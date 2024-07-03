import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppSettings } from "../../../config/app-settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Context = React.createContext();
export const OnboardingContextProvider = ({ children }) => {
  const token = sessionStorage.getItem("myToken");
  const [payerIdData, setPayerIdData] = useState([]);
  const [payId, setPayId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    organisationName: "",
    corporateAddress: "",
    email: "",
    phone_no: 0,
    state: "",
    lga: "",
    lcda: "",
    logoImage: "",
    bgImage: "",
    agreed: false,
  })



  const allState = {
    setPayerIdData,
    payerIdData,
    setPayId,
    payId,
    message,
    loading,
    setLoading,
    setMessage,
    email,
    setEmail,
    formData,
    setFormData,
    errors,
    setErrors,
  };

  return (
    <Context.Provider value={{ ...allState }}>{children}</Context.Provider>
  );
};
