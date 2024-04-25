import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import apis from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./onboardingcontext";

const HavePayerId = () => {
  const [havePayerId, setHavePayerID] = useState(false);
  const [payId, setPayId] = useState("");
  const { message, loading, setLoading, setMessage, setPayerIdData } =
    useContext(Context);

  const submitCorporatePayerId = async (e) => {
    setLoading(true);
    e.preventDefault();
    await apis
      .post(`enumeration/verify-pid`, {
        payerId: payId,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setLoading(false);
          if (response.data.status === 200) {
            setMessage(response.data.statusMessage);
            console.log("hufdef", response.data.data);
            setPayerIdData(response.data.data);
            toast.success(response.data.statusMessage, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setTimeout(() => {
              if (
                response.data.statusMessage.toLowerCase() ===
                "payerid record found"
              ) {
                navigate("form");
              } else return;
            }, 2000);
          } else if (response.data.status === 404) {
            setMessage(response.data.statusMessage);
            console.log("hufdef", response.data.data);
            setPayerIdData(response.data.data);
            toast.error(response.data.statusMessage, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        if (error.response) {
          if (error.response.status === 422) {
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
          } else {
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
          }
        } else
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
      });
  };
  const handleClick = () => {
    setHavePayerID(true);
  };
  const handlePayerIdChange = (e) => {
    const inputValue = e.target.value;
    // Apply the mask logic here
    const maskedValue = applyInputMask(inputValue);
    setPayId(maskedValue);
  };
  const applyInputMask = (value) => {
    // Define your input mask logic here
    // For example, let's say you want to enforce a format like C-999999999999
    // where C is a constant and 9 represents a numeric digit
    const constantPart = "C-";
    const numericPart = value.replace(/\D/g, "").slice(0, 12);
    return constantPart + numericPart;
  };
  const navigate = useNavigate();
  const handleNotAvalilable = (e) => {
    e.preventDefault();
    navigate("createCorporatePayerId");
  };

  return (
    <>
      <div className="modal-body">
        <div className=" mt-4">
          <div className="d-flex justify-content-center">
            <div className="header w-75 mt-3">
              <h6 className="d-flex justify-content-center text-lg">
                Do you have a Corporate Payer Id?
              </h6>
              <ToastContainer />
              <div className="d-flex justify-content-center mt-4 mb-5">
                <button
                  className="btn bg-blue-900 text-white mx-2"
                  onClick={handleClick}
                >
                  Yes
                </button>
                <button onClick={handleNotAvalilable} className="btn btn-white">
                  No
                </button>
              </div>
            </div>
          </div>

          {havePayerId && (
            <div className="d-flex justify-content-center">
              <div className=" w-75">
                <form onSubmit={submitCorporatePayerId}>
                  <div className="col-md-12">
                    <div className="form-floating mb-3 mb-md-0 d-flex">
                      <input
                        className="form-control w-75"
                        value={payId}
                        onChange={handlePayerIdChange}
                      />

                      <button
                        type="submit"
                        className="px-5 bg-blue-900 text-white"
                      >
                        {loading ? <Spinner /> : "Submit"}
                      </button>
                    </div>
                  </div>
                </form>
                {message ? (
                  <div className="text-success mt-2">{message}</div>
                ) : (
                  ""
                )}
                <div className="d-flex flex-column flex-lg-row my-2 justify-content-between">
                  <div className="label">
                    <span className="text-sm">Don't have a Payer Id?</span>{" "}
                    <Link
                      className="text-decoration-none text-blue-900 text-sm"
                      to="createCorporatePayerId"
                    >
                      Create One
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HavePayerId;
