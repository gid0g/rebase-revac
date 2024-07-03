import React, { useEffect, useState, useContext } from "react";
import FirstStep from "./firstStep";
import SecondStep from "./secondStep";
import ThirdStep from "./thirdStep";
import MultiStepProgressBar from "./multiStepProgressBar";
import { useUserForm } from "./useUserForm";
import apis, { attachment } from "../../../axios/custom";
import { Context } from "./onboardingcontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-activity";
import { useNavigate } from "react-router-dom";
import { validateStepOne, validateSecondStep, validateThirdStep } from "../onboardValidation/onboardValidation";

const UserForm = () => {
  const { payerIdData, formData, setFormData, errors, setErrors } = useContext(Context);
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState(0);
  const [lgas, setLgas] = useState([]);
  const [selectedLga, setSelectedLga] = useState(0);
  const [lcdas, setLcdas] = useState([]);
  const [selectedLcda, setSelectedLcda] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const token = sessionStorage.getItem("myToken");
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const handleValidateFirstStep = () => {
    const formData = {
      organisationName: payerIdData.fullName,
      corporateAddress: payerIdData?.address,
      email: payerIdData?.email,
      phone_no: payerIdData?.gsm,
    }


    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        ...formData
      }
    })

    const formErrors = validateStepOne(formData);
    setErrors(formErrors);
    return formErrors;
}

const handleValidateSecondStep = () => {
    const formData = {
      state: selectedState,
      lga: selectedLga,
      lcda: selectedLcda,
    }

    const formErrors = validateSecondStep(formData);
    setErrors(formErrors);
    return formErrors;
}

const handleValidateThirdStep = () => {
    const formData = {
      logoImage: logo,
      bgImage: backgroundImage,
      agreed: isAgreed,
    }
    
    const formErrors = validateThirdStep(formData);
    setErrors(formErrors);
    return formErrors;
}


  const handleNextFirstStep = (e) => {
    e.preventDefault();
    const formErrors = handleValidateFirstStep();

    if(Object.keys(formErrors).length === 0) {    
      next();
    }

  }


  const handleNextSecondStep = (e) => {
    e.preventDefault();
    const formErrors = handleValidateSecondStep();

    if(Object.keys(formErrors).length === 0) {
      next();
    }

  }


  const handleNextThirdStep = async (e) => {
    e.preventDefault();
    const formErrors = handleValidateThirdStep();

    console.log("FormData:", formData);

    if(Object.keys(formErrors).length === 0) {
      console.log("FormData:", formData);
      await submitHandler(formErrors);
    }

  }

  // Fetch the list of states from the API and set the options for the state select element
  useEffect(() => {
    const fetchState = async () => {
      await apis
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
      await apis
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
      await apis
        .get(`enumeration/${selectedLga}/lcdas`)
        .then((response) => {
       
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

  const transformedStateData = state
    ? state.map((item) => ({
        label: item.stateName,
        value: item.id,
      }))
    : "";
  const transformedLgaData = lgas
    ? lgas.map((item) => ({
        label: item.lgaName,
        value: item.id,
      }))
    : "";
  const transformedLcdaData = lcdas
    ? lcdas.map((item) => ({
        label: item.lcdaName,
        value: item.id,
      }))
    : "";

  const handleStateChange = (selectedState) => {
    setSelectedState(selectedState.value);
    setFormData({...formData, state: selectedState.label});
  };
  
  const handleLgaChange = (selectedLga) => {
    setSelectedLga(selectedLga.value);
    setFormData({...formData, lga: selectedLga.label});
  };
 
  const handleLcdaChange = (selectedLcda) => {
    setSelectedLcda(selectedLcda.value);
    setFormData({...formData, lcda: selectedLcda.label});
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    setLogo(file);
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    setBackgroundImage(file);
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;

    if(checked == true){
      setIsAgreed(true);
    }
  };

  //function to loop through the form wizard steps
  const { page, step, isFirstStep, back, next, isLastStep, isSecondStep } =
    useUserForm([
      <FirstStep 
        errors={errors}
      />,
      <SecondStep
        errors={errors}
        handleChange={handleStateChange}
        state={state}
        transformedStateData={transformedStateData}
        transformedLgaData={transformedLgaData}
        transformedLcdaData={transformedLcdaData}
        lgas={lgas}
        handleLgaChange={handleLgaChange}
        handleStateChange={handleStateChange}
        lcdas={lcdas}
        handleLcdaChange={handleLcdaChange}
      />,
      <ThirdStep
        errors={errors}
        handleLogoUpload={handleLogoUpload}
        handleBackgroundUpload={handleBackgroundUpload}
        handleCheckboxChange={handleCheckboxChange}
      />,
    ]);

  //submitting the form
  const submitHandler = async (errors) => {

   if(Object.keys(errors).length === 0) {

    const formData = new FormData();
    formData.append("countryId", 149);
    formData.append("payerId", payerIdData?.payerID);
    formData.append("OrganisationName", payerIdData?.fullName);
    formData.append("address", payerIdData?.address);
    formData.append("stateId", selectedState);
    formData.append("City", selectedState.toString());
    formData.append("lgaId", selectedLga);
    formData.append("lcdaId", selectedLcda);
    formData.append("phoneNo", payerIdData?.gsm);
    formData.append("email", payerIdData?.email);
    formData.append("logo", logo);
    formData.append("logoName", logo?.name);
    formData.append("AgencyCode", "");
    formData.append("RevenueCode", "");
    formData.append("backgroundImage", backgroundImage);
    formData.append("backgroundImagesName", backgroundImage?.name);
    formData.append("dateCreated", new Date().toISOString());
    formData.append("createdBy", payerIdData?.email);

    try {
      setLoading(true);
      await attachment
        .post("organisation", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          setLoading(false);
  
          if (response.status === 200) {
            if (response.data.status === 400) {
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
            } else if (response.data.status === 200) {
              toast.success(response.data.statusMessage, {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
              toast.success("Please Contact Admin for Approval", {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
              toast.success("User created successfully!", {
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
                navigate("/thankyou");
              }, 3000);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          // setLoading(true);
          setLoading(false);
  
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
        });
      
    } catch(error) {

    }
    }
  };

  return (
    <div className="">
      <div className="login-title mb-4 text-center">
        <p>Create an Account</p>
      </div>
      <ToastContainer />

      <div style={{ margin: "auto", width: "50%" }}>
        <MultiStepProgressBar step={page} />
      </div>

      <div className="">
        <div>{step}</div>{" "}
      </div>
      <form autoComplete="true">
        <div className="mb-4 register-items mt-4 d-flex flex-row-reverse">
          {isFirstStep && (
            <button
              className="btn btn-primary d-block px-5 btn-lg h-45px"
              type="button"
              onClick={(e) => handleNextFirstStep(e)}
            >
              Next
            </button>
          )}
          {isLastStep && (
            <button
              disabled={loading}
              className="btn btn-primary d-block px-5 btn-lg h-45px"
              type="submit"
              onClick={(e) => handleNextThirdStep(e)}
            >
              {loading ? <Spinner /> : "Submit"}
            </button>
          )}

          {isSecondStep && (
            <button
              className="btn mx-3 btn-primary d-block px-5 btn-lg h-45px"
              type="button"
              onClick={(e) => handleNextSecondStep(e)}
            >
              Next
            </button>
          )}
          {!isFirstStep && (
            <button
              className="btn mx-3 btn-primary d-block px-5 btn-lg h-45px"
              type="button"
              onClick={back}
            >
              Back
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default UserForm;
