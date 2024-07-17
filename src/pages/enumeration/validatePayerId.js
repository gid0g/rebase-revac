import React, { useState, useContext, useEffect } from "react";
import api from "../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppSettings } from "../../config/app-settings";
import initialState from "./initial";
import { Modal } from "bootstrap";

const ValidatePayId = () => {
  const [modalInstance, setModalInstance] = useState(null);
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const navigate = useNavigate();
  const [pid, setPid] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialState);
  const [validityChecked, setValidityChecked] = useState(false);

  const state = useSelector((state) => state);
  let user = state.authReducer.user;

  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");

  const checkGender = (gender) => {
    let genderId = 0;
    if (gender && gender === "M") {
      genderId = 1;
    } else if (gender && gender === "F") {
      genderId = 2;
    }
    return genderId;
  };

  const checkTitle = (title) => {
    let titleId = 0;

    if (
      (title && title?.toLowerCase() === "mr") ||
      (title && title?.toLowerCase() === "mr.") ||
      (title && title?.toLowerCase() === "master") ||
      (title && title?.toLowerCase() === "mas")
    ) {
      titleId = 1;
    } else if (
      (title && title?.toLowerCase() === "mrs.") ||
      (title && title?.toLowerCase() === "mrs") ||
      (title && title?.toLowerCase() === "miss") ||
      (title && title?.toLowerCase() === "miss.")
    ) {
      titleId = 2;
    } else {
      titleId = 2;
    }

    return titleId;
  };

  const checkMaritalDtoStatus = (maritalStatus) => {
    let maritalId = 0;
    if (maritalStatus && maritalStatus === "M") {
      maritalId = 1;
    } else if (maritalStatus && maritalStatus === "S") {
      maritalId = 2;
    }

    return maritalId;
  };
  const checkPayerType = (payerId) => {
    let payerTypeId = 0;
    if (payerId ? payerId.charAt(0) === "N" : "N") {
      payerTypeId = 1;
    } else if (payerId ? payerId.charAt(0) === "C" : "C") {
      payerTypeId = 2;
    }

    return payerTypeId;
  };
  const clearForm = () => {
    setData(initialState);
  };
  const validate = async (e) => {
    clearForm();
    setLoading(true);
    e.preventDefault();
    await api
      .post(
        "enumeration/verify-pid",
        {
          payerid: pid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          if (response.data.statusMessage === "PayerID Record Found") {
            setData(response.data.data);
            setLoading(false);
            setValidityChecked(true);
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
          } else {
            clearForm();
            setLoading(false);
            setValidityChecked(true);
            toast.error(response.data.statusMessage, {
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
        }
      })
      .then(setData({}))
      .catch((error) => {
        if (error.response.status === 422) {
          setLoading(false);
          setValidityChecked(true);
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
        }
        console.log(error);
        setLoading(false);
        setValidityChecked(false);
      });
  };

  
  function getFirstName(fullName) {
    const names = fullName.split(" ");
    return names[0] || "";
  }
  
  function getMiddleName(fullName) {
    const names = fullName.split(" ");
    return names.slice(1, -1).join(" ") || "";
  }
  
  function getLastName(fullName) {
    const names = fullName.split(" ");
    return names.slice(-1)[0] || "";
  }
  
  const handlePidChange = (event) => {
    setPid(event.target.value);
  };
  const createCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Data::", data);

    try {
      const response = await api.post(
        `/customer/${organisationId}`,
        {
          payerTypeId: checkPayerType(data?.payerID),
          payerId: data?.payerID,
          titleId: checkTitle(data?.title) || 1,
          corporateName: data?.corporateName,
          firstName: data?.firstName || getFirstName(data.fullName) || " ",
          lastName: data.lastName || getLastName(data.fullName) || "",
          middleName: data?.middleName || getMiddleName(data.fullName) || "",
          genderId: checkGender(data?.sex) || 1,
          maritalStatusId: checkMaritalDtoStatus(data?.maritalstatus) || 1,
          address: data?.address || "",
          email: data?.email,
          phoneNo: data?.gsm || "",
          suppliedPID: true,
          dateCreated: new Date().toISOString(),
          createdBy: userData[0].email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Message:", response?.data);

      if (response?.data?.status == 200) {
        toast.success(response.data?.statusMessage, {
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
          navigate("/home/enumeration/customerprofile");
          window.location.reload();
        }, 5000);
      }

      if (response?.data?.status == 409) {
        toast.error(response.data?.statusMessage, {
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
          navigate("/home/enumeration/customerprofile");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response?.data;

        if (typeof errorData === "string") {
          toast.error(errorData, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          const flatErrors = Object.entries(errorData).flatMap(
            ([key, value]) => {
              if (typeof value != Array)
                return value?.map((message) => `${key}: ${message}`);
            }
          );

          const errorMessage = flatErrors.join("\n");

          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          toast.error("Contact administrator to update information", {
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
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/enumeration/PropertyProfile">Enumeration</Link>
        </li>
        <li className="breadcrumb-item active">Validate PayerId </li>
      </ol>
      <h1 className="page-header mb-3">Validate PayerId</h1>
      <hr />
      <ToastContainer />
      <div className="d-flex justify-content-center">
        <div className="shadow-sm rounded w-50 mt-4 px-4 py-2 d-flex flex-column justify-content-center">
          <div className="">
            <div className="">
              <form onSubmit={validate}>
                <div className="">
                  <div className="">
                    <h4 className="mb-2 form-label">Validate PayerId</h4>
                    <div className="row gx-3">
                      <div className=" mb-2 mb-md-0">
                        <input
                          autoFocus
                          type="text"
                          className="form-control form-control-lg p-2 d-flex align-items-center fs-16px"
                          placeholder="Enter Payer Id"
                          value={pid}
                          name="payId"
                          onChange={handlePidChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn bg-blue-900 text-white my-2"
                    >
                      {" "}
                      {loading ? <Spinner /> : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {validityChecked && (
            <div className=" mt-5 d-flex flex-column">
              <hr></hr>
              <fieldset>
                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.title}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Sex</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.sex}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Marital Status</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.maritalstatus}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <span className="input-group-text" id="basic-addon1">
                      First Name
                    </span>
                    <input
                      type="text"
                      aria-label="First name"
                      className="form-control"
                      disabled
                      value={
                        data && data.fullName
                          ? getFirstName(data.fullName)
                          : " "
                      }
                    />
                  </div>
                  {data &&
                  data.fullName &&
                  data.fullName.split(" ").length > 2 ? (
                    <div className="col">
                      <span className="input-group-text" id="basic-addon1">
                        Middle Name
                      </span>
                      <input
                        type="text"
                        aria-label="Middle name"
                        className="form-control"
                        disabled
                        value={
                          data && data.fullName
                            ? getMiddleName(data.fullName)
                            : " "
                        }
                      />
                    </div>
                  ) : null}
                  <div className="col">
                    <span className="input-group-text" id="basic-addon1">
                      Last Name
                    </span>
                    <input
                      type="text"
                      aria-label="Last name"
                      className="form-control"
                      disabled
                      value={
                        data && data.fullName ? getLastName(data.fullName) : " "
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled
                    value={data.address}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled
                    value={data.email}
                  />
                </div>
                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.gsm}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Payer ID</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.payerID}
                      />
                    </div>
                  </div>
                </div>
                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Organisation</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.corporateName}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Branch Name</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.branchName}
                      />
                    </div>
                  </div>
                </div>
                <div className="row  align-items-center">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.birthdate}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Corp Id</label>
                      <input
                        className="form-control"
                        type="text"
                        disabled
                        value={data.corpID}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="modal fade" id="viewDialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Customer Creation</h4>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-hidden="true"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className=" mt-3 d-flex flex-column">
                        <div className="row  align-items-center">
                          <div className="col">
                            <h4 className="text-center text-lg">
                              Do You Want to Create this Customer?
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="w-full flex justify-between items-center gap-4">
                        <button
                          className="btn bg-blue-900 text-white my-2"
                          onClick={createCustomer}
                        >
                          {loading ? <Spinner /> : "Yes"}
                        </button>
                        <button
                          className="btn btn-white border-[1px] border-blue-900 text-blue-900 my-2"
                          data-bs-dismiss="modal"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#viewDialog"
                  className="btn bg-blue-900 text-white"
                  type="button"
                >
                  Create Customer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatePayId;
