import { useNavigate } from "react-router-dom";
import "../styles/nav.css"
import { useContext, useState,useEffect } from "react";
import MainContext from "../services/MainContext";
import { auth } from "../services/firebase";
import cloud_logoCopy from "../assets/cloud_logoCopy.png";
import { AccountCircleRounded, StarRounded, GridViewRounded, MapOutlined, LogoutOutlined } from "@mui/icons-material";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const { User, setUser, isLoggedIn, setIsLoggedIn } = useContext(MainContext);
  const user = User?.displayName;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [setIsLoggedIn]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  },[setUser]);

  const handleSignout = async ()=>{
    try {
      await auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const handleHover = () => {
    setCollapsed(false);
  };

  const handleLeave = () => {
    setCollapsed(true);
  };

  const handlefavs =()=>{
    if (isLoggedIn){
      navigate("/favorites");
    }else{
      alert("Please Login To see Favorites");
      navigate("/login");
    }
  }

  return (
    <div
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {!collapsed ? (
        <>
          <div className="icon-div">
            <img className="wiindylogo" src={cloud_logoCopy} />
            <div className="icon-name">Wiindy</div>
          </div>
          <div className="option">
            <div className="dashboard-icon" onClick={() => navigate("/")}>
              <GridViewRounded />
              <div className="icon-name">Dashboard</div>
            </div>
            { isLoggedIn ? (
            <div className="profile-icon" onClick={() => navigate(`/${user}`)}>
              <AccountCircleRounded />
              <div className="icon-name">Profile</div>
            </div>) : (<div></div>)}
            <div className="favorites-icon" onClick={handlefavs}>
              <StarRounded />
              <div className="icon-name">Favorites</div>
            </div>
            <div className="map-icon" onClick={() => navigate("/map")}>
              <MapOutlined />
              <div className="icon-name">Map</div>
            </div>
            { isLoggedIn ? (<div className="signout-icon" onClick={handleSignout}>
              <LogoutOutlined />
              <div className="icon-name">Sign Out</div>
            </div>):(<div></div>)}
          </div>
        </>
      ) : (
        <>
          <div className="icon-div-collasped"><img className="wiindylogo-collasped" src={cloud_logoCopy}/></div>
          <div className="option-collasped">
            <div className="dashboard-icon-collasped"><GridViewRounded /></div>
            {isLoggedIn ? (<div className="profile-icon-collasped"><AccountCircleRounded /></div>)
            :(<div></div>)}
            <div className="favorites-icon-collasped"><StarRounded /></div>
            <div className="map-icon-collasped"><MapOutlined /></div>
            { !isLoggedIn ? (<div></div>):
            (<div className="signout-icon-collasped"><LogoutOutlined /></div>)}
          </div>
        </>
      )}
    </div>
  )
}

export default Navbar
