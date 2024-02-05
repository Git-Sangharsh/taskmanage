import React from "react";
import "./App.css";
import Signup from "./components/signup/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/signin/Signin";
import Admin from "./components/admin/Admin";
import Home from "./components/home/Home";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
