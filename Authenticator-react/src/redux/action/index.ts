export const LOGIN = 'LOGIN'
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE"
export const RESET_ERROR_MESSAGE = "RESET_ERROR_MESSAGE"
export const SET_LOGIN_DETAILS = "SET_LOGIN_DETAILS"
export const RESET_LOGIN_DETAILS = "RESET_LOGIN_DETAILS"
export const FB_LOGIN = "FB_LOGIN"
export const G_LOGIN = "G_LOGIN"

export const login = (data:any) =>{
    return {
        type:LOGIN,
        payload:data
    }
}

export const setErrorMessage = (data:any) => {
    return {
        type:SET_ERROR_MESSAGE,
        data
    }
}

export const resetErrorMessage = () => {
    return {
        type:RESET_ERROR_MESSAGE,
    }
}

export const setLoginDetails = (data:any) => {
    return {
        type:SET_LOGIN_DETAILS,
        data
    }
}

export const resetLoginDetails = () => {
    return {
        type:RESET_LOGIN_DETAILS
    }
}

export const fbLogin =(data:any) => {
    return {
        type:FB_LOGIN,
        data
    }
}

export const gLogin =(data:any) => {
    return {
        type:G_LOGIN,
        data
    }
}