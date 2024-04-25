import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { apis, attachment } from "../../../axios/custom";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import { AppSettings } from "../../../config/app-settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ReactCrop, {Crop} from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

const ViewOrganisation = () => {
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  // const [crop, setCrop] = useState(Crop)
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [organisationData, setOrganisationData] = useState([]);
  const [logo, setLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const token = sessionStorage.getItem("myToken");
  const [logoName, setLogoName] = useState("");
  const [backgroundName, setBackgroundName] = useState("");
  const [organisationName, setOrganisationName] = useState(".");
  const [email, setEmail] = useState(".");
  const [address, setAddress] = useState(".");
  const [phone, setPhone] = useState(".");
  const [validateForm, setValidateForm] = useState(true);

  const navigate = useNavigate();

  // console.log("organisationData is--", organisationData);

  const code = {
    agencyCode: "",
    // revenueCode: "",
    url: "",
  };
  const [input, setInput] = useState(code);


  const fetchOrganisationData = async () => {
    await api
      .get(`organisation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrganisationData(response.data);
        console.log("response data is",response.data)
        const logoUrl = `data:image/png;base64,${response.data.logoData}`;
        const backgroundLogo = `data:image/png;base64,${response.data.backgroundImagesData}`;
        setLogo(logoUrl);
        setBackgroundImage(backgroundLogo);
        setLogoName(response.data.logoName);
        setBackgroundName(response.data.backgroundImagesName);
        setOrganisationName(response.data.organisationName);
        setEmail(response.data.email);
        setAddress(response.data.address);
        setPhone(response.data.phoneNo);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }

    setLogoName(file.name);
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    setBackgroundName(file.name);
  };
  useEffect(() => {
    fetchOrganisationData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const [agencyCodeError, setAgencyCodeError] = useState("");
  const validateAgencyCode = () => {
    let error = "";

    if(!input.agencyCode){
      error = "Agency Code is required!";
    } else if(input.agencyCode.trim().length === 0){
      error ="Enter Agency Code";
    }

    return error;
  }

  const verifyAgencyCode = async () => {
    try {
      const response = await apis.post(`enumeration/${input.agencyCode}/verify-agencycode`, "", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.status === 200) {
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
  
        return true;
      }
  
      if (response.data.status === 404) {
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
  
        return false;
      }
    } catch(error) {
      if (error.response && error.response.data && error.response.data.statusMessage) {
        toast.error(error.response.data.statusMessage, {
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
        toast.error("An error occurred while verifying the agency code.", {
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
  
      return false;
    }
  }
  

  const submitHandler = async (e) => {
    e.preventDefault();
  
    const agencyError = validateAgencyCode();
    setAgencyCodeError(agencyError);
  
    if (agencyError.length === 0) {
      setLoading(true);
      const formData = new FormData();
      formData.append("countryId", 149);
      formData.append("payerId", organisationData.payerId);
      formData.append("OrganisationName", organisationData.organisationName);
      formData.append("address", organisationData.address);
      formData.append("stateId", organisationData?.stateId);
      formData.append("City", organisationData?.city);
      formData.append("lgaId", organisationData?.lgaId);
      formData.append("lcdaId", organisationData?.lcdaId);
      formData.append("phoneNo", organisationData?.phoneNo);
      formData.append("email", organisationData?.email);
      formData.append("logo", logo);
      formData.append("logoName", logoName);
      formData.append("AgencyCode", input.agencyCode);
      // formData.append("RevenueCode", code.revenueCode);
      formData.append("backgroundImage", backgroundImage);
      formData.append("backgroundImagesName", backgroundName);
      formData.append("dateCreated", new Date().toISOString());
      formData.append("ModifiedBy", userData[0]?.email);
  
      const isAgencyVerified = await verifyAgencyCode();
  
      if (isAgencyVerified) {
        try {
          const response = await attachment.post(`organisation/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200) {
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
          }
  
          await apis.post(`organisation/approve-onboarding-request/${id}/agency/${input.agencyCode}`, "", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          toast.success("Onboarding request approved successfully.", {
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
            navigate("../");
          }, 3000);
        } catch (error) {
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
        }
      }
      setLoading(false);
    }
  };
  

  return (
    <>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/dashboard">Home</Link>
        </li>
        <li className="breadcrumb-item">Administration</li>
        <li className="breadcrumb-item active">Organisations </li>
      </ol>
      <h1 className="page-header mb-3">
        View Details for {organisationData.organisationName}
      </h1>
      <hr />

      <form onSubmit={submitHandler} className="shadow-lg p-3">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <ToastContainer />

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                    value={organisationName}
                    name="organisationName"
                    disabled
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
                    value={email}
                    name="email"
                    disabled
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
                    value={address}
                    disabled
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
                    value={phone}
                    disabled
                    name="phoneNo"
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-4">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Organisation URL
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter URL"
                    value={input.url}
                    name="url"
                    onChange={handleChange}
                    className=" px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* <div className="col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Revenue Code
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Enter Revenue Code"
                    value={input.revenueCode}
                    onChange={handleChange}
                    name="revenueCode"
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div> */}
              <div className="col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Agency Code
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    placeholder="Enter Agency Code"
                    value={input.agencyCode}
                    onChange={handleChange}
                    name="agencyCode"
                    className="px-1.5 block w-full rounded-md border py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {agencyCodeError.length > 0 && <p className="text-red-400 text-sm">{agencyCodeError}</p>}
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
                        {organisationData && (
                          <img src={logo} alt="Logo Image" />
                        )}

                        <input
                          id="file"
                          accept="image/*"
                          type="file"
                          className=""
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 1MB
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
                        {organisationData && (
                          <img src={backgroundImage} alt="Background Image" />
                        )}

                        <input
                          id="file"
                          accept="image/*"
                          onChange={handleBackgroundUpload}
                          type="file"
                        />
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 1MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md btn btn-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? <Spinner /> : "Update Organisation and Approve"}
          </button>
        </div>
        {/* <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalAlert"
                    className="btn bg-primary p-2 text-white"
                    type="submit"
                    disabled={validateForm}
                  >
                    {validateForm
                      ? "Disabled, Please Fill Necessary Details"
                      : "Continue Enumeration"}
                  </button>
                </div> */}
        <button
        style={{ marginTop: "-35px" }}
        className="btn shadow-md bg-blue-900 text-white"
        type="button"
        onClick={() => window.history.back()}
      >
        Back
      </button>
      </form>
    </>
  );
};

export default ViewOrganisation;