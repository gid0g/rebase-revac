
export const validateStepOne = (formData) => {
        
    let errors = {};

    if(!formData.organisationName){
        errors.organisationName = "Organisation Name is Required";
    } else if(formData.organisationName.trim().length == 0) {
        errors.organisationName = "Must contain atleast a character"
    }

    if(!formData.corporateAddress){
        errors.corporateAddress = "Corporate Address is Required";
    } else if(formData.corporateAddress.trim().length == 0) {
        errors.corporateAddress = "Must contain atleast a character"
    }

    if(!formData.email){
        errors.email = "Email is Required";
    } else if(!/\S+@\S+\.\S+/.test(formData.email)){
        errors.email = "Email is Invalid";
    }

    if(formData.phone_no != undefined && !formData.phone_no && !formData.phone_no == ""){
        errors.phone_no = "Phone Number is Required";
    } else if(formData.phone_no != undefined && formData.phone_no == "" && formData.phone_no.trim().length < 14) {
        errors.phone_no = "Phone Number is invalid"
    }

    return errors
};

export const validateSecondStep = (formData) => {
    let errors = {}

    if(!formData.state){
        errors.state = "State is Required";
    } else if(formData.state.length == 0) {
        errors.state = "Select a State"
    }

    if(!formData.lga){
        errors.lga = "Local Government Area is Required";
    } else if(formData.lga.length == 0) {
        errors.lga = "Select a Local Government Area "
    }

    return errors

 }


 export const validateThirdStep = (formData) => {

    let errors = {}
    
    if(!formData.agreed || formData.agreed == false){
        errors.agreed = "Terms and Condition Agreement is Required";
    }   
    return errors

 }



