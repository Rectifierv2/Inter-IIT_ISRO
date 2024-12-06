import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDViewer = () => {
  const mountRef = useRef(null);
  const [model, setModel] = useState(null); // Store the model after it is loaded

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load(
      "/model_out.glb", // Make sure the path is correct
      (gltf) => {
        const loadedModel = gltf.scene;
        setModel(loadedModel); // Store the model in state
        scene.add(loadedModel);
        loadedModel.position.set(0, 0, 0); // Center the model
        loadedModel.scale.set(1, 1, 1);   // Adjust scale if necessary
      },
      undefined,
      (error) => {
        console.error("Error loading the model:", error);
      }
    );

    // Create Coordinate system after model is loaded
    const createCoordinateSystem = (radius) => {
      const segments = 8; // Reduced segments to lower rendering cost

      // Create Latitude Lines (lower number of segments)
      for (let i = 1; i <= segments; i++) {
        const latAngle = (i / (segments + 1)) * Math.PI - Math.PI / 2; // Between -90 and 90 degrees
        const latRadius = radius * Math.cos(latAngle); // Adjust radius for latitude circle
        const latGeometry = new THREE.BufferGeometry();
        const latMaterial = new THREE.LineBasicMaterial({ color: 0x777777 }); // Lighter color for lower intensity
        const latVertices = [];

        for (let j = 0; j <= 32; j++) { // Reduced number of vertices
          const lonAngle = (j / 32) * Math.PI * 2; // Full circle (0 to 360 degrees)
          const x = latRadius * Math.cos(lonAngle);
          const y = radius * Math.sin(latAngle);
          const z = latRadius * Math.sin(lonAngle);
          latVertices.push(x, y, z);
        }

        latGeometry.setAttribute('position', new THREE.Float32BufferAttribute(latVertices, 3));
        const latLine = new THREE.LineLoop(latGeometry, latMaterial);
        scene.add(latLine);
      }

      // Create Longitude Lines (lower number of segments)
      for (let i = 0; i < segments; i++) {
        const lonAngle = (i / segments) * Math.PI * 2; // Between 0 and 360 degrees
        const lonGeometry = new THREE.BufferGeometry();
        const lonMaterial = new THREE.LineBasicMaterial({ color: 0x777777 }); // Lighter color for lower intensity
        const lonVertices = [];

        for (let j = 0; j <= 32; j++) { // Reduced number of vertices
          const latAngle = (j / 32) * Math.PI - Math.PI / 2; // -90 to 90 degrees
          const x = radius * Math.cos(latAngle) * Math.cos(lonAngle);
          const y = radius * Math.sin(latAngle);
          const z = radius * Math.cos(latAngle) * Math.sin(lonAngle);
          lonVertices.push(x, y, z);
        }

        lonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lonVertices, 3));
        const lonLine = new THREE.Line(lonGeometry, lonMaterial);
        scene.add(lonLine);
      }
    };

    // Check if model is loaded, and then create the coordinate system
    if (model) {
      const modelScale = model.scale.x; // Assuming uniform scaling
      createCoordinateSystem(modelScale);
    }

    // Set camera position
    camera.position.set(0, 0, 10); // Adjust the Z-value to fit the entire scene

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [model]); // Re-run when model is set

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ThreeDViewer;
