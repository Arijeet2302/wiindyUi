import "../styles/errorpage.css";

const ErrorPage = () => {
    const handleError = ()=>{
      window.location.reload();
    };
  return (
    <div className="error-div-main">
    <div className="error-content">
      <div className="error-header">OOPS!</div>
      <div className="text-content">Something Went Wrong</div>
      <button className="goback-btn" onClick={handleError}>Go Back</button>
    </div>
    </div>
  )
}

export default ErrorPage
