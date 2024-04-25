import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const Streets = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [itemId, setItemId] = useState("");
  const organisationId = sessionStorage.getItem("organisationId");
  const streetId = sessionStorage.getItem("streetId");
  const agencyId = sessionStorage.getItem("agencyId");
  const roleId = sessionStorage.getItem("roleId");


  const handleChange = (event) => {
    setNewStreet(event.target.value);
  };

  const addNewStreet = async (e) => {
    setLoading(true);
    e.preventDefault();
    await api
      .get(
        `enumeration/streets`,
        {
          StreetName: newStreet,
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
          setNewStreet("");
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        toast.error(error.response.data.StreetName[0], {
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

  const editStreet = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await api.post(
        `enumeration/streets/${itemId}`,
        {
          organisationId: editRow?.organisationId,
          agencyId: editRow?.agencyId,
          streetName: editRow?.streetName,
          description: "",
          active: true,
          dateCreated: new Date().toISOString(),
          modifiedBy: `${userData[0]?.email}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(response.data){
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
      }

    } catch (error) {
      const { response } = error;
      toast.error(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getAgency = (id) => {
    const agency = agencies.find(agency => agency.agencyId == id);
    return agency?.agencyName;
  }

  const transformedData = data?.map((item) => {
    return {
      streetId: item?.streetId,
      streetName: item?.streetName,
      area: getAgency(item?.agencyId)
    }
  });

  const filteredItems = transformedData?.filter(
    (item) =>
      item.streetName &&
      item.streetName.toLowerCase().includes(filterText.toLowerCase())
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
        placeholder="Search By Street Name"
      />
    );
  }, [filterText, resetPaginationToggle]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const getEndpoint = (roleId, organisationId, agencyId) => {
    switch (roleId) {
      case "1":
        return `enumeration/streets/`; // SuperAdmin
      case "2":
        return `enumeration/${organisationId}/agency/${agencyId}/streets`; // Admin
      case "3":
        return `enumeration/${organisationId}/agency/${agencyId}/streets`; // SuperUser
      case "4":
        return `enumeration/${organisationId}/agency/${agencyId}/streets`; // User
      case "5":
        return `enumeration/${organisationId}/streets`; // Admin1
      default:
        return '';
    }
  }
  


  useEffect(() => {
    api
      .get(getEndpoint(roleId, organisationId, agencyId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Streets:", response.data);
        console.log("Streets Endpoint:", getEndpoint(roleId, organisationId, agencyId));
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, organisationId, streetId]);

  useEffect(() => {
    api.get(`enumeration/${organisationId}/agencies`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
    })
    .then((response) => {
        console.log("Agencies:", response.data);
        setAgencies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditRow(item);
    setItemId(item?.streetId);
  };

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
      name: "Street Name",
      selector: (row) => row.streetName,
      sortable: true,
      grow: 2,
      style: {
        textAlign: "center",
      },
    },
    {
      name: "Area Office",
      selector: (row) => row.area,
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
          data-bs-target="#editStreet"
          className="btn text-dark"
          type="button"
          onClick={() => handleEdit(row)}
        >
          <i className="fa-solid fa-pen-to-square"></i> Edit
        </button>
      ),
    },
  ];

  


  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Streets</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Streets </li>
            </ol>
          </div>

          {/* <div className=" items-center	 gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#create"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New Street
              </button>
            </div>
          </div> */}

          <div className="items-center gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              {/* Replace the button with a Link */}
              {/* <Link to="/administration/street/createnewstreet"> */}
              <Link to="/home/administration/street/createnewstreet">
                <button
                  className="btn shadow-md bg-primary text-white"
                  type="button"
                >
                  Add New Street
                </button>
              </Link>
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
                  progressPending={pending}
                  paginationResetDefaultPage={resetPaginationToggle}
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="addStreet">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Street</h4>
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
                    <form onSubmit={addNewStreet}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Street Name
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              value={newStreet}
                              placeholder="Enter Street Name"
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

        <div className="modal fade" id="editStreet">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Street</h4>
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
                    <form onSubmit={editStreet}>
                      <div className="row gx-5">
                        <div className="col">
                          <div className="mb-3 ">
                            <label
                              className="form-label"
                              htmlFor="exampleInputEmail1"
                            >
                              Street Name
                            </label>

                            <input
                              type="text"
                              name="StreetName"
                              className="form-control"
                              value={editRow ? editRow.streetName : ""}
                              placeholder="Enter Street Name"
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

export default Streets;
