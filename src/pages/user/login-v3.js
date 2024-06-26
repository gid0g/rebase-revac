import React, { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "./onboarding/onboardingcontext";
import woman from "../../assets/images/african-american-woman.png";
import logo from "../../assets/images/Logo.png";
import apis from "../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { userConstant } from "../../redux/constants/userConstant.js";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
import { authenticateUser, isAuthenticated } from "../../utilities/remote/auth";
import { validateForm } from "../../utilities/validation/validation.js";

const LoginV3 = () => {
  const [inputType, setInputType] = useState("password");
  const { email, setEmail } = useContext(Context);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validationRules = {
    email: [{ required: true, email: true, message: "Invalid email address" }],
    password: [{ required: true, minLength: 8, password: true }],
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const styleObj = {
    marginLeft: -50,
    fontSize: 20,
  };
  const value = {
    email,
    password,
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const login = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };

    console.log("formData", formData);

    const formErrors = validateForm(formData, validationRules);
    console.log("formErrors", formErrors);
    setErrors(formErrors);

    if (Object.keys(formErrors).length == 0) {
      setLoading(true);
      await apis
        .post("auth/login", {
          Identifier: email,
          password: password,
        })
        .then((response) => {
          console.log("Error for Login", response);

          if (response.status === 200) {
            const {
              token,
              organisationId,
              userId,
              roleId,
              agency,
              agencytype,
            } = response.data;
            console.log("response", response.data);
            authenticateUser(
              token,
              organisationId,
              userId,
              roleId,
              agency,
              agencytype
            );
            toast.success("successful login", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 100,
              theme: "colored",
            });

            try {
              let organisationResponse;

              apis
                .get(`organisation`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((response) => {
                  organisationResponse = response.data;
                });
              console.log("Organisation API response:", organisationResponse);
            } catch (error) {
              console.error("Error Response:", error);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error for Login", error);

          console.log("error", error);
          if (error.response) {
            if (error.response.status === 422) {
              toast.error("User or Password fields cannot be empty", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            } else if (error.response.status === 401) {
              if (
                error.response.status === 401 &&
                error.response.data.message === "Please change your password"
              ) {
                toast.error(error.response.data.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
                navigate("/changepassword");

                // setTimeout(() => {
                //   if (
                //     error.response.data.message === "Please change your password"
                //   ) {
                //     navigate("/changepassword");
                //   } else return;
                // }, 2000);
              }  else if (
                error.response.status === 401 &&
                error.response.data.message ===
                  "Please kindly activate your account before you can login"
              ) {
                toast.error(error.response.data.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })
                setTimeout(() => {
                  navigate("/rectifyaccount", { state: { Demail: email } });
                }, 2000);
              } else if (
                error.response.status === 401 &&
                error.response.data.message === "Invalid user or password"
              ) {
                toast.error(error.response.data.message, {
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
                toast.error(error.response.data.message, {
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
            } else
              toast.error("Something went wrong...", {
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
    }
  };

  if (isAuthenticated()) {
    return <Navigate to="/home/Homepage" />;
  }

  return (
    <div className="login login-with-news-feed">
      <div className="news-feed">
        <div
          className="news-image"
          style={{ backgroundImage: `url(${woman})` }}
        ></div>
        <div
          className="news-image"
          style={{ background: "#000000", opacity: "0.52" }}
        ></div>
        <div className="news-caption">
          <h4 className="caption-title">
            <b>RevAc</b>
          </h4>
          <p className="caption-text">
            Enumeration, Billing Payment & Report Management Application
          </p>
        </div>
      </div>
      <div className=" register-container">
        <div className="mt-5 mb-5 login-header">
          <div className="brand">
            <div className="d-flex justify-content-between">
              <span className="l">
                <img className="revbill-logo" src={logo} alt="revac" />
              </span>

              <Link className="icon" to="/">
                <div>
                  <i className="fa fa-home"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center text-danger">
            <ToastContainer />
          </div>
          <div className="register-items">
            <div className=" ">
              <div className="card-body">
                <div className="register-content">
                  <form
                    onSubmit={login}
                    className="d-flex-lg justify-content-center-lg w-100-lg"
                  >
                    <div className=" d-flex w-75-lg px-4 flex-column">
                      <div>
                        <div className=" form-floating  ">
                          <input
                            className="px-1 form-control w-100 inp "
                            // id="floatingInput"
                            type="text"
                            placeholder="Email or Phone Number"
                            value={email}
                            onChange={handleEmailChange}
                          />
                          <label
                            htmlFor="floatingInput"
                            className="label p-0 d-flex align-items-center"
                          >
                            Email address
                          </label>
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-400">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <div className=" form-floating d-flex align-items-center justify-content-between">
                          <input
                            className="px-1 form-control w-100 inp "
                            // id="floatingInput"
                            type={inputType}
                            placeholder="password"
                            value={password}
                            onChange={handlePasswordChange}
                          />{" "}
                          {inputType === "password" ? (
                            <AiOutlineEyeInvisible
                              onClick={() => setInputType("text")}
                              style={styleObj}
                            />
                          ) : (
                            <AiFillEye
                              onClick={() => setInputType("password")}
                              style={styleObj}
                            />
                          )}
                          <label
                            htmlFor="floatingInput"
                            className="label p-0 d-flex align-items-center"
                          >
                            Password
                          </label>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-400">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="d-flex flex-column flex-lg-row px-2 my-30px justify-content-between">
                        <div className="label">
                          <span>Don't have an account?</span>{" "}
                          <Link className="text-decoration-none" to="/register">
                            Sign Up
                          </Link>
                        </div>
                        <div className="label">
                          <Link
                            className="text-decoration-none"
                            to="/forgotpassword"
                          >
                            Forgot Password
                          </Link>
                        </div>
                      </div>

                      <div className=" d-flex ">
                        <button
                          className="w-full my-4 p-3 fs-16px bg-blue-900 d-flex justify-content-center rounded border-0 text-white"
                          type="submit"
                        >
                          {loading ? <Spinner /> : "Login"}
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

export default LoginV3;
