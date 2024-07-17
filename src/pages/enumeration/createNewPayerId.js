import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppSettings } from "../../config/app-settings";

const CreateNewPayerId = () => {
  const token = sessionStorage.getItem("myToken");
  const navigate = useNavigate();
  const [value, setValue] = useState("...");
  const [showNin, setShowNin] = useState(false);
  const [showBvn, setShowBvn] = useState(false);
  const [showBiodata, setShowBiodata] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState([]);
  const [typeOption, setTypeOption] = useState("");
  const [title, setTitle] = useState([]);
  const [titleOption, setTitleOption] = useState("");
  const [generatedPid, setGeneratedPid] = useState("");
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNo: "",
    nin: "",
    bvn: "",
    pid: "",
    address: "",
  });
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [maritalOption, setMaritalOption] = useState("");

  const [sex, setSex] = useState([]);
  const [sexOption, setSexOption] = useState("");
  const organisationId = sessionStorage.getItem("organisationId");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;

  const [dob, setDob] = useState();

  const showNinForm = (event) => {
    setValue(event.target.value);
    setShowNin(true);
    setShowBvn(false);
    setShowForm(true);
    setShowBiodata(false);
  };
  const showBvnForm = (event) => {
    setValue(event.target.value);
    setShowBvn(true);
    setShowNin(false);
    setShowForm(true);
    setShowBiodata(false);
  };
  const showBiodataForm = (event) => {
    setValue(event.target.value);
    setShowBvn(false);
    setShowNin(false);
    setShowForm(true);
    setShowBiodata(true);
  };
  const handleTypeChange = (event) => {
    setTypeOption(event.target.value);
  };
  const handleTitleChange = (event) => {
    setTitleOption(event.target.value);
  };
  const handleMaritalOption = (event) => {
    setMaritalOption(event.target.value);
  };
  const handleSexOption = (event) => {
    setSexOption(event.target.value);
  };
  const changeDob = (event) => {
    setDob(event.target.value);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput({
      ...input,
      [event.target.name]: value,
    });
  };
  useEffect(() => {
    api
      .get(`enumeration/payer-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setType(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .get(`enumeration/titles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTitle(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .get(`enumeration/genders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSex(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .get(`enumeration/marital-statuses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMaritalStatus(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    switch (value) {
      case "Nin":
        submitNin();
        break;
      case "Bvn":
        submitBvn();
        break;
      case "Biodata":
        submitBiodata();
        break;
    }
  };
  const submitNin = async () => {
    // e.preventDefault();
    await api
      .post(
        "enumeration/createPidNin",
        {
          PhoneNumber: input.phoneNo,
          address: input.address,
          dateOfBirth: dob,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          middleName: input.middleName,
          maritalStatus: maritalOption,
          sex: sexOption,
          title: titleOption,
          type: typeOption,
          userPID: input.pid,
          NINNumber: input.nin,
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
            console.log(response.data);
            toast.success(response.data.data.statusMessage, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setInput({
              firstName: "",
              lastName: "",
              middleName: "",
              email: "",
              phoneNo: "",
              nin: "",
              bvn: "",
              pid: "",
              address: "",
            });
            setGeneratedPid(response.data.data.pid);
            setTimeout(() => {
              navigate("/businessprofile");
            }, 2000);
          } else {
            toast.error(response.data.data.statusMessage, {
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
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          setLoading(false);
          toast.error("please fill all required fields", {
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
        if (error.response.status === 500) {
          setLoading(false);
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
        }
      });
  };
  const submitBvn = async () => {};
  const submitBiodata = async () => {
    await api
      .post(
        "enumeration/createPid",
        {
          Phone: input.phoneNo,
          address: input.address,
          dateOfBirth: dob,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          middleName: input.middleName,
          maritalStatus: maritalOption,
          sex: sexOption,
          title: titleOption,
          type: typeOption,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);

        if (response.data.data) {
          if (response.data.status === 200) {
            console.log(response.data);
            toast.success(response.data.data.statusMessage, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setInput({
              firstName: "",
              lastName: "",
              middleName: "",
              email: "",
              phoneNo: "",
              nin: "",
              bvn: "",
              pid: "",
              address: "",
            });
            setGeneratedPid(response.data.data.pid);
          } else {
            toast.error(response.data.data.statusMessage, {
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
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          setLoading(false);
          toast.error("please fill all required fields", {
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
        if (error.response.status === 500) {
          setLoading(false);
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
        }
      });
    // setInput({
    //   firstName: "",
    //   lastName: "",
    //   middleName: "",
    //   email: "",
    //   phoneNo: "",
    //   nin: "",
    //   bvn: "",
    //   pid: "",
    //   address: "",
    // });
  };
  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/Enumeration">Enumeration</Link>
        </li>
        <li className="breadcrumb-item active">Create Payer Id </li>
      </ol>
      <ToastContainer />
      <h1 className="page-header mb-3">Create Payer Id</h1>
      <hr />
      <div className="d-flex my-5">
        <h4 className="mr-4"> Create With:</h4>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio1"
            value="Nin"
            onChange={showNinForm}
          />
          <label className="form-check-label" htmlFor="inlineRadio1">
            NIN
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio2"
            value="Bvn"
            onChange={showBvnForm}
          />
          <label className="form-check-label" htmlFor="inlineRadio2">
            BVN
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="inlineRadio3"
            value="Biodata"
            onChange={showBiodataForm}
          />
          <label className="form-check-label" htmlFor="inlineRadio3">
            BioData
          </label>
        </div>
      </div>

      <div className="shadow">
        {showForm && (
          <form onSubmit={submitHandler}>
            <div className="p-4">
              <h5>Personal Information</h5>
              <hr />
              <div className="mb-4 row gx-4">
                <div className="col-2">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Type
                    </label>
                    <select
                      className="form-control"
                      value={typeOption}
                      onChange={handleTypeChange}
                    >
                      <option value="">Select Type</option>
                      {type.map((types, idx) => (
                        <option key={idx} value={types.payerTypeCode}>
                          {types.payerTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Title
                    </label>
                    <select
                      className="form-control"
                      value={titleOption}
                      onChange={handleTitleChange}
                    >
                      <option value="">Select Title</option>
                      {title.map((titles, idx) => (
                        <option key={idx} value={titles.titleCode}>
                          {titles.titleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Marital Status
                    </label>
                    <select
                      className="form-control"
                      value={maritalOption}
                      onChange={handleMaritalOption}
                    >
                      <option value="">Select Marital Status</option>
                      {/* {console.log(maritalStatus)} */}

                      {maritalStatus.map((marital, idx) => (
                        <option key={idx} value={marital.maritalStatusCode}>
                          {marital.maritalStatusName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Sex
                    </label>
                    <select
                      className="form-control"
                      value={sexOption}
                      onChange={handleSexOption}
                    >
                      <option value="">Select Sex</option>
                      {sex.map((sexx, idx) => (
                        <option key={idx} value={sexx.genderCode}>
                          {sexx.genderName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-2">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Date of Birth
                    </label>
                    <input
                      autoFocus
                      type="date"
                      className="form-control"
                      placeholder="Enter Date of Birth"
                      value={dob}
                      onChange={changeDob}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row gx-4">
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      autoFocus
                      type="text"
                      className="form-control"
                      placeholder="Enter First Name"
                      value={input.firstName}
                      name="firstName"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label">Middle Name</label>
                    <input
                      autoFocus
                      type="text"
                      className="form-control"
                      placeholder="Enter Middle Name"
                      value={input.middleName}
                      name="middleName"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      autoFocus
                      type="text"
                      className="form-control"
                      placeholder="Enter Last Name"
                      value={input.lastName}
                      name="lastName"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h5>Account Information</h5>
              <hr />
              <div className="row gx-2">
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Email
                    </label>
                    <input
                      autoFocus
                      type="text"
                      className="form-control"
                      placeholder="Enter Email"
                      value={input.email}
                      name="email"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {!showBiodata && (
                  <div className="col-4">
                    <div className="mb-3">
                      <label
                        className="form-label"
                        htmlFor="exampleInputEmail1"
                      >
                        Payer Id
                      </label>
                      <input
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Payer Id"
                        value={input.pid}
                        name="pid"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
                {showNin && (
                  <div className="col-4">
                    <div className="mb-3">
                      <label
                        className="form-label"
                        htmlFor="exampleInputEmail1"
                      >
                        Nin Number
                      </label>
                      <input
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Nin"
                        value={input.nin}
                        name="nin"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
                {showBvn && (
                  <div className="col-4">
                    <div className="mb-3">
                      <label
                        className="form-label"
                        htmlFor="exampleInputEmail1"
                      >
                        Bvn Number
                      </label>
                      <input
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Bvn"
                        value={input.bvn}
                        name="bvn"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="row gx-2"></div>
            </div>
            <div className="p-4">
              <h5>Contact Information</h5>
              <hr />
              <div className="row gx-2">
                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Address
                    </label>
                    <input
                      autoFocus
                      type="text"
                      className="form-control"
                      placeholder="Enter address"
                      value={input.address}
                      name="address"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="exampleInputEmail1">
                      Phone Number
                    </label>
                    <input
                      autoFocus
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone No"
                      value={input.phoneNo}
                      name="phoneNo"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row gx-2"></div>
            </div>

            <div className="d-flex p-4 justify-content-end">
              <button type="submit" className="btn btn-primary my-2">
                {loading ? <Spinner /> : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
      {generatedPid}
    </>
  );
};

export default CreateNewPayerId;
