import React, { useState, useEffect } from "react";
import { Navigate, useNavigate} from "react-router-dom";
import { isAuthenticated, logout } from "../../utilities/remote/auth";

// Dialog component to display token expiration message
const TokenExpirationDialog = () => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
    logout();
  }
  if (!isOpen) {
    return null;
  }
  return (
    <div>
      <h3>Token Expired</h3>
      <p>Your session has expired. Please log in again.</p>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({ children, ...rest }) => {
  const authenticated = isAuthenticated();
  const navigation = useNavigate();

  useEffect(() => {
    if(!authenticated) {
      navigation("/login")
    }
  }, [authenticated]);

  return isAuthenticated() ? (
    children
  ) : (
    <>
      {authenticated === false && <TokenExpirationDialog />}
      <Navigate to="/login" state={{ from: rest.location }} replace={true} />
    </>
  );
};
