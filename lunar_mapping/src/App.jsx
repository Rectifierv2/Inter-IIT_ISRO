import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThreeDMoon from "./Components/3d/moon.jsx"; 
import TwoDMoon from "./Components/2d/moon2d.jsx"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/2d" element={<TwoDMoon />} />  {/* Default to 2D page */}
        <Route path="/" element={<ThreeDMoon />} />  {/* 3D page route */}
      </Routes>
    </Router>
  );
}

export default App;
