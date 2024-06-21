import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import Select from "react-select";
// import CryptoJS from "crypto-js";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import { ro } from "date-fns/locale";

const Revenues = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filterTextType, setFilterTextType] = React.useState("");
  const [resetPaginationToggleType, setResetPaginationToggleType] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [revenueDesc, setRevenueDesc] = useState("");
  const [businessTypeId, setBusinessTypeId] = useState();
  const [agencyName, setAgencyName] = useState("");
  const [agencyId, setAgencyId] = useState(0);
  const [agencies, setAgencies] = useState([]);
  const [revenuesHead, setRevenuesHead] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [revenueName, setRevenueName] = useState("");
  const [newRevenue, setNewRevenue] = useState("");
  const [revenueCode, setRevenueCode] = useState("");
  const [businessType, setBusinessType] = useState([]);
  const customRowsPerPageOptions = [5, 10, 20];
  const customRowsPerPageOptionsType = [5, 10, 20];
  // const [roleId, setRoleId] = useState();
  const organisationId = sessionStorage.getItem("organisationId");


  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
  let navigate = useNavigate();
  const roleId = sessionStorage.getItem("roleId");
  // console.log("role",roleId)


  function extractFirstThreeDigits(data) {
    const codes = data.map(obj => obj.agencyCode);
    const firstCode = codes.find(code => code !== "");

    if (firstCode) {
        const firstThreeDigits = firstCode.slice(0, 3);
        const allHaveSameDigits = codes.every(code => code.startsWith(firstThreeDigits) || code === "");
        
        if (allHaveSameDigits) {
            return firstThreeDigits;
        }
    }
  }

  const fetchRevenuesHead = () => {  
    // const digit = extractFirstThreeDigits(agencies);
    // console.log("Digit --:", digit);

    api
    .get(`revenue/${organisationId}/revenuehead`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Revenues:", response.data);
      setRevenuesHead(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  }

  useEffect(() => {
    fetchRevenuesHead();
  }, []);
  
  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
      style: {
        // maxWidth: "10%",
        textAlign: "center",
      },
    },
    {
      name: "Revenue Name",
      selector: (row) => row.revenueName,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },

    {
      name: "Revenue Code",
      selector: (row) => row.revenueCode,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },

    roleId == 1 && {
      name: roleId == 1 ? "Action" : "",
      sortable: false,
      center: true,
      grow: 0,
      cell: (row) =>
        roleId == 1 && (
          <button
            data-bs-toggle="modal"
            data-bs-target="#editRevenue"
            className="btn text-dark"
            type="button"
            onClick={() => handleEdit(row)}
          >
            <i className="fa-solid fa-pen-to-square"></i> Edit
          </button>
        ),
    },
  ].filter(Boolean);

  const businessTypesColumns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
      style: {
        // maxWidth: "10%",
        textAlign: "center",
      },
    },
    {
      name: "Revenue Name",
      selector: (row) => row.revenueName,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
        padding: "2rem",
      },
    },

    {
      name: "Business Type",
      selector: (row) => getBusinessType(row.businessTypeId),
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
        padding: "2rem",
      },
    },

  ].filter(Boolean);

  const getBusinessType = (value) => {
    const singleBusinessType = businessType.find(item => item.id == value);
    return singleBusinessType?.businessTypeName
  }


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };


  const handleEdit = (item) => {
    console.log("Item:", item);
    setEditRow(item);
    setItemId(item.headRevenueId);
  };
  

  const handleDescChange = (event) => {
    setRevenueDesc(event.target.value);
  };


  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("setBusinessType:", response.data);
        setBusinessType(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, organisationId]);


  //api get revenues by Organisation
  const fetchRevenues = async () => {
    api
      .get(`revenue/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Revenues:", response?.data);
        setRevenues(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  
  useEffect(() => {
    fetchRevenues()
  }, [token, organisationId]);


  // api to get agencies
  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/agencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Agencies", response.data);
        setAgencies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, organisationId]);

  const addNewRevenue = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      organisationId: parseInt(organisationId),
      agencyId: agencyId,
      businessTypeId: parseInt(businessTypeId),
      revenueCode: revenueCode,
      revenueName: revenueName,
      description: revenueDesc,
      active: true,
      dateCreated: new Date().toISOString(),
      createdBy: userData[0]?.email,
    }

    console.log("formData", formData);

    await api
      .post(
        `revenue/create-revenue`,
        {
          organisationId: parseInt(organisationId),
          agencyId: agencyId,
          businessTypeId: parseInt(businessTypeId),
          revenueCode: revenueCode,
          revenueName: revenueName,
          description: revenueDesc,
          active: true,
          dateCreated: new Date().toISOString(),
          createdBy: userData[0]?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("response-->",response);
        console.log("message--",response.data.statusMessage)
        if (response.data.status === 200) {
          setLoading(false);
          toast.success(response.data.statusMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setRevenuesHead([]);
          setRevenueName("");
          setRevenueCode("");
          setRevenueDesc("");
          setBusinessTypeId();
          setAgencyName("");
          setAgencies([]);
          setAgencyId(0);
          setBusinessType([]);
        }

        if (response.data.status === 400) {
          setLoading(false);
          toast.error(response.data.statusMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.response.data.statusMessage, {
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

  const editRevenue = async (e) => {
    e.preventDefault();
    setLoading(true);   
    console.log("itemId:", itemId);
    console.log("revenuename---",editRow.newRevenue)
    await api
      .post(
        `revenue/${itemId}`,
        {
          revenueName: editRow.revenueName,
          active: true,
          dateModified: new Date().toISOString(),
          modifiedBy: userData[0]?.email,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.status === 200) {
          setLoading(false);
          toast.success(response.data.statusMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setRevenueName("");
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.response.data.revenueName[0], {
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

  const filteredItems = revenuesHead.filter(
    (item) =>
      item.revenueName &&
      item.revenueName.toLowerCase().includes(filterText.toLowerCase()) ||
      item.revenueCode &&
      item.revenueCode.toLowerCase().includes(filterText.toLowerCase())
  );

  const organisationRevenuesfilteredItems = revenues.filter(
    (item) =>
      item.revenueName &&
      item.revenueName.toLowerCase().includes(filterTextType.toLowerCase()) ||
      getBusinessType(item.businessTypeId) &&
      getBusinessType(item.businessTypeId).toLowerCase().includes(filterTextType.toLowerCase()) 
  );

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
        placeholder="Search By Revenue Name and Revenue Code"
      />
    );
  }, [filterText, resetPaginationToggle]);


  const subHeaderComponentMemoType = React.useMemo(() => {
    const handleClear = () => {
      if (filterTextType) {
        setResetPaginationToggleType(!resetPaginationToggleType);
        setFilterTextType("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterTextType(e.target.value)}
        onClear={handleClear}
        filterText={filterTextType}
        placeholder="Search By Revenue Name and Business Type"
      />
    );
  }, [filterTextType, resetPaginationToggleType]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);


  const getAgencyId = (value) => {
    const agency = agencies.find(agency => agency.agencyName == value);
    setAgencyId(agency?.agencyId)
  }


  const getRevenueCode = (value) => {
    const revenue = revenuesHead.find(revenue => revenue.revenueName == value);
    console.log("Revenue Code:", revenue?.revenueCode);
    setRevenueCode(revenue?.revenueCode);
  }

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRevenues = async (e) => {
    e.preventDefault();

    try {
      setIsRefreshing(true);

      console.log("Endpoint:", `revenue/${organisationId}/fetch-headrevenues`);

      const response = await api.post(`revenue/${organisationId}/fetch-headrevenues`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 200) {
        toast.success(response.data.statusMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        fetchRevenues();
      }
    } catch(error) {
      toast.error("Unable to Refresh Revenues", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsRefreshing(false);
    }
  }


  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Revenues</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Revenues </li>
            </ol>
          </div>
          
          <div className=" items-center	gap-3 flex flex-row-reverse">
            <div className="flex justify-between items-center gap-2 mb-3">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#addRevenue"
                  className="btn bg-primary text-white"
                  type="button"
                >
                  Add Revenue
                </button> 

                  <button
                    className="btn !bg-sky-50 border-[1px] border-primary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#viewDialog"
                    title="Refresh Agencies"
                    disabled={isRefreshing}
                  >
                  <i className={`fa fa-refresh text-lg text-gray-700 ${isRefreshing ? "animate-spin" : ""}`}></i>
                </button>     
            </div>
          </div>
        </div>

        <div className="modal fade" id="viewDialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Refresh Revenues
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <div className=" mt-3 d-flex flex-column">
                  <div className="row  align-items-center">
                    <div className="col">
                        <h4 className="text-center text-lg">Are You Want to Refresh Revenues?</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="w-full flex justify-between items-center gap-4">
                  <button 
                    className="btn bg-blue-900 text-white my-2"
                    onClick={refreshRevenues} 
                  >

                    {isRefreshing ? <Spinner/> : "Yes"}
                  </button>
                  <button className="btn btn-white border-[1px] border-blue-900 text-blue-900 my-2" data-bs-dismiss="modal">
                    No
                  </button>
                </div>
              </div>
            </div>
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
                  progressPending={pending || isRefreshing}
                  paginationResetDefaultPage={resetPaginationToggle} 
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                  paginationRowsPerPageOptions={customRowsPerPageOptions}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-10">
          <h3 className=" mb-0">Revenues and Business Types</h3>

          <div className="flex justify-center">
          <div className="w-full p-3">
            <div className="">
              <div className="">
                <DataTable
                  columns={businessTypesColumns}
                  data={organisationRevenuesfilteredItems}
                  onClick={(item) => console.log(item)}
                  pagination
                  loading
                  progressPending={pending}
                  paginationResetDefaultPage={resetPaginationToggleType} 
                  subHeader
                  subHeaderComponent={subHeaderComponentMemoType}
                  paginationRowsPerPageOptions={customRowsPerPageOptionsType}
                />
              </div>
            </div>
          </div>
        </div>
        </div>


        <ToastContainer />
        <div className="modal fade"  id="addRevenue">
          <div className="modal-dialog"  >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Revenue</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body" >
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={addNewRevenue}>
                      <div className="row gx-3">
                      <div className="">
                          <div className="mb-3">
                              <label className="form-label" htmlFor="exampleInputEmail1">
                                  Revenue
                              </label>
                              <select
                                  className="form-select"
                                  name="revenuesHead id"
                                  onChange={(e) => {
                                    setRevenueName(e.target.value);
                                    getRevenueCode(e.target.value);
                                  }} 
                                  value={revenueName}
                              >
                                  <option value="">Select Revenue</option>
                                  {revenuesHead.map((revenue) => (
                                  <option key={revenue.revenueCode} value={revenue.revenueName} className="text-dark">
                                      {revenue.revenueName}
                                  </option>
                                  ))}
                              </select>
                          </div>
                      </div>
                        <div className="">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Revenue Description
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={revenueDesc}
                              placeholder="Enter Revenue"
                              onChange={handleDescChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="exampleInputEmail1">
                              Business Type
                            </label>
                            <select
                              className="form-select "
                              name="business type"
                              onChange={(e) => setBusinessTypeId(e.target.value)}
                              value={businessTypeId}
                            >
                              <option value="">Select Business Type</option>
                              {businessType.map((busType) => (
                                <option key={busType.id} value={busType.id} className="text-dark">
                                  {busType.businessTypeName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* <div className="">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="exampleInputEmail1">
                              Agency Area
                            </label>
                            <select
                              className="form-select "
                              name="agencies id"
                              onChange={(e) => {
                                setAgencyName(e.target.value);
                                getAgencyId(e.target.value);
                              }} 
                              value={agencyName}
                            >
                              <option value="">Select Agency</option>
                              {agencies.map((agency) => (
                                <option key={agency.agencyId} value={agency.agencyName} className="text-dark">
                                  {agency.agencyName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div> */}
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white"
                        >
                          {loading ? <Spinner /> : "Add"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="editRevenue">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Revenue</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={editRevenue}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Revenue
                            </label>

                            <input
                              type="text"
                              name="revenueName"
                              className="form-control"
                              value={editRow ? editRow.revenueName : ""}
                              placeholder="Enter Revenue Name"
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-primary text-white"
                        >
                          {loading ? <Spinner /> : "Edit"}
                        </button>
                      </div>
                    </form>
                  </div>
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

export default Revenues;
