import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import Toast from 'react-bootstrap/Toast';


const Agencies = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newAgency, setNewAgency] = useState("");
  const [description, setDescription] = useState("");
  const [agencyCode, setAgencyCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customRowsPerPageOptions = [5, 10, 20];

  const [show, setShow] = useState(false);

  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");

  //Define columns for the table
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
      name: "Agency Name",
      selector: (row) => row.agencyName,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Agency Code",
      selector: (row) => row.agencyCode,
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
        <button
          data-bs-toggle="modal"
          data-bs-target="#editAgency"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
      ),
    },
  ];

  const organisationId = sessionStorage.getItem("organisationId");


////////////////////////////

////////////////////////////


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };
  const handleEdit = (item) => {
    setEditRow(item);
    setItemId(item.agencyId);
  };


  const handleChange = (event) => {
    setNewAgency(event.target.value);
  };
  const handleCodeChange = (event) => {
    setAgencyCode(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  useEffect(()=>{
    console.log("newDepartment", newAgency)
    console.log("newcode", agencyCode)
  },[newAgency, agencyCode])
  const addNewAgency = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `enumeration/create-agency`,
        {
          organisationId: organisationId,
          agencyCode: agencyCode,
          agencyName: newAgency,
          description: description,
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
        if (response.status === 200) {
          setLoading(false);
          toast.success(response.statusText, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setNewAgency("");
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.agencyName[0], {
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


  const editAgency = async (e) => {
    e.preventDefault();
    console.log("userData:", userData);
   
    console.log("itemId:", itemId);
    const modifiedBy = userData && userData.length > 0 ? userData[0]?.email : "";
    await api
    .post(`enumeration/agencies/${itemId}`,
    {
      organisationId: organisationId,
      agencyCode: editRow.agencyCode,
      agencyName: editRow.agencyName,
      description: editRow.description ? editRow.description :"",
      active: true,
      dateModified: new Date().toISOString(),
      modifiedBy: modifiedBy
    },{
      headers: {
      Authorization: `Bearer ${token}`,
      },
    }
  )
  .then((response) => {

    if (response.status === 200) {
      setLoading(false);
      toast.success(response.statusText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setData((prevData) =>
      prevData.map((item) =>
        item.agencyId === itemId ? { ...item, ...editRow } : item
      )
    );
      setNewAgency("");
    }
    setLoading(false);
    return true;
  })
  .catch((error) => {
    setLoading(false);
    toast.error(error.response.data.agencyName[0], 
      {
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
//filter item 
  const filteredItems = data?.filter(
    (item) =>
      item.agencyName &&
      item.agencyName.toLowerCase().includes(filterText.toLowerCase()) || 
      item.agencyCode &&
      item.agencyCode.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search By Agency Name and Agency Code"
      />
    );
  }, [filterText, resetPaginationToggle]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const fetchAgencies = async () => {
    await api
      .get(`enumeration/${organisationId}/agencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else
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
    fetchAgencies();
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRevenues = async (e) => {
    e.preventDefault();

    try {
      setIsRefreshing(true);

      const response = await api.post(`enumeration/${organisationId}/fetch-agency`, {
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
        setShow(true)
        fetchAgencies();
        setTimeout(()=>{
          window.location.reload();
        },2000)

      }
    } catch(error) {
      toast.error("Unable to Refresh Agencies", {
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
          {/* <ToastContainer position="top-end" className="mt-5" style={{ zIndex: 1 }}> 
</ToastContainer> */}
<ToastContainer />
    {/*  */}
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Agencies</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Agencies </li>
            </ol>
          </div>

          <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-between items-center gap-2 mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addAgency"
                className="btn bg-primary text-white"
                type="button"
              >
                Add New Agency
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

        <div className="flex justify-center">
          <div className=" w-full p-3">
            <div className="">
              <div className="">
              <DataTable
                  columns={columns}
                  data={filteredItems}
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
        <div className="modal fade" id="addAgency">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Agency</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <ToastContainer />
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={addNewAgency}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Agency
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={newAgency}
                              placeholder="Enter Agency"
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Agency Code
                            </label>

                            <input
                              type="number"
                              className="form-control"
                              value={agencyCode}
                              placeholder="Enter Agency Code"
                              onChange={handleCodeChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Description
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={description}
                              placeholder="Enter Description"
                              onChange={handleDescriptionChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-blue-900 text-white"
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

        <div className="modal fade" id="viewDialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Refresh Agencies
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
                        <h4 className="text-center text-lg">Are You Want to Refresh Agencies?</h4>
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

        <div className="modal fade" id="editAgency">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Agency</h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <ToastContainer />
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={editAgency}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Agency Name
                            </label>

                            <input
                              type="text"
                              name="agencyName"
                              className="form-control"
                              value={editRow ? editRow.agencyName : ""}
                              placeholder="Enter Agency "
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn shadow-md bg-blue-900 text-white"
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

export default Agencies;
