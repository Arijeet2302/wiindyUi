import { useEffect, useRef, useState, useContext } from 'react';
import MainContext from '../services/MainContext';
import "../styles/map.css";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

const WeatherMap = () => {
  const { GlobalCity } = useContext(MainContext);
  const API_key = import.meta.env.VITE_REACT_APP_WEATHERAPI_KEY;
  const [layer, setLayer] = useState("pressure_new");
  const [legendName, setLegendName] = useState("Pressure, hPa");
  const [legendScale, setLegendScale] = useState("pressure");
  const [legendValue, setLegendValue] = useState([
  { key: 'item1', value: 950 },
  { key: 'item2', value: 980 },
  { key: 'item3', value: 1010 },
  { key: 'item4', value: 1040 },
  { key: 'item5', value: 1070 }
  ]);
  const mapRef = useRef(null);
  const [activeButton, setActiveButton] = useState("Pressure");
  const [lat, setLat] = useState(23.68)
  const [lon, setLon] = useState(87)
  const layers = [
    { id: 0, name: "Pressure", type: "pressure_new", legend_name: "Pressure, hPa", legend_scale: "pressure", 
      legend_value : [
      { key: 'item1', value: 950 },
      { key: 'item2', value: 980 },
      { key: 'item3', value: 1010 },
      { key: 'item4', value: 1040 },
      { key: 'item5', value: 1070 }
      ]},
    { id: 1, name: "Clouds", type: "clouds_new", legend_name: "Clouds, %", legend_scale: "clouds", 
      legend_value : [
      { key: 'item1', value: 0 },
      { key: 'item2', value: 25 },
      { key: 'item3', value: 50 },
      { key: 'item4', value: 75 },
      { key: 'item5', value: 100 }
      ]},
    { id: 2, name: "Wind Speed", type: "wind_new", legend_name: "Wind Speed, mph", legend_scale: "wind", legend_value : [
      { key: 'item1', value: 0 },
      { key: 'item2', value: 2 },
      { key: 'item3', value: 3 },
      { key: 'item4', value: 6 },
      { key: 'item5', value: 12 },
      { key: 'item5', value: 25 },
      { key: 'item5', value: 50 },
      { key: 'item5', value: 100 },
      ]},
    { id: 3, name: "Temperature", type: "temp_new", legend_name: "Temperature, °C", legend_scale: "temp", legend_value : [
      { key: 'item1', value: -40 },
      { key: 'item2', value: -20 },
      { key: 'item3', value: 0 },
      { key: 'item4', value: 20 },
      { key: 'item5', value: 40 }
      ]},
  ]
  
  const handleLayer = (item) => {
    setLayer(item.type);
    setActiveButton(item.name);
    setLegendName(item.legend_name);
    setLegendScale(item.legend_scale);
    setLegendValue(item.legend_value);
  }

  useEffect(()=>{
    const SetLatLon = async () => {
      if(GlobalCity){
        await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${GlobalCity}&appid=${API_key}`)
        .then(response => response.json())
        .then(res => {
          setLat(res[0].lat);
          setLon(res[0].lon);
        })
        .catch((e)=>{
          console.log(e);
        })
      }
    }
    SetLatLon();
  },[GlobalCity,API_key])

  useEffect(() => {

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_key}`,
          }),
          opacity: 10,
        }),
      ],
      view: new View({
        center: [lon, lat], 
        zoom: 8, 
        projection: 'EPSG:4326',
      }),
    });
    return () => {
      map.setTarget(null);
    };
  }, [layer, API_key, lat, lon]);

  return (
    <div className='main-container1'>
        <h1>Weather Map</h1>
      <div className='map-container1'>
        <div className='left-part1'>
          {layers.map((item) => (
              <div className='btn-container1' key={item}>
                <button className={activeButton === item.name ? 'activated':''} onClick={() => handleLayer(item)}>{item.name}</button>
              </div>
          ))}
        </div>
        <div className='right-part1'>
          <div ref={mapRef} className="map1">
          <div className='legend'>
            <div className='legend-name'>{legendName}</div>
            <div className='scale-gradient'>
              <div className='scale-dividers'>
                { legendValue.map((item)=>(
                  <div key={item.key}>
                  <div>{item.value}</div>
                  </div>
                  ))}
              </div>
              <div className={`scale-line-${legendScale}`}></div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;

