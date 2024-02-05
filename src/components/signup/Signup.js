import React, { useState } from "react";
import "./Signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate();

    const [signupName , setSignupName] = useState('');
    const [signupEmail , setSignupEmail] = useState('');
    const [signupPassword , setSignupPassword] = useState('');

    const handleSignupName = (e) => {
        setSignupName(e.target.value);
    }

    const handleSignupEmail = (e) => {
        setSignupEmail(e.target.value);
    }

    const handleSignupPassword = (e) => {
        setSignupPassword(e.target.value)
    }

    const handleRegister = () => {
        const signupData = {
            sendSignupName: signupName,
            sendSingupEmail: signupEmail,
            sendSignupPassword: signupPassword
        };

        axios.post("http://localhost:5000/signup", signupData)
            .then(res => {
                console.log(res.data);

                if (res.data.signup === 'signup') {
                    console.log('Sign up successfully');
                    navigate('/home')
                    // You can perform additional actions here or navigate to a different route
                }
            })
            .catch(err => console.log('Error found while posting data in signup endpoint', err));
    };




  return (
    <div className="signup">
      <h1 className="main-up-header">Sign Up</h1>
      <div className="signup-wrapper">
        <h1 className="up-headers">Name</h1>
        <input className="up-input" type="text" placeholder="example" onChange={handleSignupName} />
        <h1 className="up-headers">Email</h1>
        <input className="up-input" type="email" placeholder="example@gmail.com" onChange={handleSignupEmail}/>
        <h1 className="up-headers">Password</h1>
        <input className="up-input" type="password" placeholder="example123" onChange={handleSignupPassword}/>
            <button className="register" onClick={handleRegister}>Register</button>
        <div className="first-page">
        <Link to={'/'}>
          <h1 className="route-signin">SignIN</h1>
        </Link>
        <Link to={'/admin'}>
          <h1 className="route-admin">Admin</h1>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
