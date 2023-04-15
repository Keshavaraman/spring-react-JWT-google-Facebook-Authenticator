import { combineReducers } from "redux";
import erroMessage from "./ErrorMessage";
import LoginDetails from "./LoginDetails";
const rootReducer = combineReducers({
    erroMessage:erroMessage,
    LoginDetails:LoginDetails
});

export default rootReducer;