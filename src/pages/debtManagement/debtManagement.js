import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../axios/custom";
import Select from "react-select";
import { AppSettings } from "../../config/app-settings";
import { Spinner } from "react-activity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateRange } from "react-date-range";
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import Card from 'react-bootstrap/Card';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Context } from "../enumeration/enumerationContext";
import DataTable from "react-data-table-component";
import FilterComponent from "../../components/filtercomponent/filtercomponent";
import { AccordionItem, useAccordionButton } from "react-bootstrap";

const ContextAwareToggle = ({ children, eventKey, callback }) => {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <button
      type="button"
      className="bg-sky-50 text-blue-900 py-2 px-6 rounded-md font-semibold"
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

const DebtManagement = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const [loading, setLoading] = useState(false);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [payerTypeId, setPayerTypeId] = useState(null);
  const [allRevenue, setAllRevenue] = useState("");
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [lgas, setLgas] = useState([]);
  const [selectedLga, setSelectedLga] = useState("");
  const [lcdas, setLcdas] = useState([]);
  const [selectedLcda, setSelectedLcda] = useState("");
  const [debtPerDay, setDebtPerDay] = useState(null);
  const [debtPerYear, setDebtPerYear] = useState(null);
  const [debtPerMonth, setDebtPerMonth] = useState(null);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const customRowsPerPageOptions = [5, 10, 20];
  const [pending, setPending] = useState(true);
  const [totalRows, setTotalRows] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [billData, setBillData] = useState([]);
  const [billDataInfo, setBillDataInfo] = useState([]);
  const { agencies } = useContext(Context);



  const columns = [
    {
      name: "S/N",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      sortable: true,
      grow: 0,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Property",
      selector: (row) => row.propertyBuildingName,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Customer Name",
      selector: (row) => row.customersFullName,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Agency",
      selector: (row) => row.agencyName,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Paid Amount",
      selector: (row) => row.totalAmountPaid,
      sortable: true,
      grow: 1,      
      style: {
        textAlign: "center",
      },
    },

    {
      name: "Outstanding Amount",
      selector: (row) => row.totalBillArrears,
      sortable: true,
      grow: 1,      
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Harmonized Bill Reference",
      selector: (row) => row.harmonizedBillReferenceNo,
      sortable: true,
      grow: 1,
      style: {
        textAlign: "center",
      },
    },

    {
      name: "Action",
      sortable: false,
      center: true,
      grow: 0,

      cell: (row) => (
        <div>
          <button 
           data-bs-toggle="modal"
           data-bs-target="#viewMore" 
           className="btn btn-sm shadow-md bg-primary text-white"
           type="button"
           onClick={() => handleViewMore(row)}
           >
             View More
          </button>
        </div>
      ),
    },
  ];

  const handleViewMore = (item) => {
    const filteredBillData = billData?.filter(bill => bill.harmonizedBillReferenceNo == item?.harmonizedBillReferenceNo);
    setBillDataInfo(filteredBillData);

    console.log("Filtered Bill:", filteredBillData);
  }


  const filteredItems = data.filter(
    (item) =>
      item.propertyBuildingName ||
      item.customersFullName ||
      item.agencyName ||
      item.property?.buildingName
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  const reversedFilteredItems = [...filteredItems].reverse();
  
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        placeholder="Search By Property Name"
      />
    );
  }, [filterText, resetPaginationToggle]);

  //************** ALL API CALLS *************/

  //Api to get all revenues
  const fetchAllRevenues = async () => {
    await api
      .get("revenue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setAllRevenue(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchAllRevenues();
  }, []);

  // Fetch the list of states from the API and set the options for the state select element
  useEffect(() => {
    const fetchState = async () => {
      await api
        .get("enumeration/states")
        .then((response) => {
          setState(response.data);
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
    fetchState();
  }, []);

  //Fetch all corresponding Lgas based on the state selected
  useEffect(() => {
    const fetchLga = async () => {
      await api
        .get(`enumeration/${selectedState}/lgas`)
        .then((response) => {
          setLgas(response.data);
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
    if (selectedState) {
      fetchLga();
    } else {
      setLgas([]);
      setSelectedLga("");
    }
  }, [selectedState]);

  //Fetch all corresponding Lcdas based on Lgs selected
  useEffect(() => {
    const fetchLcda = async () => {
      await api
        .get(`enumeration/${selectedLga}/lcdas`)
        .then((response) => {
          // console.log("fetched lcdas------", response.data);
          setLcdas(response.data);
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
    if (selectedLga) {
      fetchLcda();
    } else {
      setLcdas([]);
      setSelectedLcda("");
    }
  }, [selectedLga]);

  //api to get all debts
  useEffect(() => {
    //per-month
    api
      .get(`billing/${organisationId}/debt-reportfor-month`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDebtPerMonth(response.data);
      })
      .catch((error) => {
        console.log(error);
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

    //per-year
    api
      .get(`billing/${organisationId}/debt-reportthis-year`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDebtPerYear(response.data);
      })
      .catch((error) => {
        console.log(error);
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

    //per-day
    api
      .get(`billing/${organisationId}/debt-reportfor-today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDebtPerDay(response.data);
      })
      .catch((error) => {
        console.log(error);
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
  }, []);

  const fetchData = (page) => {
    fetch(`/response.json?pagenumber=${page}&PageSize=${perPage}`)
    .then((response) => response.json())
    .then((jsonData) => {
      console.log("JsonData---:", jsonData);
      setData(jsonData);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  useEffect(() => {


    // Fetch the JSON file data
    fetch(`/response.json`)
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("JsonData---:", jsonData);
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  //************** ALL API CALLS *************/

  //************* HANDLE ALL SELECT TAGS *************/

  const payerType = [
    { value: "", label: "-- Select a Payer Type --" },
    { value: "1", label: "Individual" },
    { value: "2", label: "Corporate" },
  ];

  const transformedAgencyData = agencies
    ? agencies.map((item) => ({
        label: item.agencyName,
        value: item.agencyId,
      }))
    : [];
    
  transformedAgencyData.unshift({
    value: "",
    label: "-- Area Office/Zone --",
  });

  const transformedRevenueData = allRevenue
    ? allRevenue.map((item) => ({
        label: item.revenueName,
        value: item.revenueId,
      }))
    : [];
  transformedRevenueData.unshift({
    label: "-- Select Revenue --",
    value: "",
  });

  const transformedStateData = state
    ? state.map((item) => ({
        label: item.stateName,
        value: item.id,
      }))
    : [];
  transformedStateData.unshift({
    label: "-- Select State --",
    value: "",
  });

  const transformedLGAData = lgas
    ? lgas.map((item) => ({
        label: item.lgaName,
        value: item.id,
      }))
    : [];
  transformedLGAData.unshift({
    label: "-- Select LGA --",
    value: "",
  });

  const transformedLCDAData = lcdas
    ? lcdas.map((item) => ({
        label: item.lcdaName,
        value: item.id,
      }))
    : [];
  transformedLCDAData.unshift({
    label: "-- Select LCDA --",
    value: "",
  });

  //************* *************/

  const handlePayerType = (selectedPayerType) => {
    setPayerTypeId(selectedPayerType.value);
  };
  const handleAgencyChange = (agencyOption) => {};
  const handleStateChange = (selectedState) => {
    const stateId = selectedState.value;
    setSelectedState(stateId);
  };
  const handleLcdaChange = (selectedLcda) => {
    setSelectedLcda(selectedLcda.value);
  };
  const handleLgaChange = (selectedLga) => {
    setSelectedLga(selectedLga.value);
  };

  const handlePageChange = (page) => {
    fetchData(page);
    // const nextPage = currentPage + 1;
    // setCurrentPage(nextPage)
  };

  function calculateSumsByCriteria(billsArray) {
    const groupedBills = {};
  
    billsArray.forEach((bill) => {
      const key = `${bill.harmonizedBillReferenceNo}`;
  
      if (!groupedBills[key]) {
        groupedBills[key] = {
          customersFullName: bill.customers.fullName,
          harmonizedBillReferenceNo: bill.harmonizedBillReferenceNo,
          agencyName: bill.agencies.agencyName,
          propertyBuildingName: bill.property.buildingName,
          totalBillArrears: 0,
          totalAmountPaid: 0,
        };
      }
  
      groupedBills[key].totalBillArrears += bill.billArrears;
      groupedBills[key].totalAmountPaid += bill.amountPaid;
    });
  
    const resultArray = Object.values(groupedBills).map((groupedBill) => ({
      customersFullName: groupedBill.customersFullName,
      harmonizedBillReferenceNo: groupedBill.harmonizedBillReferenceNo,
      agencyName: groupedBill.agencyName,
      propertyBuildingName: groupedBill.propertyBuildingName,
      totalBillArrears: groupedBill.totalBillArrears,
      totalAmountPaid: groupedBill.totalAmountPaid,
    }));

    console.log("Result Array", resultArray)
  
    return resultArray;
  }


  const handlePerRowsChange = async (newPerPage, page) => {
    setPending(true);

    const response = await api.get(
      `billing/${organisationId}?pagenumber=${page}&PageSize=${newPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBillData(response?.data);
    const transformedData = calculateSumsByCriteria(response.data);
    setData(transformedData);
    setPerPage(newPerPage);
    setPending(false);
  };


  const handleFilterDebtManagement = async (e) => {
    e.preventDefault();
    console.log("PayerTypeId:", payerTypeId);
    console.log("selectedState:", selectedState);
    console.log("selectedLcda:", selectedLcda);
    console.log("selectedLga:", selectedLga);
    // organisationId, payerId, payerTypeId, AreaOffice, Revenue, stateId, LcdaId, LgaId, StartDate, EndDate

    try{
      const response = await api.get(`/billing/debt-filter-report/16?PayerId=&PayerTypeId&AreaOffice&Revenue&stateId=0&LcdaId=0&LgaId=0&StartDate=11/09/2023, 08:05:00 AM&EndDate=01/01/2024, 08:05:00 AM`)
    } catch(err) {

    }
  }

  const checkStatus = (value) => {
    if(value && value == "Paid") {
      return "bg-green-500 text-white";
    } else if(value && value == "Unpaid") {
      return "bg-red-500 text-white"
    } else {
      return ""
    }
  }
  

  return (
    <>
      <div className="mb-2 pl-3 flex justify-content-between">
        <div className=" ">
          <h5 className=" mb-2">Debt Report</h5>
          <h3 className="">Unbalanced Bill Summary</h3>
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
                      <p>Today </p>
                    </div>
                    <hr className="text-dark" />
                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Total Count</h6>
                        <b className="text-lg">{debtPerDay?.count}</b>
                      </div>

                      <div className="border-r-2 border-zinc-400"></div>

                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Total Amount</h6>
                        <b className="text-lg">{debtPerDay?.totalAmount}</b>
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
                      <p>This Month</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5  pt-2">
                        <h6 className="text-primary">Total Count</h6>
                        <b className="text-lg">{debtPerMonth?.count}</b>
                      </div>

                      <div className="border-r-2 border-zinc-400"></div>

                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Total Amount</h6>
                        <b className="text-lg">{debtPerMonth?.totalAmount}</b>
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
                      <p>This Year</p>
                    </div>
                    <hr className="text-dark" />

                    <div className="flex justify-content-between mb-1">
                      <div className="w-2/5  pt-2">
                        <h6 className="text-primary">Total Count</h6>
                        <b className="text-lg">{debtPerYear?.count}</b>
                      </div>

                      <div className="border-r-2 border-zinc-400"></div>

                      <div className="w-2/5 pt-2">
                        <h6 className="text-primary">Total Amount</h6>
                        <b className="text-lg">{debtPerYear?.totalAmount}</b>
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
        <div className="flex justify-end p-3">
          {" "}
          <h4 className="text-gray ">
            <i className="fas fa-sliders fa-fw"></i> Filter
          </h4>
        </div>

        <div className="grid gap-y-6">
          <div className="row ">
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Tax Payer ID"
              />
            </div>
            <div className="col-4">
              <Select
                id="category"
                className="basic-single"
                classNamePrefix="Please Select Billing Type"
                name="category"
                defaultValue={payerType[0]}
                options={payerType}
                onChange={handlePayerType}
              />
            </div>
            <div className="col-4">
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={transformedAgencyData[0]}
                isSearchable={true}
                name="Agency"
                options={transformedAgencyData}
                onChange={handleAgencyChange}
              />
            </div>
          </div>
          <div className="row ">
            <div className="col-4">
              <Select
                id="category"
                className="basic-single"
                classNamePrefix="Please Select Billing Type"
                name="category"
                defaultValue={transformedRevenueData[0]}
                options={transformedRevenueData}
                onChange={handlePayerType}
              />
            </div>
          </div>
          <div className="row ">
            <div className="col-4">
              <Select
                id="category"
                className="basic-single"
                classNamePrefix="Please Select Billing Type"
                name="category"
                defaultValue={transformedStateData[0]}
                options={transformedStateData}
                onChange={handleStateChange}
              />
            </div>
            <div className="col-4">
              <Select
                id="category"
                className="basic-single"
                classNamePrefix="Please Select Billing Type"
                name="category"
                defaultValue={transformedLGAData[0]}
                options={transformedLGAData}
                onChange={handleLgaChange}
              />
            </div>
            
          </div>

          <div className="row ">
              <div className="col-4">
                <label className="my-2">Start Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Enter Start Date"
                  name="start_date"
                />
              </div>

              <div className="col-4">
              <label className="my-2">End Date</label>
              <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Enter End Date"
                  name="end_date"
                />
              </div>
            </div>
        </div>

        <div className="flex justify-end mt-3 p-3">
          {" "}
          <button className="btn btn-primary mr-3" onClick={handleFilterDebtManagement}> Search</button>
          <button className="btn btn-danger">Reset</button>
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

      <div className="table-responsive">
        <DataTable
          columns={columns}
          data={reversedFilteredItems}
          pagination
          paginationRowsPerPageOptions={customRowsPerPageOptions}
          progressPending={pending}
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </div>

      <div className="modal fade"  id="viewMore">
          <div className="modal-dialog"  >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Bill Information</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                {billDataInfo && (
                  <>
                    <div className="w-full flex flex-col gap-2 border-b-[1px] border-gray-300 pb-2">
                      <div className="flex justify-between items-center w-full">
                        <h4 className="text-black text-sm font-medium">HarmonizedBillReferenceNo:</h4>
                        <span className="text-gray-600 text-sm font-medium">{billDataInfo[0]?.harmonizedBillReferenceNo}</span>
                      </div>

                      <div className="flex justify-between items-center gap-4">
                          <span className="text-gray-600 text-sm font-medium inline-flex">No. of Bills</span>
                          <span className="bg-sky-50 inline-flex text-blue-950 py-.5 px-2 rounded-md text-center font-bold">{billDataInfo.length}</span>
                      </div>

                    </div>


                  <div className="flex justify-start items-start flex-col my-2">
                      <h4 className="text-gray-800 font-semibold text-sm">List of Bills</h4>
                  </div>

                  </>

                )}

                <div className="w-full flex justify-start items-start flex-col gap-2">
                  {billDataInfo && billDataInfo.map((bill, i) => (
                    <div key={i} className="w-full flex justify-start items-start flex-col">


                      <div className="w-full flex flex-col justify-start items-start gap-4">
                      
                        <Accordion defaultActiveKey={i == 0 ? i : 0} className="!bg-[transparent] !w-full">
                            <Accordion.Item eventKey={i} className="!bg-[transparent]">
                              <Accordion.Header className="!text-blue-950 !bg-[transparent]">
                                <div className="!w-full !flex !justify-start !items-center gap-4">
                                    <span className="text-black text-sm inline-flex">{i+1}. BillReferenceNo:</span>
                                    <span className="text-gray-900 text-center inline-flex">{bill?.billReferenceNo}</span>
                                </div>
                                  </Accordion.Header>
                              <Accordion.Body className="!visible !h-52 overflow-y-auto">
                                <div className="w-full flex flex-col justify-start items-center gap-2">

                                <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Bill Type:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.billType.billTypeName ? bill.billType.billTypeName : "None"}</span>
                                  </div>

                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Property Name:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.property.buildingName ? bill.property.buildingName : "None"}</span>
                                  </div>

                                  
                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Customer Name:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.customers.fullName}</span>
                                  </div>

                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Agency Name:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.agencies.agencyName ? bill.agencies.agencyName : "Null"}</span>
                                  </div>

                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Frequency Name:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.frequencies.frequencyName ? bill.frequencies.frequencyName : "Null"}</span>
                                  </div>

                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Business Type:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.businessType.businessTypeName ? bill.businessType.businessTypeName : "Null"}</span>
                                  </div>
  
                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Revenue(s):</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.revenues.revenueName}</span>
                                  </div>

                                                                  
                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Category:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.category}</span>
                                  </div>

                                                                                                  
                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Amount Paid:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.amountPaid}</span>
                                  </div>


                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Arrears:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.billArrears}</span>
                                  </div>

                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Applied Date:</h4>
                                    <span className="text-gray-600 font-medium inline-flex"> {bill.appliedDate}</span>
                                  </div>

                                  
                                  <div className="w-full flex justify-between items-center border-b-[1px] border-gray-300 py-2">
                                    <h4 className="text-sm inline-flex">Bill Status:</h4>
                                    <span className={`${checkStatus(bill.billStatus.billStatusName)}  font-semibold inline-flex py-2 px-3 rounded-md`}> {bill.billStatus.billStatusName ? bill.billStatus.billStatusName : "Null"}</span>
                                  </div>

                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default DebtManagement;
