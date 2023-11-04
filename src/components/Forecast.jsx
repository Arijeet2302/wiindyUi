import { useState } from "react";
import "../styles/forecast.css";

const Forecast = () => {
    const [option, setOption] = useState(true);

    const HandleOption =()=>{
        if(option){
            setOption(false);
        }else{
            setOption(true);
        }
    }

    const Forecast = [
        {id : 0, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 1, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 2, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 3, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 4, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 5, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 6, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 7, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 8, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 9, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
        {id : 10, day: "Thursday", img : "https://openweathermap.org/img/w/02d.png", temp : "25°C", type : "Cloudy"},
    ]

  return (
    <div className="forecast-main">
      <div className="forecast-header">
        <div className="forecast-main-header">Forecast</div>
        <div className="select-optns">
            <div className= { option ? "daily-dark" : "daily-light"} onClick={HandleOption}>
            <div className="daily">Daily</div>
            </div>
            <div className={ option ? "daily-light" : "daily-dark"} onClick={HandleOption}>
            <div className="daily">Hourly</div>
            </div>
        </div>
      </div>
      <div className="forecast-content">
      { Forecast.map((item)=>(
        <div className="forecast-content-container" key={item.id}>
            <div className="forecast-day">{item.day}</div>
            <img alt="icon" src={item.img}></img>
            <div className="forecast-temp">{item.temp}</div>
            <div className="forecast-type">{item.type}</div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast
