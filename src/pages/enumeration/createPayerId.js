import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api, { apis } from "../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { AppSettings } from "../../config/app-settings";


const payerTypes = [
  { value: "", label: "-- Select a Payer Type --" },
  { value: "1", label: "Individual" },
  { value: "2", label: "Corporate Payer Id" },
];

const CreatePayId = () => {
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const [payerType, setPayerType] = useState("");
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
  const [data, setData] = useState({});

  const [sex, setSex] = useState([]);
  const [sexOption, setSexOption] = useState("");

  const [state, setState] = useState([]);
  const [stateOption, setStateOption] = useState("");

  const [dob, setDob] = useState();
  console.log("value", input);

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
  // console.log(type);
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

  const handleStateOption = (event) => {
    setStateOption(event.target.value);
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
    const fetchData = async () => {
      try {
        const [genderResponse, maritalStatusResponse, payerTypesResponse, titlesResponse] = await Promise.all([
          api.get(`enumeration/genders`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`enumeration/marital-statuses`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`enumeration/payer-types`, { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`enumeration/titles`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
    
        setSex((prevSex) => genderResponse.data);
        setMaritalStatus((prevMaritalStatus) => maritalStatusResponse.data);
        setType((prevType) => payerTypesResponse.data);
        setTitle((prevTitle) => titlesResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchState = async () => {
      await apis
        .get("enumeration/states")
        .then((response) => {
          // console.log("States:", response?.data);
          setState(response.data);
        })
        .catch((error) => {
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
    fetchState();
  }, []);


  const checkGender = (gender) => {
    let genderId = 0;
    if (gender && gender === "M") {
      genderId = 1;
    } else if (gender && gender === "F") {
      genderId = 2;
    }
    return genderId;
  };

  const checkTitle = (title) => {
    let titleId = 0;

    if (
      (title && title?.toLowerCase() === "mr") ||
      (title && title?.toLowerCase() === "mr.") ||
      (title && title?.toLowerCase() === "master") ||
      (title && title?.toLowerCase() === "mas")
    ) {
      titleId = 1;
    } else if (
      (title && title?.toLowerCase() === "mrs.") ||
      (title && title?.toLowerCase() === "mrs") ||
      (title && title?.toLowerCase() === "miss") ||
      (title && title?.toLowerCase() === "miss.")
    ) {
      titleId = 2;
    }

    else {
      titleId = 2
    }

    return titleId;
  };


  const checkMaritalDtoStatus = (maritalStatus) => {
    let maritalId = 0;
    if (maritalStatus
      && maritalStatus
      === "M") {
      maritalId = 1
    } else if (maritalStatus
      && maritalStatus
      === "S") {
      maritalId = 2;
    }

    return maritalId
  };
  const checkPayerType = (payerId) => {
      let payerTypeId = 0;
    if (payerId ? payerId.charAt(0) === "N" : "N") {
      payerTypeId = 1;
    } else if (payerId ? payerId.charAt(0) === "C" : "C") {
      payerTypeId = 2;
    }

    return payerTypeId;
  };

  function extractContent(inputString) {
    const regex = /\((.*?)\)/; 
    const match = inputString.match(regex);
    
    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }


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
    setLoading(true);

    const formData = {
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
    }

    console.log("FormData:", formData);

    await api
      .post(
        "enumeration/create-pid-nin",
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
        console.log("NIN:", response.data);
        if (response.data.data) {
          if (response.data.status === 200) {
            console.log("Creation with Bio Data", response.data);
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
            theme: "light",
          });
        }
      }).finally(() => {
        setLoading(false);
      });
  };
  const submitBvn = async () => {
    setLoading(true);
    try {
        const formDataTosend = {
          Type: typeOption,
          Title: titleOption,
          Hash: "",
          Sex: sexOption,
          LastName: input.lastName,
          FirstName: input.firstName,
          MiddleName: input.middleName,
          MaritalStatus: maritalOption,
          DateOfBirth: dob,
          PhoneNumber: input.phoneNo,
          Email: input.email,
          Address: input.address,
          BVNNumber: input.bvn,
          UserPID: input.pid,
          State: stateOption
      }


      const response = await api.post('enumeration/create-pid-bvn', formDataTosend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if(response.data?.data){
        if(response.data.status === 200){
          console.log("Creation with BVN", response.data);
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
    } catch(error) {
      console.log("Error:", error);


      if (error.response.status === 422) {
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
    } finally {
      setLoading(false);
    }


  };
  const submitBiodata = async () => {
    setLoading(true);

    const formData = {
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
    }

    console.log("FormData:", formData);
    await api
      .post(
        "enumeration/create-pid-biodata",
        {
          type: typeOption,
          title: titleOption,
          hash: "string",
          clientId: "string",
          sex: sexOption,
          lastName: input.lastName,
          firstName: input.firstName,
          otherName: input.middleName,
          maritalStatus: maritalOption,
          dateOfBirth: dob,
          phone: input.phoneNo,
          email: input.email,
          address: input.address,
          state: stateOption,
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
            console.log("Creation with Bio Data", response.data);
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
            theme: "light",
          });
        }
      }).finally(() => {
        setLoading(false);
      });
  };


  const createCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Data::", data);

    try {
      const response = await api.post(`/customer/${organisationId}`, {
        payerTypeId: checkPayerType(data?.payerID),
        payerId: data?.payerID,
        titleId: checkTitle(data?.title),
        corporateName: data?.corporateName,
        firstName: data?.firstName ? data?.firstName : data?.corporateName,
        lastName: data?.lastName ? data.lastName : data?.corporateName,
        middleName: data?.middleName,
        genderId: checkGender(data?.sex),
        maritalStatusId: checkMaritalDtoStatus(data?.maritalstatus),
        address: data?.address,
        email: data?.email,
        phoneNo: data?.gsm,
        suppliedPID: true,
        dateCreated: new Date().toISOString(),
        createdBy: userData[0].email,
      },         
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Message:", response?.data);
  
      if(response?.data?.status == 200) {
          toast.success(response.data?.statusMessage, {
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

      if(response?.data?.status == 409) {
        toast.error(response.data?.statusMessage, {
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

    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response?.data;
  
        if (typeof errorData === 'string') {

          toast.error(errorData, {
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

          const flatErrors = Object.entries(errorData).flatMap(([key, value]) => {
            if(typeof value != Array) return value?.map((message) => `${key}: ${message}`);
          });
  
          const errorMessage = flatErrors.join('\n');
  
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
        }
      } else {
        // Handle other types of errors here
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  
  const handlePayerTypeChange = (selectedPayer) => {
    console.log("Selected Payer:", selectedPayer);
    setPayerType(selectedPayer.value);

    setValue("...");
    setShowNin(false);
    setShowBvn(false);
    setShowBiodata(false);
    setLoading(false);
    setShowForm(false);
    setType([]);
    setTypeOption("");
    setTitle([]);
    setTitleOption("");
    setGeneratedPid("");
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
    setMaritalStatus([]);
    setMaritalOption("");
    setData({});
    setSex([]);
    setSexOption("");
    setState([]);
    setStateOption("");
    setDob();
  }

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
      <div className="col-span-6 mb-3">
        <label className=" block text-lg font-bold leading-6 text-gray-900">
          Payer Type:
        </label>
        <div className="flex mt-2 ">
          <Select
            className="basic-single w-25"
            classNamePrefix="Please Select Payer Type"
            defaultValue={payerTypes[0]}
            options={payerTypes}
            onChange={handlePayerTypeChange}
          />
        </div>
      </div>

      {payerType === "1" && (
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
      )}
      {generatedPid && (
        <div className="mb-3 shadow bg-info text-white p-3 text-lg">
          {generatedPid}
        </div>
      )}

      {payerType === "1" && (
        <div className="shadow">
          {showForm && (
            <form onSubmit={submitHandler}>
              <div className="p-4">
                <h5>Personal Information</h5>
                <hr />
                <div className="mb-4 row gx-4">
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                        {console.log(maritalStatus)}

                        {maritalStatus.map((marital, idx) => (
                          <option key={idx} value={marital.maritalStatusCode}>
                            {marital.maritalStatusName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                      <label className="form-label" htmlFor="exampleInputEmail1">
                        First Name
                      </label>
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
                      <label className="form-label" htmlFor="exampleInputEmail1">
                        Middle Name
                      </label>
                      <input
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Middle Name"
                        value={input.middleName}
                        name="middleName"
                        onChange={handleInputChange}
                        
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="exampleInputEmail1">
                        Last Name
                      </label>
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

                <div className="row gx-4">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="exampleInputEmail1">
                        State
                      </label>
                      <select
                        className="form-control"
                        value={stateOption}
                        onChange={handleStateOption}
                      >
                        <option value="">Select State</option>
                        {state.map((item, i) => (
                          <option key={i} value={item.stateName}>
                            {item.stateName}
                          </option>
                        ))}
                      </select>
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
      )}
    </>
  );
};

export default CreatePayId;
