import { useNavigate } from "react-router-dom";
import "../styles/nav.css"
import { useContext, useState,useEffect } from "react";
import MainContext from "../services/MainContext";
import { auth } from "../services/firebase";
import { AccountCircleRounded, StarRounded, GridViewRounded, MapOutlined, LogoutOutlined, CloudOutlined } from "@mui/icons-material";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const { setUser, isLoggedIn, setIsLoggedIn } = useContext(MainContext);

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

  return (
    <div
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {!collapsed ? (
        <>
          <div className="icon-div">
            <CloudOutlined />
            <div className="icon-name">Wiindy</div>
          </div>
          <div className="option">
            <div className="dashboard-icon" onClick={() => navigate("/")}>
              <GridViewRounded />
              <div className="icon-name">Dashboard</div>
            </div>
            <div className="profile-icon">
              <AccountCircleRounded />
              <div className="icon-name">Profile</div>
            </div>
            <div className="favorites-icon" onClick={() => navigate("/favorites")}>
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
          <div className="icon-div-collasped"><CloudOutlined /></div>
          <div className="option-collasped">
            <div className="dashboard-icon-collasped"><GridViewRounded /></div>
            <div className="profile-icon-collasped"><AccountCircleRounded /></div>
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
