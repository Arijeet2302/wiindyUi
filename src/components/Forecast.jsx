import { useState, useContext, useEffect } from "react";
import "../styles/forecast.css";
import MainContext from "../services/MainContext";
import { format } from 'date-fns';

const Forecast = () => {
    const [option, setOption] = useState(false);
    const [LocalUnit,setLocalUnit] = useState(false);
    const [hourlyForecast, sethourlyForecast] = useState([]);
    const [Forecast,setForecast] = useState([]);
    const {GlobalCity, units, temperature, wind, humidity, setTemp, setWind, setHumidity, setChartDay } = useContext(MainContext);

  const API_Key = import.meta.env.VITE_REACT_APP_WEATHERAPI_KEY;
  const dailyTime = "09:00:00";
  const dailyForecast = hourlyForecast.filter((data) => data.dt_txt.includes(dailyTime));

    const HandleOption =(filterTime)=>{
        if (filterTime === "daily"){
          setForecast(dailyForecast);
        }else{
          setForecast(hourlyForecast);
        }
        setOption(!option);
    }

  useEffect(() => {
    if (GlobalCity) {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${GlobalCity}&appid=${API_Key}&units=${units}`)
        .then((response) => response.json())
        .then((res) => {
          const response = res.list;

          const tempContent = response.map((item) => Math.round(item.main?.temp));
          const windContent = response.map((item) => Math.round(item.wind?.speed));
          const humidityContent = response.map((item) => item.main?.humidity);
          const chartDayContent = response.map((item) => item.dt_txt);

          sethourlyForecast(response);
          setForecast(response);
          setTemp({ ...temperature, content: tempContent });
          setWind({ ...wind, content: windContent });
          setHumidity({ ...humidity, content: humidityContent });
          setChartDay(chartDayContent);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [GlobalCity, API_Key, setTemp, setWind, setHumidity, setChartDay,units]);

  const setDay = (day,length) =>{
    if(day){
      const date = new Date(day);
      if (length === 5 ){
        const formattedDate = format(date, "EEEE");
        return formattedDate;
      }else{
        const formattedDate = format(date, "h a");
        return formattedDate;
      }
    }
  }

useEffect(()=>{
  const HandleUnit =()=>{
    if (units === "imperial"){
      setLocalUnit(true);
    }else{
      setLocalUnit(false);
    }
  }
  HandleUnit();
},[units])


  return (
    <div className="forecast-main">
      <div className="forecast-header">
        <div className="forecast-main-header">Forecast</div>
        <div className="select-optns">
            <div className= { option ? "daily-dark" : "daily-light"} onClick={()=>HandleOption("daily")}>
            <div className="daily">Daily</div>
            </div>
            <div className={ option ? "daily-light" : "daily-dark"} onClick={()=>HandleOption("hourly")}>
            <div className="daily">Hourly</div>
            </div>
        </div>
      </div>
      <div className="forecast-content">
      { Forecast.map((item)=>(
        <div className="forecast-content-container" key={item.id}>
            <div className="forecast-day">{setDay(item.dt_txt,Forecast.length)}</div>
            <div className="forecast-img-div">
            <img alt="icon" src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}/>
            </div>
            <div className="forecast-temp">{Math.round(item.main.temp)}
            {!LocalUnit ? (<div>°C</div>) :(<div>°F</div>)}
            </div>
            <div className="forecast-type">{item.weather[0].main}</div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast
