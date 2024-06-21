import { combineReducers } from "redux";
import authReducer from "./authReducer";
import onboardingReducer from "./onboardingReducer"

const rootReducer = combineReducers({
  authReducer,
  onboardingReducer,
});

export default rootReducer;
