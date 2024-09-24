import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../axios/custom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { Context } from "../enumerationContext.js";
import { AppSettings } from "../../../config/app-settings";
import { TableRowsLoader } from "../../../ui/contentLoader";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import DataTable from "react-data-table-component";
import FilteringComponent from "../../../ui/filterComponent";
import FormWizard from "../payerIdmodal";
import Loader from "../../../ui/loader";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";

const PropertyProfile = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const [propertyData, setPropertyData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const viewDialogRef = useRef(null);
  const editDialogRef = useRef(null);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const customRowsPerPageOptions = [5, 10, 20];

  const columns = [
    {
      name: "S/N",
      selector: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },
    {
      name: "Building Name",
      selector: (row) => row.buildingName,
      sortable: true,
      grow: 1,
    },
    {
      name: "Location Address",
      selector: (row) => row.locationAddress,
      sortable: true,
      grow: 1,
    },
    {
      name: "Space Identifier",
      selector: (row) => row.spaceIdentifier.spaceIdentifierName,
      sortable: true,
      grow: 1,
    },
    {
      name: "Space Floor",
      selector: (row) => row.spaceFloor,
      sortable: true,
      grow: 0,
    },
    // {
    //   name: "Ward Name",
    //   selector: (row) => row.ward?.wardName,
    //   sortable: true,
    //   grow: 0,
    // },
    {
      name: "Actions",
      grow: 0,
      cell: (row) => (
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#editDialog"
            className="text-dark"
            onClick={() => handleEdit(row)}
          >
            <i className="fas fa-pencil-alt fa-fw"></i>{" "}
            <span className="text-decoration-underline text-dark">Edit</span>
          </button>
          <br />
          <button
            data-bs-toggle="modal"
            data-bs-target="#viewDialog"
            className="text-dark"
            onClick={() => handleView(row)}
          >
            <i className="fas fa-floppy-disk fa-fw"></i>{" "}
            <span className="text-decoration-underline text-dark">View</span>
          </button>
          <br />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "",
      width: "180px",
      // grow:2,
      cell: (row) => (
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#continueAlert"
            className="btn btn-sm shadow-md bg-primary text-white"
            onClick={() => handleEnumerationStatus(row)}
            type="button"
          >
            Continue Enumeration
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
        placeholder="Search By Property Name"
      />
    );
  }, [filterText, resetPaginationToggle]);

  const {
    setData,
    agencies,
    // ward,
    setAgencyId,
    spaceIdentifier,
    setEnumerationPosition,
    setSelectedProperty,
    setBuildingName,
    setExistingCustomerAgencyId,
    setExistingPropertyForNewCustomer,
    setNewCustomerStatus,
  } = useContext(Context);

  const [filterGroups, setFilterGroups] = useState([]);
  // useEffect(() => {
  //   console.log("Prop---------->", propertyData);
  //   propertyData.sort((a, b) => a.propertyId - b.propertyId);
  //   console.log("Prop", propertyData);

  // }, [propertyData]);
  const fetchFilterGroups = async () => {
    try {
      const spaceIdentifierResponse = await api.get(
        `enumeration/${organisationId}/space-identifiers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const agencyResponse = await api.get(
        `enumeration/${organisationId}/agencies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const spaceIdentifierData = spaceIdentifierResponse.data;
      const agencyData = agencyResponse.data;

      const processedFilterGroups = [
        {
          name: "Space Identifier",
          label: "Space Identifier",
          filters: spaceIdentifierData.map((spaceIdentifier) => ({
            name: "Space Identifier",
            value: spaceIdentifier.id,
            label: spaceIdentifier.spaceIdentifierName,
          })),
        },
        {
          name: "Agency",
          label: "Agency",
          filters: agencyData.map((agency) => ({
            name: "Agency",
            value: agency.agencyId,
            label: agency.agencyName,
          })),
        },
        // Add more filter groups as needed
      ];
      setFilterGroups(processedFilterGroups);
    } catch (error) {
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
  };
  const fetchPropertyData = async (page) => {
    await api
      .get(`enumeration/${organisationId}/property`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        // console.log(" ", response.data);
        setPropertyData(response.data);
        var paginationData = response.headers["x-pagination"];
        const parsedPaginationData = JSON.parse(paginationData);
        setTotalRows(parsedPaginationData.TotalPages);
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
  };

  const handleFilter = async (filterValues, dateRange) => {
    setLoading(true);
    // Perform filter logic or trigger filter action here
    await api
      .get(
        `http://revbilldemo.ebs-rcm.com/New/api/enumeration/${organisationId}/property?${
          filterValues.Wards ? `Ward=${filterValues.Wards}` : ""
        }&${
          filterValues["Space Identifier"]
            ? `SpaceIdentifier=${filterValues["Space Identifier"]}`
            : ""
        }&${filterValues.Agency ? `AreaOffice=${filterValues.Agency}` : ""}&${
          dateRange[0].startDate
            ? `StartDate=${dateRange[0].startDate.toISOString()}`
            : ""
        }&${
          dateRange[0].endDate
            ? `EndDate=${dateRange[0].endDate.toISOString()}`
            : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log(response);
        setPropertyData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submittedData = {
    agencyId: editRow?.agencies.agencyId,
    spaceIdentifierId: editRow?.spaceIdentifier.id,
    // wardId: editRow?.ward?.id,
    locationAddress: editRow?.locationAddress,
    spaceFloor: editRow?.spaceFloor,
    buildingNo: editRow?.buildingNo,
    buildingName: editRow?.buildingName,
    dateModified: new Date().toISOString(),
    modifiedBy: userData[0]?.email,
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    api
      .post(
        `enumeration/${organisationId}/property-update/${editRow.propertyId}`,
        submittedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {})
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
    const editDialog = editDialogRef.current;
    if (editDialog) {
      const closeButton = editDialog.querySelector("[data-bs-dismiss='modal']");
      closeButton.click();
    }
    // console.log("Form submitted:", submittedData);
    setLoading(false);
  };

  const handleEnumerationStatus = (item) => {
    console.log("Enumeration Item:", item);
    setExistingPropertyForNewCustomer(item);
    setNewCustomerStatus(false);
    setAgencyId(item?.agencies?.agencyId);
    setBuildingName(item.buildingName);
    setSelectedProperty(item.propertyId);
    setExistingCustomerAgencyId(item?.agencies?.agencyId);
    setEnumerationPosition("continue");
  };

  const handleEdit = (item) => {
    console.log("Editing---->", item);
    setEditRow({ ...item });
  };

  const handleView = (item) => {
    setSelectedRow(item);
    console.log(item);
    console.log(`View button clicked for item with ID ${item.propertyId}`);
  };

  const filteredItems = propertyData.sort(
    (a, b) => b.propertyId - a.propertyId
  );
  // const filteredItems = propertyData.filter(
  //   (item) =>
  //     item.buildingName &&
  //     item.buildingName.toLowerCase().includes(filterText.toLowerCase())
  // );

  useEffect(() => {
    fetchPropertyData(1);
  }, []);

  useEffect(() => {
    fetchFilterGroups();
  },[]);

  return (
    <>
      <div>
        <div className="mb-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Property Enumeration</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Enumeration</li>
              <li className="breadcrumb-item active">Property </li>
            </ol>
          </div>

          <div className=" items-center flex flex-row-reverse">
            <div className="">
              <Link
                className="btn bg-primary text-white"
                to="../newPropertyProfile"
              >
                <i className="fas fa-plus fa-fw"></i> Start new enumeration
              </Link>
            </div>
          </div>
        </div>

        <div className=" ">
          <Menu
            as="div"
            className=" rounded-md relative inline-block text-left col-1  "
          >
            <div>
              <Menu.Button className=" inline-flex rounded-md text-dark font-semibold">
                <span className="text-dark ">
                  <i className="fas fa-sliders fa-fw"></i>Filter
                </span>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute w-96 left-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <FilteringComponent
                        filterGroups={filterGroups}
                        onFilter={handleFilter}
                      />
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="mt-3">
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
      </div>
      <div className="modal fade" id="continueAlert">
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
              <FormWizard />
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="viewDialog" ref={viewDialogRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                View Property for {selectedRow ? selectedRow.buildingName : " "}
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
                <form>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow ? selectedRow.buildingName : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col-9">
                      <div className="mb-3">
                        <label className="form-label">Location Address</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow ? selectedRow.locationAddress : ""}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Building No</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow ? selectedRow.buildingNo : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Agency</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={
                            selectedRow ? selectedRow.agencies.agencyName : ""
                          }
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Space Floor</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow ? selectedRow.spaceFloor : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Space Identifier</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={
                            selectedRow
                              ? selectedRow.spaceIdentifier.spaceIdentifierName
                              : ""
                          }
                        />
                      </div>
                    </div>
                    {/* <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Ward</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow ? selectedRow?.ward?.wardName : ""}
                        />
                      </div>
                    </div> */}
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <a href="#/" className="btn btn-primary" data-bs-dismiss="modal">
                Close
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="editDialog" ref={editDialogRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Edit Property for {editRow ? editRow?.buildingName : " "}
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
                <form onSubmit={handleEditSubmit}>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={handleEditChange}
                          name="buildingName"
                          value={editRow ? editRow?.buildingName : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col-9">
                      <div className="mb-3">
                        <label className="form-label">Location Address</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={handleEditChange}
                          name="locationAddress"
                          value={editRow ? editRow?.locationAddress : ""}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Building No</label>
                        <input
                          className="form-control"
                          type="text"
                          onChange={handleEditChange}
                          name="buildingNo"
                          value={editRow ? editRow?.buildingNo : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="agency">
                          Agency
                        </label>

                        <select
                          className="form-select"
                          id="agency"
                          value={editRow?.agencies?.agencyId}
                          onChange={handleEditChange}
                        >
                          {" "}
                          <option value="">Select Agency</option>
                          {agencies.map((agency) => (
                            <option
                              key={agency.agencyId}
                              value={agency.agencyId}
                            >
                              {agency.agencyName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Space Floor</label>
                        <input
                          className="form-control"
                          type="text"
                          name="spaceFloor"
                          onChange={handleEditChange}
                          value={editRow ? editRow.spaceFloor : ""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Space Identifier</label>
                        <select
                          className="form-select"
                          name="spaceIdentifier"
                          value={editRow ? editRow?.spaceIdentifier?.id : ""}
                          onChange={handleEditChange}
                        >
                          <option value="">Select Space Identifier</option>
                          {spaceIdentifier.map((space) => (
                            <option
                              key={space.id}
                              value={space.id}
                              className="option-select"
                            >
                              {space.spaceIdentifierName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Ward</label>
                        <select
                          className="form-select"
                          value={editRow ? editRow?.ward?.id : ""}
                          onChange={handleEditChange}
                          name="ward"
                        >
                          {" "}
                          <option value="">Select Ward</option>
                          {ward.map((wards) => (
                            <option key={wards.id} value={wards.id}>
                              {wards.wardName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div> */}
                  </div>
                  <div className="modal-footer">
                    <a
                      href="#/"
                      className="btn btn-white"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </a>
                    <button type="submit" className="btn btn-primary">
                      {loading ? <Spinner /> : "Edit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ViewRow /> */}
    </>
  );
};

export default PropertyProfile;
