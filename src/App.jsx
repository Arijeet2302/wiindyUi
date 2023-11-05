import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainContext from "./services/MainContext";
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import Favorites from "./components/Favorites"
import Signup from "./components/Signup"
import Login from "./components/Login"
import Map from "./components/Map"
import "./App.css"


function App() {
  const [User, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [units, setUnits] = useState("metric");
  const [GlobalCity, setGlobalCity] = useState("");
  const [temperature, setTemp] = useState({label: "Temperature", title : "In Celcius (°C)"});
  const [wind, setWind] = useState({label: "Wind Speed", title : "In Km/Hour"});
  const [humidity, setHumidity] = useState({label: "Temperature", title : "In Pecentage (%)"});
  const [ChartDay, setChartDay] = useState([]);

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
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </MainContext.Provider>
  )
}

export default App
