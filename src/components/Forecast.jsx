import { useState, useContext, useEffect } from "react";
import "../styles/forecast.css";
import MainContext from "../services/MainContext";
import { format } from 'date-fns';

const Forecast = () => {
    const [option, setOption] = useState(false);
    const [LocalUnit,setLocalUnit] = useState(false);
    const [hourlyForecast, sethourlyForecast] = useState([]);
    const [ForecastState,setForecastState] = useState(true);
    const {GlobalCity, units, temperature, wind, humidity, setTemp, setWind, setHumidity, setChartDay } = useContext(MainContext);

  const API_Key = '5ed629dc1cc4bf3e82808a28e85384dd';
  const dailyTime = "09:00:00";
  const dailyForecast = hourlyForecast.filter((data) => data.dt_txt.includes(dailyTime));

    const HandleOption =(filterTime)=>{
        if (filterTime === "daily"){
          setForecastState(false);
        }else{
          setForecastState(true);
        }

        if(option){
            setOption(false);
        }else{
            setOption(true);
        }
    }

  useEffect(() => {
    if (GlobalCity) {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${GlobalCity}&appid=${API_Key}&units=${units}`)
        .then((response) => response.json())
        .then((res) => {
          const response = res.list;

          const tempContent = response.map((item) => Math.round(item.main?.temp));
          const windContent = response.map((item) => item.wind?.speed);
          const humidityContent = response.map((item) => item.main?.humidity);
          const chartDayContent = response.map((item) => item.dt_txt);

          sethourlyForecast(response);
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

  const setDay = (day) =>{
    if(day){
    const date = new Date(day);
    const formattedDate = format(date, "h a");
    return formattedDate;
    }
  }

  const setDaily = (day) =>{
    if(day){
    const date = new Date(day);
    const formattedDate = format(date, "EEEE");
    return formattedDate;
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
      { ForecastState ? (
        <>
      { hourlyForecast.map((item)=>(
        <div className="forecast-content-container" key={item.id}>
            <div className="forecast-day">{setDay(item.dt_txt)}</div>
            <img alt="icon" src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}/>
            <div className="forecast-temp">{Math.round(item.main.temp)}
            {!LocalUnit ? (<div>°C</div>) :(<div>°F</div>)}
            </div>
            <div className="forecast-type">{item.weather[0].main}</div>
        </div>
        ))}
        </>
      ) : (
        <>
        { dailyForecast.map((item)=>(
        <div className="forecast-content-container" key={item.id}>
            <div className="forecast-day">{setDaily(item.dt_txt)}</div>
            <img alt="icon" src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}/>
            <div className="forecast-temp">{Math.round(item.main.temp)}
            {!LocalUnit ? (<div>°C</div>) :(<div>°F</div>)}
            </div>
            <div className="forecast-type">{item.weather[0].main}</div>
        </div>
        ))}
        </>
      )}
      </div>
    </div>
  )
}

export default Forecast
