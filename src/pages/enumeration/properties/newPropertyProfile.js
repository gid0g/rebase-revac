import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { AppSettings } from "../../../config/app-settings.js";
// import api from "../../../axios/custom.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import Select from "react-select";
import "react-activity/dist/library.css";
import FormWizard from "../payerIdmodal.js";
import api from "../../../axios/custom.js";

import { Context } from "../enumerationContext.js";

const NewPropertyProfile = () => {
  const token = sessionStorage.getItem("myToken");
  const organisationId = sessionStorage.getItem("organisationId");
  const roleId = sessionStorage.getItem("roleId");
  const agencyId = sessionStorage.getItem("agencyId");
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;

  const [validateForm, setValidateForm] = useState(true);
  const [isSubmittedForm,  setIsSubmittedForm] = useState(false);
  const [streets, setStreets] = useState([]);

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
    streetOption,
    setStreetOption,
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
    newPropertyId,
    setNewPropertyId,
    setNewCustomerStatus,
  } = useContext(Context);

  //constants to check for validity for forms
  const enteredSpaceNameIsValid = spaceName.trim() !== "";
  const enteredBuildingNumberIsValid = buildingNumber.trim() !== "";
  const enteredSpaceFloorIsValid = spaceFloor.trim() !== "";
  const enteredLocationAddressIsValid = locationAddress.trim() !== "";
  const selectedSpaceIdentifierOption = spaceIdentifierOption;
  const selectedWardOption = wardOption;
  const selectedAgency = agencyOption;
  const selectedStreet = streetOption;

  //
  useEffect(() => {
    if (
      enteredSpaceNameIsValid &&
      enteredBuildingNumberIsValid &&
      enteredSpaceFloorIsValid &&
      // enteredLocationAddressIsValid &&
      selectedSpaceIdentifierOption &&
      // selectedWardOption &&
      selectedStreet &&
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
    selectedStreet,
    selectedSpaceIdentifierOption,
  ]);

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "spaceName":
          if (!value) {
            stateObj[name] = "Please input Space Name.";
          }
          break;
        case "buildingNumber":
          if (!value) {
            stateObj[name] = "Please Enter a digit";
          }
          break;
        case "spaceFloor":
          if (!value) {
            stateObj[name] = "Please Enter a digit";
          }
          break;
        // case "locationAddress":
        //   if (!value) {
        //     stateObj[name] = "Please Enter an Address";
        //   }
        //   break;
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
        // case "locationAddress":
        //   if (!value) {
        //     stateObj[name] = "";
        //   }
        //   break;
        default:
          break;
      }

      return stateObj;
    });
  };

  const handleSpaceName = (event) => {
    setSpaceName(event.target.value);
  };
  const handleBuildingNo = (event) => {
    console.log(event.target.value);
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
  const handleAgencyChange = async (agencyOption) => {
    setAgencyOption(agencyOption.value);
    setAgencyName(agencyOption.label);
    console.log("agencyId", agencyOption);

    try {
      const fetchedStreets = await fetchAgencyStreets(agencyOption?.value);
      setStreets(fetchedStreets);
    } catch (error) {
      console.error("Error fetching streets:", error);
      setStreets([]);
    }
  };



  const handleStreetChange = (streetOption) => {
    console.log("street:", streetOption);
    setStreetOption(streetOption);
  }
 
  
  const fetchAgencyStreets = async (agencyId) => {
    try {
      console.log("gbese",organisationId,agencyId)
      const response = await api.get(`enumeration/${organisationId}/agency/${agencyId}/streets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Agency Streets:", response.data);
      return response.data; 
    } catch (error) {
      console.error("Error fetching streets", error);
      throw error;
    }
  };
  
  const handleSpaceChange = (spaceIdentifierOption) => {
    setspaceIdentifierOption(spaceIdentifierOption.value);
  };

  const transformedStreetsData = streets ?
    streets.map((item) => ({
      label: item.streetName,
      value: item.streetId,
    }))
  : "";

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
    : "";

  

    const handleNewPropertyEnumeration = async (e) => {

      e.preventDefault();
      const formattedLocationAddress = buildingNumber + " " + streetOption.label
      console.log("formattedLocationAddress",formattedLocationAddress)
      setNewCustomerStatus(true);
      const createProperty = {
        AgencyId: agencyOption,
        SpaceIdentifierId: spaceIdentifierOption,
        StreetId: streetOption.value,
        LocationAddress: formattedLocationAddress,
        SpaceFloor: parseInt(spaceFloor),
        BuildingNo: buildingNumber,
        BuildingName: spaceName,
        DateCreated: new Date().toISOString(),
        CreatedBy: userData[0]?.email,
      }

      try {
        // const createProperty = {
        //   AgencyId:formData.agencyId,
        //   SpaceIdentifierId:formData.spaceIdentifierId,
        //   StreetId:formData.streetId,
        //   LocationAddress:formData.locationAddress,
        //   SpaceFloor:formData.spaceFloor,
        //   BuildingNo:formData.buildingNo,
        //   BuildingName:formData.buildingName,
        //   DateCreated:formData.dateCreated,
        //   CreatedBy:formData.createdBy
        // }
        const response = await api.post(`enumeration/${organisationId}/property`,
          createProperty,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("newPropertyId:", newPropertyId);
          if(response.data.data) {
            console.log("New propertID---->", response?.data?.data)
            setNewPropertyId(response?.data?.data);
          }

          if(response?.data?.status == 200) {
            toast.success(response?.data?.statusMessage, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setSpaceName("")
            setSpaceFloor("")
            setBuildingNumber("")
            setLocationAddress("")
            setWardOption("")
          } else if(response?.data?.status == 403) {
            toast.error(response?.data?.statusMessage, {
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

          setIsSubmittedForm(true);

      } catch(error){
        const { response } = error;
        toast.error(response?.data?.statusMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

          setIsSubmittedForm(true);
      }
    }
useEffect(()=>{
  console.log("agencies ", agencies)
},[agencies])
  const getRoleAgency = (storedAgencyId) => {
    const filteredAgency = agencies.find(agency => agency.agencyId == storedAgencyId);
    setAgencyOption(filteredAgency);
    console.log("boom")
    return`${filteredAgency?.agencyName} / ${filteredAgency?.agencyCode}`
  }

  const getRoleAgencyStreets = async (storedAgencyId) => {
    try {
      const filteredAgency = agencies.find(agency => agency.agencyId == storedAgencyId);
      const fetchedStreets = await fetchAgencyStreets(filteredAgency?.agencyId);
      setStreets(fetchedStreets);
    } catch (error) {
      console.error("Error fetching streets:", error);
      setStreets([]);
    }
  }

  useEffect(() => {
    getRoleAgencyStreets(agencyId);
  }, [agencyId]);

  return (
    <AppSettings.Consumer>
      {({ cartIsShown, showModalHandler, hideModalHandler }) => (
        <div>

          <div className="mb-3 flex justify-content-between">
            <div className=" ">
              <h3 className=" mb-0">New Enumeration</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/home/Dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item">Enumeration</li>
                <li className="breadcrumb-item active">New Enumeration </li>
              </ol>
            </div>
          </div>
          <div className="mt-5">
            <form>
              <fieldset>
                <div>
                  <div className="row gx-5">
                    <div className="col">
                      <div className=" flex flex-column mb-3 ">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Space Name
                        </label>{" "}
                        {error.spaceName && (
                          <span className="text-danger">{error.spaceName}</span>
                        )}
                        <input
                          className="form-control"
                          type="text"
                          name="spaceName"
                          placeholder="Space Name"
                          value={spaceName}
                          onChange={handleSpaceName}
                          onBlur={validateInput}
                          onFocus={onFocus}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Space Identifier</label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Space Identifier"
                          isSearchable={true}
                          name="spaceIdentifier"
                          options={transformedSpaceData}
                          onChange={handleSpaceChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row gx-5">
                    {/* <div className="col">
                      <div className="mb-3">
                        <label className="form-label">Ward</label>

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
                        <label className="form-label">Building Number</label>{" "}
                        {error.buildingNumber && (
                          <span className="text-danger">
                            {error.buildingNumber}
                          </span>
                        )}
                        <input
                          className="form-control"
                          type="number"
                          name="buildingNumber"
                          placeholder="Building Number"
                          onChange={handleBuildingNo}
                          value={buildingNumber}
                          onBlur={validateInput}
                          onFocus={onFocus}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row gx-5">
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

                        {roleId != 1 && roleId != 2 && (
                            <input
                              className="form-control"
                              type="text"
                              name="Agency"
                              placeholder="Select Agency"
                              value={getRoleAgency(agencyId)}
                              readOnly
                            />
                        )}

                        {roleId == 2 && (
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={transformedAgencyData.find(option => option.value == agencyId)}
                            isSearchable={true}
                            name="Agency"
                            options={transformedAgencyData}
                            onChange={handleAgencyChange}
                          />   
                        )}

                        {roleId == 1 && (
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue="Select Agency"
                            isSearchable={true}
                            name="Agency"
                            options={transformedAgencyData}
                            onChange={handleAgencyChange}
                          />   
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">

                  <div className="col">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="exampleInputEmail1"
                        >
                          Street
                        </label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue="Select Agency"
                          isSearchable={true}
                          name="street"
                          options={transformedStreetsData}
                          onChange={handleStreetChange}
                        />
                      </div>
                    </div>

                    <div className="col"></div>

                    {/* <div className="col">
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
                    </div> */}

                  </div>
                </div>

                <div className="d-flex justify-content-end mt-5">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalAlert"
                    className="btn bg-primary p-2 text-white"
                    type="button"
                    onClick={handleNewPropertyEnumeration}
                    disabled={validateForm}
                  >
                    {validateForm
                      ? "Disabled, Please Fill Necessary Details"
                      : "Continue Enumeration"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
            <div className="modal fade" id="modalAlert">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Payer Id</h4>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-hidden="true"
                    ></button>
                  </div>
                  <FormWizard />
                </div>
              </div>
            </div>
          <ToastContainer />
        </div>
      )}
    </AppSettings.Consumer>
  );
};

export default NewPropertyProfile;
