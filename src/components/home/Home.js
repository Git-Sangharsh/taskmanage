import React, { useState, useEffect } from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import AdminSide from "../adminSide/AdminSide";
import UserSide from "../userSide/UserSide";

const Home = () => {

  const adminName = useSelector((state) => state.adminName);
  const [isThisAdminOrUser, setIsThisAdminOrUser] = useState(!!adminName);

  useEffect(() => {
    setIsThisAdminOrUser(!!adminName);
  }, [adminName]);

  return (
    <div className="home">
      <div className="home-wrapper">
        {isThisAdminOrUser ? (
            <AdminSide />
        ) : (
            <UserSide />
        )}
      </div>
    </div>
  );
};

export default Home;
