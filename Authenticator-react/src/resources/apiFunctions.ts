import axios from 'axios';
import {spinnerService} from "../components/Spinner";
export function getApi(url: any | undefined) {
    const request = {
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        }
    }
    spinnerService.showSpinner();
    return axios({
        method: 'GET',
        url,
        headers: request.headers,
    })
    .then((request)=>request)
    .catch((err)=>err) 
    .finally(()=>{
        spinnerService.hideSpinner();
    })
}

export function PostApi(url: any | undefined,token:string,body:any) {
    const request = {
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            "Authorization": token !== '' ? 'Bearer ' + token : undefined,
        }
    }
    if(request.headers.Authorization === undefined)
    delete request.headers.Authorization;
    spinnerService.showSpinner();
    return axios({
        method: 'POST',
        url,
        headers: request.headers,
        data: body !== undefined ? JSON.stringify(body) : null,
    })


    .then((request)=>request)
    .catch((err)=>err) 
    .finally(()=>{
        spinnerService.hideSpinner();
    })
}