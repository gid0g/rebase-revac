import React, { useState } from "react";
import "react-activity/dist/library.css";

export const Context = React.createContext();

export const OrganisationContext = ({ children }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const allState = {
    selectedRow,
    setSelectedRow,

  };
  return (
    <Context.Provider value={{ ...allState }}>{children}</Context.Provider>
  );
};
