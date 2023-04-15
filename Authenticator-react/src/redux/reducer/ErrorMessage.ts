import {SET_ERROR_MESSAGE,
    RESET_ERROR_MESSAGE } from "../action";

    const INITIAL_STATE = {erroMessage:""}

    const erroMessage = (state = INITIAL_STATE, action:any) =>{

        switch(action.type)
        {
            case SET_ERROR_MESSAGE :
                return {erroMessage:action.data};
            case RESET_ERROR_MESSAGE :
                return INITIAL_STATE;
            default :
            return state;
        }

    }

    export default erroMessage;