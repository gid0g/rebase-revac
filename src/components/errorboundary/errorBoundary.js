import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ErrorBoundaryComponent = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleErrors = (error) => {
      setHasError(true);
      console.error("errorrrr---", error);
    };

    window.addEventListener("error", handleErrors);

    return () => {
      window.removeEventListener("error", handleErrors);
    };
  }, []);

  if (hasError) {
    return (
      <div className="error">
        <div className="error-code">404</div>
        <div className="error-content">
          <div className="error-message">Something went wrong...</div>
          <div className="error-desc mb-4">
            The page you're looking for doesn't exist. <br />
            Perhaps, there pages will help find what you're looking for.
          </div>
         
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundaryComponent;
