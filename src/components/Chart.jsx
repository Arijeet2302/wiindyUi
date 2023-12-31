import { useEffect, useState, useRef, useContext } from "react";
import MainContext from "../services/MainContext";
import { format } from "date-fns";
import "../styles/chart.css";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Filler, Tooltip} from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Filler, Tooltip);

const Chart = () => {
  const { temperature, wind,  humidity, ChartDay, units } = useContext(MainContext);
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);
  const [minX, setMinX] = useState(0);
  const [maxX, setMaxX] = useState(6);
  const [param, setParam] = useState({});
  const [toggle, setToggle] = useState("button1");
  const [title, setTitle] = useState("In Celcius (°C)");

  useEffect(() => {
      setChart(chartRef.current);
      setParam(temperature);
      setToggle("button1");
    },[temperature])

  useEffect(()=>{
    if (units === "metric") {
      setTitle(param.titleMetric);
    }else{
      setTitle(param.titleImperial);
    }
  },[units,param])
    
  const setTime = (day) => {
    if (day) {
      const date = new Date(day);
      const formattedDate = format(date, "h a");
      return formattedDate;
    }
  }

    const data = {
    labels: ChartDay.map((item) => setTime(item)),
    datasets: [{
      label: param.label,
      data: param.content,
      borderColor: "#76A3BA",
      tension: 0.4
    }]
  };

  const options = {
    responsive : true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        min: minX,
        max: maxX,
        ticks :{color:"white"},
        grid : {display:false},
      },
      y:{
        ticks :{color:"white"},
        grid : {display:false},
        title : {
          display : true,
          text : title,
          color : "white",
        }
      }
    },
  };

  useEffect(() => {
    if (chart) {
      chart.options.scales.x.min = minX;
      chart.options.scales.x.max = maxX;
      chart.update();
    }
  }, [minX, maxX, chart]);

  // Handle scrolling
  const handleScroll = (e) => {
    const scrollAmount = e.deltaY;
    const datalength = data.labels.length;

    if (scrollAmount > 0) {
      if (maxX >= datalength) {
        setMinX(datalength - 6);
        setMaxX(datalength);
      } else {
        setMinX(minX + 1);
        setMaxX(maxX + 1);
      }
    } else if (scrollAmount < 0) {
      if (minX <= 0) {
        setMinX(0);
        setMaxX(6);
      } else {
        setMinX(minX - 1);
        setMaxX(maxX - 1);
      }
    } else {
      //do nothing;
    }
  };

  const setButton = (param,buttonName) => {
    setParam(param);
    setToggle(buttonName);
  }

  return (
    <div className="chart-main">
      <div className="chart-options">
        <div className="chart-header">Summary</div>
        <div className="chart-btn">
        <button className={toggle === 'button1' ? "active": ""} onClick={()=>setButton(temperature,"button1")}>Temperature</button>
        <button className={toggle === 'button2' ? "active": ""} onClick={()=>setButton(humidity,"button2")}>Humidity</button>
        <button className={toggle === 'button3' ? "active": ""} onClick={()=>setButton(wind,"button3")}>Wind</button>
        </div>
      </div>
      <div className="chart-body">
        <Line data={data} options={options} ref={chartRef} onWheel={handleScroll} />
      </div>
    </div>
  )
}

export default Chart
