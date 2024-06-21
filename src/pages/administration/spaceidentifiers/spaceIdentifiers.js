import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const SpaceIdentifiers = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [newSpaceIdentifier, setNewSpaceIdentifier] = useState("");
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
        // maxWidth: "10%",
        textAlign: "center",
      },
    },
    {
      name: "Space Identifer",
      selector: (row) => row.spaceIdentifierName,
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
          data-bs-target="#editSpace"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i class="fa-solid fa-pen-to-square"></i> Edit
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
    setNewSpaceIdentifier(event.target.value);
  };

  const addNewSpace = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        `enumeration/${organisationId}/space-identifiers`,
        {
          spaceIdentifierName: newSpaceIdentifier,
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
          setNewSpaceIdentifier("");
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.response.data.spaceIdentifierName[0], {
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
  const editSpace = async (e) => {
    setLoading(true);
    console.log("itemId:", itemId);

    e.preventDefault();
    await api
      .post(
        `enumeration/${organisationId}/space-identifiers/${itemId}`,
        {
          spaceIdentifierName: editRow.spaceIdentifierName,
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
          setNewSpaceIdentifier("");
        }
        setLoading(false);
        // return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.response.data.spaceIdentifierName[0], {
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
      item.spaceIdentifierName &&
      item.spaceIdentifierName.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search by Space Identifier"
      />
    );
  }, [filterText, resetPaginationToggle]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/space-identifiers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, data]);

  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Space Identifiers</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Space Identifiers </li>
            </ol>
          </div>

          <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addSpace"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Space Identifer
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
                  pagination
                  loading
                  progressPending={pending}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                  paginationRowsPerPageOptions={customRowsPerPageOptions}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addSpace">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Space Identifier</h4>
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
                    <form onSubmit={addNewSpace}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Space Identifier
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={newSpaceIdentifier}
                              placeholder="Enter Space Identifier"
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

        <div className="modal fade" id="editSpace">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Space Identifier</h4>
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
                    <form onSubmit={editSpace}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Space Identifier Name
                            </label>

                            <input
                              type="text"
                              name="spaceIdentifierName"
                              className="form-control"
                              value={editRow ? editRow.spaceIdentifierName : ""}
                              placeholder="Enter Space Identifier"
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

export default SpaceIdentifiers;
