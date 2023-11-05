import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import "../styles/dashboard.css"
import { object } from "../services/images";
import { AccountCircleRounded, Search } from "@mui/icons-material"
import { IoMdWater } from "react-icons/io";
import { BsThermometerSun, BsEyeFill } from "react-icons/bs";
import { TbSunrise, TbSunset } from "react-icons/tb";
import { RiWindyFill } from "react-icons/ri";
import MainContext from "../services/MainContext";
import Forecast from "./Forecast";
import Chart from "./Chart";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { User, isLoggedIn, GlobalCity, setGlobalCity, units, setUnits } = useContext(MainContext);
  const [weather, setWeather] = useState([]);
  const [userWeather, setUserWeather] = useState([]);
  const [icon, setIcon] = useState(object.rain);
  const [city, setCity] = useState('');
  const [toggle, setToggle] = useState(true);
  const [favicon, setFavicon] = useState(true);
  const buttonRef = useRef(null);

  const API_key = '5ed629dc1cc4bf3e82808a28e85384dd';

  useEffect(() => {
    if (!toggle) {
      setUnits('imperial');
    } else {
      setUnits('metric');
    }
  }, [toggle, setUnits]);

  useEffect(() => {
    if (navigator.geolocation && GlobalCity === '') {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_key}`)
          .then((res) => res.json())
          .then((res) => {
            setGlobalCity(res[0]?.name);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    }
  }, [API_key, setGlobalCity, GlobalCity]);

  const searchCity = async () => {
    if (city) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=${units}`
        );
        const data = await response.json();
        setWeather(data);
        setUserWeather(data.weather[0]);
        setGlobalCity(data.name);
        setFavicon(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchCity();
    }
  };

  useEffect(() => {
    if (GlobalCity) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${GlobalCity}&appid=${API_key}&units=${units}`
          );
          const data = await response.json();
          setWeather(data);
          setUserWeather(data.weather[0]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [GlobalCity, API_key, units]);

  useEffect(() => {
    switch (userWeather?.main) {
      case 'Haze':
        setIcon(object.haze);
        break;
      case 'Mist':
        setIcon(object.haze);
        break;
      case 'Rain':
        setIcon(object.rain);
        break;
      case 'Thunderstorm':
        setIcon(object.thunderstorm);
        break;
      case 'Clouds':
        setIcon(object.clouds);
        break;
      case 'Snow':
        setIcon(object.snow);
        break;
      case 'Drizzle':
        setIcon(object.rain);
        break;
      case 'Fog':
        setIcon(object.foggy);
        break;
      case 'Dust':
        setIcon(object.windy);
        break;
      default:
        setIcon(object.clouds);
        break;
    }
  }, [userWeather]);

  const currentday = () => {
    const options = {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    };
    const currentTime = new Date().toLocaleString('en-US', options);
    return currentTime;
  };

  const setSun = (time) => {
    const timeValue = new Date(time * 1000);
    const optns = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return timeValue.toLocaleTimeString(undefined, optns);
  };

  const handleAddFav = async () => {
      try {
        const res = await axios.post('https://wiindy-backend.vercel.app/api/user/add', {
          username: User.displayName,
          uid: User.uid,
          cityname: GlobalCity,
        });
        setFavicon(false);
        alert(res.data.msg);
      } catch (err) {
        console.error('Error while adding to favorites', err);
    }
  }

  useEffect(() => {
    const fetchFavoritesAndCheckFavoriteStatus = async () => {
      if (User) {
        try {
          const res = await axios.post('https://wiindy-backend.vercel.app/api/user/favorites', {
            username: User.displayName,
          });
          const favoriteCities = res.data;
          const isFavorite = favoriteCities.some(item => item.cityname === GlobalCity);
          setFavicon(!isFavorite);
        } catch (err) {
          console.log('Error while fetching favorites', err);
        }
      }
    };
  
    fetchFavoritesAndCheckFavoriteStatus();
  }, [User, GlobalCity]);
  

  return (
    <div className="dashboard">
      <div className="upper-part">
        <div className="searchbar">
          <div className="search-icon"><Search ref={buttonRef} onClick={searchCity} /></div>
          <input
            type="text"
            placeholder="Enter Your location"
            onChange={(event) => {
              setCity(event.target.value);
            }}
            onKeyDown={handleKeyPress}
            value={city}
          />
        </div>
        <div className="profile-div">
          {isLoggedIn ? (
            <div className="profile-name">
              <AccountCircleRounded id="abc" />
              <div>{User?.displayName}</div>
            </div>
          ) : (
            <div className="login-btn"><button onClick={() => navigate("/login")}>Login</button></div>
          )}
        </div>
      </div>
      {weather.main ? (
        <>
      <div className="middle-part">
        <div className="main-temp">
          <div className="main-city">
            <div className="middle-header">Current Weather</div>
            <div className="maincityname">
              <h2>{GlobalCity}</h2>
              {favicon ? (<div className="favicon" onClick={handleAddFav}>+ Add to favorites</div>) 
              :(<div></div>)}
            </div>
            <div className="main-time">{currentday()}</div>
          </div>
          <div className="basic-weather">
            <img className="weather-icon" src={icon} />
            <div className="basic-temp">
              <div className="big-temp">
              <div className="weather-main-temp">{Math.round(weather.main.temp)}
              { toggle ? (<div className="basic-unit">°C</div>) :(<div className="basic-unit">°F</div>)}
                </div>
                <div className="basic-weather-type">{(userWeather.description).toUpperCase()}</div>
              </div>
            </div>
          </div>
          <div className="unit-change-btn">
            <button className="unit-btn" onClick={() => setToggle(true)}>Celcius</button>
            <button className="unit-btn" onClick={() => setToggle(false)}>Farenheite</button>
          </div>
        </div>
        <div className="forecast-container"><Forecast /></div>
        <div className="current-weather-details">
          <div className="weather-details-header">Weather Details</div>
          <div className="details-div">
            <div className="deatils-icon"><IoMdWater size={20} /></div>
            <div className="details">Humidity</div>
            <div className="details-value">{weather.main.humidity} %</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><BsThermometerSun size={20} /></div>
            <div className="details">Pressure </div>
            <div className="details-value">{weather.main.pressure} Hpa</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><RiWindyFill size={20} /></div>
            <div className="details">Wind Speed</div>
            <div className="details-value">{Math.round(weather.wind.speed * 3.6)} KM/hr</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><BsEyeFill size={20} /></div>
            <div className="details">Visibility</div>
            <div className="details-value">{weather.visibility / 1000} KM</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><TbSunrise size={20} /></div>
            <div className="details">Sunrise</div>
            <div className="details-value">{setSun(weather?.sys.sunrise)}</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><TbSunset size={20} /></div>
            <div className="details">Sunset</div>
            <div className="details-value">{setSun(weather?.sys.sunset)}</div>
          </div>
        </div>
      </div>
      <div className="bottom-part">
        <div className="map-container">
          <img className="img-container" src="https://images.pexels.com/photos/1768538/pexels-photo-1768538.jpeg?auto=compress&cs=tinysrgb&w=400" />
          <div className="map-content">Explore Global Map of Wind, Weather and Other Conditions</div>
          <div id="map-btn" onClick={() => navigate("/map")}>Get Started</div>
        </div>
        <div className="chart-container"><Chart /></div>
      </div>
      </>):(<div></div>)}
    </div>
  )
}

export default Dashboard
