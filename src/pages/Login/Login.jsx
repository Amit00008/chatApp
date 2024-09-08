import React, { useState } from 'react'
import '../Login/Login.css'
import assets from '../../assets/assets'
import { signup, Login , resetPass} from '../../config/firebase'
const login = () => {

    const [CurrState,SetCurrState] = useState("Sign Up");
    const [userName,SetUserName] = useState("");
    const [email,SetEmail] = useState("");
    const [password,SetPassword] = useState("");


const onSubmitHandler = (event) => {

  event.preventDefault();
  if (CurrState==="Sign Up"){
    signup(userName,email,password);
  }
  else {
    Login(email,password)
  }
}


  return (
    <div className='login'>

        <img src={assets.logo_big} alt="" className='logo' />
        <form onSubmit={onSubmitHandler} className="login-form">
            <h2>{CurrState}</h2>
            {CurrState === "Sign Up"?<input onChange={(e)=>SetUserName(e.target.value) } value={userName} type="text" placeholder='Username' className="form-input" required/>:null}
            <input onChange={(e)=>SetEmail(e.target.value)} value={email} type="email" placeholder='Email adress' className="form-input" />
            <input onChange={(e)=>SetPassword(e.target.value)} value={password} type="password" placeholder='Password' className="form-input" required/>
            <button type="submit">{CurrState === "Sign Up"?"Create Account":"Login now"}</button>
            <div className="login-term">
                <input type="checkbox" />
                
                <p>Agree to the user terms of use of privacy policy</p>
            </div>
            <div className="login-forgot">
              {

                CurrState === "Sign Up"?
                <p className="login-toggle">Already have an account? <span onClick={()=>SetCurrState("Login")}>Login here</span></p>
                :<p className="login-toggle">Create an account <span onClick={()=>SetCurrState("Sign Up")}>Click here</span></p>

              }

              {CurrState === "Login" ? <p className="login-toggle">Forgot <span onClick={()=>{resetPass(email)}}>Reset here</span></p> : null}

                
            </div>
        </form>
      
    </div>
  )
}

export default login
