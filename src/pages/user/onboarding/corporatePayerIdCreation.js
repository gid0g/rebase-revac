import React, { useState, useContext } from "react";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../../../axios/custom";
import { Link } from "react-router-dom";
import { Context } from "./onboardingcontext";

const CorporatePayerId = () => {
  const [loading, setLoading] = useState(false);
  const [newPayerId, setNewPayerId] = useState("");
  const [input, setInput] = useState({
    companyName: "",
    address: "",
  });
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [error, setError] = useState({
    companyName: "",
    phoneNumber: "",
  });

  const { setPayerIdData } = useContext(Context);

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };
      switch (name) {
        case "companyName":
          if (!value) {
            stateObj[name] = "Please enter Company Name";
          }
          break;
        case "email":
          if (!value) {
            stateObj[name] = "Please enter your email ";
          }
          break;
        case "phoneNumber":
          if (!value) {
            stateObj[name] = "Please enter your Phone Number.";
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Passwords do not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      companyName: input.companyName,
      phoneNumber: phoneNumber,
      email: email,
      address: input.address,
      dateofIncorporation: new Date().toISOString(),
    };

    console.log("create-pid-corporate:", formData);
    
    await apis
      .post(`enumeration/create-pid-corporate`, {
        companyName: input.companyName,
        phoneNumber: phoneNumber,
        email: email,
        address: input.address,
        dateofIncorporation: new Date().toISOString(),
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.data.flag === "Passed") {
            setLoading(false);
            setNewPayerId(response.data.data.outData);
            setPayerIdData(response.data.data);
            toast.success(response.data?.data.outData, {
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
            if (response.data.data.flag !== "Passed") {
              setLoading(false);
              toast.error(response.data?.data.outData, {
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
        }
        setLoading(false);
        return true;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        if (error.response) {
          if (error.response.status === 422) {
            console.log(error.response.data);
            let errorMessages = [];
            for (const response in error.response.data) {
              error.response.data[response].forEach((errorMessage) => {
                errorMessages.push(errorMessage);
              });
            }
            errorMessages.forEach((errorMessage) => {
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
            });
          } else if (error.response.status === 401) {
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
          } else if (error.response.status === 500) {
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
      });
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput({
      ...input,
      [event.target.name]: value,
    });
  };
  const handlePhoneChange = (event) => {
    const value = event.target.value;
    setPhoneNumber(event.target.value);
    const regex =
      /^(\+234|234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|909|908|901|902|903|904|905|906|907)([0-9]{7})$/;
    const isValidPhoneNumber = regex.test(value);
    if (!isValidPhoneNumber) {
      setPhoneNumberError("Phone Number is not valid");
    } else {
      setPhoneNumberError("");
    }
  };
  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(event.target.value);
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const isValidEmail = regex.test(value);
    if (!isValidEmail) {
      setEmailError("Email Address is not valid");
    } else {
      setEmailError("");
    }
  };
  return (
    <>
      <ToastContainer />
      <h1 className="page-header mt-3 text-center ">
        Create Corporate Payer Id
      </h1>
      <hr />
      {newPayerId && (
        <div className="d-flex justify-center">
          <div className="d-flex text-lg flex-column bg-blue-400 text-white w-75 p-2 text-center">
            {newPayerId}
          </div>
        </div>
      )}
      {newPayerId && (
        <Link
          className=" mt-3 text-blue-900 text-lg d-flex justify-center"
          to="../"
        >
          Back to Onboarding
        </Link>
      )}
      <div className="">
        <form onSubmit={submitHandler}>
          <div className="p-4">
            <h4> Information</h4>
            <hr />

            <div className="row gx-4">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label" htmlFor="corporate">
                    Corporate Name <span className="text-danger"> *</span>
                  </label>
                  <input
                    id="corporate"
                    type="text"
                    className="form-control"
                    placeholder="Enter Corporate Name"
                    value={input.companyName}
                    name="companyName"
                    onChange={handleInputChange}
                    required
                    onBlur={validateInput}
                  />
                  {error.companyName && (
                    <span className="text-danger">{error.companyName}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email <span className="text-danger"> *</span>
                  </label>
                  <input
                    id="email"
                    autoFocus
                    type="text"
                    className="form-control"
                    placeholder="Enter Email "
                    value={input.email}
                    name="email"
                    onChange={handleEmailChange}
                    required
                    onBlur={validateInput}
                  />
                  {emailError && (
                    <span className="text-danger">{emailError}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 pt-2">
            <h4>Contact Information</h4>
            <hr />
            <div className="row gx-2">
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label" htmlFor="address">
                    Address <span className="text-danger"> *</span>
                  </label>
                  <input
                    id="address"
                    autoFocus
                    type="text"
                    className="form-control"
                    placeholder="Enter address"
                    value={input.address}
                    name="address"
                    onChange={handleInputChange}
                    required
                    onBlur={validateInput}
                  />
                  {error.address && (
                    <span className="text-danger">{error.address}</span>
                  )}
                </div>
              </div>

              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label" htmlFor="phone">
                    Phone Number <span className="text-danger"> *</span>
                  </label>
                  <input
                    autoFocus
                    id="phone"
                    type="text"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={handlePhoneChange}
                    onKeyDown={validateInput}
                    required
                    onBlur={validateInput}
                  />
                  {phoneNumberError && (
                    <span className="text-danger">{phoneNumberError}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="row gx-2"></div>
          </div>

          <div className="d-flex p-4 justify-content-end">
            <button type="submit" className="btn bg-blue-900 text-white my-1">
              {loading ? <Spinner /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CorporatePayerId;
