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

const SelfRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { email, setEmail } = useContext(Context);
  const captchaRef = useRef(null);

  const [inputType, setInputType] = useState("password");
  let navigate = useNavigate();

  const styleObj = {
    marginLeft: -50,
    fontSize: 20,
  };

  const emailChange = (e) => {
    setEmail(e.target.value)
  }
  const [input, setInput] = useState({
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await apis
      .post(
        `auth/register`,
        {
          phoneNumber: input.phoneNo,
          email: email,
          password: input.password,
          confirmPassword: input.confirmPassword,
        },
        
      )
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          if (response.data.status === 400) {
            setLoading(false);
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
            setLoading(false);
          }
          else{
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
            setLoading(false);
            navigate("verifyemail");
          }
        }

        setLoading(false);
      })

      .catch((error) => {
        console.log("context", error);
        if (error.response.status === 422) {
          setLoading(false);
          toast.error("Please fill all required fields", {
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
        } else if (error.response.status === 422) {
          toast.error("Please fill all the required fields", {
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
        setLoading(false);
      });
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "phoneNo":
          if (!value) {
            stateObj[name] = "Please input your Phone Number.";
          }
          break;
        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] = "Passwords do not match.";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword;
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
  return (
    <>
      <div>
        <ToastContainer />
        <div className="">
          <div className=" ">
            <div className="card-body">
              <div className="register-content ">
                <form
                  onSubmit={handleSubmit}
                  className="d-flex justify-content-center mt-3"
                >
                  <div className=" d-flex w-75 flex-column">
                    <div className=" form-floating  ">
                      <input
                        className="px-1 form-control w-100 inp fs-16px "
                        id="emailInput"
                        type="email"
                        name="email"
                        value={email}
                        onChange={emailChange}
                        placeholder="email"
                      />
                      <label
                        htmlFor="floatingInput"
                        className="p-0 d-flex align-items-center fs-16px"
                      >
                        Email address
                      </label>
                    </div>
                    <div className=" form-floating ">
                      <input
                        className="px-1 form-control w-100 inp fs-16px "
                        id="phoneInput"
                        type="tel"
                        placeholder="Phone Number"
                        name="phoneNo"
                        value={input.phoneNo}
                        onChange={onInputChange}
                        onBlur={validateInput}
                      />
                      <label
                        htmlFor="floatingInput"
                        className="p-0 d-flex align-items-center fs-16px"
                      >
                        Phone Number <span className="text-danger"> *</span>
                      </label>
                    </div>
                    {error.phoneNo && (
                      <span className="text-danger">{error.phoneNo}</span>
                    )}
                    <div className=" form-floating d-flex align-items-center justify-content-between">
                      <input
                        className="px-1 form-control w-100 inp fs-16px "
                        id="passwordInput"
                        type={inputType}
                        placeholder="Password"
                        name="password"
                        value={input.password}
                        onChange={onInputChange}
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
                    {error.password && (
                      <span className="text-danger">{error.password}</span>
                    )}
                    <div className=" form-floating d-flex align-items-center justify-content-between">
                      <input
                        className="px-1 form-control w-100 inp fs-16px "
                        id="confirmInput"
                        type={inputType}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={input.confirmPassword}
                        onChange={onInputChange}
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
                        Confirm Password <span className="text-danger"> *</span>
                      </label>
                    </div>
                    {error.confirmPassword && (
                      <span className="text-danger">
                        {error.confirmPassword}
                      </span>
                    )}
                    <div className=" mt-30px">
                      <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} />
                    </div>
                    <div className="mt-3 fs-14px">
                      By continuing, you agree to Revbill{" "}
                      <Link to="/" className="text-primary">
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link to="/" className="text-primary">
                        Privacy Policy
                      </Link>
                    </div>{" "}
                    <div className=" d-flex ">
                      {" "}
                      <button
                        className="w-full my-4 p-3 fs-16px bg-blue-900 d-flex justify-content-center rounded border-0 text-white"
                        type="submit"
                      >
                        {loading ? <Spinner /> : "Register"}
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="fs-14px">
                        Already have an account? <Link to="/login">Login</Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelfRegistration;
