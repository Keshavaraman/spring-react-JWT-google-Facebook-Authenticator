import {LOGIN,FB_LOGIN,G_LOGIN,setErrorMessage,setLoginDetails} from '../action';
import {call, put, takeLatest} from 'redux-saga/effects';
import { PostApi } from '../../resources/apiFunctions';

interface LoginProps{
    payload:any;
    type:String;
}
function* LoginSaga(data:any):any{

    console.log(data);

    const payload=data.payload;



    var request = {
        userName:payload.userName,
        password:payload.password
    };
    
    try{     
      const response=yield call(PostApi,"http://localhost:8089/api/auth/login","",request);
      if(response.status==200) { 
        const logindetail = {
            userName:response.data.username,
            AccessToken:response.data.authenticationToken,
            refreshToken:response.data.refreshToken

        }
        yield put(setLoginDetails(logindetail));
      }
      else yield put(setErrorMessage("Authentication Failed"));
    }
    catch(e) {
        console.log(e);
    }
}

export function* watchLoginSaga() {
    yield takeLatest(LOGIN, LoginSaga);
}


function* FbLoginSaga(data:any):any{
    var request = {
        "accessToken":data.data
    };
    
    try{     
      const response=yield call(PostApi,"http://localhost:8089/api/auth/login/facebook","",request);
      if(response.status==200) { 
        const logindetail = {
            userName:response.data.username,
            AccessToken:response.data.authenticationToken,
            refreshToken:response.data.refreshToken

        }
        yield put(setLoginDetails(logindetail));
      }
      else yield put(setErrorMessage("Authentication Failed"));
    }
    catch(e) {
        console.log(e);
    }
}

export function* watchFbLoginSaga() {
    yield takeLatest(FB_LOGIN, FbLoginSaga);
}



function* GoogleLoginSaga(data:any):any{
    var request = {
        "accessToken":data.data        
    };
    
    try{     
      const response=yield call(PostApi,"http://localhost:8089/api/auth/login/google","",request);
      if(response.status==200) { 
        const logindetail = {
            userName:response.data.username,
            AccessToken:response.data.authenticationToken,
            refreshToken:response.data.refreshToken

        }
        yield put(setLoginDetails(logindetail));
      }
      else yield put(setErrorMessage("Authentication Failed"));
    }
    catch(e) {
        console.log(e);
    }
}

export function* watchGLoginSaga() {
    yield takeLatest(G_LOGIN, GoogleLoginSaga);
}
