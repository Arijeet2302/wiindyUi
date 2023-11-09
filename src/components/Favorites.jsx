import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/favorites.css";
import MainContext from "../services/MainContext";
import { AccountCircleRounded, DeleteRounded } from "@mui/icons-material";
import axios from "axios";

const Favorites = () => {
  const [favItems, setFavItems] = useState([]);
  const [NewFavItems, setNewFavItems] = useState([]);
  const { User, setGlobalCity } = useContext(MainContext);
  const navigate = useNavigate();

  const API_key = import.meta.env.VITE_REACT_APP_WEATHERAPI_KEY;
  

  useEffect(() => {
      axios.post("https://wiindy-backend.vercel.app/api/user/favorites", {
          uid: User?.uid
      })
          .then((res) => {
              setFavItems(res.data);
          })
          .catch((err) => {
              console.log("error while showing data", err);
          })
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
    }, [favItems]);


    const HandleShow =(name)=>{
      setGlobalCity(name);
      navigate("/");
    }

    const handleDelete = async(cityName)=>{
      try {
        const res = await axios.delete('https://wiindy-backend.vercel.app/api/user/delete', {
          data: {
            uid: User.uid,
            cityname: cityName,
          },
        });
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
      <div className="favorites-main-content">
        {NewFavItems.map((item) => (
          <div className="fav-body" key={item._id} onClick={()=>HandleShow(item.cityname)}>
            <div className="fav-cityname">{item.cityname}</div>
            <div className='details-container'>
              <div className="fav-temp">{item.temp}°C</div>
              <div className="fav-weather">{item.weather}</div>
            </div>
            <div onClick={()=>handleDelete(item.cityname)}><DeleteRounded/></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favorites
