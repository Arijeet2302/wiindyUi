import { useEffect, useState } from "react";
import "../styles/errorpage.css";
import PropTypes from "prop-types";

const ErrorPage = ({error}) => {
    const [LoadSkeletonPage, setLoadSkeletonPage] = useState(true);

    useEffect(()=>{
      if (error != ""){
        setLoadSkeletonPage(false);
      }else{
        setLoadSkeletonPage(true);
      }
    },[error])

    const handleError = ()=>{
      window.location.reload();
    };
    
  return (
    <div className="error-div-main">
    { !LoadSkeletonPage ? (
    <div className="error-content">
      <div className="error-header">OOPS!</div>
      <div className="text-content">{error}</div>
      <button className="goback-btn" onClick={handleError}>Go Back</button>
    </div>
    ):(
      <div className="loading-container">
        <div className="loading-page">Loading....</div>
      </div>
      )} 
    </div>
  )
}

ErrorPage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorPage
