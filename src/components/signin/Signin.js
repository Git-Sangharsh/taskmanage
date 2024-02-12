import React, { useState, useEffect } from "react";
import "./Signin.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  const handleSigninEmail = (e) => {
    setSigninEmail(e.target.value);
  };

  const handleSigninPassword = (e) => {
    setSigninPassword(e.target.value);
  };

  const handleSigninBtn = () => {
    // console.log(signinEmail, signinPassword)
    const signinData = {
      sendSigninEmail: signinEmail,
      sendSigninPassword: signinPassword,
    };

    axios
      .get("http://localhost:5000/signin", { params: signinData })
      .then((res) => {
        console.log(res.data);
        if (res.data.signin === "signin") {
          dispatch({ type: "SET_SIGNIN_NAME", payload: res.data.user });
          dispatch({ type: "SET_SIGNIN_EMAIL", payload: res.data.userEmail });
          dispatch({ type: "SET_USER_TASK", payload: res.data.usetTask });
          dispatch({ type: "SET_USER_DESC", payload: res.data.userDesc });
          dispatch({
            type: "SET_USER_MAIN_ARRAY",
            payload: res.data.userMainArray,
          });
          navigate("/home");
        } else if (res.data.incorrect === "wrong") {
          console.log("password is incorrect kindly check out!!!");
          setIncorrectPassword(true);
        } else {
          console.log("Sign in failed");
        }
      })
      .catch((err) => {
        console.log("error found while fetch in signin", err);
        setUserNotCreated(true);
      });
  };

  useEffect(() => {
    if(userNotCreated){
      const timeoutId = setTimeout(() => {
        setUserNotCreated(false);
      },3000)
      return () => clearTimeout(timeoutId)
    }

    if(incorrectPassword){
      const timeoutId = setTimeout(() => {
        setIncorrectPassword(false);
      }, 3000)
      return () => clearTimeout(timeoutId)
    }
  }, [userNotCreated, incorrectPassword])

  // console.log("know is ",know)
  return (
    <div className="signin">
      <h1 className="main-in-header">SignIn</h1>
      <div className="signin-wrapper">
        <h1 className="in-headers">Email</h1>
        <input type="text" className="in-input" onChange={handleSigninEmail} />
        {userNotCreated && (
          <h1 className="in-headers-exist">User Not Exist !!!</h1>
        )}
        <h1 className="in-headers">Password</h1>
        <input
          type="password"
          className="in-input"
          onChange={handleSigninPassword}
        />
        {incorrectPassword && (
          <h1 className="in-headers-wrong">Incorrect Password !!!</h1>
        )}
        <button className="btn-signin" onClick={handleSigninBtn}>
          Sign In
        </button>
        <div className="first-page">
          <Link to={"/signup"}>
            <h1 className="route-signin">SignUp</h1>
          </Link>
          <Link to={"/admin"}>
            <h1 className="route-admin">Admin</h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
