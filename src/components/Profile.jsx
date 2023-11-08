import { useContext } from "react"
import "../styles/profile.css"
import MainContext from "../services/MainContext"
import { AccountCircleRounded } from "@mui/icons-material"
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {

    const {User} = useContext(MainContext);
    const navigate = useNavigate();

    const handleSignout = async ()=>{
      try {
        await auth.signOut();
        navigate("/");
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

  return (
    <div className="main-profile-container">
      <div className="profile-name-page">
        <AccountCircleRounded id="abc1" />
        <div>{User?.displayName}</div>
      </div>
      <div className="profile-main-content">
        <div className="username-main">Username : {User?.displayName}</div>
        <div className="user-email">Email : {User?.email}</div>
        <div className="date-created">Date Created : {User?.metadata.creationTime}</div>
        <button className="sign-out-btn" onClick={handleSignout}>SignOut</button>
      </div>
    </div>
  )
}

export default Profile
