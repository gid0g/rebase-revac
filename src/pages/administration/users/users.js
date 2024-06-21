import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import FilterComponent from "../../../components/filtercomponent/filtercomponent";
import DataTable from "react-data-table-component";
import api from "../../../axios/custom";
// import  'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-activity";
import { AppSettings } from "../../../config/app-settings";

import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const Users = () => {
  const token = sessionStorage.getItem("myToken");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState("");

  const [active, setActive] = useState(false);
  const [lockout, setLockout] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [agencyId, setAgencyId] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const organisationId = sessionStorage.getItem("organisationId");
  const storedAgencyId = sessionStorage.getItem("agencyId");
  const [agencies, setAgencies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const modal = document.getElementById("modal24");
  const [noUser, sucessUser]= useState("")
  const modalRef = useRef(null);
  // const [Variable, setVariable]=useState([])
  const options = [
    { value: "2", label: "Admin" },
    { value: "3", label: "Super User" },
    { value: "4", label: "User" },
  ];
  const handleRoleChange = (options) => {
    setSelectedOptionId(options.value);
    setSelectedRole(options);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleMiddleName = (e) => {
    setMiddleName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

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
      name: "Users",
      selector: (row) => row.firstname,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },

    {
      name: "Role",
      selector: (row) => row.roleName,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },

    {
      name: "Agency",
      selector: (row) => row.agencyName,
      sortable: true,
      grow: 2,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Confirmed",
      selector: (row) => row.confirmed.toString(),
      sortable: true,
      grow: 1,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "active",
      selector: (row) => row.active.toString(),
      sortable: true,
      grow: 1,
      style: {
        // maxWidth: "50%",
        textAlign: "center",
      },
    },
    {
      name: "Actions",
      sortable: false,
      center: true,
      grow: 0,
      cell: (row) => (
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#updateUser"
            className=" text-dark"
            type="button"
            onClick={() => handleEdit(row)}
          >
            <i className="fa-solid fa-pen-to-square"></i> Update
          </button>
          <br />
          <br />

          <button
            data-bs-toggle="modal"
            data-bs-target="#viewUser"
            className=" text-dark"
            type="button"
            onClick={() => handleView(row)}
          >
            <i className="fas fa-floppy-disk fa-fw"></i> View
          </button>
        </div>
      ),
    },
  ];
  const handleActiveToggle = () => {
    setActive(!active);
    // console.log(editRow);
  };

  const handleLockoutToggele = () => {
    setLockout(!lockout);
  };

  const handleConfirmedToggle = () => {
    setConfirmed(!confirmed);
  };

  const handleView = (item) => {
    console.log("Item:", item);
    setSelectedRow(item);
  };
  const handleEdit = (item) => {
    setEditRow(item);
    console.log(item);
    setActive(item.active);
    setLockout(item.lockoutEnabled);
    setActive(item.active);
    setConfirmed(item.accountConfirmed);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevEditData) => ({
      ...prevEditData,
      [name]: value,
    }));
  };

  const handleAgencyChange = (option) => {
    console.log("Agency Change:", option);
    console.log("date Change:", new Date().toISOString());
    setAgencyId(option?.value);
  };

  const updateUser = (e) => {
    setLoading(true);
    e.preventDefault();
  };

  const addNewUser = async (e) => {
    e.preventDefault();
    console.log("Selected Role ID:", selectedOptionId);
    setLoading(true);
    console.log("organize",organisationId)
    setIsRefreshing(true);
    await api
      .post(
        `users/${organisationId}/create-user`,
        {
          firstname: firstName,
          middleName: middleName,
          surname: lastName,
          email: email,
          phoneNumber: phone,
          roleId: parseInt(selectedOptionId),
          agencyId: parseInt(agencyId),
          dateCreated: new Date().toISOString(),
          createdBy: userData[0].email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPending(false);
        if (response.status === 200) {
          setLoading(false);
          console.log(response);
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
            console.log("1");
            sucessUser("User Successfully Added")
            modal.style.display = "block";      
            modal.style.color="green"
            modal.style.border = "2px solid black"; // Add a visible border
            setTimeout(() => {
              modal.style.display = "none";
            }, 5000);
          }, 2000);

          // Refresh User
          fetchUsers();

          setFirstName("");
          setMiddleName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setSelectedOptionId("");
        }
        setLoading(false);
        setIsRefreshing(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        setPending(false);
        setIsRefreshing(false);
        console.log(error);

        if (error.message === "timeout exceeded") {
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

          setTimeout(() => {
            console.log("2");
            sucessUser("Failed To Add User")
            modal.style.display = "block";
            modal.style.color="red"
            modal.style.border = "2px solid black"; // Add a visible border
            setTimeout(() => {
              modal.style.display = "none";
            }, 5000);
          }, 2000);
        }
        setLoading(false);
        console.log("error", error);
        toast.error(error.response, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setPending(false);
        setTimeout(() => {
          console.log("3");
          sucessUser("Failed To Add User")
          modal.style.display = "block";
          modal.style.color="red"
          modal.style.border = "2px solid black"; // Add a visible border
          setTimeout(() => {
            modal.style.display = "none";
          }, 5000);
        }, 2000);
      });
  };

  const filteredItems = data.filter(
    (item) =>
      (item.firstname &&
        item.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.middlename &&
        item.middlename.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.surname &&
        item.middlename.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.roleName &&
        item.roleName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.agencyName &&
        item.agencyName.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.active.toString() &&
        item.active
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.confirmed.toString() &&
        item.confirmed
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase()))
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
        placeholder="Search User"
      />
    );
  }, [filterText, resetPaginationToggle]);

  //get all users
  const fetchUsers = async () => {
    try {
      api
        .get(`users/${organisationId}/user-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data);
          setPending(false);
          console.log("users", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [organisationId, token]);

  const transformedAgency = agencies
    ? agencies.map((item) => {
        return {
          label: `${item?.agencyName} / ${item.agencyCode}`,
          value: item?.agencyId,
        };
      })
    : [];

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/agencies/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAgencies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [organisationId, token]);

  // useEffect(()=>{
  //    setVariable( roles.map(obj=>({
  //     label:obj.roleName,
  //     value:obj.roleId,
  //   })))
  // },[roles])

  useEffect(() => {
    api
      .get(`/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [organisationId, token]);

  function Dissmiss() {
    modal.style.display = "none";
  }
  return (
    <>
      <div>
        <div className="mb-2 pl-3 flex justify-content-between">
          <div className=" ">
            <h3 className=" mb-0">Users</h3>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home/Dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">Administration</li>
              <li className="breadcrumb-item active">Users </li>
            </ol>
          </div>

          <div className=" items-center	gap-3 flex flex-row-reverse">
            <div className="flex justify-end mb-3">
              <button
                data-bs-toggle="modal"
                data-bs-target="#addUser"
                className="btn shadow-md bg-primary text-white"
                type="button"
              >
                Add New User
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            id="modal24"
            tabindex="-1"
            class="modal"
            style={{ display: "none" }}
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">New User</h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={Dissmiss}
                  ></button>
                </div>
                <div class="modal-body">
                  <p>{noUser}</p>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={Dissmiss}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full p-3">
            <div className="">
              <div className="">
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  onClick={(item) => console.log(item)}
                  pagination
                  loading
                  progressPending={pending || isRefreshing}
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                  subHeader
                  subHeaderComponent={subHeaderComponentMemo}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="addUser" ref={modalRef}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New User</h4>
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
                    <form onSubmit={addNewUser}>
                      <div className="row gx-2 mb-2">
                        <div className="form-floating mb-3 mb-md-0 col-12">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            name="email"
                            onChange={handleEmail}
                            placeholder="Enter email"
                          />
                          <label htmlFor="email" className=" fs-13px">
                            Enter Email
                          </label>
                        </div>
                      </div>

                      <div className="row gx-2 mb-2">
                        <div className="form-floating mb-3 mb-md-0 col-12">
                          <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            value={firstName}
                            name="firstName"
                            onChange={handleFirstName}
                            placeholder="Enter firstname"
                          />
                          <label htmlFor="firstname" className=" fs-13px">
                            Enter Firstname
                          </label>
                        </div>
                      </div>

                      <div className="row gx-2 mb-2">
                        <div className="form-floating mb-3 mb-md-0 col-12">
                          <input
                            type="text"
                            className="form-control"
                            id="middlename"
                            value={middleName}
                            name="middleName"
                            onChange={handleMiddleName}
                            placeholder="Enter Middle Name"
                          />
                          <label htmlFor="middlename" className=" fs-13px">
                            Enter Middlename
                          </label>
                        </div>
                      </div>

                      <div className="row gx-2 mb-2">
                        <div className="form-floating mb-3 mb-md-0 col-12">
                          <input
                            type="text"
                            className="form-control"
                            id="lastname"
                            value={lastName}
                            onChange={handleLastName}
                            name="lastName"
                            placeholder="Enter Last Name"
                          />
                          <label htmlFor="lastname" className=" fs-13px">
                            Enter Lastname
                          </label>
                        </div>
                      </div>

                      <div className="row gx-2 mb-2">
                        <div className="form-floating mb-3 mb-md-0 col-12">
                          <input
                            type="tel"
                            className="form-control"
                            id="phonenumber"
                            value={phone}
                            onChange={handlePhone}
                            name="phone"
                            placeholder="Enter Phone Number"
                          />
                          <label htmlFor="phonenumber" className=" fs-13px">
                            Enter Phone Number
                          </label>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <Select
                          options={options}
                          onChange={handleRoleChange}
                          className="basic-single"
                          classNamePrefix="select ROle"
                          placeholder="Select Role"
                          name="role"
                          value={options.find(
                            (option) => option.value === selectedRole
                          )}
                        />
                      </div>

                      <div className="row mb-2">
                        <Select
                          className="basic-single"
                          classNamePrefix="Select Agency Area"
                          placeholder="Select Agency Area"
                          name="agency"
                          options={transformedAgency}
                          onChange={(selectedOption) =>
                            handleAgencyChange(selectedOption)
                          }
                          value={transformedAgency.find(
                            (option) => option.value === selectedAgency
                          )}
                        />
                      </div>

                      <div className="d-flex justify-content-end mt-6">
                        <button
                          type="submit"
                          data-bs-dismiss="modal"
                          aria-hidden="true"
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

        <div className="modal fade" id="viewUser">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  View Details for {selectedRow ? selectedRow.firstname : " "}
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
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow && selectedRow?.firstname}
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
                          value={selectedRow && selectedRow?.email}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">phoneNumber</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow && selectedRow?.phoneNumber}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">accountConfirmed</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={
                            selectedRow && selectedRow?.confirmed.toString()
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">active</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow && selectedRow?.active}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">lockoutEnabled</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={selectedRow && selectedRow?.lockoutEnabled}
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
        <div className="modal fade" id="updateUser">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  Update Details for {editRow ? editRow.firstname : " "}
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
                  <form onSubmit={updateUser}>
                    <div className="row  align-items-center">
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label">User Name</label>
                          <input
                            className="form-control"
                            type="text"
                            name="userName"
                            onChange={handleEditChange}
                            value={editRow && editRow?.firstname}
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
                            name="email"
                            onChange={handleEditChange}
                            value={editRow && editRow?.email}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row  align-items-center">
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label">phoneNumber</label>
                          <input
                            className="form-control"
                            type="text"
                            name="phoneNumber"
                            onChange={handleEditChange}
                            value={editRow && editRow?.phoneNumber}
                          />
                        </div>
                      </div>
                      <div className="col"></div>
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
                        {loading ? <Spinner /> : "Update"}
                      </button>
                    </div>
                  </form>
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

export default Users;
