import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../axios/custom.js";
import GoogleMapReact from "google-map-react";
// import ReactECharts from 'echarts-for-react';
import Chart from "react-apexcharts";
// import DateRangePicker from "react-bootstrap-daterangepicker";
// import Moment from "moment";
// import { AppSettings } from "../../config/app-settings.js";
import "bootstrap-daterangepicker/daterangepicker.css";
import authReducer from "../../redux/reducers/authReducer.js";
import { useSelector } from "react-redux";
import EChartsReact from "echarts-for-react";
import { MyLoader } from "../../ui/contentLoader.js";
import DataTable from "react-data-table-component";

const Dashboard = () => {
  const token = sessionStorage.getItem("myToken");
  const [totalPropCustomer, setTotalPropCustomer] = useState([]);
  const [totalNonPropCustomer, setTotalNonPropCustomer] = useState();
  const totalCustomers = totalPropCustomer + totalNonPropCustomer;

  const [dailyCollection, setDailyCollection] = useState([]);
  const [monthlyCollection, setMonthlyCollection] = useState([]);
  const [yearlyCollection, setYearlyCollection] = useState([]);

  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const organisationId = sessionStorage.getItem("organisationId");
  const [activeButton, setActiveButton] = useState("Revenue"); // Initialize with the default active button

  const fetchRevenueData = () => {
    api
      .get(`payment/${organisationId}/count-properties-by-revenue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setPending(false);
        console.log("revenue---", data);
      })
      .catch((error) => {
        console.log(error);
        setPending(false);
      });
  };

  const fetchAgencyData = () => {
    api
      .get(`payment/${organisationId}/count-properties-by-agency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setPending(false);
        console.log("agency---", data);
      })
      .catch((error) => {
        console.log(error);
        setPending(false);
      });
  };

  const fetchBankData = () => {
    api
      .get(
        `payment/${organisationId}/count-properties-by-bank`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data);
        setPending(false);
        console.log("bankdata---", data);
      })
      .catch((error) => {
        console.log(error);
        setPending(false);
      });
  };

  useEffect(() => {
    // Fetch initial data (Revenue)
    fetchRevenueData();
  }, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setPending(true);

    switch (buttonName) {
      case "Revenue":
        fetchRevenueData();
        break;
      case "Agency":
        fetchAgencyData();
        break;
      case "Bank":
        fetchBankData();
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },

    {
      name: "Revenue",
      selector: (row) => row.revenueName,
      sortable: true,
    },
    {
      name: "Count of Bill",
      selector: (row) => row.billCount,
      sortable: true,
    },
    {
      name: "Value of Bill",
      selector: (row) => row.billValue,
      sortable: true,
    }, 
    {
      name: "Amount Paid",
      selector: (row) => row.billPaid,
      sortable: true,
    },
    {
      name: "Amount Outstanding",
      selector: (row) => row.billOutstanding,
      sortable: true,
    },
  ];

  const agencyColumns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },

    {
      name: "Agency",
      selector: (row) => row.agencyName,
      sortable: true,
    },
    {
      name: "Count of Bill",
      selector: (row) => row.billCount,
      sortable: true,
    },
    {
      name: "Value of Bill",
      selector: (row) => row.billValue,
      sortable: true,
    },
    {
      name: "Amount Paid",
      selector: (row) => row.billPaid,
      sortable: true,
    },
    {
      name: "Amount Outstanding",
      selector: (row) => row.billOutstanding,
      sortable: true,
    },
  ];

  const bankColumns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },

    {
      name: "Bank Name",
      selector: (row) => row.bankName,
      sortable: true,
    },
    {
      name: "Count of Bill",
      selector: (row) => row.billCount,
      sortable: true,
    },
    {
      name: "Value of Bill",
      selector: (row) => row.billValue,
      sortable: true,
    },
    {
      name: "Amount Paid",
      selector: (row) => row.billPaid,
      sortable: true,
    },
  ];

  //api call to get property customers
  useEffect(() => {
    //per-day
    api
      .get(`transactionReport/${organisationId}/total-property-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTotalPropCustomer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //per-month
    api
      .get(`transactionReport/${organisationId}/total-non-property-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTotalNonPropCustomer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // api to get collections
  useEffect(() => {
    //for a day
    api
      .get(`payment/${organisationId}/daily-total-payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPending(false);
        setDailyCollection(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    //for month
    api
      .get(`payment/${organisationId}/monthly-total-payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPending(false);
        setMonthlyCollection(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // for yearly
    api
      .get(`payment/${organisationId}/year-total-payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPending(false);
        setYearlyCollection(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const chart1 = {
    xAxis: {
      type: "category",
      data: ["01", "02", "03", "04", "05", "06", "07", "08"],
    },
    yAxis: {
      type: "value",
    },

    legend: {
      data: ["Paid Bills", "Unpaid Bills"],
    },

    series: [
      {
        name: "Paid Bills",
        type: "bar",
        data: [70, 50, 50, 80, 70, 54, 84, 64],
        // Customize style for the first set of bars
        itemStyle: {
          color: "#009BEF",
          borderColor: "#009BEF",
          borderWidth: 2,
          barWidth: 15,
        },
      },
      {
        name: "Unpaid Bills",
        type: "bar",
        data: [40, 34, 20, 60, 50, 54, 30, 80],
        // Customize style for the second set of bars
        itemStyle: {
          color: "#e6e8ec",
          borderColor: "#e6e8ec",
          borderWidth: 2,
          barWidth: 15,
        },
      },
    ],
  };
  const chart2 = {
    xAxis: {
      type: "category",
      data: [
        "Wema",
        "FCMB",
        "Zenith",
        "Access",
        "GTB",
        "First Bank",
        "Polaris",
        "Kuda",
      ],
    },
    yAxis: {
      type: "value",
    },

    legend: {
      data: ["Paid Bills", "Unpaid Bills"],
    },

    series: [
      {
        name: "Paid Bills",
        type: "bar",
        data: [700000, 50000, 50000, 800000, 700000, 540000, 840000, 640000],
        // Customize style for the first set of bars
        itemStyle: {
          color: "#002336",
          borderColor: "#002336 ",
          borderWidth: 2,
          barWidth: 15,
        },
      },
      {
        name: "Unpaid Bills",
        type: "bar",
        data: [40, 34, 20, 60, 50, 54, 30, 80],
        // Customize style for the second set of bars
        itemStyle: {
          color: "#e6e8ec",
          borderColor: "#e6e8ec",
          borderWidth: 2,
          barWidth: 15,
        },
      },
    ],
  };

  return (
    <>
      <div className="mb-3 flex justify-content-between">
        <div className=" ">
          <h3 className=" mb-0">Revenue Dashboard</h3>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home/Dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">Dashboard</li>
          </ol>
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
                      <p>Total Registered Property Customer </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {totalPropCustomer ? totalPropCustomer : <MyLoader />}
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
                      <p>Total Registered Non-Property</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {totalNonPropCustomer ? (
                          totalNonPropCustomer
                        ) : (
                          <MyLoader />
                        )}
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
                      <p>Total Combined Customer</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {totalCustomers ? totalCustomers : <MyLoader />}{" "}
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
                      <p>Total Daily Collection</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {dailyCollection.data ? (
                          dailyCollection.data
                        ) : (
                          <MyLoader />
                        )}
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
                      <p>Total Monthly Collection</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {monthlyCollection.data ? (
                          monthlyCollection.data
                        ) : (
                          <MyLoader />
                        )}
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
                      <p>Total Yearly Collection</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="d-flex mb-1">
                      <h2 className="mb-0">
                        {yearlyCollection.data ? (
                          yearlyCollection.data
                        ) : (
                          <MyLoader />
                        )}
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
      <div className="items-center gap-3 flex flex-row-reverse">
        <div className="">
          <button
            style={{ backgroundColor: activeButton === 'Bank' ? '#009BEF' : '',color: activeButton === 'Bank' ? 'white' : 'black' }}
            className={`btn btn-white  ${activeButton === 'Bank' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Bank')}>
            Bank
          </button>
        </div>
        <div className="">
          <button
            style={{ backgroundColor: activeButton === 'Revenue' ? '#009BEF' : '', color: activeButton === 'Revenue' ? 'white' : 'black'}}
            className={`btn btn-white  ${activeButton === 'Revenue' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Revenue')}>
            Revenue
          </button>
        </div>
        <div className="">
          <button
            style={{ backgroundColor: activeButton === 'Agency' ? '#009BEF' : '', color: activeButton === 'Agency' ? 'white' : 'black' }}
            className={`btn btn-white  ${activeButton === 'Agency' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Agency')}>
            Agency
          </button>
        </div>
      </div>        
        {activeButton === 'Bank' && (
            <DataTable
            title="Total Collection by Bank"
            columns={bankColumns}
            data={data}
            pagination
            progressPending={pending}
          />
        )}

        {/* Display Agency Data */}
        {activeButton === "Agency" && (
          <DataTable
            title="Total Collection by Agency"
            columns={agencyColumns}
            data={data}
            pagination
            progressPending={pending}
          />
        )}

        {/* Total collection data table */}
        {activeButton === "Revenue" && (
          <DataTable
            title="Total Collection by Revenue"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
          />
        )}
      </div>
      <div className="mt-3 shadow-md p-4">
        <div className="grid gap-3 p-3">
          <div className="grid-col-6">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <h5>Daily Collection by Bank</h5>
                <p>#880,021,000</p>
                <p>Sales from 1-12 Dec, 2023</p>
                <div>
                  <EChartsReact option={chart1} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid-col-6">
            <div className="card border-0 mb-3 overflow-hidden bg-white shadow-sm text-dark">
              <div className="card-body">
                <h5>Bill Performance</h5>
                <p>Sales from 1-12 Dec, 2023</p>
                <div>
                  <EChartsReact option={chart2} />
                </div>
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

export default Dashboard;
