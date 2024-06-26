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

const PasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputType, setInputType] = useState("password");
  const { forgotEmail } = useContext(Context);
  const navigate = useNavigate();
  const handlePassword = (event) => {
    setPassword(event.target.value);
    validateInput(event);
  };
  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    validateInput(event);
  };
  const styleObj = {
    marginLeft: -50,
    fontSize: 20,
  };
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  const resetPasword = async (event) => {
    setLoading(true);
    event.preventDefault();
    await apis
      .post("auth/update-password", {
        userPasswordUpdateDto: {
          email: forgotEmail,
          password: password,
          dateModified: new Date().toISOString(),
          modifiedBy: forgotEmail,
        },
        passwordHistoryCreationDto: {
          password: password,
          dateCreated: new Date().toISOString(),
          createdBy: forgotEmail,
        },
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
                navigate("/login");
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

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (confirmPassword && value !== confirmPassword) {
            stateObj["confirmPassword"] = "Passwords do not match.";
          } else {
            stateObj["confirmPassword"] = confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "";
          } else if (password && value !== password) {
            stateObj[name] = "Passwords do not match.";
          }
          break;

        default:
          break;
      }
      return stateObj;
    });
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
      <div className=" register-container">
        <div className="mt-5 mb-5 login-header">
          <div className="brand">
            <div className="d-flex justify-content-between">
              <span className="l">
                <img className="RevAc-logo" src={logo} alt="RevAc" />
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
                  <h3 className="text-center py-4">Reset your Password</h3>
                  <form
                    onSubmit={resetPasword}
                    className="d-flex justify-content-center mt-3"
                  >
                    <div className=" d-flex w-75 flex-column">
                      {/* <div className=" form-floating ">
                        <input
                          className="px-1 form-control w-100 inp fs-16px "
                          id="floatingInput"
                          type="password"
                          placeholder="Password"
                          //   value={email}
                          //   onChange={handleEmailChange}
                        />
                        <label
                          htmlFor="floatingInput"
                          className="p-0 d-flex align-items-center fs-16px"
                        >
                          Password
                        </label>
                      </div>
                      <div className=" form-floating ">
                        <input
                          className="px-1 form-control w-100 inp fs-16px "
                          id="floatingInput"
                          type="password"
                          placeholder="Confirm Password"
                          //   value={email}
                          //   onChange={handleEmailChange}
                        />
                        <label
                          htmlFor="floatingInput"
                          className="p-0 d-flex align-items-center fs-16px"
                        >
                          Confirm Password
                        </label>
                      </div> */}
                      <div className=" form-floating d-flex align-items-center justify-content-between">
                        <input
                          className="px-1 form-control w-100 inp fs-16px "
                          id="passwordInput"
                          type={inputType}
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={handlePassword}
                          onBlur={validateInput}
                        />
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
                          className="p-0 d-flex align-items-center fs-16px"
                        >
                          Password <span className="text-danger"> *</span>
                        </label>
                      </div>
                      <div className=" form-floating ">
                        <input
                          className="px-1 form-control w-100 inp fs-16px "
                          id="confirmInput"
                          type={inputType}
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={handleConfirmPassword}
                          onBlur={validateInput}
                        />
                        <label
                          htmlFor="floatingInput"
                          className="p-0 d-flex align-items-center fs-16px"
                        >
                          Confirm Password{" "}
                          <span className="text-danger"> *</span>
                        </label>
                      </div>

                      {error.confirmPassword && (
                        <span className="text-danger">
                          {error.confirmPassword}
                        </span>
                      )}

                      <div className=" d-flex ">
                        {" "}
                        <button
                          className="w-full my-4 p-3 fs-16px bg-blue-900 d-flex justify-content-center rounded border-0 text-white"
                          type="submit"
                        >
                          {loading ? <Spinner /> : "Reset"}
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

export default PasswordReset;
