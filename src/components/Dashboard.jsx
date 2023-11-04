import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"
import thunderstorm from "../assets/thunderstorm.png";
import { AccountCircleRounded, Search } from "@mui/icons-material"
import { IoMdWater } from "react-icons/io";
import { BsThermometerSun, BsEyeFill } from "react-icons/bs";
import { TbSunrise, TbSunset } from "react-icons/tb";
import { RiWindyFill } from "react-icons/ri";
import { useContext } from "react";
import MainContext from "../services/MainContext";
import Forecast from "./Forecast";
import Chart from "./Chart";

const Dashboard = () => {
  const navigate = useNavigate();
  const {User, isLoggedIn} = useContext(MainContext);
  
  return (
    <div className="dashboard">
      <div className="upper-part">
        <div className="searchbar">
          <div className="search-icon"><Search /></div>
          <input type="text" placeholder="Enter Your location" />
        </div>
        <div className="profile-div">
          { isLoggedIn ? (
            <div className="profile-name">
            <AccountCircleRounded id="abc"/>
            <div>{User?.displayName}</div>
            </div>
            ):(
              <div className="login-btn"><button onClick={()=>navigate("/login")}>Login</button></div>
            )}
        </div>
      </div>
      <div className="middle-part">
        <div className="main-temp">
          <div className="main-city">
            <div className="middle-header">Current Weather</div>
            <div className="maincityname">
              <h2>Asansol</h2>
              <div className="favicon">+ Add to favorites</div>
            </div>
            <div className="main-time">6:25 PM</div>
          </div>
          <div className="basic-weather">
            <img className="weather-icon" src={thunderstorm} />
            <div className="basic-temp">
              <div className="big-temp">25
                <div className="basic-weather-type">Rainy</div>
              </div>
              <div className="basic-unit">°C</div>
            </div>
          </div>
          <div className="unit-change-btn">
            <button className="unit-btn">Celcius</button>
            <button className="unit-btn">Farenheite</button>
          </div>
        </div>
        <div className="forecast-container"><Forecast/></div>
        <div className="current-weather-details">
          <div className="weather-details-header">Weather Details</div>
          <div className="details-div">
            <div className="deatils-icon"><IoMdWater size={20} /></div>
            <div className="details">Humidity</div>
            <div className="details-value">96%</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><BsThermometerSun size={20} /></div>
            <div className="details">Pressure </div>
            <div className="details-value">1000Hpa</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><RiWindyFill size={20} /></div>
            <div className="details">Wind Speed</div>
            <div className="details-value"> 10 KM/hr</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><BsEyeFill size={20} /></div>
            <div className="details">Visibility</div>
            <div className="details-value">10 KM</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><TbSunrise size={20} /></div>
            <div className="details">Sunrise</div>
            <div className="details-value">5:30 AM</div>
          </div>
          <div className="details-div">
            <div className="deatils-icon"><TbSunset size={20} /></div>
            <div className="details">Sunset</div>
            <div className="details-value">5:30 PM</div>
          </div>
        </div>
      </div>
      <div className="bottom-part">
        <div className="map-container">
          <img className="img-container" src="https://images.pexels.com/photos/1768538/pexels-photo-1768538.jpeg?auto=compress&cs=tinysrgb&w=400"/>
          <div className="map-content">Explore Global Map of Wind, Weather and Other Conditions</div>
          <div id="map-btn" onClick={()=>navigate("/map")}>Get Started</div>
        </div>
        <div className="chart-container"><Chart/></div>
      </div>
    </div>
  )
}

export default Dashboard
