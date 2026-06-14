
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="d-flex justify-content-center align-items-center " style={{height:"100vh"}}>
      <div className="text-center">
        <h1 >404</h1>
        <p >Oops! Page not found</p>
        <a href="/" >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
