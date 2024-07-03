import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../axios/custom";
import Select from "react-select";
import { AppSettings } from "../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";

const IndividualPaymentHistory = () => {
  const [isOn, setIsOn] = useState(false);
  const token = sessionStorage.getItem("myToken");
  const [loading, setLoading] = useState(false);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const organisationId = sessionStorage.getItem("organisationId");

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">Payments</li>
        <li className="breadcrumb-item active">Home</li>
      </ol>

      <h1 className="page-header mb-3">Payments</h1>
      <hr />
    </>
  );
};

export default IndividualPaymentHistory;
