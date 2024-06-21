import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../axios/custom";
import { useSelector } from "react-redux";

const SearchPayId = () => {
  const [value, setValue] = useState("...");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [validityChecked, setValidityChecked] = useState(false);
  const [formShow, setFormShow] = useState(false);
  const [data, setData] = useState([]);
  console.log(data);

  const state = useSelector((state) => state);
  // let user = state.authReducer.user;
  const token = sessionStorage.getItem("myToken");
  console.log("tokennnn", token);

  const handleNameChange = (event) => {
    setInput(event.target.value);
  };

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setFormShow(true);
    setLoading(false);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    switch (value) {
      case "Name":
        searchByName();
        break;
      case "Email":
        searchByEmail();
        break;
      case "Phone":
        searchByPhone();
        break;
    }
  };

  const searchByName = async (e) => {
    setLoading(true);
    setData([]);
    await api
      .post(
        `enumeration/pid-search-by-name`,
        {
          param: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.data) {
          if (response.data.status === 200) {
            setData(response.data.data);
            setValidityChecked(true);
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
        } else {
          toast.error(
            response.data.statusMessage
              ? response.data.statusMessage
              : "Something went wrong.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("error--", error);
        if (error.response) {
          if (error.response.status === 422) {
            toast.error(error.response.data.Param[0], {
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
          } else {
            toast.error(error.response.statusText, {
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
  const searchByEmail = async (e) => {
    setLoading(true);
    setData([]);
    await api
      .post(
        "enumeration/pid-search-by-email",

        {
          param: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.data) {
          if (response.data.status === 200) {
            const results = response.data.data;
            setLoading(false);
            setData([results]);
            setValidityChecked(true);
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
        } else {
          toast.error(
            response.data.statusMessage
              ? response.data.statusMessage
              : "Something went wrong.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          setLoading(false);
        }
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 401) {
          toast.error(
            `${error.response.statusText}, Your session timed out, please login`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
        if (error.response.status === 422) {
          toast.error(error.response.data.Param[0], {
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
      });
  };
  const searchByPhone = async (e) => {
    setLoading(true);
    await api
      .post(
        "enumeration/pid-search-by-phonenumber",
        {
          param: input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.data) {
          if (response.data.status === 200) {
            const results = response.data.data;
            setLoading(false);
            setData([results]);
            setValidityChecked(true);
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
        } else {
          setLoading(false);
          toast.error(
            response.data.statusMessage
              ? response.data.statusMessage
              : "Something went wrong.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          setLoading(false);
        }
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 401) {
          toast.error(
            `${error.response.statusText}, Your session timed out, please login`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
        if (error.response.status === 422) {
          toast.error(error.response.data.Param[0], {
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
      });
  };

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/enumeration">Enumeration</Link>
        </li>
        <li className="breadcrumb-item active">Search Payer Id </li>
      </ol>

      <h1 className="page-header mb-3">Search Payer ID</h1>
      <hr></hr>
      <ToastContainer />
      <div className="d-flex my-4 ">
        <h4 className="mr-4"> Search By:</h4>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="searchpayerId"
            id="1"
            value="Name"
            onChange={handleRadioChange}
          />
          <label className="form-check-label" htmlFor="inlineRadio1">
            By Name
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="searchpayerId"
            id="2"
            value="Email"
            onChange={handleRadioChange}
          />
          <label className="form-check-label" htmlFor="inlineRadio2">
            By Email Address
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="searchpayerId"
            id="3"
            value="Phone"
            onChange={handleRadioChange}
          />
          <label className="form-check-label" htmlFor="inlineRadio3">
            By Phone Number{" "}
          </label>
        </div>
      </div>
      {formShow && (
        <div>
          <div className="d-flex justify-content-center">
            <div className="shadow-sm rounded w-50 my-2 px-4 py-2 d-flex flex-column justify-content-center">
              <form onSubmit={searchHandler}>
                <div className="">
                  <h4 className="mb-2 form-label">Search PayerId</h4>
                  <div className="row gx-3">
                    <div className=" mb-2 mb-md-0">
                      <input
                        autoFocus
                        type="text"
                        className="form-control form-control-lg p-2 d-flex align-items-center fs-16px"
                        placeholder=""
                        value={input}
                        name="input"
                        onChange={handleNameChange}
                        //   required
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary my-2">
                      {" "}
                      {loading ? <Spinner /> : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {data.map((result, idx) => (
            <div
              key={idx}
              style={
                idx % 2 !== 0
                  ? { backgroundColor: "#348fe2", color: "white" }
                  : {}
              }
              className="border shadow-lg p-3 mt-3 mb-4 d-flex flex-column"
            >
              <fieldset>
                <div className="row  align-items-center">
                  {result.title && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.title}
                        />
                      </div>
                    </div>
                  )}
                  {result.sex && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Sex</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.sex}
                        />
                      </div>
                    </div>
                  )}

                  {result.nationality && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Nationality</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.nationality}
                        />
                      </div>
                    </div>
                  )}
                  {result.maritalStatus && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Marital Status</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.maritalStatus}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {result.fullName && (
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={result.fullName}
                    />
                  </div>
                )}
                {result.address && (
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      className="form-control"
                      type="text"
                      disabled
                      value={result.address}
                    />
                  </div>
                )}
                <div className="row  align-items-center">
                  {result.email && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.email}
                        />
                      </div>
                    </div>
                  )}
                  {result.corporateID && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Corporate ID</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.corporateID}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="row  align-items-center">
                  {result.gsm && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.gsm}
                        />
                      </div>
                    </div>
                  )}
                  {result.persID_abc && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Payer ID</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.persID_abc}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="row  align-items-center">
                  {result.bvn && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">BVN</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.bvn}
                        />
                      </div>
                    </div>
                  )}
                  {result.nin && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">NIN</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.nin}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="row  align-items-center">
                  {result.birthDate && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Birthdate</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.birthDate}
                        />
                      </div>
                    </div>
                  )}
                  {result.payerID && (
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">payerID</label>
                        <input
                          className="form-control"
                          type="text"
                          disabled
                          value={result.payerID}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchPayId;
