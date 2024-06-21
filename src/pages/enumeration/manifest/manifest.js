import React, { useState, useEffect, useMemo } from "react";
import api from "../../../axios/custom";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

import { TableRowsLoader } from "../../../ui/contentLoader";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";

const Manifest = () => {
  const token = sessionStorage.getItem("myToken");
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const customRowsPerPageOptions = [5, 10, 20];

  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const organisationId = sessionStorage.getItem("organisationId");
  const handleView = (item) => {
    setSelectedRow(item);
    console.log(item);
  };

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },
    {
      name: "Property",
      selector: (row) => row.propertyName,
      sortable: true,
      grow: 2,
    },
    {
      name: "Customer Name",
      selector: (row) => row.lastName + "" + row.firstName,
      sortable: true,
      grow: 2,
    },
    {
      name: "Payer Id",
      selector: (row) => row.payerID,
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
            className="text-decoration-none text-blue-900"
            onClick={() => handleView(row)}
          >
            <i className="fa-solid fa-circle-info"></i> View 
          </button>
          <br />
          <br />
          <Link
            to={`print-manifest-slip/${row.id}`}
            className="text-decoration-none text-blue-900"
          >
            <i className="fa-solid fa-print"></i> Print Slip
          </Link>
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
        placeholder="Search By Property or Customer"
      />
    );
  }, [filterText, resetPaginationToggle]);

  const filteredItems = data.filter(
    (item) =>
      (item.propertyName &&
        item.propertyName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastName &&
        item.lastName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.firstName &&
        item.firstName.toLowerCase().includes(filterText.toLowerCase()))
  );

  useEffect(() => {
    // Fetch data from API and update state
    api
      .get(`enumeration/${organisationId}/manifest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div className=" ">
        <h3 className=" mb-0">Manifest </h3>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/home/Dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Enumeration</li>
          <li className="breadcrumb-item active">Manifest </li>
        </ol>
      </div>
      {/* 
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Property</th>
            <th>Customer Name</th>
            <th>Payer ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableLoading ? (
            <TableRowsLoader rowsNum={10} colsNum={5} />
          ) : (
            data.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.propertyName}</td>
                <td>{item.lastName + " " + item.firstName}</td>
                <td>{item.payerID}</td>
                <td>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#viewDialog"
                    className="text-decoration-underline text-blue-900"
                    onClick={() => handleView(item)}
                  >
                    View Details
                  </button>
                  <br />
                  <Link
                    to={`print-manifest-slip/${item.id}`}
                    className="text-decoration-underline"
                    // onClick={() => handleView(item.id)}
                  >
                    Print Slip
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table> */}

      <DataTable
        columns={columns}
        data={filteredItems}
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={customRowsPerPageOptions}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />

      <div className="modal fade" id="viewDialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                View Manifest for {selectedRow ? selectedRow.agency : " "}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container shadow-lg p-3">
                <header className="header">
                  {selectedRow ? selectedRow.agency : ""}
                </header>
                <hr />
                <div>
                  <main className="main-section">
                    <div className="main-section-child">
                      <section className="first-section">
                        <p>Enumeration Id</p>
                        <p>
                          LastName: {selectedRow ? selectedRow.lastName : ""}
                        </p>
                        <p>
                          Middle Name:{" "}
                          {selectedRow ? selectedRow.middleName : ""}
                        </p>
                        <p>
                          First Name: {selectedRow ? selectedRow.firstName : ""}
                        </p>
                        <p>Gender: </p>
                      </section>
                      <section className="second-section">
                        <p>
                          Contact Address:{" "}
                          {selectedRow ? selectedRow.customerAddress : ""}
                        </p>
                        <p>
                          Property Address:{" "}
                          {selectedRow ? selectedRow.propertyAddress : ""}
                        </p>
                        <div>
                          Business Type:{" "}
                          {selectedRow
                            ? selectedRow.businessprofile.map((item, idx) => {
                                return (
                                  <ul key={idx}>
                                    <li>{item.businessType}</li>
                                  </ul>
                                );
                              })
                            : ""}
                        </div>
                      </section>
                    </div>
                  </main>
                  <aside></aside>
                </div>
                <hr />
                <span className="date">
                  {" "}
                  Issued Date:{" "}
                  {selectedRow
                    ? new Date(selectedRow.dateIssued).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}
                </span>
                <hr />
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

export default Manifest;
