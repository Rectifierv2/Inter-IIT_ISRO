import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThreeDMoon from "./Components/3d/moon.jsx"; 
import TwoDMoon from "./Components/2d/moon2d.jsx"; 
import SUBPIXEL from "./Components/subpixel/moon_sub_pixel.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/2d" element={<TwoDMoon />} /> 
        <Route path="/subpixel" element={<SUBPIXEL/>} />
        <Route path="/" element={<ThreeDMoon />} />  
      </Routes>
    </Router>
  );
}

export default App;
