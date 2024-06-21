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
import { Context } from "../enumeration/enumerationContext";

const TransactionReportBuilder = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const [loading, setLoading] = useState(false);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;

  return (
    <>
      <div className="mb-2 pl-3 flex justify-content-between">
        <div className=" ">
          <h5 className=" mb-2">Transaction Report Builder</h5>
          <h3 className=""> Transaction Overview</h3>
        </div>
      </div>

      <div className=" p-4 shadow-md">
        <div className="row ">
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className=" col-xl-12 col-lg-8">
                    <div className="mb-3">
                      <p>Total Registered Property </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Customer</h6>
                        <b className="text-lg">4530</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                    <img
                      src="/assets/img/svg/img-1.svg"
                      alt=""
                      height="150px"
                      className="d-none d-lg-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-12 col-lg-8">
                    <div className="mb-3 ">
                      <p>Totl Registered Non-Property</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5  pt-2">
                        <h6 className="text-primary">Customer</h6>
                        <b className="text-lg">4530</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                    <img
                      src="/assets/img/svg/img-1.svg"
                      alt=""
                      height="150px"
                      className="d-none d-lg-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-12 col-lg-8">
                    <div className="mb-3">
                      <p>Total Registered & Non Registered Property</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5  pt-2">
                        <h6 className="text-primary">Customer</h6>
                        <b className="text-lg">3</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                    <img
                      src="/assets/img/svg/img-1.svg"
                      alt=""
                      height="150px"
                      className="d-none d-lg-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className=" col-xl-12 col-lg-8">
                    <div className="mb-3">
                      <p>Total Daily Collection </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Naira (#)</h6>
                        <b className="text-lg">40,000,920</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                    <img
                      src="/assets/img/svg/img-1.svg"
                      alt=""
                      height="150px"
                      className="d-none d-lg-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className=" col-xl-12 col-lg-8">
                    <div className="mb-3">
                      <p>Total Monthly Collection </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Naira (#)</h6>
                        <b className="text-lg">40,000,920</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                    <img
                      src="/assets/img/svg/img-1.svg"
                      alt=""
                      height="150px"
                      className="d-none d-lg-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className=" col-xl-12 col-lg-8">
                    <div className="mb-3">
                      <p>Total Yearly Collection </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Naira (#)</h6>
                        <b className="text-lg">40,000,920</b>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                    <img
                      src="/assets/img/svg/img-1.svg"
                      alt=""
                      height="150px"
                      className="d-none d-lg-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 shadow-md p-4">
        <div className="grid gap-3 p-3">
          <div className="grid-col-6">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <h5>Daily Collection per Bank</h5>
                <p>#880,021,000</p>
                <p>
                  <span className="text-green">!2.1% </span>vs last week
                </p>
                <p>Sales from 1-12 Dec, 2023</p>
                <div></div>
              </div>
            </div>
          </div>

          <div className="grid-col-6">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <h5>Daily Collection per Bank</h5>
                <p>#880,021,000</p>
                <p>
                  <span className="text-green">!2.1% </span>vs last week
                </p>
                <p>Sales from 1-12 Dec, 2023</p>
                <div></div>
              </div>
            </div>
          </div>
        </div>
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

export default TransactionReportBuilder;
