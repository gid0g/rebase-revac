const initialState = {
  payId: "",
  message: "",
  loading: "",
  email: "",
  payerIdData: [],
  havePayerId: true,
  error: {
    email: "",
    payId: "",
  },
};

const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "SUBMIT_FORM":
      // Perform form submission logic here
      return state; // or return updated state after form submission
    default:
      return state;
  }
};

export default onboardingReducer;
