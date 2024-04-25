import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const BusinessTypes = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [newBusinessType, setNewBusinessType] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
  const customRowsPerPageOptions = [5, 10, 20];
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
      name: "Business Types",
      selector: (row) => row.businessTypeName,
      sortable: true,
      grow: 2,
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
          data-bs-target="#editBusinessType"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
      ),
    },
  ];

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };
  const handleEdit = (item) => {
    setEditRow(item);
    setItemId(item.id);

  };
  const organisationId = sessionStorage.getItem("organisationId");

  const handleChange = (event) => {
    setNewBusinessType(event.target.value);
  };

  const addNewBusinessType = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `enumeration/${organisationId}/business-types`,
        {
          businessTypeName: newBusinessType,
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
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setNewBusinessType("");
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
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
          }
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
  const editBusinessType = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `enumeration/${organisationId}/business-types/${itemId}`,
        {
          businessTypeName: editRow.businessTypeName,
          DateModified: new Date().toISOString(),
          ModifiedBy: userData[0].email,
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
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setNewBusinessType("");
        }
        setLoading(false);
        // return true;
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
              toast.error(errorMessage, {
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
          }
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

  const filteredItems = data.filter(
    (item) =>
      item.businessTypeName &&
      item.businessTypeName.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search By Business Types"
      />
    );
  }, [filterText, resetPaginationToggle]);


  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/business-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setPending(false)
      })
      .catch((error) => {
    
        if (error.message === "timeout exceeded") {
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
        }
      });
  }, [token, data]);

  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Business Types</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Business Types </li>
            </ol>
          </div>

          <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addBusinessType"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Business Type
              </button>
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
                  pagination
                  paginationRowsPerPageOptions={customRowsPerPageOptions}
                  progressPending={pending}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addBusinessType">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Business Type</h4>
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
                    <form onSubmit={addNewBusinessType}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Business Type
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={newBusinessType}
                              placeholder="Enter Business Type"
                              onChange={handleChange}
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

        <div className="modal fade" id="editBusinessType">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Business Type</h4>
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
                    <form onSubmit={editBusinessType}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Business Type
                            </label>

                            <input
                              type="text"
                              name="businessTypeName"
                              className="form-control"
                              value={editRow ? editRow.businessTypeName : ""}
                              placeholder="Enter Business Type "
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

export default BusinessTypes;
