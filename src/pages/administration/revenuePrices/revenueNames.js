import React, { useState, useEffect } from "react";
import api from "../../../axios/custom";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const RevenueName = ({ isActive }) => {
  const organisationId = sessionStorage.getItem("organisationId");
  const token = sessionStorage.getItem("myToken");
  const [revenueName, setRevenueName] = useState("");
  const fetchBusinessSizes = () => {
    api
      .get(`revenue/${organisationId}/${isActive}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRevenueName(response.data.revenueName);
      })
      .catch((error) => {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };
  useEffect(() => {
    fetchBusinessSizes();
  }, []);

  return (
    <div>
      <p>{revenueName ? revenueName : "None"}</p>
    </div>
  );
};

export default RevenueName;
