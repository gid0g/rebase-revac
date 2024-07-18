import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
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
  // {
  //   name: "Ward",
  //   selector: (row) => row.wardId,
  //   sortable: true,
  // },
  {
    name: "LGA",
    selector: (row) => row.lgaId,
    sortable: true,
  },
  {
    name: "Actions",
    selector: (row) => row.action,
    sortable: true,
  },
];
const BusinessProfile = () => {
  const token = sessionStorage.getItem("myToken");
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const state = useSelector((state) => state);

  const filteredItems = data.filter(
    (item) =>
      item.buildingName &&
      item.buildingName.toLowerCase().includes(filterText.toLowerCase())
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
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/Enumeration">Enumeration</Link>
        </li>
        <li className="breadcrumb-item active">Business Profile </li>
      </ol>
      <ToastContainer />
      <h1 className="page-header mb-3">Business Profile</h1>
      <hr />

      <div>
        {/* <form>
          <div className="d-flex my-5">
            <h4 className="mr-4"> Search By:</h4>
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
        </form> */}
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
      />

      {/* <div className="d-flex justify-content-end mt-5">
        <Link
          to="/Enumeration/newPropertyProfile"
          type="button"
          className="btn btn-primary"
        >
          Add New Property Profile
        </Link>
      </div> */}
    </>
  );
};

export default BusinessProfile;
