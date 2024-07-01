import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/Logo.png";
import man from "../../../assets/images/african-american-man.png";
import apis from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./selfservicecontext";

const ForgotPassword = () => {
  const { forgotEmail, setForgotEmail } = useContext(Context);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const handleEmailChange = (event) => {
    setForgotEmail(event.target.value);
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
        setLoading(false);
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
            if (response.status === 200) {
              navigate("/otp");
            } else return;
          }, 3000);
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
          } else if (error.response.status === 404) {
            toast.error(error.response.data.Message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
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
        </div>
        <div className="text-center text-danger">
          <ToastContainer />
        </div>
        <div>
          <h3 className="text-center py-4">Forgot Password</h3>
          <form onSubmit={forgotPassword}>
            <div className=" d-flex align-items-center flex-column">
              <div className=" form-floating w-75 ">
                <input
                  className="px-1 form-control w-100 inp fs-16px "
                  id="floatingInput"
                  type="email"
                  placeholder="email"
                  value={forgotEmail}
                  onChange={handleEmailChange}
                />
                <label
                  htmlFor="floatingInput"
                  className="p-0 d-flex align-items-center fs-16px"
                >
                  Enter your Email address
                </label>
              </div>

              <div className=" w-75 d-flex ">
                {" "}
                <button
                  className="w-full my-4 p-3 fs-16px bg-blue-900 d-flex justify-content-center rounded border-0 text-white"
                  type="submit"
                >
                  {loading ? <Spinner /> : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
