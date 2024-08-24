import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../../../axios/custom";
import DataTable from "react-data-table-component";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";

const CustomerProfile = () => {
  const token = sessionStorage.getItem("myToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const customRowsPerPageOptions = [5, 10, 20];
  const organisationId = sessionStorage.getItem("organisationId");

  const handleEdit = (item) => {
    // Handle edit button click
    console.log(`Edit button clicked for item with ID ${item}`);
  };

  const handleView = (item) => {
    setSelectedRow(item);
    console.log("view---", item);
    // Handle view button click
  };

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },
    {
      name: "Full Name",
      selector: (row) => row.fullName,
      sortable: true,
      grow: 2,
    },
    // {
    //   name: "Full Name",
    //   selector: (row) => row.fullName,
    //   sortable: true,
    //   grow: 2,
    // },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Phone No",
      selector: (row) => row.phoneNo,
      sortable: true,
      grow: 1,
    },
    {
      name: "Payer Id",
      selector: (row) => row.payerId,
      sortable: true,
      grow: 1,
    },
    {
      name: "Actions",
      sortable: true,
      grow: 0,
      cell: (row) => (
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#viewDialog"
            className="text-decoration-none text-blue-900 p-2"
            onClick={() => handleView(row)}
          >
            <i className="fa-solid fa-circle-info"></i> View
          </button>
          <br />
        </div>
      ),
    },
  ];

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
        placeholder="Search By Name"
      />
    );
  }, [filterText, resetPaginationToggle]);

  const filteredItems = data.filter(
    (item) =>
      item.fullName &&
      item.fullName.toLowerCase().includes(filterText.toLowerCase())
  );

  //api to get table data
  useEffect(() => {
    // Fetch data from API and update state
    api
      .get(`customer/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log("data------------->", response.data);
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
          <h3 className=" mb-0">Customer Profile</h3>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home/Dashboard">Home</Link>
            </li>
            <li className="breadcrumb-item">Enumeration</li>
            <li className="breadcrumb-item active">Customer Profile </li>
          </ol>
        </div>

        <div className=" items-center	 gap-3 flex flex-row-reverse">
          <div className="">
            <Link
              to="../../enumeration/createpayerId"
              className="btn bg-dark mr-3 text-white"
            >
              Create Payer Id
            </Link>
          </div>
          <div className="">
            <Link
              to="../../enumeration/searchpayerId"
              className="btn bg-primary mr-3 text-white "
            >
              Search Payer Id
            </Link>
          </div>
          <div className="">
            <Link
              to="../../enumeration/validatepayerId"
              className="btn bg-dark mr-3 text-white "
            >
              Validate Payer Id
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer />
      <div className="mt-5">
        <DataTable
          columns={columns}
          data={filteredItems}
          progressPending={loading}
          pagination
          paginationRowsPerPageOptions={customRowsPerPageOptions}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
      </div>
      <div className="modal fade" id="viewDialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                View Details for {selectedRow ? selectedRow.fullName : " "}
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
                {/* <hr></hr> */}
                <div className="row  align-items-center">
                  <div className="col-5">
                    <div className="mb-3">
                      <label className="form-label">Marital Status</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={
                          selectedRow
                            ? selectedRow.maritalStatuses.maritalStatusName
                            : ""
                        }
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={selectedRow ? selectedRow.titles.titleName : ""}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">PayerID</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={selectedRow ? selectedRow.payerId : ""}
                      />
                    </div>
                  </div>
                </div>

                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={selectedRow ? selectedRow.fullName : ""}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={
                          selectedRow ? selectedRow.genders.genderName : ""
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">email</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={selectedRow ? selectedRow.email : ""}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">phoneNo</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={selectedRow ? selectedRow.phoneNo : ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label"> Address</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={selectedRow ? selectedRow.address : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <a href="#/" className="btn btn-white" data-bs-dismiss="modal">
                Close
              </a>
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

export default CustomerProfile;
