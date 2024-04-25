import React, { useState } from "react";
import "react-activity/dist/library.css";

export const Context = React.createContext();

export const SelfServiceContextProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const allState = {
    email,
    setEmail,
    forgotEmail,
    setForgotEmail,

  };
  return (
    <Context.Provider value={{ ...allState }}>{children}</Context.Provider>
  );
};
