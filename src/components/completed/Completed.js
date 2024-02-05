import React, { useState, useEffect } from "react";
import "./Completed.css";
import axios from "axios";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { useDispatch } from "react-redux";

const Completed = () => {

  const dispatch = useDispatch();
  const [completedTasks, setCompletedTasks] = useState([]);
  const userEmail = useSelector((state) => state.signInEmail);
  // const adminName = useSelector((state) => state.adminName);
  const [checked, setChecked] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [completeSortState, setCompleteSortState] = useState(false); // Default to sorting in reverse order

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/completedget?sendTaskEmail=${userEmail}`
        );
        const remainingTasks = response.data.completedTasks;
        setCompletedTasks(remainingTasks);
      } catch (error) {
        console.error("Error fetching completed tasks:", error.message);
      }
      setChecked(true);
    };

    fetchData();
  }, [userEmail]);

  const handleCompletedDelete = async (userEmail, userTitle) => {
    try {
      const dataUserID = {
        sendUserEmail: userEmail,
        sendUserTitle: userTitle,
      };
      await axios
        .post("http://localhost:5000/del", dataUserID)
        .then((res) => setCompletedTasks(res.data.taskCompleted))
        .catch((err) => console.log(err));
      console.log(userEmail, userTitle);
    } catch (error) {
      console.log(
        "error found in the del Endpoint inside completed.js : " + error.message
      );
    }
  };

  const handlCompletedCheck = async (userEmail, userTitle) => {
    try {
      const sendData = {
        sendUserEmail: userEmail,
        sendUserTitle: userTitle,
      };
      await axios.post("http://localhost:5000/undo", sendData)
        .then((res) => {
          setCompletedTasks(res.data.taskCompleted);
          dispatch({ type: "SET_USER_MAIN_ARRAY", payload: res.data.tasks });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(
        "Error found in the undo endpoint inside completed.js: " + error.message
      );
    }
  };


  const handleTaskClick = (task) => {
    if (selectedTaskId === task._id) {
      setSelectedTaskId("");
      // setSelectedTaskDesc("");
    } else {
      setSelectedTaskId(task._id);
      // setSelectedTaskDesc(task.taskAssignDesc);
    }
    // console.log("task is ",task)
  };

  const handleSort = () => {
    setCompleteSortState(!completeSortState);
  };

  // console.log("Completed Task is ", completedTasks);
  // console.log("adminName is adminName", adminName);
  // console.log("adminName is signInEmail", userEmail);
  return (
    <div className="completed">
      <h1 className="completed-main-header">TASK COMPLETED</h1>
      <div className="completed-map">
        {completedTasks ? (
          (completeSortState
            ? [...completedTasks].reverse()
            : completedTasks
          ).map((i) => (
            <div className="completed-box">
              <div
                className="parent-completed-row1"
                onClick={() => {
                  handleTaskClick(i);
                }}
              >
                <div className="completed-row1">
                  <input
                    type="checkbox"
                    // defaultChecked={true}
                    checked={checked}
                    className="completed-row1-checkbox"
                    readOnly
                    onClick={() =>
                      handlCompletedCheck(userEmail, i.taskCompletedTitle)
                    }
                  />
                  <h1 className="completed-row1-header">
                    {i.taskCompletedTitle.toUpperCase()}
                  </h1>
                </div>
                <DeleteIcon
                  className="completed-delete-icon"
                  fontSize="30px"
                  onClick={() =>
                    handleCompletedDelete(userEmail, i.taskCompletedTitle)
                  }
                />
              </div>

              <div className="completed-row2">
                {selectedTaskId === i._id && (
                  <div className="selected-task-desc">
                    <DoubleArrowIcon fontSize="30px" className="arrow-icon" />
                    <h1 className="row-two-header">
                      {`${i.taskCompletedDesc.toUpperCase()} --- Task Given By Admin`}
                    </h1>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div></div>
        )}
        {completeSortState ? (
          <div className="hold-sort" onClick={handleSort}>
            <KeyboardDoubleArrowDownIcon
              className="completed-sort-icon"
              fontSize="30px"
            />
            <h1 className="sort-header">SWITCH TO ORIGINAL</h1>
          </div>
        ) : (
          <div className="hold-sort" onClick={handleSort}>
            <KeyboardDoubleArrowUpIcon
              className="completed-sort-icon"
              fontSize="30px"
            />
            <h1 className="sort-header">SWITCH TO RECENT</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;
