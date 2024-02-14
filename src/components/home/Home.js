import React, { useState, useEffect } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import AdminSide from "../adminSide/AdminSide";
import UserSide from "../userSide/UserSide";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const adminName = useSelector((state) => state.adminName);
  const userName = useSelector((state) => state.signInUserName);
  const [isThisAdminOrUser, setIsThisAdminOrUser] = useState(!!adminName);

  useEffect(() => {
    setIsThisAdminOrUser(!!adminName);
  }, [adminName]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/");
      return;
    } else if (adminName === "" && userName === "") {
      navigate("/");
      return;
    }
  }, [navigate, adminName, userName]);

  const [root, setRoot] = useState(false);

  useEffect(() => {
    const checkPageReload = () => {
      window.addEventListener("beforeunload", (event) => {
        if (event.currentTarget.performance.navigation.type === 1) {
          setRoot(true);
        }
      });
    };
    checkPageReload();

    return () => {
      window.removeEventListener("beforeunload", () => {}); // Cleanup the event listener
    };
  });

  useEffect(() => {
    if (root) {
      navigate("/");
      const emptyToken = "";
      localStorage.setItem("token", emptyToken);
    }
  }, [root, navigate]);

  return (
    <div className="home">
      <div className="home-wrapper">
        {isThisAdminOrUser ? <AdminSide /> : <UserSide />}
      </div>
      {/* <Random /> */}
    </div>
  );
};

export default Home;
