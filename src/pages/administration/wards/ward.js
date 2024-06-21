import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import CryptoJS from "crypto-js";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import { Modal } from "bootstrap";

const Wards = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [newWard, setNewWard] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
  const customRowsPerPageOptions = [5, 10, 20];
  const [modalInstance, setModalInstance] = useState(null);

  let navigate = useNavigate();

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
      name: "Ward Name",
      selector: (row) => row.wardName,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Action",
      // width: "63px",
      sortable: false,
      center: true,
      grow: 0,
      // maxWidth: "100px",

      cell: (row) => (
        <button
          data-bs-toggle="modal"
          data-bs-target="#editWard"
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
    setNewWard(event.target.value);
  };

  const fetchWards = async () => {
    setLoading(true);
    api
    .get(`enumeration/${organisationId}/wards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchWards();
  }, []);

  const authCloseModal = (elementId) => {
    const myModal = new Modal(document.getElementById(elementId));
  
    myModal.show();
  
    myModal._element.addEventListener('shown.bs.modal', () => {
      clearTimeout(myModal._element.hideInterval);
      const backdropElement = document.querySelector('.modal-backdrop.show');

      const id = setTimeout(() => {
        myModal.hide(); 
      }, 10000);
      myModal._element.hideInterval = id;
  
      if (backdropElement) {
        backdropElement.remove();
      }
    });
  
    setModalInstance(myModal);
  }

  const addNewWard = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .post(
        `enumeration/${organisationId}/wards`,
        {
          wardName: newWard,
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
          setTimeout(() => {
            authCloseModal("addWard");
            setNewWard("");
            fetchWards();
          }, 5000)
        }
        return true;
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(error.response.data.WardName[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }).finally(() => {
        setLoading(false);
      });
  };
  const editWard = async (e) => {
    e.preventDefault();
    setLoading(true);

    await api
      .post(
        `enumeration/${organisationId}/wards/${itemId}`,
        {
          wardName: editRow.wardName,
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

          setTimeout(() => {
            authCloseModal("editWard");
            setNewWard("");
            fetchWards();
          }, 2000)
        }
      })
      .catch((error) => {
        toast.error(error.response.data.WardName[0], {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }).finally(() => {
        setLoading(false);
      });
  };

  const filteredItems = data.filter(
    (item) =>
      item.wardName &&
      item.wardName.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search By Ward Name"
      />
    );
  }, [filterText, resetPaginationToggle]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);



  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Wards</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Wards </li>
            </ol>
          </div>

          <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addWard"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Ward
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
                  onClick={(item) => console.log(item)}
                  loading
                  pagination
                  progressPending={pending || loading}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                  paginationRowsPerPageOptions={customRowsPerPageOptions}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addWard">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Ward</h4>
                <button
                  type="button"
                  className="btn-close "
                  data-bs-dismiss="modal"
                  aria-hidden="true"
                ></button>
              </div>
              <div className="modal-body">
                <ToastContainer />
                <div className="  ">
                  <div className=" p-2 ">
                    <form onSubmit={addNewWard}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Ward Name
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={newWard}
                              placeholder="Enter Ward Name"
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

        <div className="modal fade" id="editWard">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Ward</h4>
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
                    <form onSubmit={editWard}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Ward Name
                            </label>

                            <input
                              type="text"
                              name="wardName"
                              className="form-control"
                              value={editRow ? editRow.wardName : ""}
                              placeholder="Enter Ward Name"
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

export default Wards;
