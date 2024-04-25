import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../../axios/custom";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import Select from "react-select";
import "react-activity/dist/library.css";
import { Context } from "./enumerationContext";

const FormStep1 = (props) => {
  const {
    setData,
    payID,
    setPayId,
    customerStatus,
    setCustomerStatus,
    setSelectedCustomer,
    setEnumerationStatus,
  } = useContext(Context);

  const { setCurrentStep, currentStep } = props;

  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  let navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    // Fetch data from API and update state
    api
      .get(`customer/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
        setCustomerData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleNewStatus = () => {
    setCurrentStep(currentStep + 1);
    setCustomerStatus(false);
    setSelectedCustomer(0);
  };

  const transformedCustomerData = customerData
    ? customerData.map((item) => ({
        label: `${item.fullName}, ${item.payerId}`,
        value: item.customerId,
        ...item,
      }))
    : "";

  const handleCustomerChange = (selectedCustomer) => {
    setSelectedCustomer(selectedCustomer.value);
    setData(selectedCustomer)
    console.log("selectedCustomer", selectedCustomer);
  };

  const handleStatusClick = () => {
    console.log("Existing button clicked");
    setCustomerStatus(true);
  };

  const submitCustomerData = () => {
    setEnumerationStatus(false);
    navigate("../createbusinessprofile");
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      <div className="header mt-3 d-flex justify-content-center text-center">
        <h4>Are you a New or Existing Customer?</h4>
      </div>
      <div className="d-flex mt-4 mb-3 justify-content-center">
        <button
          aria-hidden="true"
          className="btn bg-blue-600 btn-white text-white"
          onClick={handleStatusClick}
          type="button"
        >
          Existing
        </button>

        <button
          aria-hidden="true"
          onClick={handleNewStatus}
          className="btn bg-blue-900 text-white mx-2"
          type="button"
        >
          New
        </button>
      </div>
      {customerStatus && (
        <div className="px-2 py-2">
          <div>
            <label>Please Select Customer</label>
            <Select
              id="customer"
              className="basic-single"
              classNamePrefix="select"
              defaultValue="Select Customer"
              isSearchable={true}
              name="customerId"
              options={transformedCustomerData}
              onChange={handleCustomerChange}
            />
            <div className=" d-flex justify-content-end mt-2">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-hidden="true"
                onClick={submitCustomerData}
                className="btn bg-blue-900 text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormStep2 = (props) => {
  const {
    data,
    setData,
    payID,
    setPayId,
    customerStatus,
    setCustomerStatus,
    setSelectedCustomer,
    setEnumerationStatus,
    submitPayerId,
  } = useContext(Context);
  const { setCurrentStep, currentStep } = props;

  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  let navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [newCustomer, setNewCustomer] = useState(selectedCustomer);

  useEffect(() => {
    // Fetch data from API and update state
    api
      .get(`customer/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCustomerData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClick = () => {
    setVisibility(true);
    setEnumerationStatus(true);
  };

  const handleNotAvalilable = () => {
    setEnumerationStatus(false);
    navigate("../createbusinessprofile");
  };
  const handleChange = (e) => {
    setPayId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .post(
        "enumeration/verify-pid",
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
        setLoading(false);
        if (response.status === 200) {
          if (response.data.status === 200) {
            setData(response.data.data);
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
          } else if (response.data.status === 404) {
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
      .catch((error) => {
        console.log(error);
        if (error.response.status) {
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
          } else {
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
        }
      });
  };

  const handleNewStatus = () => {
    setCurrentStep(currentStep + 1);
    setCustomerStatus(false);
    setSelectedCustomer(0);
  };

  const transformedCustomerData = customerData
    ? customerData.map((item) => ({
        label: item.fullName,
        value: item.customerId,
      }))
    : "";

  const handleCustomerChange = (selectedCustomer) => {
    setSelectedCustomer(selectedCustomer.value);
  };

  const handleStatusClick = () => {
    console.log("Existing button clicked");
    setCustomerStatus(true);
  };

  const submitCustomerData = () => {
    setEnumerationStatus(false);
    navigate("../createbusinessprofile");
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      <div className="header mt-3 flex justify-evenly items-baseline">
        <i
          className="fa fa-arrow-left "
          onClick={prevStep}
          aria-hidden="true"
        ></i>

        <h4 className="">Is the customer available to provide PID?</h4>
        <div></div>
      </div>

      <div className="d-flex mt-4 mb-3 justify-content-center">
        <button
          className="btn bg-blue-900 text-white mx-2"
          onClick={handleClick}
        >
          Yes
        </button>

        <button
          data-bs-dismiss="modal"
          aria-hidden="true"
          onClick={handleNotAvalilable}
          className="btn btn-white"
        >
          No
        </button>
      </div>
      {visibility && (
        <div className="px-3 mt-4">
          <div className="header d-flex mt-3">
            <h6 className=" ">Please Provide PayerID</h6>
          </div>

          <form onSubmit={handleSubmit}>
            <div className=" d-flex flex-column">
              <div className=" w-100">
                <input
                  autoFocus
                  className=" px-1 form-control w-100"
                  type="text"
                  value={payID}
                  onChange={handleChange}
                  name="payId"
                  placeholder="Enter payer Id"
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  className="btn bg-blue-900 text-white my-2 "
                  type="submit"
                >
                  {loading ? <Spinner /> : "Submit"}
                </button>
              </div>
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
                        value={data?.fullName}
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
                        value={data?.email}
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
                        value={data?.payerID}
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
                        value={data?.gsm}
                      />
                    </div>
                  </div>
                </div>
                <div className=" d-flex justify-content-end pb-3">
                  <button
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                    type="submit"
                    className="btn bg-blue-900 text-white"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div>
      <ToastContainer />
      {currentStep === 1 && (
        <FormStep1 currentStep={currentStep} setCurrentStep={setCurrentStep} />
      )}
      {currentStep === 2 && (
        <FormStep2 currentStep={currentStep} setCurrentStep={setCurrentStep} />
      )}
    </div>
  );
};

export default FormWizard;
