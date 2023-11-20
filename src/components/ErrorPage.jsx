import "../styles/errorpage.css";
import PropTypes from "prop-types";

const ErrorPage = ({error}) => {
    const handleError = ()=>{
      window.location.reload();
    };
  return (
    <div className="error-div-main">
    <div className="error-content">
      <div className="error-header">OOPS!</div>
      <div className="text-content">{error}</div>
      <button className="goback-btn" onClick={handleError}>Go Back</button>
    </div>
    </div>
  )
}

ErrorPage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorPage
