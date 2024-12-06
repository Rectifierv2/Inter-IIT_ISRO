import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import './moon.css';  // Import the CSS file for styling

const ThreeDMoon = () => {
  const mountRef = useRef(null);
  const [texture, setTexture] = useState("/assets/lunar_texture8k.jpg");  // Default texture
  const navigate = useNavigate();  // React Router hook for navigation

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);  // Set the background color to black (or transparent if needed)
    mountRef.current.appendChild(renderer.domElement);

    // Load lunar texture for the moon
    const loader = new THREE.TextureLoader();
    const lunarTexture = loader.load(
      texture,  // Use the texture from state
      (loadedTexture) => {
        console.log("Lunar texture loaded successfully", loadedTexture);
      },
      undefined,
      (err) => {
        console.error("Lunar texture loading error:", err);
      }
    );

    // Create Moon geometry and material with increased size and quality
    const geometry = new THREE.SphereGeometry(5, 128, 128);  // Increased size and quality
    const material = new THREE.MeshStandardMaterial({ map: lunarTexture });
    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);

    // Lighting setup
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 10;  // Adjust camera distance for the larger moon

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      moon.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [texture]);  // Re-run useEffect when texture changes

  const handleDropdownChange = (event) => {
    // Update texture based on compound selection
    const selectedCompound = event.target.value;
    switch (selectedCompound) {
      case "FeO":
        setTexture("/assets/lunar_texture4.jpg");
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

  const handleBackClick = () => {
    navigate('/2d');  // Navigate to the 2D page when 'Back' is clicked
  };

  return (
    <div className="three-moon-container">
      <div ref={mountRef} className="moon-content" />
      <div className="ui-elements">
        <button onClick={handleBackClick}>Lunar 2D</button>
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

export default ThreeDMoon;
