import React, { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/Logo.png";
import man from "../../../assets/images/african-american-man.png";
import OtpInput from "react-otp-input";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../../../axios/custom";
import "./otpPage.css";
import { Context } from "./selfservicecontext";

const OneTimePassword = () => {
  const { forgotEmail } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  let navigate = useNavigate();
  const handleSetOtp = (otpValue) => {
    setOtp(otpValue);
  };

  const forgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    await apis
      .post("auth/forgot-password", {
        email: forgotEmail,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
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
          setTimeout(() => {
            if (response.data.status === 200) {
              navigate("/passwordreset");
            } else return;
          }, 2000);
        }
        setLoading(false);
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

  const handleOTP = async (event) => {
    setLoading(true);
    event.preventDefault();
    await apis
      .post("auth/verify-password-otp", {
        email: forgotEmail,
        otp: otp,
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
          }
          else if (response.data.status === 200) {
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
              if (response.data.status === 200) {
                navigate("/passwordreset");
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

  const handleKeyPress = (event) => {
    // used to retrieve the key code of the pressed key from the event. keyCode is for old browsers, which is for new browsers
    const keyCode = event.keyCode || event.which;

    //converts the key code to a string character. It gives us the actual value of the pressed key.
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numeric values (0-9)
    if (!/^[0-9]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  return (
    <>
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
              <b>RevAc</b>
            </h4>
            <p className="fs-32px">
              Enumeration, Billing Payment & Report Management Application
            </p>
          </div>
        </div>
        <div className="  register-container">
          <div className="mt-5 mb-5 login-header">
            <div className="brand">
              <div className="d-flex justify-content-between">
                <span className="l">
                  <img className="RevAc-logo" src={logo} alt="RevAc" width="300px"/>
                </span>
                <Link to="/">
                  <div className="icon">
                    <i className="fa fa-home"></i>
                  </div>
                </Link>
              </div>
            </div>
            <ToastContainer />
          </div>
          <div className=" p-3 my-5 bg-white rounded justify-content-center  ">
            <h3 className="text-center py-2">
              We sent your code to your registered email/phone number
            </h3>
            <p className="text-center py-2 fs-14px">
              Kindly enter the confirmation code below
            </p>
            <form
              onSubmit={handleOTP}
              className="d-flex justify-content-center"
            >
              <div className="d-flex flex-column align-items-center  ">
                <div className="d-flex justify-content-center ">
                  <OtpInput
                    inputStyle="inputStyle"
                    value={otp}
                    onChange={handleSetOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => (
                      <input {...props} onKeyPress={handleKeyPress} />
                    )}
                  />
                </div>
                <div className="w-100 d-flex text-center justify-content-center">
                  <button
                    type="submit"
                    className="btn bg-blue-900 text-white  px-5 px-1 mt-40px"
                    // disabled={otp.length < numInputs}
                  >
                    {loading ? <Spinner /> : "Submit"}
                  </button>
                </div>
              </div>
            </form>
            <div className="d-flex justify-content-center">
              <form
                onSubmit={forgotPassword}
                className="d-flex flex-column align-items-center justify-content-center "
              >
                <p className="mt-5"> Didn't receive an OTP?</p>
                <button type="submit" className="text-decoration-underline">
                  Resend OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default OneTimePassword;
