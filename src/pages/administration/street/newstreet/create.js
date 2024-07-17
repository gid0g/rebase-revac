import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { AppSettings } from "../../../../config/app-settings.js";
// import api from "../../../axios/custom.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import Select from "react-select";
import "react-activity/dist/library.css";
import FormWizard from "../../../enumeration/payerIdmodal.js";

import { Context } from "../../../enumeration/enumerationContext.js";
import api from "../../../../axios/custom.js";

const CreateNewStreet = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;

  const [validateForm, setValidateForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({
    spaceName: "",
    buildingNumber: "",
    locationAddress: "",
  });

  let navigate = useNavigate();

  const {
    data,
    setData,
    payID,
    setPayId,
    spaceName,
    setSpaceName,
    agencies,
    buildingNumber,
    setSpaceFloor,
    customerStatus,
    setCustomerStatus,
    selectedCustomer,
    setSelectedCustomer,
    setLocationAddress,
    ward,
    setWardOption,
    spaceIdentifier,
    setEnumerationStatus,
    setBuildingNumber,
    setspaceIdentifierOption,
    spaceFloor,
    locationAddress,
    setAgencyOption,
    wardOption,
    spaceIdentifierOption,
    agencyOption,
    submitPayerId,
    setAgencyName,
    loadingBusiness,
  } = useContext(Context);

  //constants to check for validity for forms
  const enteredSpaceNameIsValid = spaceName.trim() !== "";
  const enteredBuildingNumberIsValid = buildingNumber.trim() !== "";
  const enteredSpaceFloorIsValid = spaceFloor.trim() !== "";
  const enteredLocationAddressIsValid = locationAddress.trim() !== "";
  const selectedSpaceIdentifierOption = spaceIdentifierOption;
  const selectedWardOption = wardOption;
  const selectedAgency = agencyOption;

  const [formData, setFormData] = useState([
    {
      organisationId: 0,
      agencyId: 0,
      streetName: "",
      description: "",
      active: false,
      dateCreated: new Date().toISOString(),
      createdBy: `${userData[0]?.email}`,
    }
  ])

  //
  useEffect(() => {
    if (
      enteredSpaceNameIsValid &&
      enteredBuildingNumberIsValid &&
      enteredSpaceFloorIsValid &&
      enteredLocationAddressIsValid &&
      selectedSpaceIdentifierOption &&
      // selectedWardOption &&
      selectedAgency
    ) {
      setValidateForm(false);
    } else {
      setValidateForm(true);
    }
  }, [
    enteredSpaceNameIsValid,
    enteredBuildingNumberIsValid,
    enteredSpaceFloorIsValid,
    enteredLocationAddressIsValid,
    selectedAgency,
    selectedWardOption,
    selectedSpaceIdentifierOption,
  ]);

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "spaceName":
          if (!value) {
            stateObj[name] = "Please input Street Name.";
          }
          break;
        case "buildingNumber":
          if (!value) {
            stateObj[name] = "Please Enter the Narration";
          }
          break;
        case "spaceFloor":
          if (!value) {
            stateObj[name] = "Please Enter a digit";
          }
          break;
        case "locationAddress":
          if (!value) {
            stateObj[name] = "Please Enter an Address";
          }
          break;
        default:
          break;
      }

      return stateObj;
    });
  };

  const onFocus = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "spaceName":
          if (!value) {
            stateObj[name] = "";
          }
          break;
        case "buildingNumber":
          if (!value) {
            stateObj[name] = "";
          }
          break;
        case "spaceFloor":
          if (!value) {
            stateObj[name] = "";
          }
          break;
        case "locationAddress":
          if (!value) {
            stateObj[name] = "";
          }
          break;
        default:
          break;
      }

      return stateObj;
    });
  };

  const handleSpaceName = (event) => {
    console.log("Space:", event.target.value);
    setSpaceName(event.target.value);

    const value = event.target.value;

    setFormData((prevFormData) => [
      {
        ...prevFormData[0],
        streetName: value,
      }
    ]);

    console.log(formData);
  };
  const handleBuildingNo = (event) => {
    console.log("BuildingNo", event.target.value);
    setBuildingNumber(event.target.value);
    
  };
  const handleSpaceFloor = (event) => {
    setSpaceFloor(event.target.value);
  };
  const handleLocation = (event) => {
    setLocationAddress(event.target.value);
  };
  const handleWardChange = (wardOption) => {
    setWardOption(wardOption.value);
  };

  const handleAgencyChange = (agencyOption) => {
    setAgencyOption(agencyOption.value);
    setAgencyName(agencyOption.label);

    setFormData((prevFormData) => [
      {
        ...prevFormData[0],
        organisationId: parseInt(organisationId), 
        agencyId: agencyOption.value,
        description: agencyOption.label,
        active: true,
      }
    ]);

        
    console.log("agencyId", agencyOption);
    console.log(formData);
  };
  const handleSpaceChange = (spaceIdentifierOption) => {
    setspaceIdentifierOption(spaceIdentifierOption.value);
  };

  const transformedSpaceData = spaceIdentifier
    ? spaceIdentifier.map((item) => ({
        label: item.spaceIdentifierName,
        value: item.id,
      }))
    : "";
  const transformedWardData = ward
    ? ward.map((item) => ({
        label: item.wardName,
        value: item.id,
      }))
    : "";
  
    const transformedAgencyData = agencies
      ? agencies.map((item) => ({
          label: `${item.agencyName} / ${item.agencyCode}`,
          value: item.agencyId,
        }))
      : [];

      const handleCreateStreet = async (e) => {
        e.preventDefault();
        const formDataToSend = {
          streetCreation: formData,
        }
    
        try {
          setIsLoading(true);
          const response = await api.post(
            `enumeration/create-street`,
            formDataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if(response.data.status == 200){
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
              navigate("/home/administration/street");
            }, 2000);

            setFormData([
              {
                organisationId: 0,
                agencyId: 0,
                streetName: "",
                description: "",
                active: false,
                dateCreated: new Date().toISOString(),
                createdBy: `${userData[0]?.email}`,
              }
            ]);

            setSpaceName("");
            setBuildingNumber("");
          }
    
        } catch (error) {
          const { response } = error;
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
        } finally {
          setIsLoading(false);
        }
      };
    
     

  return (
    <AppSettings.Consumer>
      {({ cartIsShown, showModalHandler, hideModalHandler }) => (
        <div>
            <div className=" ">
              <h3 className=" mb-0">Add Street</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/home/Dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item">Administration</li>
                <li className="breadcrumb-item active"> Street Name</li>
              </ol>
            </div>
          <div className="d-flex flex-row-reverse">
        <Link
          to="/home/administration/street/createnewstreet/bulkstreetupload"
          className="btn bg-blue-900 shadow-md text-white px-4"
        >
          Bulk Street Upload
        </Link>
      </div>
          <div className="mt-5">
            <form>
              <fieldset>
                <div>
                  <div className="row gx-5">
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Area Office</label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Space Identifier"
                          isSearchable={true}
                          name="spaceIdentifier"
                          options={transformedAgencyData}
                          onChange={handleAgencyChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className=" flex flex-column mb-3 ">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Street Name
                        </label>{" "}
                        {error.spaceName && (
                          <span className="text-danger">{error.spaceName}</span>
                        )}
                        <input
                          className="form-control"
                          type="text"
                          name="spaceName"
                          placeholder="Street Name"
                          value={spaceName}
                          onChange={handleSpaceName}
                          onBlur={validateInput}
                          onFocus={onFocus}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row gx-5">
                    {/* <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Ward Name</label>

                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Ward"
                          isSearchable={true}
                          name="ward"
                          options={transformedWardData}
                          onChange={handleWardChange}
                        />
                      </div>
                    </div> */}
                    <div className="col">
                      <div className="flex flex-column mb-3">
                        <label className="form-label">Narration</label>{" "}
                        {error.buildingNumber && (
                          <span className="text-danger">
                            {error.buildingNumber}
                          </span>
                        )}
                        <input
                          className="form-control"
                          type="text"
                          name="buildingNumber"
                          placeholder="Narration"
                          onChange={handleBuildingNo}
                          value={buildingNumber}
                          onBlur={validateInput}
                          onFocus={onFocus}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="row gx-5">
                    <div className="col">
                      {" "}
                      <div className=" flex flex-column mb-3">
                        <label className="form-label">Space floor</label>{" "}
                        {error.spaceFloor && (
                          <span className="text-danger">
                            {error.spaceFloor}
                          </span>
                        )}
                        <input
                          className="form-control"
                          type="number"
                          name="spaceFloor"
                          placeholder="Space Floor"
                          onChange={handleSpaceFloor}
                          value={spaceFloor}
                          onBlur={validateInput}
                          onFocus={onFocus}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Agency
                        </label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Agency"
                          isSearchable={true}
                          name="Agency"
                          options={transformedAgencyData}
                          onChange={handleAgencyChange}
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="row">
                    <div className="col">
                      <div className=" flex flex-column mb-3">
                        <label className="form-label">Location Address</label>{" "}
                        {error.locationAddress && (
                          <span className="text-danger">
                            {error.locationAddress}
                          </span>
                        )}
                        <input
                          className="form-control"
                          type="text"
                          name="locationAddress"
                          placeholder="Location Address"
                          value={locationAddress}
                          onChange={handleLocation}
                          onBlur={validateInput}
                          onFocus={onFocus}
                        />
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* <div className="d-flex justify-content-end mt-5">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalAlert"
                    className="btn bg-primary p-2 text-white"
                    type="button"
                    disabled={validateForm}
                  >
                    {validateForm
                      ? "Disabled, Please Fill Necessary Details"
                      : "Continue Enumeration"}
                  </button>
                </div> */}
              </fieldset>
            </form>
          </div>
        
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStreet}
              type="submit"
              className="rounded-md btn btn-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? <Spinner/> : "Save"}
            </button>
          </div>
          <ToastContainer/>
        </div>
      )}
    </AppSettings.Consumer>
  );
};

export default CreateNewStreet;
