import React, { useEffect, useState } from "react";
import "./Admin.css";
import { Link, useNavigate } from "react-router-dom";
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

        axios.get("http://localhost:5000/admin", {params : adminData})
        .then(res => {
            // console.log(res.data)
            dispatch({type: 'SET_ADMIN_NAME', payload: res.data.adminName});
            // setBackendAdmin(res.data.adminName)
            if(res.data.adminExist === "notExist"){
              setAdminExist(true);
            } else{
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
  return (
    <div className="admin">
      <h1 className="main-admin-header">Admin</h1>
      <div className="admin-wrapper">
        <h1 className="admin-headers">Admin Username</h1>
        <input type="text" className="admin-input" onChange={handleAdminName}/>
        <h1 className="admin-headers">Admin Key</h1>
        <input type="text" className="admin-input" onChange={handleAdminPassword}/>
        {adminExist && (
          <h1 className="in-headers-exist">Wrong Username or Password!!!</h1>
        )}
        <button className="admin-enter" onClick={handleEnter}>Enter</button>
        <div className="first-page">
        <Link to={'/signup'}>
            <h1 className="route-signin">SignUp</h1>
        </Link>
        <Link to={'/'}>
          <h1 className="route-admin">SignIn</h1>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;