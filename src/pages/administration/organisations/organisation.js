import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserStatus from "../../../ui/userStatus";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

// import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const Organisation = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [organisationData, setOrganisationData] = useState([]);
  const [approvedOrganisation, setApprovedOrganisation] = useState([]);
  const [viewApproved, setViewApproved] = useState(false);
  const [viewUnApproved, setViewUnApproved] = useState(false);
  const [viewAll, setViewAll] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [unApprovedOrganisation, setUnApprovedOrganisation] = useState([]);
  const [pending, setPending] = useState(true);
  const customRowsPerPageOptions = [5, 10, 20];

  console.log("organisationData:", organisationData);

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
      name: "Organisations",
      selector: (row) => row.organisationName,
      sortable: true,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Status",
      selector: (row) => <UserStatus isActive={row.organisationApprovalStatus} />,
      grow: 0,
    },
    {
      name: "Action",
      sortable: false,
      grow: 0,
      cell: (row) => (
        <Link
          to={`vieworganisation/${row.organisationId}`}
          className="text-dark"
        >
          <i className="fas fa-info fa-fw"></i>

            View
      
        </Link>
      ),
    },
  ];

  //toggle approve
  const toggleApproved = () => {
    setViewApproved(true);
    setViewUnApproved(false);
    setViewAll(false);
  };
  const toggleUnApproved = () => {
    setViewApproved(false);
    setViewUnApproved(true);
    setViewAll(false);
  };

  const filteredItems = organisationData.filter(
    (item) =>
      item.organisationName &&
      item.organisationName.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredApprovedItems = approvedOrganisation.filter(
    (item) =>
      item.organisationName &&
      item.organisationName.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredUnApprovedItems = unApprovedOrganisation.filter(
    (item) =>
      item.organisationName &&
      item.organisationName.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search by Organisation"
      />
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    api
      .get(`organisation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrganisationData(response.data);
        setPending(false);
      })
      .catch((error) => {
        setPending(false);
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
  }, []);
  useEffect(() => {
    api
      .get(`organisation/approved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setApprovedOrganisation(response.data);
        // setPending(false);
      })
      .catch((error) => {
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
  }, []);
  useEffect(() => {
    api
      .get(`organisation/unapproved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUnApprovedOrganisation(response.data);
        // setPending(false);
      })
      .catch((error) => {
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
  }, []);

  return (
    <>
      <div>
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item">
            <Link to="/home/Homepage">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/home/administration/organisation">Administration</Link>
          </li>
          <li className="breadcrumb-item">Administration</li>
          <li className="breadcrumb-item active">Organizations </li>
        </ol>
        <h1 className="page-header mb-3">Organizations</h1>
        <hr />
        <ToastContainer />

        <div className="flex justify-center">
          <div className="w-full p-3">
            <div className="flex justify-between mb-3">
              <div className="flex justify-between">
                <button
                  className="btn shadow-md bg-primary mr-3 text-white"
                  type="button"
                  onClick={toggleApproved}
                >
                  Approved Organizations
                </button>
                <button
                  className="btn shadow-md bg-primary text-white"
                  type="button"
                  onClick={toggleUnApproved}
                >
                  Pending Organizations
                </button>
              </div>
              <Link
                to="createneworganisation"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Organization
              </Link>
            </div>
            <div className="">
              {viewAll && (
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
                    paginationRowsPerPageOptions={customRowsPerPageOptions}
                  />
                </div>
              )}
              {viewApproved && (
                <div className="">
                  <DataTable
                    columns={columns}
                    data={filteredApprovedItems}
                    pagination
                    loading
                    progressPending={pending}
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    paginationRowsPerPageOptions={customRowsPerPageOptions}
                  />
                </div>
              )}
              {viewUnApproved && (
                <div className="">
                  <DataTable
                    columns={columns}
                    data={filteredUnApprovedItems}
                    pagination
                    loading
                    progressPending={pending}
                    paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    paginationRowsPerPageOptions={customRowsPerPageOptions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Organisation;
