import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserSide.css";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Completed from "../completed/Completed";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const UserSide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminName = useSelector((state) => state.adminName);
  const signInUserName = useSelector((state) => state.signInUserName);
  const displayUserName =
    adminName !== "" ? adminName : signInUserName || "Default Name";
  const mainTaskArray = useSelector((state) => state.userMainArray);
  const userEmail = useSelector((state) => state.signInEmail);
  const [forwardTask, setForwardTask] = useState(false);
  const [taskCheckboxStates, setTaskCheckboxStates] = useState({});
  const [viewTask, setViewTask] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [completeTask, setCompleteTask] = useState(false);
  const [leftAnimation, setLeftAnimation] = useState(false);
  const controls = useAnimationControls();

  const handleLeftAnimation = () => {
    setLeftAnimation(!leftAnimation);
    controls.start({ x: leftAnimation ? 0 : "-100%" });
  };

  const handleSubmitTask = async (taskTitle, taskId) => {
    try {
      const dataSend = {
        sendTaskEmail: userEmail,
        sendTaskTitle: taskTitle,
      };

      await axios.post("https://taskmanagebackend-bdus.onrender.com/completed", dataSend);

      // Update the state after a successful response from the server
      const updatedTasks = mainTaskArray.filter((task) => task._id !== taskId);
      dispatch({ type: "SET_USER_MAIN_ARRAY", payload: updatedTasks });
      setForwardTask(true);

      // Request the remaining tasks after completion
      const remainingTasksResponse = await axios.get(
        `http://localhost:5000/completedget?sendTaskEmail=${userEmail}`
      );
      const remainingTasks = remainingTasksResponse.data.completeUpdate;

      dispatch({ type: "SET_USER_MAIN_ARRAY", payload: remainingTasks });

      if (taskCheckboxStates[taskId]) {
        handleCheckBox(taskId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const handleDeleteTask = (taskId) => {
    const taskDelete = {
      emailSend: userEmail,
      taskNameSend: taskId,
    };

    axios
      .post("http://localhost:5000/deleted", taskDelete)
      .then(async (res) => {
        // Update the state only after a successful response from the server
        const updatedTasks = mainTaskArray.filter(
          (task) => task._id !== taskId
        );
        dispatch({ type: "SET_USER_MAIN_ARRAY", payload: updatedTasks });

        // Request the remaining tasks after deletion
        const remainingTasksResponse = await axios.get(
          `http://localhost:5000/remaining?emailSend=${userEmail}`
        );
        const remainingTasks = remainingTasksResponse.data.remainingTasks;
        // Update the state with the remaining tasks
        dispatch({ type: "SET_USER_MAIN_ARRAY", payload: remainingTasks });
      })
      .catch((err) => {
        console.log("error found inside ", err);
      });
  };

  const handleCheckboxCheck = () => {
    setCompleteTask(!completeTask);
  };

  const handleLogOut = () => {
    dispatch({ type: "SET_ADMIN_NAME", payload: "" });
    dispatch({ type: "SET_SIGNIN_NAME", payload: "" });
    const emptyToken = "";
    localStorage.setItem("token", emptyToken);
    navigate("/");
  };

  const handleViewTask = () => {
    setViewTask(true);
    setSelectedTaskId("");
    // setSelectedTaskDesc("");
  };

  // !!!!!!!!!!!!!!
  const handleViewTaskCompleted = () => {
    setViewTask(false);
    // setViewTaskCompleted(true)
  };

  const handleCheckBox = (taskId) => {
    setTaskCheckboxStates((prevStates) => ({
      ...prevStates,
      [taskId]: !prevStates[taskId],
    }));
  };

  const handleTaskClick = (task) => {
    if (selectedTaskId === task._id) {
      setSelectedTaskId("");
      // setSelectedTaskDesc("");
    } else {
      setSelectedTaskId(task._id);
      // setSelectedTaskDesc(task.taskAssignDesc);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.get("http://localhost:5000/userEmails");
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    if (forwardTask) {
      const timeoutId = setTimeout(() => {
        setForwardTask(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [forwardTask]);

  useEffect(() => {
    axios.get("http://localhost:5000/");
  }, []);

  return (
    <div className="home-wrapper">
      <AnimatePresence>
        {leftAnimation ? (
          <motion.div className="left-home-hide" animate={controls}>
            <h1 className="profile">{displayUserName.toUpperCase()}</h1>
            <h1
              className={
                viewTask ? "headers-left-home-active" : "headers-left-home"
              }
              onClick={handleViewTask}
            >
              Task Pending
            </h1>
            <h1
              onClick={handleViewTaskCompleted}
              className={
                !viewTask ? "headers-left-home-active" : "headers-left-home"
              }
            >
              Task Completed
            </h1>
            {/* <h1 className="headers-left-home">Task Status</h1> */}
            <h1 className="headers-left-home" onClick={handleLogOut}>
              Log Out
            </h1>
          </motion.div>
        ) : (
          <motion.div className="left-home-hide" animate={controls}>
            <h1 className="profile">{displayUserName.toUpperCase()}</h1>
            <h1
              className={
                viewTask ? "headers-left-home-active" : "headers-left-home"
              }
              onClick={handleViewTask}
            >
              Task Pending
            </h1>
            <h1
              onClick={handleViewTaskCompleted}
              className={
                !viewTask ? "headers-left-home-active" : "headers-left-home"
              }
            >
              Task Completed
            </h1>
            {/* <h1 className="headers-left-home">Task Status</h1> */}
            <h1 className="headers-left-home" onClick={handleLogOut}>
              Log Out
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* !!!!!!!!!!!!! position absolute */}

      {leftAnimation ? (
        <div className="fill-true"></div>
      ) : (
        <div className="fill"></div>
      )}
      {leftAnimation ? (
        <motion.div
          className="left-icon-absolute"
          onClick={handleLeftAnimation}
        >
          <KeyboardDoubleArrowLeftIcon className="icon-class" fontSize="30px" />
        </motion.div>
      ) : (
        <motion.div
          className="left-icon-absolute-in"
          onClick={handleLeftAnimation}
        >
          <KeyboardDoubleArrowRightIcon
            className="icon-class"
            fontSize="30px"
          />
        </motion.div>
      )}

      <div className="right-home">
        {viewTask ? (
          <div className="inner-right-home">
            <h1 className="main-assign-h1" onClick={handleLeftAnimation}>
              TASK PENDING
            </h1>
            {mainTaskArray.map((i) => (
              <div
                key={i._id}
                className="task-box"
                onClick={() => {
                  handleTaskClick(i);
                  handleCheckboxCheck(i._id);
                }}
              >
                <div className="row-one">
                  <div className="row-one-inner-div">
                    <input
                      type="checkbox"
                      checked={taskCheckboxStates[i._id] || false}
                      onChange={() => {
                        handleCheckBox(i._id);
                        if (!taskCheckboxStates[i._id]) {
                          handleSubmitTask(
                            i.taskAssignTitle,
                            i.taskAssignDesc,
                            i._id
                          );
                        }
                      }}
                      className="checkbox-class"
                    />
                    <h1
                      className={
                        taskCheckboxStates[i._id]
                          ? "task-header-checked"
                          : "task-header-userside"
                      }
                    >
                      {i.taskAssignTitle.toUpperCase()}
                    </h1>
                  </div>
                  <DeleteIcon
                    className="delete-icon"
                    fontSize="30px"
                    onClick={() => handleDeleteTask(i.taskAssignTitle)}
                  />
                </div>
                <div className="row-two">
                  {selectedTaskId === i._id && (
                    <div className="selected-task-desc">
                      <DoubleArrowIcon fontSize="30px" className="arrow-icon" />
                      <h1 className="row-two-header">
                        {i.taskAssignDesc.toUpperCase()} -- Task Assign By Admin
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="right-home-completed">
            {!viewTask && <Completed />}
          </div>
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
            <h1 className="forwardTask-header">Task Assign Successfully!!!!</h1>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserSide;
