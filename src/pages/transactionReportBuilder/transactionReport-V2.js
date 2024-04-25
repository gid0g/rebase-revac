import React, { useState, useEffect, useContext, useMemo } from "react";
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
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import FilterComponent from "../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";


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
      className="uppercase bg-red-50 text-red-500 py-2 px-6 rounded-md font-semibold"
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

const TransactionReportBuilder = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [isRevenueVisible, setIsRevenueVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryTypes, setCategoryTypes] = useState("");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const categoryType = [
    { 
      value: "Collection Agency", 
      label: "--- Collection for Agency (All Transactions/by Bank/by Revenue Type) ---" 
    },
  ];

  const filterList = [
    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },
  ]


  const columnsList = [
    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },

    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },
    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },
    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },
    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },
    {
      label: "Agency",
      value: "agency",
      name: "agency",
    },

    {
      label: "Revenue",
      value: "revenue",
      name: "revenue",
    },

    {
      label: "Bank",
      value: "bank",
      name: "bank",
    },
  ];




  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleBillingTypeChange = (selectedBilling) => {
    setCategoryTypes(selectedBilling.value);
  }

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleAccordionToggle = () => {
    setIsAccordionOpen(prevState => !prevState);
  };

    // Get all agencies
    const [checkboxValues, setCheckboxValues] = useState({});

    const [agencies, setAgencies] = useState([]);
    const [agency, setAgency] = useState({});

    const [revenues, setRevenues] = useState([]);
    const [revenue, setRevenue] = useState({});

    const [banks, setBanks] = useState([]);
    const [bank, setBank] = useState({});



    const [isLoading, setIsLoading] = useState(false);

    const handleAgencyChange = (selectedAgency) => {
      setAgency(selectedAgency);
    };

    const handleRevenueChange = (selectedRevenue) => {
      setRevenue(selectedRevenue);
    };

    const handleBankChange = (selectedBank) => {
      setBank(selectedBank);
    };

    const transformedAgencies = agencies.map((agency) => {
      return {
        label: agency?.agencyName,
        value: agency?.agencyCode,
      }
    })

    const transformedRevenues = revenues.map((revenue) => {
      return {
        label: revenue?.revenueName,
        value: revenue?.revenueId,
      }
    });

    const transformedBanks = banks.map((bank) => {
      return {
        label: bank?.bankName,
        value: bank?.bankCode,
      }
    });


    
  const [reportData, setReportData] = useState([]);

  const convertDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const originalDate = new Date(date);
    const month = months[originalDate.getMonth()];
    const day = originalDate.getDate();
    const year = originalDate.getFullYear();

    return `${month} ${day}, ${year}`;
};

