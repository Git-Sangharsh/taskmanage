import React, { useEffect, useState } from "react";
import "./Admin.css";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';

const Admin = () => {

    const dispatch = useDispatch();
    //this shit is for routing purpose
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminExist, setAdminExist] = useState(false);

    // //!Fetching Admin name from the backend
    // const [backendAdmin, setBackendAdmin] = useState('');

    const handleAdminName = (e) => {
        setAdminName(e.target.value);
    }

    const handleAdminPassword = (e) => {
        setAdminPassword(e.target.value);
    }

    const handleEnter = () => {
        const adminData = {
            sendAdminName : adminName,
            sendAdminPassword : adminPassword
        }

        axios.get("https://taskmanagebackend-bdus.onrender.com/admin", {params : adminData, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
        .then(res => {
            dispatch({type: 'SET_ADMIN_NAME', payload: res.data.adminName});
            if(res.data.adminExist === "notExist"){
              setAdminExist(true);
            } else{
              const authToken = res.data.auth;
              localStorage.setItem("token", authToken);
              navigate('/home');
            }
        })
        .catch (err => {
            console.log('error found in the admin endpoint', err)
        })
    }

    useEffect(() => {
      if(adminExist){
        const timeoutId = setTimeout(() => {
          setAdminExist(false);
        }, 3000);
        return () => clearTimeout(timeoutId);
      }
    }, [adminExist])

    const handleRootRoute = () => {
      navigate('/');
    }

    const handleSignUpRoute = () => {
      navigate('/signup');
    }

  return (
    <div className="admin">
      <h1 className="main-admin-header">Admin</h1>
      <div className="admin-wrapper">
        <h1 className="admin-headers">Username</h1>
        <input type="text" className="admin-input" onChange={handleAdminName}/>
        <h1 className="admin-headers">Key</h1>
        <input type="password" className="admin-input" onChange={handleAdminPassword}/>
        {adminExist && (
          <h1 className="in-headers-exist">Wrong Username or Password!!!</h1>
        )}
        <button className="admin-enter" onClick={handleEnter}>Enter</button>
        <div className="first-page">
            <h1 className="route-signin" onClick={handleSignUpRoute}>SignUp</h1>
            <h1 className="route-admin" onClick={handleRootRoute}>SignIn</h1>
        </div>
      </div>
    </div>
  );
};

export default Admin;
