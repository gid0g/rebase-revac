import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./selfservicecontext";
import apis from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

const UserForm = () => {
  const [loading, setLoading] = useState(false);
  const { email, setPhone, handleEmailChange, error, validateInput } =
    useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apis
      .get(`customer/email/${email}`)
      .then((response) => {
        console.log("response", response);
        if (response.data) {
          setLoading(false);
          setPhone(response.data.phoneNo);
          toast.success("Email Address Found", {
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
        setTimeout(() => {
          navigate("/selfregistration");
        }, 1000);
        setLoading(false);
      })

      .catch((error) => {
        console.log("context", error);
        if (error.message) {
          // setData(response.data.data);
          setLoading(false);
          toast.error("Email Not found, Please contact your Organisation", {
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
    <>
      <div className=" p-3 my-5 bg-white rounded ">
        <h3 className="text-center py-4">Create A New Account</h3>
        <form onSubmit={handleSubmit}>
          <div className=" d-flex align-items-center flex-column">
            <div className="form-floating w-75">
              {error.email && (
                <span className="text-danger">{error.email}</span>
              )}
              <input
                className=" px-1 form-control w-100 inp fs-16px "
                id="emailInput"
                type="email"
                value={email}
                onChange={handleEmailChange}
                name="email"
                placeholder="name@example.com"
                onBlur={validateInput}
              />
              <label
                htmlFor="floatingInput"
                className=" p-0 d-flex align-items-center fs-16px"
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
                {loading ? <Spinner /> : "Get Started"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default UserForm;
