import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { attachment } from "../../../axios/custom";
import Select from "react-select";
import "react-activity/dist/library.css";
import { ToastContainer, toast } from "react-toastify";

import { PhotoIcon } from "@heroicons/react/24/solid";

const OrganisationData = {
  payerId: "",
  organisationName: "",
  email: "",
  address: "",
  phoneNo: "",
};
const CreateNewOrganisation = () => {
  const [isOn, setIsOn] = useState(false);
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [lgas, setLgas] = useState([]);
  const [selectedLga, setSelectedLga] = useState("");
  const [lcdas, setLcdas] = useState([]);
  const [selectedLcda, setSelectedLcda] = useState("");
  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [userInput, setUserInput] = useState(OrganisationData);
  const token = sessionStorage.getItem("myToken");

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleStateChange = (selectedState) => {
    const stateId = selectedState.value;
    setSelectedState(stateId);
  };
  const handleLcdaChange = (selectedLcda) => {
    setSelectedLcda(selectedLcda.value);
  };
  const handleLgaChange = (selectedLga) => {
    setSelectedLga(selectedLga.value);
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = (e) => {
      setFileUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const transformedStateData = state
    ? state.map((item) => ({
        label: item.stateName,
        value: item.id,
      }))
    : "";
  const transformedLGAData = lgas
    ? lgas.map((item) => ({
        label: item.lgaName,
        value: item.id,
      }))
    : "";
  const transformedLCDAData = lcdas
    ? lcdas.map((item) => ({
        label: item.lcdaName,
        value: item.id,
      }))
    : "";

  function submitHandler(e) {
    e.preventDefault();
    let data = new FormData();
    data.append("organisationName", "Alpha1");
    data.append("address", "Etiebet's Place,  21-22 Mobolaji Bank Anthony Way");
    data.append("city", "Lagos");
    data.append("stateId", "24");
    data.append("lgaId", "12");
    data.append("phoneNo", "07080112233");
    data.append("email", "sonugaengineer@gmail.com");
    data.append("CreatedBy", "Ayomide Sonuga")
    attachment
      .post("organisation", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
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
  }

  const handleBackgroundUpload = (event) => {
    const backgroundImage = event.target.files[0];
    setBackgroundImage(backgroundImage);
    const reader = new FileReader();
    reader.onloadend = (e) => {
      setBackgroundUrl(reader.result);
    };
    reader.readAsDataURL(backgroundImage);
  };

  // Fetch the list of states from the API and set the options for the state select element
  useEffect(() => {
    const fetchState = async () => {
      await api
        .get("enumeration/states")
        .then((response) => {
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

  //Fetch all corresponding Lgas based on the state selected
  useEffect(() => {
    const fetchLga = async () => {
      await api
        .get(`enumeration/${selectedState}/lgas`)
        .then((response) => {
      
          setLgas(response.data);
         
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
    if (selectedState) {
      fetchLga();
    } else {
      setLgas([]);
      setSelectedLga("");
    }
  }, [selectedState]);

  //Fetch all corresponding Lcdas based on Lgs selected
  useEffect(() => {
    const fetchLcda = async () => {
      await api
        .get(`enumeration/${selectedLga}/lcdas`)
        .then((response) => {
          // console.log("fetched lcdas------", response.data);
          setLcdas(response.data);
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
    if (selectedLga) {
      fetchLcda();
    } else {
      setLcdas([]);
      setSelectedLcda("");
    }
  }, [selectedLga]);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/home/Homepage">Home</Link>
        </li>
        <li className="breadcrumb-item">
            <Link to="/home/administration/organisation">Administration</Link>
        </li>
        <li className="breadcrumb-item active">Organisations </li>
      </ol>
      <h1 className="page-header mb-3">Organisations</h1>
      <hr />

      <form onSubmit={submitHandler} className="shadow-lg p-3">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            {/* <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a valid email address where you can receive mail.
            </p> */}

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-4">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Organisation Payer ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter PayerID"
                    value={userInput.payerId}
                    name="payerId"
                    onChange={handleChange}
                    className=" px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Verify Payer ID
                </label>
                <div className="mt-2">
                  <button
                    name="first-name"
                    className=" btn btn-primary text-white block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    Verify Payer Id
                  </button>
                </div>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Organisation Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter Organization Name"
                    value={userInput.organisationName}
                    name="organisationName"
                    onChange={handleChange}
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Enter Email Address"
                    value={userInput.email}
                    name="email"
                    onChange={handleChange}
                    type="email"
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Enter Corporate Address"
                    value={userInput.address}
                    onChange={handleChange}
                    name="address"
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={userInput.phoneNo}
                    onChange={handleChange}
                    name="phoneNo"
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 ">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  State
                </label>
                <div className="mt-2">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select State"
                    name="color"
                    options={transformedStateData}
                    onChange={handleStateChange}
                  />
                </div>
              </div>
              <div className="sm:col-span-2 ">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  LGA
                </label>
                <div className="mt-2">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select Lga"
                    name="color"
                    options={transformedLGAData}
                    onChange={handleLgaChange}
                  />
                </div>
              </div>{" "}
              <div className="sm:col-span-2 ">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  LCDA
                </label>
                <div className="mt-2">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue="Select Lcda"
                    name="color"
                    options={transformedLCDAData}
                    onChange={handleLcdaChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Logo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                      >
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        {/* <span>Upload a file or drag and drop</span> */}
                        <input
                          id="file"
                          accept="image/*"
                          type="file"
                          // className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Background Image
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                      >
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        {/* <span>Upload a file or drag and drop</span> */}
                        <input
                          id="file"
                          accept="image/*"
                          onChange={handleBackgroundUpload}
                          type="file"
                          // className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Status
                </legend>

                <div className="mt-6 d-flex ">
                  <div className="inline relative w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="toggle"
                      id="toggle"
                      role="switch"
                      className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                      checked={isOn}
                      onChange={handleToggle}
                    />
                    <span htmlFor="toggle" className="">
                      {isOn ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md btn btn-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateNewOrganisation;
