import React, { useState, useEffect } from "react";
import "./Signin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const mainUserTask = useSelector((state) => state.userTask)
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [userNotCreated, setUserNotCreated] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSigninEmail = (e) => {
    setSigninEmail(e.target.value);
    if(e.target.value.endsWith("@gmail.com")){
      setEmailValid(true);
      setShowError(false);
    } else{
      setEmailValid(false);
      setShowError(true);
    }
  };

  const handleSigninPassword = (e) => {
    setSigninPassword(e.target.value);
  };

  const handleSigninBtn = () => {
    // console.log(signinEmail, signinPassword)
    if (emailValid) {
      const signinData = {
        sendSigninEmail: signinEmail,
        sendSigninPassword: signinPassword,
      };

      axios
        .get("https://taskmanagebackend-bdus.onrender.com/signin", {
          params: signinData,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.signin === "signin") {
            dispatch({ type: "SET_SIGNIN_NAME", payload: res.data.user });
            dispatch({ type: "SET_SIGNIN_EMAIL", payload: res.data.userEmail });
            dispatch({ type: "SET_USER_TASK", payload: res.data.usetTask });
            dispatch({ type: "SET_USER_DESC", payload: res.data.userDesc });
            dispatch({
              type: "SET_USER_MAIN_ARRAY",
              payload: res.data.userMainArray,
            });
            const authToken = res.data.auth;
            localStorage.setItem("token", authToken);
            navigate("/home");
          } else if (res.data.incorrect === "wrong") {
            setIncorrectPassword(true);
          }
        })
        .catch((err) => {
          setUserNotCreated(true);
        });
    } else {
      setShowError(false);
    }
  };

  useEffect(() => {
    if (userNotCreated) {
      const timeoutId = setTimeout(() => {
        setUserNotCreated(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }

    if (incorrectPassword) {
      const timeoutId = setTimeout(() => {
        setIncorrectPassword(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [userNotCreated, incorrectPassword]);

  const handleSignUpRoute = () => {
    navigate('/signup');
  }

  const handleAdminRoute = () => {
    navigate('/admin');
  }
  return (
    <div className="signin">
      <h1 className="main-in-header">SignIn</h1>
      <div className="signin-wrapper">
        <h1 className="in-headers">Email</h1>
        <input type="text" className="in-input" onChange={handleSigninEmail} placeholder="s@gmail.com"/>
        {userNotCreated && (
          <h1 className="in-headers-exist">User Not Exist !!!</h1>
        )}
        {showError && <h1 className="in-headers-exist"> Missing "@gmail.com"</h1>}
        <h1 className="in-headers">Password</h1>
        <input
          type="password"
          className="in-input"
          onChange={handleSigninPassword}
          placeholder="s"
        />
        {incorrectPassword && (
          <h1 className="in-headers-wrong">Incorrect Password !!!</h1>
        )}
        <button className="btn-signin" onClick={handleSigninBtn}>
          Sign In
        </button>
        <div className="first-page">
            <h1 className="route-signin" onClick={handleSignUpRoute}>SignUp</h1>
            <h1 className="route-admin" onClick={handleAdminRoute}>Admin</h1>
        </div>
      </div>
    </div>
  );
};

export default Signin;
