import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "./selfservicecontext";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import logo from "../../../assets/images/Logo.png";
import man from "../../../assets/images/african-american-man.png";
import apis from "../../../axios/custom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmAccount = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleOTP = (event) => {
    setOtp(event.target.value);
  };

  const resendOtp = async (event) => {
    await apis
      .post("auth/confirm-account-otp", {
        Email: email,
      })
      .then((response) => {
        console.log('response--', response)
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
      })
      .catch((error) => {
        console.log('error-', error)
        if(error.response){
          toast.error(error.response.data.Email[0], {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else{
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

  const confirmAccount = async (event) => {
    setLoading(true);
    event.preventDefault();
    await apis
      .post("auth/confirm-account", {
        Email: email,
        OTP: otp,
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
        if (response.status === 200) {
          if (response.data.status === 400) {
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
          } else if (response.data.status === 200) {
            setTimeout(() => {
              if (response.data.status === 200) {
                navigate("/changepassword");
              } else return;
            }, 2000);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
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
          } else
            toast.error("something went wrong...", {
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
      });
    setLoading(false);
  };

  return (
    <div className="register register-with-news-feed">
      <div className="news-feed">
        <div
          className="news-image"
          style={{ backgroundImage: `url(${man})` }}
        ></div>
        <div
          className="news-image"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 0, 0, 0.33) 0%, rgba(0, 0, 0, 0.33) 155.28%)",
          }}
        ></div>
        <div className="news-caption">
          <h4 className="caption-title fs-38px">
            <b>RevBills</b>
          </h4>
          <p className="fs-32px">
            Enumeration, Billing Payment & Report Management Application
          </p>
        </div>
      </div>
      <div className=" register-container">
        <div className="mt-5 mb-5 login-header">
          <div className="brand">
            <div className="d-flex justify-content-between">
              <span className="l">
                <img className="revbill-logo" src={logo} alt="revbill" />
              </span>
              <Link to="/">
                <div className="icon">
                  <i className="fa fa-home"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="register-items">
            <ToastContainer />

            <div className=" ">
              <div className="card-body">
                <div className="register-content ">
                  <h3 className="text-center pt-4">Confirm your Account</h3>
                  {/* <p className="text-sm text-center pb-4"></p> */}
                  <form
                    onSubmit={confirmAccount}
                    className="d-flex justify-content-center mt-3"
                  >
                    <div className=" d-flex w-75 flex-column">
                      <div className=" form-floating d-flex align-items-center justify-content-between">
                        <input
                          className="px-1 form-control w-100 inp fs-16px "
                          id="email"
                          type="email"
                          placeholder="Email Address"
                          name="email"
                          value={email}
                          onChange={handleEmail}
                          //   onBlur={validateInput}
                        />

                        <label
                          htmlFor="email"
                          className="p-0 d-flex align-items-center fs-16px"
                        >
                          Email <span className="text-danger"> *</span>
                        </label>
                      </div>
                      <div className=" form-floating ">
                        <input
                          className="px-1 form-control w-100 inp fs-16px "
                          id="otp"
                          type="number"
                          placeholder="Please provide the OTP sent to your email"
                          name="otp"
                          value={otp}
                          onChange={handleOTP}
                          //   onBlur={validateInput}
                        />
                        <label
                          htmlFor="floatingInput"
                          className="p-0 d-flex align-items-center fs-16px"
                        >
                          OTP <span className="text-danger"> *</span>
                        </label>
                      </div>

                      <div className='flex mt-4'>
                        <p>Didnt Get an OTP?</p>
                        <span>
                          <button type='button' onClick={resendOtp}>{" "}Click to resend </button>
                        </span>
                      </div>
                      <div className=" d-flex ">
                        {" "}
                        <button
                          className="w-full my-4 p-3 fs-16px bg-blue-900 d-flex justify-content-center rounded border-0 text-white"
                          type="submit"
                        >
                          {loading ? <Spinner /> : "Confirm"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
