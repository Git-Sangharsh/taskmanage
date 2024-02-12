import React, { useState, useEffect } from "react";
import "./AdminSide.css";
import axios from "axios";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminStatus from "../adminStatus/AdminStatus.js";

const AdminSide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminName = useSelector((state) => state.adminName);
  const signInUserName = useSelector((state) => state.signInUserName);
  const displayUserName =
    adminName !== "" ? adminName : signInUserName || "Default Name";
  // const [selectedDescIndex, setSelectedDescIndex] = useState(null);

  const [selectGmail, setSelectGmail] = useState("");
  const [userEmails, setUserEmails] = useState([]);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [forwardTask, setForwardTask] = useState(false);
  // const [times, setTimes] = useState("");
  const [viewAssign, setViewAssign] = useState(true);

  const handlViewAssign = () => {
    setViewAssign(!viewAssign);
  };

  const handleGmail = (e) => {
    setSelectGmail(e.target.value);
  };

  const handleAssignTitle = (e) => {
    setAssignTitle(e.target.value);
  };

  const handleAssignDesc = (e) => {
    setAssignDesc(e.target.value);
  };

  const handleSubmitTask = () => {
    const sendTaskData = {
      emailTask: selectGmail,
      titleTask: assignTitle,
      descTask: assignDesc,
    };

    axios
      .post("http://localhost:5000/assigntask", sendTaskData)
      .then((res) => {
        console.log(res); // Log the entire response
        console.log(res.data.taskArray); // Log the taskArray specifically
        setForwardTask(true);
        // alert("Task Asign Successful");
        setAssignTitle("");
        setAssignDesc("");
      })
      .catch((err) => {
        console.log("error while assigning the task: ", err.message);
      });

    // console.log(selectGmail, assignTitle, assignDesc)
  };

  const handleDiscard = () => {
    setSelectGmail("");
  };

  const handleLogOut = () => {
    dispatch({ type: "SET_ADMIN_NAME", payload: "" });
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/userEmails");
        setUserEmails(response.data.userEmails);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    if (forwardTask) {
      const timeoutId = setTimeout(() => {
        setForwardTask(false);
      }, 2000);

      // Clear the timeout if the component unmounts or forwardTask becomes false before 4 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [forwardTask]);

  // console.log('timess is ', times);

  return (
    <div className="home-wrapper">
      <div className="left-home">
        <h1 className="profile">{displayUserName}</h1>
        <h1 className="headers-left-home" onClick={handlViewAssign}>
          Task Assign
        </h1>
        <h1 className="headers-left-home" onClick={handlViewAssign}>
          Task Status
        </h1>
        <h1 className="headers-left-home" onClick={handleLogOut}>
          Log Out
        </h1>
      </div>
      <div className="right-home">
        {viewAssign ? (
          <div className="assign">
            <h1 className="main-assign-h1">Assign Task</h1>
            <div className="assign-wrapper">
              <select
                value={selectGmail}
                onChange={handleGmail}
                className="assign-gmail assign-common-input"
              >
                <option value="">Select Gmail</option>
                {userEmails.map((email, index) => (
                  <option key={index} value={email} className="gmail-options">
                    {email}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter Task Title.."
                className="assign-title assign-common-input"
                onChange={handleAssignTitle}
              />
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                placeholder="Enter Task Description..."
                className="assign-desc assign-common-input"
                onChange={handleAssignDesc}
              ></textarea>
              <div className="assign-cancel">
                <button className="btn-assign" onClick={handleSubmitTask}>
                  Assign
                </button>
                <button className="btn-discard" onClick={handleDiscard}>
                  Discard
                </button>
                <button
                  className="btn-discard"
                >
                  animate me
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>{!viewAssign && <AdminStatus />}</div>
        )}

        {forwardTask && (
            <motion.div
              className="forwardTask"
              initial={{ opacity: 0, y: 60 }}
              // animate={{opacity: 1, y: [0, 0, 0 ] }}
              animate={{ opacity: 1, y: [0, 0] }}
              exit={{ opacity: 0, y: 60 }}
              transition={{
                duration: 2,
                type: "spring",
                ease: "easeIn",
                times: [1, 1],
              }}
            >
              <h1 className="forwardTask-header">
                Task Assign Successfully!!!!
              </h1>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminSide;
