import {SET_LOGIN_DETAILS,RESET_LOGIN_DETAILS} from "../action";
const INITIAL_STATE = {
    userName:"",
    AccessToken:"",
    refreshToken:""
}

const LoginDetails = (state = INITIAL_STATE, action:any) =>{

    switch(action.type) {
        case SET_LOGIN_DETAILS :
            return action.data;
        case RESET_LOGIN_DETAILS :
            return INITIAL_STATE;
        default:
            return state;
    }



}

export default LoginDetails;