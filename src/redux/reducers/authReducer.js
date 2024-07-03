import { userConstant } from "../constants";

const initialState = {
  user: {
    token: "",
    userId: "",
    roleId: "",
    organisationId: "",
    userProfileId: "",
  },
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case userConstant.LOGIN_SUCCESS:
      return {
        user: action.payload,
      };
    case userConstant.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