const getBank = (id) => {
  const bank = banks.find(bank => bank.id == id);
  return bank?.bankName;
}


  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Payer Type",
      selector: (row) => row.payerType,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Agency",
      selector: (row) => row.agency,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Revenue",
      selector: (row) => row.revenue,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Bank",
      selector: (row) => getBank(row.bankCode),
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Bank Amount",
      selector: (row) => row.bankAmount,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Entry Date",
      selector: (row) => convertDate(row.entryDate),
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
  ];

  const filteredItems = [...reportData.reverse()];

  const subHeaderComponentMemo = useMemo(() => {
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
        placeholder=""
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);



    useEffect(() => {
      const fetchData = async () => {
        try {
          if (checkboxValues.agency) {
            const agencyResponse = await api.get(`enumeration/${organisationId}/agencies`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }); 

            console.log("Agencies:", agencyResponse.data);
            setAgencies(agencyResponse.data);
          }
  
          if (checkboxValues.revenue) {
            const revenueResponse = await api.get(`revenue/${organisationId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log("Revenues:", revenueResponse.data);
            setRevenues(revenueResponse.data);
          }
  
          if (checkboxValues.bank) {
            const bankResponse = await api.get(`enumeration/banks`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log("Banks:", bankResponse.data);
            setBanks(bankResponse.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [checkboxValues]);
  
        

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));

  };


  
  const handleFilter = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.get(`payment/${organisationId}/payment-filter?PayerId=&Revenue=${revenue?.label ? revenue?.label : ""}&BankCode=${bank.value ? bank.value : ""}&StartDate=${startDate ? startDate : ""}EndDate=${endDate ? endDate : ""}&Agency=${agency?.value ? agency?.value : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReportData([
        {
            paymentId: 2,
            payerId: 7804839,
            entryId: 12,
            webGuid: "45385183716835016",
            assessRef: "45385183716835016",
            entryDate: "2024-01-04T13:57:05.687",
            payerType: "Bank",
            agency: "IJU AREA OFFICE",
            revenue: "RADIO/ TV",
            bankCode: 33,
            amount: 1000.00,
            bankAmount: 1000.00,
            bankEntryDate: "2024-01-04T13:57:05.687",
            bankTransId: 112233445,
            bankTranRef: "033112233442"
        }
    ]);
      console.log("Data:", response?.data);

    } catch(error){
        console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }


    return (
        <>
        
            <div>
                <ol className="breadcrumb float-xl-end">
                    <li className="breadcrumb-item">
                        <Link to="/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Transaction Report Builder</li>
                </ol>
                <h1 className="page-header mb-3">Transaction Report Builder</h1>
                <hr />

                <div className="my-8 p-4 shadow-md bg-white">
                 <div className="row">
                    <div className="col">
                        <h4 className="font-bold">Report Builder</h4>
                        <hr />
                    </div>
                 </div>
                 <div className="grid gap-y-6 mt-8 mb-12">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="category" className="text-sm text-gray-600 font-medium">
                          Search Category
                        </label>
                      </div>
                      <div className="col-md-8">
                        <Select
                          id="category"
                          className="basic-single rounded-md"
                          classNamePrefix="Please Select Category"
                          name="category"
                          defaultValue={categoryType[0]}
                          options={categoryType}
                          onChange={handleBillingTypeChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="category" className="text-sm text-gray-600 font-medium">
                          Start Date / End Date
                        </label>
                      </div>
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-6">
                            <input
                              type="date"
                              value={startDate}
                              placeholder=""
                              onChange={handleStartDateChange}
                              className="my-2 md:my-0 w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="date"
                              value={endDate}
                              placeholder=""
                              onChange={handleEndDateChange}
                              className="my-2 md:my-0 w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="category" className="text-gray-600 text-sm font-medium">
                          Select Filters
                        </label>
                      </div>
                      <div className="col-md-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-6">
                          {filterList?.map((filter, i) => {
                            return (
                              <div
                                key={i}
                                className="form-check form-check-inline"
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={filter.name}
                                  checked={checkboxValues[filter.name] || false}
                                  onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label mx-2" htmlFor={`${filter?.name}`}>
                                  {filter?.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {checkboxValues.agency && (
                      <div className="row">
                        <div className="col-md-4">
                          <label htmlFor="category" className="text-gray-600 text- font-medium">
                            Agency
                          </label>
                        </div>
                        <div className="col-md-8">
                          <Select
                            id="revenue"
                            className="basic-single rounded-md"
                            classNamePrefix="Please Select Revenue"
                            name="revenue"
                            defaultValue={"---Select Agency---"}
                            options={transformedAgencies}
                            onChange={handleAgencyChange}
                          />
                        </div>
                      </div>
                    )}

                    {checkboxValues.revenue && (
                      <div className="row">
                        <div className="col-md-4">
                          <label htmlFor="category" className="text-gray-600 text- font-medium">
                            Revenue
                          </label>
                        </div>
                        <div className="col-md-8">
                          <Select
                            id="revenue"
                            className="basic-single rounded-md"
                            classNamePrefix="Please Select Revenue"
                            name="revenue"
                            defaultValue={"---Select Revenue---"}
                            options={transformedRevenues}
                            onChange={handleRevenueChange}
                          />
                        </div>
                      </div>
                    )}

                    {checkboxValues.bank && (
                      <div className="row">
                        <div className="col-md-4">
                          <label htmlFor="category" className="text-gray-600 text- font-medium">
                            Bank
                          </label>
                        </div>
                        <div className="col-md-8">
                          <Select
                            id="revenue"
                            className="basic-single rounded-md"
                            classNamePrefix="Please Select Revenue"
                            name="revenue"
                            defaultValue={"---Select Bank---"}
                            options={transformedBanks}
                            onChange={handleBankChange}
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white mt-10 mb-2"
                          onClick={handleFilter}
                        >
                          {loading ? <Spinner /> : "Submit"}
                        </button>
                      </div>
                 </div>

                 <div className="row">
                  <Accordion activeKey={isAccordionOpen ? "0" : null}>
                      <Card>
                        <Card.Header className="!bg-gray-50">
                          <ContextAwareToggle eventKey="0" callback={handleAccordionToggle}>
                            Click to select columns to display
                          </ContextAwareToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0" className="!visible">                      
                          <Card.Body>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
                              {columnsList?.map((column, i) => {
                                return (
                                  <div
                                    key={i}
                                    className="form-check form-check-inline"
                                  >
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name={`${column?.name}`}
                                      value={column.value}
                                      // onChange={}
                                    />
                                    <label className="form-check-label mx-2" htmlFor={`${column?.name}`}>
                                      {column?.label}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                  </Accordion>
                 </div>

                 <div className="row">
                      <div className="!mt-6 flex items-center gap-2">
                        <button className="btn text-gray-800 bg-gray-50 border-[1px] border-gray-700">Excel</button>
                        <button className="btn text-gray-800 bg-gray-50 border-[1px] border-gray-700">PDF</button>
                        <button className="btn text-gray-800 bg-gray-50 border-[1px] border-gray-700">Print</button>
                      </div>
                 </div>

                 <div className="flex justify-center">
                    <div className="w-full p-3">
                      <div className="">
                        <div className="">
                          <DataTable
                            columns={columns}
                            data={filteredItems}
                            onClick={(item) => console.log(item)}
                            pagination
                            loading
                            progressPending={pending}
                            paginationResetDefaultPage={resetPaginationToggle}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                          />
                        </div>
                      </div>
                    </div>
                </div>

                </div>
            </div>
        </>
    )

}

export default TransactionReportBuilder