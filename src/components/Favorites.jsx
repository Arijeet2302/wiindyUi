import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/favorites.css";
import MainContext from "../services/MainContext";
import { AccountCircleRounded, DeleteRounded } from "@mui/icons-material";
import axios from "axios";

const Favorites = () => {
  const [favItems, setFavItems] = useState([]);
  const [NewFavItems, setNewFavItems] = useState([]);
  const [show, setShow] = useState("Loading...");
  const { User, setGlobalCity } = useContext(MainContext);
  const navigate = useNavigate();

  const API_key = import.meta.env.VITE_REACT_APP_WEATHERAPI_KEY;


  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        const response = await axios.get("https://wiindy-backend.vercel.app/api/user/favorites", {
          params: {
            uid: User?.uid
          }
        });
  
        setFavItems(response.data);
        setShow("No favorites yet");
      } catch (error) {
        console.error("Error while showing data", error);
        setShow("No favorites yet");
      }
    };
  
    fetchUserFavorites();
  }, [User]);
  


  useEffect(() => {
    const fetchData = async () => {
      const updatedFavItems = await Promise.all(
        favItems.map(async (item) => {
          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${item.cityname}&appid=${API_key}&units=metric`);
            item.temp = Math.round(response.data?.main?.temp);
            item.weather = response.data?.weather[0]?.main;
            return item;
          } catch (err) {
            console.log(err);
            return item;
          }
        })
      );

      setNewFavItems(updatedFavItems);
    };

    fetchData();
  }, [favItems,API_key]);


  const HandleShow = (name) => {
    setGlobalCity(name);
    navigate("/");
  }

  const handleDelete = async (item_id) => {
    try {
      const res = await axios.delete(`https://wiindy-backend.vercel.app/api/user/delete/${item_id}`);
      alert(res.data.msg);
    } catch (err) {
      console.error('Error while removing from favorites', err);
    }
  }

  return (
    <div className="favorites-main">
      <h1>Favorites</h1>
      <div className="fav-profile-name">
        <AccountCircleRounded id="abc1" />
        <div>{User?.displayName}</div>
      </div>
      {favItems.length === 0 ?
        <div className="no-favs">{show}</div> : (
          <div className="favorites-main-content">
            {NewFavItems.map((item) => (
              <div className="fav-body" key={item._id} onClick={() => HandleShow(item.cityname)}>
                <div className="fav-cityname">{item.cityname}</div>
                <div className='details-container'>
                  <div className="fav-temp">{item.temp}°C</div>
                  <div className="fav-weather">{item.weather}</div>
                </div>
                <div onClick={() => handleDelete(item._id)}><DeleteRounded /></div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default Favorites
