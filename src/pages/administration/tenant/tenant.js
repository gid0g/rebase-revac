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

const Tenants = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [newWard, setNewWard] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
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
      name: "Tenant Name",
      selector: (row) => row.organisationName,
      sortable: true,
      grow: 1,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Tenant Id",
      selector: (row) => row.tenantId,
      sortable: true,
      grow: 0,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Connection String",
      selector: (row) => row.connectionString,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
  ];

  const filteredItems = data.filter(
    (item) =>
      item.organisationName &&
      item.organisationName
        .toLowerCase()
        .includes(filterText.toLowerCase())
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
        placeholder="Search By Organisation Name"
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    api
      .get("organisation/tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("teneant response", response)
        setData(response.data);
        setPending(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  return (
    <>
      <div>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>
          <li className="breadcrumb-item">Administration</li>
          <li className="breadcrumb-item active">Tenants </li>
        </ol>
        <h1 className="page-header mb-3">Tenants</h1>
        <hr />

        <div className="flex justify-center">
          <div className="w-full p-3">
            <div className="">
              <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                loading
                progressPending={pending}
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tenants;
