import { useContext } from "react";
import "../styles/favorites.css";
import MainContext from "../services/MainContext";
import { AccountCircleRounded, DeleteRounded } from "@mui/icons-material";

const Favorites = () => {
  const { User } = useContext(MainContext);
  const weatherData = [
    { id: 1, cityname: "New York", temperature: 72, weather: "Sunny" },
    { id: 2, cityname: "Los Angeles", temperature: 85, weather: "Clear" },
    { id: 3, cityname: "Chicago", temperature: 65, weather: "Cloudy" },
    { id: 4, cityname: "Miami", temperature: 88, weather: "Partly Cloudy" },
    { id: 5, cityname: "Miami", temperature: 88, weather: "Partly Cloudy" },
  ];

  return (
    <div className="favorites-main">
      <h1>Favorites</h1>
      <div className="fav-profile-name">
        <AccountCircleRounded id="abc1" />
        <div>{User?.displayName}</div>
      </div>
      <div className="favorites-main-content">
        {weatherData.map((item) => (
          <div className="fav-body" key={item.id}>
            <div className="fav-cityname">{item.cityname}</div>
            <div className='details-container'>
              <div className="fav-temp">{item.temperature}°C</div>
              <div className="fav-weather">{item.weather}</div>
            </div>
            <div><DeleteRounded/></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites
