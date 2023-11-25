import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainContext from "./services/MainContext";
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Favorites from "./components/Favorites"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Map from "./components/Map"
import ForgotPassword from "./components/ForgotPassword";
import "./App.css"
import Profile from "./components/Profile";


function App() {
  const [User, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [units, setUnits] = useState("metric");
  const [GlobalCity, setGlobalCity] = useState("");
  const [temperature, setTemp] = useState({label: "Temperature", titleMetric : "In Celcius (°C)", titleImperial : "In Farenheit (°F)"});
  const [wind, setWind] = useState({label: "Wind Speed", titleMetric : "In Meter/sec", titleImperial : "In Miles/Hour"});
  const [humidity, setHumidity] = useState({label: "Humidity", titleMetric : "In Pecentage (%)", titleImperial : "In Pecentage (%)"});
  const [ChartDay, setChartDay] = useState([]);

  const user = User?.displayName;

  return (
    <MainContext.Provider value={{
      GlobalCity, setGlobalCity,
      units, setUnits,
      isLoggedIn, setIsLoggedIn,
      User, setUser,
      temperature, setTemp,
      wind, setWind,
      humidity, setHumidity,
      ChartDay, setChartDay
    }}>
      <BrowserRouter>
        <div className="main-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/favorites" element={<Favorites />} />
              <Route exact path="/map" element={<Map />} />
              <Route exact path={`/${user}`} element={<Profile />} />
              <Route exact path={`/user/password/reset`} element={<ForgotPassword />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </MainContext.Provider>
  )
}

export default App
