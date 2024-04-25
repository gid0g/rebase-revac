import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";

const columns = [
  {
    name: "Building Name",
    selector: (row) => row.buildingName,
    sortable: true,
  },
  {
    name: "Location Address",
    selector: (row) => row.locationAddress,
    sortable: true,
  },
  {
    name: "Space Identifier",
    selector: (row) => row.spaceIdentifierId,
    sortable: true,
  },
  {
    name: "Space Floor",
    selector: (row) => row.spaceFloorId,
    sortable: true,
  },
  {
    name: "State ",
    selector: (row) => row.stateId,
    sortable: true,
  },
  {
    name: "Ward",
    selector: (row) => row.wardId,
    sortable: true,
  },
  {
    name: "LGA",
    selector: (row) => row.lgaId,
    sortable: true,
  },
  {
    name: "",
    width: "63px",
    cell: (row) => (
      <Link
        to={`/enumeration/property/${row.propertyId}`}
        className="btn btn-sm btn-primary"
      >
        Edit
      </Link>
    ),
  },
  {
    width: "67px",
    sortable: false,
    cell: (row) => {
      return (
        <button
          data-bs-toggle="modal"
          data-bs-target="#modalAlert"
          className="btn btn-sm btn-info"
          onClick={() => {
            {
              console.log("hittt....", row);
            }
            ViewRow(row);
          }}
        >
          View
        </button>
      );
    },
  },
];

const ViewRow = (props) => {
  const {
    agencyId,
    buildingName,
    createdBy,
    dateCreated,
    dateModified,
    lgaId,
    locationAddress,
    modifiedBy,
    organisationId,
    propertyId,
    spaceFloorId,
    spaceIdentifierId,
    stateId,
    wardId,
  } = props;

  return (
    <div className="modal fade" id="modalAlert">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">View Property</h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-hidden="true"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <div className="row gx-5">
                <div className="col">
                  <div className="mb-3 ">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Space Name
                    </label>
                    {/* {console.log(buildingName)} */}

                    <input
                      type="text"
                      readOnly
                      className="form-control"
                      value={buildingName}
                      disabled
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Space Identifier
                    </label>
                    <select
                      className="form-select"
                      value={spaceIdentifierId}
                      required
                      disabled
                    ></select>
                  </div>
                </div>
              </div>
              <div className="row gx-5">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Ward
                    </label>
                    <select
                      className="form-select"
                      value={wardId}
                      disabled
                    ></select>
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Building Number
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="exampleInputEmail1"
                      placeholder="Building Number"
                      value=""
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="row gx-5">
                <div className="col">
                  {" "}
                  <div className="mb-3">
                    <label className="form-label">Space floor</label>
                    <input
                      className="form-control"
                      type="number"
                      value={spaceFloorId}
                      required
                      disabled
                    />
                  </div>
                </div>
                <div className="col">
                  {" "}
                  <div className="mb-3 ">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Area Office or Zone
                    </label>
                    <select className="form-select" disabled>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Location Address
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={locationAddress}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NonPropertyProfile = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("myToken");
  const [filterText, setFilterText] = React.useState("");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payID, setPayId] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [pending, setPending] = React.useState(true);
  const [result, setResult] = useState(false);
  const [datas, setDatas] = useState({});

  const state = useSelector((state) => state);
  let user = state.authReducer.user;
  const handleChange = (e) => {
    setPayId(e.target.value);
  };
  let organisationId = user.organisationId;
  const filteredItems = data.filter(
    (item) =>
      item.buildingName &&
      item.buildingName.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleClick = () => {
    setVisibility(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      setTimeout(() => {
        toast.warning("Slow Network Detected", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }, 10000);
    }
    setLoading(true);
    await api
      .post(
        "enumeration/verifyPid",
        {
          payerid: payID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setDatas(response.data.data);
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
          setTimeout(() => {
            setResult(true);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          setLoading(false);
          toast.error(error.response.data.PayerId[0], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else if (
          error.response.status === 401 &&
          error.response.statusText === "Unauthorized"
        ) {
          setLoading(false);
          toast.error(error.response.statusText, {
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
  };
  const submitPayerId = (e) => {
    e.preventDefault();
    navigate("createbusinessprofile");
  };
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
      .get(`enumeration/${organisationId}/property`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        const paginationHeader = response.headers["X-Pagination"];
        console.log(paginationHeader);
        setDatas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Enumeration</li>
          <li className="breadcrumb-item active">Non-Property </li>
        </ol>
        <h1 className="page-header mb-3">Non-Property</h1>
        <hr />

        <div className="d-flex justify-content-between my-3">
          <div className=" d-flex align-items-end">
            <form>
              <div className="d-flex">
                <h4 className="m-0 pr-4"> Search By:</h4>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="option1"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    By ward
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="option2"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    By Address
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio3"
                    value="option3"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio3">
                    By Area Office{" "}
                  </label>
                </div>{" "}
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio4"
                    value="option4"
                  />
                  <label className="form-check-label" htmlFor="inlineRadio4">
                    Date Created{" "}
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div>
            <button
              data-bs-toggle="modal"
              data-bs-target="#modalAlert"
              className="btn btn-sm btn-primary"
              //   onClick={ViewRow}
            >
              New Non-Property Enumeration
            </button>
          </div>
        </div>

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
          //actions={<button className=" btn btn-sm btn-info">Download</button>}
        />
      </div>
      <div className="modal fade" id="modalAlert">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Payer Id</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body">
              <ToastContainer />

              {!visibility && (
                <div className=" mt-4">
                  <div className="header d-flex justify-content-center mt-3">
                    <h6 className=" title ">Enter your PayerID</h6>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className=" d-flex align-items-center flex-column">
                      <div className=" w-75">
                        <input
                          className=" px-1 form-control w-100"
                          type="text"
                          value={payID}
                          onChange={handleChange}
                          name="payId"
                          placeholder="Enter your payer Id"
                        />
                      </div>

                      <button className="btn btn-primary my-2" type="submit">
                        {loading ? <Spinner /> : "Submit"}
                      </button>
                    </div>
                  </form>

                  {result && (
                    <div className=" mt-3 d-flex flex-column">
                      <hr></hr>
                      <form onSubmit={submitPayerId}>
                        <div className="row  align-items-center">
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <input
                                className="form-control"
                                type="text"
                                disabled
                                value={datas.fullName}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label">Email</label>
                              <input
                                className="form-control"
                                type="text"
                                disabled
                                value={datas.email}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row  align-items-center">
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label">Payer ID</label>
                              <input
                                className="form-control"
                                type="text"
                                disabled
                                value={datas.payerID}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3">
                              <label className="form-label">Phone Number</label>
                              <input
                                className="form-control"
                                type="text"
                                disabled
                                value={datas.gsm}
                              />
                            </div>
                          </div>
                        </div>
                        <div className=" d-flex justify-content-end">
                          <button type="submit" className="btn btn-primary">
                            Continue
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ViewRow />
    </>
  );
};

export default NonPropertyProfile;
