import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './moon2d.css';  // Make sure the CSS file exists

const TwoDMoon = () => {
  const [texture, setTexture] = useState("/assets/lunar_texture8k.jpg");  // Default texture
  const [imageError, setImageError] = useState(false);  // State for handling image load errors
  const [coords, setCoords] = useState({ lat: 0, lon: 0 }); // Latitude and longitude
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const moonRef = useRef(null); // To reference the moon image container
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');  // Navigate back to the 3D page
  };

  // Handle texture change based on dropdown selection
  const handleDropdownChange = (event) => {
    const selectedCompound = event.target.value;
    switch (selectedCompound) {
      case "FeO":
        setTexture("/assets/feO_texture.jpg");
        break;
      case "CaO":
        setTexture("/assets/caO_texture.jpg");
        break;
      case "MgO":
        setTexture("/assets/mgO_texture.jpg");
        break;
      case "SiO2":
        setTexture("/assets/siO2_texture.jpg");
        break;
      case "Al2O3":
        setTexture("/assets/al2O3_texture.jpg");
        break;
      case "TiO2":
        setTexture("/assets/tiO2_texture.jpg");
        break;
      case "Na2O":
        setTexture("/assets/na2O_texture.jpg");
        break;
      default:
        setTexture("/assets/lunar_texture8k.jpg");
        break;
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setTexture("/assets/lunar_texture8k.jpg"); // Fallback to the default texture if there's an error
  };

  // Calculate coordinates based on mouse position
  const handleMouseMove = (e) => {
    const rect = moonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X relative to the moon image
    const y = e.clientY - rect.top;  // Mouse Y relative to the moon image

    // Map the mouse position to latitude and longitude
    const lon = ((x / rect.width) * 360) - 180; // Longitude range: -180 to 180
    const lat = ((y / rect.height) * 180) - 90;  // Latitude range: -90 to 90

    setCoords({
      lat: lat.toFixed(2),
      lon: lon.toFixed(2)
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 1, 3)); // Zoom level ranges from 1 to 3
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMoveDrag = (e) => {
    if (dragging) {
      const diffX = e.clientX - dragStart.x;
      const diffY = e.clientY - dragStart.y;

      moonRef.current.style.transform = `translate(${diffX}px, ${diffY}px)`;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    // Prevent dragging when not zoomed in
    if (zoomLevel <= 1) {
      moonRef.current.style.transform = "none";
    }

    // Clean up mouse move listeners for dragging
    window.addEventListener("mousemove", handleMouseMoveDrag);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveDrag);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoomLevel, dragging]);

  return (
    <div className="two-moon-container">
      <div 
        className="moon-background" 
        ref={moonRef} 
        onMouseMove={handleMouseMove} 
        onMouseDown={handleMouseDown}
        style={{ transform: `scale(${zoomLevel})` }}  // Apply zooming on the image
      >
        {/* Display the selected texture for the 2D page */}
        <img 
          src={texture}  // Dynamically updated texture
          alt="Moon Texture"
          className="moon-image"
          onError={handleImageError}  // Handle image loading errors
        />
      </div>

      {/* Fixed UI Elements */}
      <div className="ui-elements">
        <button onClick={handleBackClick}>Back to 3D</button>
        <select onChange={handleDropdownChange}>
          <option value="FeO">FeO</option>
          <option value="CaO">CaO</option>
          <option value="MgO">MgO</option>
          <option value="SiO2">SiO2</option>
          <option value="Al2O3">Al2O3</option>
          <option value="TiO2">TiO2</option>
          <option value="Na2O">Na2O</option>
        </select>
        <button onClick={handleZoomIn}>Zoom In</button>
        <div className="coordinates">
          <p>Latitude: {coords.lat}</p>
          <p>Longitude: {coords.lon}</p>
        </div>
      </div>
    </div>
  );
};

export default TwoDMoon;
