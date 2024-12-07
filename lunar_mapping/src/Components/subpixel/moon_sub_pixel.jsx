import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './subpixel.css';  // Make sure the CSS file exists

const SUBPIXEL = () => {
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
      case "Al":
        setTexture("/assets/Lunar_Surface_Map_with_Al_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "Cl":
        setTexture("/assets/Lunar_Surface_Map_with_Cl_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "Mg":
        setTexture("/assets/Lunar_Surface_Map_with_Mg_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "Na":
        setTexture("/assets/Lunar_Surface_Map_with_Na_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "O":
        setTexture("/assets/Lunar_Surface_Map_with_O_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "P":
        setTexture("/assets/Lunar_Surface_Map_with_P_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "S":
        setTexture("/assets/Lunar_Surface_Map_with_S_Intensity_Polygon_Overlay_E000N0000.png");
        break;
      case "Si":
        setTexture("/assets/Lunar_Surface_Map_with_Si_Intensity_Polygon_Overlay_E000N0000.png");
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

  // Add a zoom out function
  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 1, 1)); // Zoom level can't go below 1
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
          <option value="Al">AL</option>
          <option value="Cl">Cl</option>
          <option value="Mg">Mg</option>
          <option value="Na">Na</option>
          <option value="O">O</option>
          <option value="P">P</option>
          <option value="S">S</option>
          <option value="Si">Si</option>
        </select>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button> {/* Zoom Out Button */}
        <div className="coordinates">
          <p>Latitude: {coords.lat}</p>
          <p>Longitude: {coords.lon}</p>
        </div>
      </div>
    </div>
  );
};

export default SUBPIXEL;
