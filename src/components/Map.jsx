import { useEffect, useRef, useState } from 'react';
import "../styles/map.css";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

const WeatherMap = () => {
  const API_key = import.meta.env.VITE_REACT_APP_WEATHERAPI_KEY;
  const [layer, setLayer] = useState("pressure_new");
  const mapRef = useRef(null);
  const layers = [
    { id: 0, name: "Pressure", type: "pressure_new" },
    { id: 1, name: "Clouds", type: "clouds_new" },
    { id: 2, name: "Wind Speed", type: "wind_new" },
    { id: 3, name: "Temperature", type: "temp_new" },
  ]

  const handleLayer = (newLayer) => {
    setLayer(newLayer);
  }

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
        center: [0, 0],
        zoom: 2.5,
      }),
    });
    return () => {
      map.setTarget(null);
    };
  }, [layer, API_key]);

  return (
    <div className='main-container1'>
        <h1>Weather Map</h1>
      <div className='map-container1'>
        <div className='left-part1'>
          {layers.map((item) => (
              <div className='btn-container1' key={item}>
                <button onClick={() => handleLayer(item.type)}>{item.name}</button>
              </div>
          ))}
        </div>
        <div className='right-part1'>
          <div ref={mapRef} className="map1">
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;

