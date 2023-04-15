import React,{useState, useEffect} from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import {GoogleLogin} from '@react-oauth/google';
import avatar from "../../themes/images/avatar.png";
import { useDispatch,useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import { login,fbLogin, gLogin} from "../../redux/action";

const LoginPage:React.FC=()=>{

  const [isSignup ,SetIsSignup] = useState(false); 
  const [userName,setUserName] = useState("");
  const [password,setPassword] = useState("");
  const [email,setEmailID] = useState("");
  const LoginDetails = useSelector((state:any)=>state.LoginDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignIn = () =>{
    const payload=
    {"userName":userName,
    "password":password
    };
    const loginrequest =login(payload);
    dispatch(loginrequest);
  }
  useEffect(()=>{
    console.log(LoginDetails);
    if(LoginDetails.AccessToken)
    navigate("/LandingPage");
  },[LoginDetails.AccessToken])
  

    return(
        <div className="fullScreen">
      <div className="loginForm ">
        <form onSubmit={(e)=>{e.preventDefault()}}>
        <div className="avatar">
			         <img src={avatar} alt="Avatar"/>
		    </div>
        <div className="form-group mb-4">
        	<input type="text" className="form-control" name="username" placeholder="Username" value={userName} onChange = {(e)=>{setUserName(e.target.value)}}/>
        </div>
        <div className="form-group mb-4">
        	<input type="password" className="form-control" name="username" placeholder="Password" value={password} onChange = {(e)=>{setPassword(e.target.value)}}/>
        </div>

        <div className="form-group mb-4">
        	<input type="email" className="form-control" name="Email-ID" placeholder="Email-ID" hidden={!isSignup} value={email} onChange = {(e)=>{setEmailID(e.target.value)}}/>
        </div>

        <div className="form-group submitbutton">
            <button type="submit" className="btn btn-lg btn-block" onClick={SignIn}>Sign in</button>
        </div>
        </form>
        <h2><span>OR</span></h2>
        <p className="authheader">Log in using </p>
        <div className="row">
          <div className="col-12 " style = {{display: "flex",justifyContent: "center",marginBottom: "10px"}}>
        <FacebookLogin
           appId="572746031476272"
           onSuccess={(response) => {dispatch(fbLogin(response.accessToken))}}
           className={"bg-white fb-class"}
        /> 
        </div>
        <div className="col-12" style = {{display: "flex",justifyContent: "center",marginBottom: "10px"}}> 
        <GoogleLogin
        onSuccess={(Credential)=>{dispatch(gLogin(Credential.credential))}}
        />
        </div>
          </div>
          </div>        
        </div>
    )
}
export default LoginPage;