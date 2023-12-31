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
import { format, parse } from 'date-fns';
import Forecast from "./Forecast";
import Chart from "./Chart";
import ErrorPage from "./ErrorPage";
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
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const API_key = import.meta.env.VITE_REACT_APP_WEATHERAPI_KEY;

  useEffect(() => {
    if (!toggle) {
      setUnits('imperial');
    } else {
      setUnits('metric');
    }
  }, [toggle, setUnits]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        if (navigator.geolocation && GlobalCity === '') {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_key}`);
          const data = await response.json();

          setGlobalCity(data[0]?.name);
        }
      } catch (error) {
        console.error(error);
        setError("Couldn't Find Your Current Location");
      }
    };

    fetchUserLocation();
  }, [GlobalCity, API_key, setGlobalCity]);


  useEffect(() => {
    const fetchSuggestions = async () => {
      const options = {
        method: 'GET',
        url: 'https://place-autocomplete1.p.rapidapi.com/autocomplete/json',
        params: {
          input: city,
          radius: '500'
        },
        headers: {
          'X-RapidAPI-Key': 'd816d3d66bmsh61000e59c1cf930p1f570ajsn9368d130bba2',
          'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setSuggestions(response.data?.predictions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [city, API_key]);

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
        setCity('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Couldn't Find Your City");
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
          setError("Couldn't Fetch Weather Data For Your Current Location");
        }
      };

      fetchData();
    }
  }, [GlobalCity, API_key, units]);

  useEffect(() => {
    const id = userWeather?.id;

    if (id === 721) {
      setIcon(object.haze);
    } else if (id === 711 || id === 741) {
      setIcon(object.foggy);
    } else if (parseInt(id / 100) === 5) {
      setIcon(object.rain);
    } else if (parseInt(id / 100) === 2) {
      setIcon(object.thunderstorm);
    } else if (id === 802 || id === 803 || id === 804) {
      setIcon(object.clouds);
    } else if (id === 801) {
      setIcon(object.cloudy);
    } else if (parseInt(id / 100) === 6) {
      setIcon(object.snow);
    } else if (parseInt(id / 100) === 3) {
      setIcon(object.rain);
    } else if (id === 800) {
      setIcon(object.sunny);
    } else {
      setIcon(object.sunny);
    }
  }, [userWeather]);


  const currentday = (time) => {
    const utc_seconds = parseInt(time, 10) + parseInt(weather.timezone, 10);
    const utc_milliseconds = utc_seconds * 1000;
    const local_date = new Date(utc_milliseconds).toUTCString();
    const inputDate = parse(local_date, 'EEE, dd MMM yyyy HH:mm:ss \'GMT\'', new Date());
    const formattedDate = format(inputDate, 'EEE, dd MMM h:mm a');
    return formattedDate;
  };

  const setSun = (time) => {
    const inputDate = new Date(currentday(time));
    const formattedDate = format(inputDate, 'hh:mm a');
    return formattedDate;
  };

  const handleAddFav = async () => {
    if (User) {
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
    } else {
      alert("Please Login First");
      navigate("/login");
    }
  }

  useEffect(() => {
    const fetchFavoritesAndCheckFavoriteStatus = async () => {
      if (User) {
        try {
          const res = await axios.get('https://wiindy-backend.vercel.app/api/user/favorites', {
            params: {
              uid: User?.uid,
            }
          });
          const favoriteCities = res.data;
          const isFavorite = favoriteCities.some(item => item.cityname === GlobalCity);
          setFavicon(!isFavorite);
        } catch (err) {
          console.log('Error while fetching favorites', err);
        }
      } else {
        setFavicon(true);
      }
    };

    fetchFavoritesAndCheckFavoriteStatus();
  }, [User, GlobalCity]);


  return (
    <div className="dashboard" >
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
        {suggestions.length !== 0 ? (
        <div className="city-suggestions-container">
          {suggestions.map((item) => (
            <div key={item.place_id} >
              <p className="city-suggestion"
              onClick={() => setCity(item.description)}
              onKeyDown={handleKeyPress}
              tabIndex={0}>{item.description}
              </p>
            </div>
          ))}
        </div>
        ):(<div></div>)}
        <div className="profile-div">
          {isLoggedIn ? (
            <div className="profile-name">
              <AccountCircleRounded id="abc" />
              <div>{User?.displayName}</div>
            </div>
          ) : (
            <div className="login-btn"><button id="btn" onClick={() => navigate("/login")}>Login</button></div>
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
                  <h2>{GlobalCity}, {weather.sys.country}</h2>
                  {favicon ? (<div className="favicon" onClick={handleAddFav}>+ Add to favorites</div>)
                    : (<div></div>)}
                </div>
                <div className="main-time">{currentday(weather.dt)}</div>
              </div>
              <div className="basic-weather">
                <img className="weather-icon" src={icon} />
                <div className="basic-temp">
                  <div className="big-temp">
                    <div className="weather-main-temp">{Math.round(weather.main.temp)}
                      {toggle ? (<div className="basic-unit">°C</div>) : (<div className="basic-unit">°F</div>)}
                    </div>
                    <div className="basic-weather-type">{(userWeather.description).toUpperCase()}</div>
                  </div>
                </div>
              </div>
              <div className="unit-change-btn">
                <button className="unit-btn" onClick={() => setToggle(true)}>Celcius</button>
                <button className="unit-btn" onClick={() => setToggle(false)}>Farenheit</button>
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
                {toggle ? (<div className="details-value">{Math.round(weather.wind.speed * 3.6)} KM/hr</div>)
                  : (<div className="details-value">{Math.round(weather.wind.speed)} Miles/hr</div>)
                }
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
        </>) : (
        <div className="error-container">
          <ErrorPage error={error} /></div>
      )}
    </div>
  )
}

export default Dashboard
