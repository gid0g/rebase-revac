import React, { useState, useEffect } from "react";
import api from "../../../axios/custom";
import { Link } from "react-router-dom";
import { MyLoader } from "../../../ui/contentLoader";
import DataTable from "react-data-table-component";

const Enumerate = () => {
  const token = sessionStorage.getItem("myToken");
  const [propPerDay, setPropPerDay] = useState("");
  const [propPerWeek, setPropPerWeek] = useState("");
  const [propPerMonth, setPropPerMonth] = useState("");
  const [customerPerDay, setCustomerPerDay] = useState("");
  const [customerPerWeek, setCustomerPerWeek] = useState("");
  const [customerPerMonth, setCustomerPerMonth] = useState("");
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);

  const organisationId = sessionStorage.getItem("organisationId");

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },

    {
      name: "Agency Name",
      selector: (row) => row.agencyName,
      sortable: true,
    },
    {
      name: "Property Count ",
      selector: (row) => row.propertyCount,
      sortable: true,
    },
    {
      name: "Customer Count",
      selector: (row) => row.customerCount,
      sortable: true,
    },
  ];
  //api to get registered properties
  useEffect(() => {
    //per-month
    api
      .get(
        `enumeration/${organisationId}/count-of-registered-properties-this-month`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPropPerMonth(response.data);
        console.log(propPerMonth);
      })
      .catch((error) => {
        console.log(error);
      });
    //per-week
    api
      .get(
        `enumeration/${organisationId}/count-of-registered-properties-this-week`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPropPerWeek(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //per-day
    api
      .get(
        `enumeration/${organisationId}/count-of-registered-properties-today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPropPerDay(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //api to get customers
  useEffect(() => {
    //per-month
    api
      .get(
        `enumeration/${organisationId}/count-of-registered-customers-this-month`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCustomerPerMonth(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //per-week
    api
      .get(
        `enumeration/${organisationId}/count-of-registered-customers-this-week`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCustomerPerWeek(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //per-day
    api
      .get(
        `enumeration/${organisationId}/count-of-registered-customers-today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCustomerPerDay(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //api to get table data
  useEffect(() => {
    // Fetch data from API and update state
    api
      .get(
        `enumeration/${organisationId}/count-of-properties-and-customers-by-area-office`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPending(false);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div className="mb-3 flex justify-content-between">
        <div className=" ">
          <h3 className=" mb-0">Enumeration</h3>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home/Dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">Enumeration</li>
            <li className="breadcrumb-item active">Enumeration </li>
          </ol>
        </div>

        <div className=" items-center	 gap-3 flex flex-row-reverse">
          <div className="">
            <Link className="btn bg-dark text-white" to="../billing">
              Start new non-property enumeration
            </Link>
          </div>
          <div className="">
            <Link to="PropertyProfile" className="btn bg-primary text-white ">
              Start new property enumeration
            </Link>
          </div>
        </div>
      </div>

      <div className=" p-4 shadow-md">
        <div className="row ">
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-12 col-lg-8">
                    <div className="mb-3">
                      <p>No of registered property this month </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {propPerMonth ? propPerMonth : <MyLoader />}
                      </h2>
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
                      <p>No of registered property this week</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {propPerWeek ? propPerWeek : <MyLoader />}
                      </h2>
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
                      <p>No of registered property today</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {propPerDay ? propPerDay : <MyLoader />}{" "}
                      </h2>
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

        <div className="row">
          <div className="col-xl-4">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-12 col-lg-8">
                    <div className="mb-3 ">
                      <p>No of registered customer this month</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {customerPerMonth ? customerPerMonth : <MyLoader />}
                      </h2>
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
                      <p>No of registered customer this week</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {customerPerWeek ? customerPerWeek : <MyLoader />}
                      </h2>
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
                      <p>No of registered customer today</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {customerPerDay ? customerPerDay : <MyLoader />}
                      </h2>
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

      <div className="mt-3 p-4 shadow-md">
        <DataTable
          title="Property and Customer Count Table"
          columns={columns}
          data={data}
          pagination
          progressPending={pending}
        />
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

export default Enumerate;
