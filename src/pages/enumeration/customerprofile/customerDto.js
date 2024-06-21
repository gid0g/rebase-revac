import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { AppSettings } from "../../../config/app-settings.js";
import api from "../../../axios/custom.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import CryptoJS from "crypto-js";

import React from "react";
import { Context } from "../enumerationContext.js";

const CustomerDto = () => {
  const {
    data,
    setAddressNo,
    addressNo,
    submitEnumerationData,
    loading,
    setLoading,
  } = useContext(Context);

  const handleAddressNo = (e) => {
    setAddressNo(e.target.value);
  };

  return (
    <AppSettings.Consumer>
      {({ cartIsShown, showModalHandler, hideModalHandler }) => (
        <div>
          <ol className="breadcrumb float-xl-end">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">Enumeration</li>

            <li className="breadcrumb-item active">Customer Profile</li>
          </ol>
          <h1 className="page-header mb-3">Customer Profile</h1>
          <hr />

          <div className=" mt-3 d-flex flex-column">
            <hr></hr>
            <ToastContainer />
            <form onSubmit={submitEnumerationData}>
              <div className="row align-items-center">
                <div className="col-1">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data ? data.title : ""}
                    />
                  </div>
                </div>
                <div className="col-1">
                  <div className="mb-3">
                    <label className="form-label">Sex</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.sex}
                    />
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-3">
                    <label className="form-label">Marital Status</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.maritalstatus}
                    />
                  </div>
                </div>
              </div>
              <div className="row  align-items-center">
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.fullName}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.email}
                    />
                  </div>
                </div>
              </div>

              <div className="row  align-items-center">
                <div className="col-10">
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.address}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Address No</label>
                    <input
                      className="form-control"
                      type="text"
                      value={addressNo}
                      onChange={handleAddressNo}
                    />
                  </div>
                </div>
              </div>
              <div className="row  align-items-center">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Payer ID</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.payerID}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.gsm}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Corporate Name</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.corporateName}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label">Branch Name</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={data.branchName}
                    />
                  </div>
                </div>
              </div>

              <div className=" d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn bg-blue-900 text-white"
                  //   onClick={submitPayerId}
                >
                  {loading ? <Spinner /> : "Continue to Billing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppSettings.Consumer>
  );
};

export default CustomerDto;
