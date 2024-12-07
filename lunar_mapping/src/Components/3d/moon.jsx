import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import './moon.css';  // Import the CSS file for styling

const ThreeDMoon = () => {
  const mountRef = useRef(null);
  const [texture, setTexture] = useState("/assets/Lunar_Surface_Map_with_Mg_Al_Intensity_Polygon_Overlay_E000N0000.png");  // Default texture
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });  // Latitude and Longitude
  const [raycastActive, setRaycastActive] = useState(false);  // To control whether raycast is active
  const navigate = useNavigate();  // React Router hook for navigation

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);  // Set the background color to black
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

    // Create Moon geometry and material
    const geometry = new THREE.SphereGeometry(5, 128, 128);  // Increased quality
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

    // Raycasting logic to detect mouse position on the globe
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      // Normalize mouse coordinates (-1 to 1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Cast a ray to the moon
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(moon);

      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;

        // Calculate latitude and longitude from intersected point
        const lat = (Math.asin(intersectPoint.y / 5) * 180) / Math.PI;  // Convert Y to Latitude
        const lon = (Math.atan2(intersectPoint.x, intersectPoint.z) * 180) / Math.PI;  // Convert X and Z to Longitude

        setCoords({
          lat: lat.toFixed(2),
          lon: lon.toFixed(2)
        });

        setRaycastActive(true);  // Show coordinates when hovering over the moon
      } else {
        setRaycastActive(false);  // Hide coordinates if not over the moon
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [texture]);  // Re-run useEffect when texture changes

  const handleDropdownChange = (event) => {
    // Update texture based on compound selection
    const selectedCompound = event.target.value;
    switch (selectedCompound) {
      case "Al/Mg":
        setTexture("/assets/Lunar_Surface_Map_with_Mg_Al_Intensity_Polygon_Overlay_E000N0000.png?timestamp=" + new Date().getTime());
        break;
      case "Mg/Si":
        setTexture("/assets/Lunar_Surface_Map_with_Mg_Si_Intensity_Polygon_Overlay_E000N0000.png?timestamp=" + new Date().getTime());
        break;
      case "Al/Si":
        setTexture("/assets/Lunar_Surface_Map_with_Al_Si_Intensity_Polygon_Overlay_E000N0000.png?timestamp=" + new Date().getTime());
        break;
      default:
        setTexture("/assets/lunar_texture8k.jpg");
        break;
    }
  };

  const handleBackClick = () => {
    navigate('/2d');  // Navigate to the 2D page when 'Back' is clicked
  };

  const handleClick = () => {
    navigate('/subpixel');  // Navigate to the 2D page when 'Back' is clicked
  };

  return (
    <div className="three-moon-container">
      <div ref={mountRef} className="moon-content" />
      {raycastActive && (
        <div className="coordinates">
          <p style={{ color: 'white', fontSize: '20px' }}>Latitude: {coords.lat}</p>
          <p style={{ color: 'white', fontSize: '20px' }}>Longitude: {coords.lon}</p>
        </div>
      )}
      <div className="ui-elements">
        <button onClick={handleBackClick}>Lunar 2D</button>
        <button onClick={handleClick}>Sub-Pixel</button>
        <select onChange={handleDropdownChange}>
          <option value="Al/Mg">Al/Mg</option>
          <option value="Mg/Si">Mg/Si</option>
          <option value="Al/Si">Al/Si</option>
        </select>
      </div>
    </div>
  );
};

export default ThreeDMoon;
