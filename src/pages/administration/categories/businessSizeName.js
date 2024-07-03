import React, { useState, useEffect } from "react";
import api from "../../../axios/custom";

const BusinessSizeName = ({ isActive }) => {
  const organisationId = sessionStorage.getItem("organisationId");
  const token = sessionStorage.getItem("myToken");
  const [businessSizeName, setBusinessSizeName] = useState("");
  const fetchBusinessSizes = () => {
    api
      .get(`enumeration/${organisationId}/business-sizes/${isActive}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBusinessSizeName(response.data.businessSizeName);
      });
  };
  useEffect(() => {
    fetchBusinessSizes();
  }, []);

  return (
    <div>
      <p>{businessSizeName}</p>
    </div>
  );
};

export default BusinessSizeName;
