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

const OrganisationPaymentHistory = () => {
  const [isOn, setIsOn] = useState(false);
  const token = sessionStorage.getItem("myToken");
  const [loading, setLoading] = useState(false);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [data, setData] = useState([]);
  console.log("data----", data);
  const organisationId = sessionStorage.getItem("organisationId");

  //api to get table data
  useEffect(() => {
    // Fetch data from API and update state
    api
      .get(`payment/${organisationId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data);
        //  setTableLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

      <div className="table-responsive">
        <table className="table table-bordered mb-0">
          <thead>
            <tr>
              <th className="font-bold">S/N</th>
              <th className="font-bold">Payer ID</th>
              <th className="font-bold">Bill Reference No</th>
              <th className="font-bold">Entry ID</th>
              <th className="font-bold">Entry Date</th>
              <th className="font-bold">Agency</th>
              <th className="font-bold">Revenue</th>
              <th className="font-bold">Amount</th>
              <th className="font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td colSpan="9">No records</td>
              </tr>
            ) : (
              data?.map((item, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{idx + 1}</td>
                  <td className="font-medium">
                    {item?.property?.buildingName}
                  </td>
                  <td className="font-medium">{item?.customers.fullName}</td>
                  <td className="font-medium">{item?.agencies.agencyName}</td>
                  <td className="font-medium">{item?.revenues.revenueName}</td>
                  <td className="font-medium">{item?.category}</td>
                  <td className="font-bold">Amount</td>
                  <td className="font-bold">Amount</td>
                  <td className="font-medium">
                    <button
                      className="btn bg-blue-900 shadow-md text-white px-4 ml-3"
                      // onClick={() => handlePayNow(item)}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        style={{ marginTop: "20px" }}
        className="btn shadow-md bg-blue-900 text-white"
        type="button"
        onClick={() => window.history.back()}
      >
        Back
      </button>
    </>
  );
};

export default OrganisationPaymentHistory;
