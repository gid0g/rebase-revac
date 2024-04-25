import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/Logo.png";
import man from "../../../assets/images/african-american-man.png";
import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
import { Context } from "./selfservicecontext";
import { ToastContainer, toast } from "react-toastify";
import apis from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";

const VerifyEmail = () => {
  const { email } = useContext(Context);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleOtp = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apis
      .post(
        `auth/confirm-account`,
        {
          email: email,
          otp: otp,
        },
        
      )
      .then((response) => {
        console.log("response", response);
        if (response.data) {
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
          setLoading(false);
        }
        setLoading(false);
        navigate("/login");
      })

      .catch((error) => {
        console.log("context", error);
        if (error.message) {
          // setData(response.data.data);
          setLoading(false);
          toast.error("Please FIll all required field", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setLoading(false);
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <ToastContainer />
      <div className="">
        <h1 className="text-center">Verify Your Email Address</h1>
        <p className="text-center">
          {" "}
          An otp has been sent to your registered Email.
        </p>
        <div className=" ">
          <div className="card-body">
            <div className="register-content ">
              <form
                onSubmit={handleSubmit}
                className="d-flex justify-content-center mt-3"
              >
                <div className=" d-flex w-75 flex-column">
                  <div className=" form-floating ">
                    <input
                      className="px-1 form-control w-100 inp fs-16px "
                      id="emailInput"
                      type="email"
                      value={email}
                      placeholder="email"
                      disabled
                    />
                    <label
                      htmlFor="floatingInput"
                      className="p-0 d-flex align-items-center fs-16px"
                    >
                      Email address
                    </label>
                  </div>

                  <div className=" form-floating  ">
                    <input
                      className="px-1 form-control w-100 inp fs-16px "
                      id="otp"
                      type="otp"
                      value={otp}
                      onChange={handleOtp}
                      placeholder="enter otp"
                      minLength={6}
                    />
                    <label
                      htmlFor="otp"
                      className="p-0 d-flex align-items-center fs-16px"
                    >
                      OTP
                    </label>
                  </div>

                  <div className=" d-flex ">
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
      </div>
    </div>
  );
};

export default VerifyEmail;
