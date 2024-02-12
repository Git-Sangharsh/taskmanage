import React from "react";
import { useState, useEffect } from "react";
import "./AdminStatus.css";
import axios from "axios";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const AdminStatus = () => {
  const [selectGmail, setSelectGmail] = useState("");
  const [userEmails, setUserEmails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const checked = true;
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleGmail = (e) => {
    setSelectGmail(e.target.value);
    axios
      .get(`http://localhost:5000/getTask?value=${e.target.value}`)
      .then((response) => {
        // Handle the response data if needed
        setTasks(response.data.mainTasks);
        setCompletedTasks(response.data.complete);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/userEmails");
        setUserEmails(response.data.userEmails);
      } catch (error) {
        console.log("error from the AdminStatus ", error);
      }
    };
    fetchData();
  }, []);

  console.log("tasks is ", tasks);

  const handleTaskClick = (task) => {
    if (selectedTaskId === task._id) {
      setSelectedTaskId("");
    } else {
      setSelectedTaskId(task._id);
    }
  };

  console.log("completed task is", completedTasks)
  return (
    <div className="adminstatus">
      <h1 className="main-assign-h1">Task Status</h1>
      <div className="adminstatus-wrapper">
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
        {tasks ? (
          <div className="status-map">
            <h1 className="status-header-pending">Pending Task of {selectGmail.toUpperCase()}</h1>
            {tasks.map((i,index) => (
              <div
                className="admin-grid"
                onClick={() => {
                  handleTaskClick(i);
                }}
                key={i.id}
              >
                <div className="parent-admin-row1">
                  <div className="admin-row1">
                    {/* <input
                      type="checkbox"
                      // defaultChecked={true}
                      checked={checked}
                      className="completed-row1-checkbox"
                      readOnly
                    /> */}
                    <h1 className="completed-row1-count">{index + 1}.</h1>
                    <h1 className="completed-row1-header">
                      {i.taskAssignTitle.toUpperCase()}
                    </h1>
                  </div>
                  <div className="admin-row2">
                    {selectedTaskId === i._id && (
                      <div className="admin-task-desc">
                        <DoubleArrowIcon
                          fontSize="30px"
                          className="arrow-icon"
                        />
                        <h1 className="row-two-header">
                          {`${i.taskAssignDesc.toUpperCase()} --- Task Given By Admin`}
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>

      {/* //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {completedTasks ? (
          <div className="status-map">
            <h1 className="status-header-pending">Completed Task of {selectGmail.toUpperCase()}</h1>
            {completedTasks.map((i) => (
              <div
                className="admin-grid"
                onClick={() => {
                  handleTaskClick(i);
                }}
                key={i.id}
              >
                <div className="parent-admin-row1">
                  <div className="admin-row1">
                    <input
                      type="checkbox"
                      // defaultChecked={true}
                      checked={checked}
                      className="completed-row1-checkbox"
                      readOnly
                    />
                    {/* <h1 className="completed-row1-count">{index + 1}.</h1> */}
                    <h1 className="completed-header">
                      {i.taskCompletedTitle.toUpperCase()}
                    </h1>
                  </div>
                  <div className="admin-row2">
                    {selectedTaskId === i._id && (
                      <div className="admin-task-desc">
                        <DoubleArrowIcon
                          fontSize="30px"
                          className="arrow-icon"
                        />
                        <h1 className="row-two-header">
                          {`${i.taskCompletedDesc.toUpperCase()} --- Task Given By Admin`}
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
    </div>
  );
};

export default AdminStatus;
