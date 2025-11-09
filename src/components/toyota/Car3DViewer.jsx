import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Car3DViewer({ modelId, isActive, color }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const carGroupRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any existing content
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = mountRef.current.clientWidth || 200;
    const height = mountRef.current.clientHeight || 150;
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.set(4, 2, 4);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xff4444, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff0000, 0.6);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Create car based on model type
    const createCar = () => {
      const group = new THREE.Group();
      
      // Handle color prop - can be string or object with hex
      let carColor = '#C1272D'; // Default red
      if (typeof color === 'string') {
        carColor = color;
      } else if (color?.hex) {
        carColor = color.hex;
      }
      
      const bodyMaterial = new THREE.MeshPhysicalMaterial({ 
        color: carColor,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.5
      });

      const glassMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x111111,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.4
      });

      const wheelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.4
      });

      // Different geometries based on model - using rounded shapes for smoother look
      let bodyScale = { x: 2.2, y: 0.7, z: 1.1 };
      let cabinScale = { x: 1.3, y: 0.6, z: 1 };
      let cabinOffset = 0;
      
      if (modelId === 'rav4' || modelId === 'highlander') {
        // SUV shape
        bodyScale = { x: 2.4, y: 0.9, z: 1.2 };
        cabinScale = { x: 1.8, y: 0.7, z: 1.1 };
        cabinOffset = 0.1;
      } else if (modelId === 'tacoma') {
        // Truck shape
        bodyScale = { x: 2.8, y: 0.7, z: 1.2 };
        cabinScale = { x: 1.2, y: 0.7, z: 1.1 };
        cabinOffset = -0.3;
      }

      // Body - using rounded box for smoother appearance
      const bodyGeometry = new THREE.BoxGeometry(bodyScale.x, bodyScale.y, bodyScale.z, 2, 2, 2);
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      body.castShadow = true;
      // Smooth the edges
      body.geometry.computeVertexNormals();
      group.add(body);

      // Cabin - rounded
      const cabinGeometry = new THREE.BoxGeometry(cabinScale.x, cabinScale.y, cabinScale.z, 2, 2, 2);
      const cabin = new THREE.Mesh(cabinGeometry, glassMaterial);
      cabin.position.set(cabinOffset, 1, 0);
      cabin.castShadow = true;
      cabin.geometry.computeVertexNormals();
      group.add(cabin);

      // Hood (front slope) - more rounded
      const hoodGeometry = new THREE.BoxGeometry(0.6, 0.3, bodyScale.z, 2, 2, 2);
      const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
      hood.position.set(bodyScale.x / 2 + 0.2, 0.6, 0);
      hood.rotation.z = -0.3;
      hood.castShadow = true;
      hood.geometry.computeVertexNormals();
      group.add(hood);

      // Trunk (back slope) - more rounded
      const trunkGeometry = new THREE.BoxGeometry(0.5, 0.3, bodyScale.z, 2, 2, 2);
      const trunk = new THREE.Mesh(trunkGeometry, bodyMaterial);
      trunk.position.set(-bodyScale.x / 2 - 0.15, 0.6, 0);
      trunk.rotation.z = 0.2;
      trunk.castShadow = true;
      trunk.geometry.computeVertexNormals();
      group.add(trunk);

      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32);
      const wheelPositions = [
        [bodyScale.x / 2 - 0.3, 0.35, bodyScale.z / 2 + 0.15],
        [bodyScale.x / 2 - 0.3, 0.35, -bodyScale.z / 2 - 0.15],
        [-bodyScale.x / 2 + 0.3, 0.35, bodyScale.z / 2 + 0.15],
        [-bodyScale.x / 2 + 0.3, 0.35, -bodyScale.z / 2 - 0.15]
      ];

      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        
        // Rim detail
        const rimGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 6);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x888888,
          metalness: 0.9,
          roughness: 0.2
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        wheel.add(rim);
        
        group.add(wheel);
      });

      // Headlights
      const headlightGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.35);
      const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffff88,
        emissive: 0xffff44,
        emissiveIntensity: 0.5
      });

      const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight1.position.set(bodyScale.x / 2 + 0.45, 0.45, bodyScale.z / 2 - 0.15);
      group.add(headlight1);

      const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight2.position.set(bodyScale.x / 2 + 0.45, 0.45, -bodyScale.z / 2 + 0.15);
      group.add(headlight2);

      // Tail lights
      const taillightGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.25);
      const taillightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.3
      });

      const taillight1 = new THREE.Mesh(taillightGeometry, taillightMaterial);
      taillight1.position.set(-bodyScale.x / 2 - 0.25, 0.45, bodyScale.z / 2 - 0.15);
      group.add(taillight1);

      const taillight2 = new THREE.Mesh(taillightGeometry, taillightMaterial);
      taillight2.position.set(-bodyScale.x / 2 - 0.25, 0.45, -bodyScale.z / 2 + 0.15);
      group.add(taillight2);

      // Ground shadow plane
      const shadowGeometry = new THREE.PlaneGeometry(4, 2);
      const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
      const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0;
      shadowPlane.receiveShadow = true;
      group.add(shadowPlane);

      return group;
    };

    const carGroup = createCar();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    // Animation
    let time = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (isActive && carGroupRef.current) {
        time += 0.01;
        carGroupRef.current.rotation.y += 0.008;
        carGroupRef.current.position.y = Math.sin(time * 2) * 0.05;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      // Clear refs
      sceneRef.current = null;
      rendererRef.current = null;
      carGroupRef.current = null;
    };
  }, [modelId, isActive, color]);

  return <div ref={mountRef} className="w-full h-full" />;
}