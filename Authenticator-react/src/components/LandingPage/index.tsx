import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingPage:React.FC = () =>{
    const LoginDetails= useSelector((state:any)=>state.LoginDetails);
    const navigate = useNavigate();
    useEffect(()=>{
        console.log(LoginDetails);
        if(LoginDetails.AccessToken=="")
        navigate("/");
      },[LoginDetails.AccessToken])

    return (
        <div>
            {LoginDetails.userName}
        </div>
    )


}

export default LandingPage;