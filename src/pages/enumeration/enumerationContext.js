import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/custom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-activity/dist/library.css";
import { AppSettings } from "../../config/app-settings";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
  const appSettings = useContext(AppSettings);
  const userData = appSettings.userData;
  const token = sessionStorage.getItem("myToken");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  const [enumerationData, setEnumerationData] = useState(null);
  const [addressNo, setAddressNo] = useState("");
  const [payID, setPayId] = useState("");
  const [payerTypeId, setPayerTypeId] = useState("");
  const [genderId, setGenderId] = useState("");
  const [titleId, setTitleId] = useState("");
  const [maritalStatusId, setMaritalStatusId] = useState(0);
  const [spaceName, setSpaceName] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [spaceFloor, setSpaceFloor] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  // const [ward, setWard] = useState([]);
  // const [wardOption, setWardOption] = useState("");
  const [streetOption, setStreetOption] = useState({});
  const [agencyId, setAgencyId] = useState("");
  const [existingCustomerAgencyId, setExistingCustomerAgencyId] = useState(0);
  const [enumerationStatus, setEnumerationStatus] = useState(false);
  const [spaceIdentifier, setSpaceIdentifier] = useState([]);
  const [spaceIdentifierOption, setspaceIdentifierOption] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [agencyOption, setAgencyOption] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [customerStatus, setCustomerStatus] = useState(false);
  const [newCustomerStatus, setNewCustomerStatus] = useState(false);
  const [newPropertyId, setNewPropertyId] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(null);
  const [existingPropertyForNewCustomer, setExistingPropertyForNewCustomer] = useState({});
  const [fields, setFields] = useState([
    {
      businessTypeId: "",
      businessSizeId: "",
      billRevenues: [],
      createdBy: userData[0]?.email,
      dateCreated: new Date().toISOString(),
    },
  ]);

  const [existingCustomerFields, setExistingCustomerFields] = useState([
    {
      agencyId: 0,
      appliedDate: `${new Date().getFullYear()}`,
      BillRevenuePrices: [],
      businessTypeId: 0,
      businessSizeId: 0,
      dateCreated: new Date().toISOString(),
      createdBy: `${userData[0]?.email}`,
    },
  ]);

  const [enumerateFields, setEnumerateFields] = useState([]);

  const [enumerationPosition, setEnumerationPosition] = useState("new");
  const [selectedProperty, setSelectedProperty] = useState("");
  const navigate = useNavigate();

  // on refresh, reset all states 
  useEffect(() => {
    return () => {
    setData({});
    setLoading(false);
    setLoadingBusiness(false);
    setEnumerationData(null);
    setAddressNo("");
    setPayId("");
    setPayerTypeId("");
    setGenderId("");
    setTitleId("");
    setMaritalStatusId("");
    setSpaceName("");
    setBuildingNumber("");
    setSpaceFloor("");
    setLocationAddress("");
    // setWard([]);
    // setWardOption("");
    setAgencyId("");
    setEnumerationStatus(null);
    setSpaceIdentifier([]);
    setspaceIdentifierOption("");
    setAgencies([]);
    setAgencyOption("");
    setAgencyName("");
    setCustomerStatus(false);
    setSelectedCustomer(0);
    setExistingCustomer(null);
    setFields([
      {
        businessTypeId: 0,
        businessSizeId: 0,
        billRevenues: [],
        createdBy: userData[0]?.email,
        dateCreated: new Date().toISOString(),
      },
    ]);
    setEnumerateFields([]);
    setEnumerationPosition("new");
    setSelectedProperty("");
  }
  }, []);
  

  // Get and decrypt Organisation ID from local storage
  const organisationId = sessionStorage.getItem("organisationId");

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
  const checkmaritalstatus = () => {
    if (data.maritalStatuses
      && data.maritalStatuses.maritalStatusCode
      === "M") {
      setMaritalStatusId(1);
    } else if (data.maritalStatuses
      && data.maritalStatuses.maritalStatusCode
      === "S") {
      setMaritalStatusId(2);
    }
  };


  const checkMaritalDtoStatus = (maritalStatus) => {
    let maritalId = 0;
    if (maritalStatus
      && maritalStatus.maritalStatusCode
      === "M") {
      maritalId = 1
    } else if (maritalStatus
      && maritalStatus.maritalStatusCode
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
  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/agencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAgencies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // useEffect(() => {
  //   api
  //     .get(`enumeration/${organisationId}/wards`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setWard(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  useEffect(() => {
    api
      .get(`enumeration/${organisationId}/space-identifiers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSpaceIdentifier(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


function removeDuplicates(profile) {
  console.log("Raw:", profile);

  profile.forEach((item) => {
      item.billRevenues = [...new Set(item.billRevenues)];
  });

  console.log("Refactored:", profile);
  return profile

}

  const convertedField = fields.map((obj) => ({
    businessTypeId: obj.businessTypeId,
    businessSizeId: obj.businessSizeId,
    billRevenues: obj.billRevenues?.map((item) => parseInt(item?.id)),
    dateCreated: obj.dateCreated,
    createdBy: obj.createdBy,
  }));


  const submitPayerId = (e) => {
    e.preventDefault();
    navigate("enumeration/createbusinessprofile");
    // checktitle();
    // checkgender();
    // checkmaritalstatus();
    // checkpayertype();
  };

  function splitFullName(fullName) {
    const nameParts = fullName?.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const middleName =
      nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
    return {
      firstName,
      lastName,
      middleName,
    };
  }

  const fullName = data?.fullName ? data.fullName : "";

  const nameInfo = splitFullName(fullName);
  
  const payerTypeDto = customerStatus == false ? checkPayerType(data?.payerID) : checkPayerType(data?.payerTypes?.payerTypeCode);
  const payerDto = data?.payerID;
  const titleDto = customerStatus == false ? 1 : checkTitle(data?.titles?.titleCode);
  const genderDto = customerStatus == false ? 1 : checkGender(data?.genders?.genderCode);
  const maritalStatusDto = customerStatus == false ? 1 : checkMaritalDtoStatus(data?.maritalStatuses);
  const phoneNoDto = customerStatus == false ? data?.gsm : data?.phoneNo;
  const corporateNameDto = data.corporateName ? data.corporateName : "string";
  const firstNameDto = nameInfo.firstName;
  const middleNameDto = nameInfo.middleName;
  const lastNameDto =  nameInfo.lastName;
  const addressDto = data.address;
  const emailDto = data.email;
  const suppliedPidDto = customerStatus == false ? true : enumerationStatus;
  

  console.log("Customer Data:", data);
  console.log("existingPropertyForNewCustomer", existingPropertyForNewCustomer);
  
  const createCustomerDto = {
    payerTypeId: payerTypeDto,
    payerId: payerDto,
    titleId: titleDto,
    corporateName: corporateNameDto,
    firstName: firstNameDto,
    lastName: lastNameDto,
    middleName: middleNameDto,
    genderId: genderDto,
    maritalStatusId: maritalStatusDto,
    address: addressDto,
    email: emailDto,
    suppliedPID: suppliedPidDto,
    phoneNo: phoneNoDto,
    dateCreated: new Date().toISOString(),
    createdBy: userData[0]?.email,
  };
  
  console.log("createCustomerDto:", createCustomerDto);

  const chooseAgency = (status) => {
    if(status == true){
      return agencyOption?.agencyId;
    } else {
      return existingPropertyForNewCustomer?.agencies?.agencyId;
    }
  }

  const chooseSpaceIdentifierId = (status) => {
    if(status == true) {
      return spaceIdentifierOption;
    } else {
      return existingPropertyForNewCustomer?.spaceIdentifier?.id;
    }
  }

  // const chooseWardId = (status) => {
  //   if(status == true) {
  //     return wardOption;
  //   } else {
  //     return existingPropertyForNewCustomer?.ward?.id;
  //   }
  // }

  const chooseLocationAddress = (status) => {
    if(status == true) {
      return `${parseInt(buildingNumber)}, ${streetOption.label}`;
    } else {
      return existingPropertyForNewCustomer?.locationAddress;
    }
  }

  const chooseSpaceFloor = (status) => {
    if(status == true) {
      return spaceFloor;
    } else {
      return existingPropertyForNewCustomer?.spaceFloor;
    }
  }

  const chooseBuildingNo = (status) => {
    if(status == true) {
      return parseInt(buildingNumber);
    } else {
      return existingPropertyForNewCustomer?.buildingNo;
    }
  }

  const chooseBuildingName = (status) => {
    if(status == true) {
      return spaceName;
    } else {
      return existingPropertyForNewCustomer?.buildingName;
    }
  }

  const extractText = (value) => {
    if(value) {
      const number = value.match(/\d+/);
      if (number) {
        console.log("Extracted number:", number[0]);
        return number[0];
      }
    }
  }
  
  const submitBusinessProfile = async (e) => {
    e.preventDefault();
    setLoadingBusiness(true);

    const formData = {
        createPropertyDto: {
          agencyId: chooseAgency(newCustomerStatus),
          spaceIdentifierId: chooseSpaceIdentifierId(newCustomerStatus),
          streetId: streetOption.value,
          // wardId: chooseWardId(newCustomerStatus),
          locationAddress: chooseLocationAddress(newCustomerStatus),
          spaceFloor: chooseSpaceFloor(newCustomerStatus),
          buildingNo: chooseBuildingNo(newCustomerStatus),
          buildingName: chooseBuildingName(newCustomerStatus),
          dateCreated: new Date().toISOString(),
          createdBy: userData[0]?.email,
        },
        createBusinessProfileDto: removeDuplicates(convertedField),
        createCustomerDto: createCustomerDto,
        createCustomerPropertyDto: {
          doesCustomerExist: customerStatus,
          customerId: selectedCustomer,
          dateCreated: new Date().toISOString(),
          createdBy: userData[0]?.email,
        },
    }

    console.log("FormData:", formData);

    if (customerStatus == false) {
      console.log(`End point for ${customerStatus}:`, `enumeration/${organisationId}`);
      await api
        .post(
          `enumeration/${organisationId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("response--", response);
          if (response.status === 200) {
            if (response.data.status === 200) {
              setLoadingBusiness(false);
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
                navigate("enumeration/billing");
              }, 3000);
              setLoading(false);
            } else if (response.data.status === 400) {
              setLoadingBusiness(false);
              console.log("response--", response);
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
            }
            setLoading(false);
            setFields([
              {
                businessTypeId: "",
                businessSizeId: "",
                billRevenues: [],
                createdBy: userData[0]?.email,
                dateCreated: new Date().toISOString(),
              },
            ])
          }
        })

        .catch((error) => {
          setLoadingBusiness(false);
          // console.log("response--", wardOption);

          console.log("contextt----", error);
          if (error.response) {
            if (error.response.status === 400) {
              // setData(response.data.data);
              setLoadingBusiness(false);
              toast.error(error.response.data, {
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
              let errorMessages = [];
              for (const response in error.response.data) {
                error.response.data[response].forEach((errorMessage) => {
                  errorMessages.push(errorMessage);
                });
              }
              errorMessages.forEach((errorMessage) => {
                toast.error(errorMessage, {
                  position: "top-right",
                  autoClose: 10000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              });
            } else
              toast.error(error.response.message, {
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
          setLoading(false);
        });
    } else {
      setLoadingBusiness(true);
  
      console.log("Data:", existingCustomerFields);
      console.log("Selected Property:", selectedProperty);
      console.log("Selected Customer:", selectedCustomer);
  

      //If customer exists => Bill Generation Api 
      await api
        .post(
          `billing/${organisationId}/generate-bill/property/${selectedProperty || newPropertyId}/customer/${selectedCustomer}`,
          {
            createPropertyBillDto: existingCustomerFields,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          console.log("formValues", agencyOption);


          setLoadingBusiness(false);
          if (response.status === 200) {
            if (response.data && response?.data?.statusMessage != "Bill(s) Exists!") {
              setLoading(false);
              const billId = extractText(response.data?.statusMessage);
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
              
              setTimeout(() => {
                navigate("/home/billing/previewbill/", {
                  state: {
                    customerId: selectedCustomer,
                    previewData: response?.data,
                    billId: String(billId),
                  }
                })

              }, 2000);
            } else {
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
            }
          }
          setLoading(false);
  
          console.log("Submitted Bill:", response.data);
  
          // setTimeout(() => {
          //   navigate("/home/enumeration");
          // }, 2000);
          return true;
        })
        .catch((error) => {
          setLoadingBusiness(false);

          console.log("error", error);
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
            } else if (error.response.status === 404) {
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
    }
  };

  const allState = {
    data,
    fields,
    setEnumerationStatus,
    setFields,
    setData,
    payID,
    setPayId,
    spaceName,
    addressNo,
    setAddressNo,
    setSpaceName,
    buildingNumber,
    buildingName,
    setSpaceFloor,
    setLocationAddress,
    // setWardOption,
    setBuildingNumber,
    setBuildingName,
    setspaceIdentifierOption,
    spaceFloor,
    locationAddress,
    setAgencyOption,
    // ward,
    // wardOption,
    streetOption,
    setStreetOption,
    spaceIdentifier,
    spaceIdentifierOption,
    agencies,
    agencyOption,
    selectedCustomer,
    setSelectedCustomer,
    submitBusinessProfile,
    // submitEnumerationData,
    loading,
    setLoading,
    enumerationPosition,
    setEnumerationPosition,
    setSelectedProperty,
    setCustomerStatus,
    customerStatus,
    submitPayerId,
    setAgencyName,
    agencyName,
    agencyId,
    setAgencyName,
    existingCustomer,
    setExistingCustomer,
    loadingBusiness,
    setLoadingBusiness,
    enumerationData,
    enumerateFields,
    setEnumerateFields,
    newPropertyId,
    setNewPropertyId,
    convertedField,
    existingCustomerFields,
    existingCustomerAgencyId,
    setExistingCustomerFields,
    setExistingCustomerAgencyId,
    newCustomer,
    setNewCustomer,
    newCustomerStatus,
    setNewCustomerStatus,
    existingPropertyForNewCustomer,
    setExistingPropertyForNewCustomer,
  };
  return (
    <Context.Provider value={{ ...allState }}>{children}</Context.Provider>
  );
};
