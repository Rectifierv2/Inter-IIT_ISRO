import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './moon2d.css';  // Make sure the CSS file exists

const TwoDMoon = () => {
  const [texture, setTexture] = useState("/assets/lunar_texture8k.jpg");  // Default texture
  const [imageError, setImageError] = useState(false);  // State for handling image load errors
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');  // Navigate back to the 3D page
  };

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

  return (
    <div className="two-moon-container">
      <div className="moon-background">
        {/* Display the selected texture for the 2D page */}
        <img 
          src={texture}  // Dynamically updated texture
          alt="Moon Texture"
          className="moon-image"
          onError={handleImageError}  // Handle image loading errors
        />
      </div>
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
      </div>
    </div>
  );
};

export default TwoDMoon;
