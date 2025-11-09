import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Model URLs - You can replace these with actual Sketchfab model URLs
// For now, these are placeholders - you'll need to download models from Sketchfab
// and host them in your public folder or use a CDN
const MODEL_URLS = {
  camry: null, // '/models/camry.glb',
  rav4: null, // '/models/rav4.glb',
  highlander: null, // '/models/highlander.glb',
  tacoma: null, // '/models/tacoma.glb',
};

export default function Car3DViewer({ modelId, isActive, color }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const carGroupRef = useRef(null);
  const animationIdRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);

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

    // Create procedural car (fallback when GLTF models aren't available)
    const createProceduralCar = () => {
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

      // Different geometries based on model - Toyota-specific proportions
      let bodyScale = { x: 2.2, y: 0.65, z: 1.0 };
      let cabinScale = { x: 1.4, y: 0.65, z: 0.95 };
      let cabinOffset = 0;
      let hoodLength = 0.5;
      let trunkLength = 0.4;
      let roofHeight = 0.7;
      
      if (modelId === 'rav4') {
        // RAV4 - Compact SUV with sporty look
        bodyScale = { x: 2.3, y: 0.85, z: 1.15 };
        cabinScale = { x: 1.6, y: 0.75, z: 1.05 };
        cabinOffset = 0.05;
        hoodLength = 0.55;
        trunkLength = 0.45;
        roofHeight = 0.8;
      } else if (modelId === 'highlander') {
        // Highlander - Large SUV with boxy shape
        bodyScale = { x: 2.5, y: 0.95, z: 1.25 };
        cabinScale = { x: 1.9, y: 0.85, z: 1.15 };
        cabinOffset = 0.1;
        hoodLength = 0.6;
        trunkLength = 0.5;
        roofHeight = 0.9;
      } else if (modelId === 'tacoma') {
        // Tacoma - Pickup truck with distinct cab and bed
        bodyScale = { x: 2.9, y: 0.75, z: 1.2 };
        cabinScale = { x: 1.3, y: 0.75, z: 1.05 };
        cabinOffset = -0.4;
        hoodLength = 0.5;
        trunkLength = 0.8; // Truck bed
        roofHeight = 0.75;
      } else {
        // Camry - Sedan with sleek profile
        bodyScale = { x: 2.2, y: 0.65, z: 1.0 };
        cabinScale = { x: 1.4, y: 0.65, z: 0.95 };
        cabinOffset = 0;
        hoodLength = 0.5;
        trunkLength = 0.4;
        roofHeight = 0.7;
      }

      // Main Body - More segments for smoother curves
      const bodyGeometry = new THREE.BoxGeometry(bodyScale.x, bodyScale.y, bodyScale.z, 8, 4, 6);
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      body.castShadow = true;
      body.geometry.computeVertexNormals();
      // Add slight curve to top
      const bodyVertices = body.geometry.attributes.position;
      for (let i = 0; i < bodyVertices.count; i++) {
        const y = bodyVertices.getY(i);
        if (y > 0.3) {
          const curve = Math.sin((y - 0.3) * 2) * 0.05;
          bodyVertices.setY(i, y + curve);
        }
      }
      body.geometry.computeVertexNormals();
      group.add(body);

      // Cabin/Roof - Sleeker design
      const cabinGeometry = new THREE.BoxGeometry(cabinScale.x, roofHeight, cabinScale.z, 6, 4, 4);
      const cabin = new THREE.Mesh(cabinGeometry, glassMaterial);
      cabin.position.set(cabinOffset, 0.9, 0);
      cabin.castShadow = true;
      cabin.geometry.computeVertexNormals();
      // Add slight curve to roof
      const cabinVertices = cabin.geometry.attributes.position;
      for (let i = 0; i < cabinVertices.count; i++) {
        const x = cabinVertices.getX(i);
        const y = cabinVertices.getY(i);
        if (y > 0.5) {
          const curve = Math.sin((x - cabinOffset) * 1.5) * 0.03;
          cabinVertices.setY(i, y + curve);
        }
      }
      cabin.geometry.computeVertexNormals();
      group.add(cabin);

      // Hood - More aerodynamic slope
      const hoodGeometry = new THREE.BoxGeometry(hoodLength, 0.25, bodyScale.z, 4, 2, 4);
      const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
      hood.position.set(bodyScale.x / 2 + hoodLength / 2, 0.55, 0);
      hood.rotation.z = -0.25;
      hood.castShadow = true;
      hood.geometry.computeVertexNormals();
      group.add(hood);

      // Front Grille - Toyota-specific
      const grilleGeometry = new THREE.BoxGeometry(0.3, 0.4, bodyScale.z * 0.6, 2, 2, 2);
      const grilleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.7
      });
      const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
      grille.position.set(bodyScale.x / 2 + 0.5, 0.5, 0);
      group.add(grille);

      // Trunk/Back - More refined
      if (modelId === 'tacoma') {
        // Truck bed
        const bedGeometry = new THREE.BoxGeometry(trunkLength, 0.5, bodyScale.z, 4, 2, 4);
        const bed = new THREE.Mesh(bedGeometry, bodyMaterial);
        bed.position.set(-bodyScale.x / 2 - trunkLength / 2, 0.5, 0);
        bed.castShadow = true;
        bed.geometry.computeVertexNormals();
        group.add(bed);
      } else {
        // Trunk for sedan/SUV
        const trunkGeometry = new THREE.BoxGeometry(trunkLength, 0.25, bodyScale.z, 4, 2, 4);
        const trunk = new THREE.Mesh(trunkGeometry, bodyMaterial);
        trunk.position.set(-bodyScale.x / 2 - trunkLength / 2, 0.55, 0);
        trunk.rotation.z = 0.15;
        trunk.castShadow = true;
        trunk.geometry.computeVertexNormals();
        group.add(trunk);
      }

      // Wheels - More realistic Toyota wheels
      const wheelRadius = modelId === 'tacoma' || modelId === 'highlander' ? 0.4 : 0.35;
      const wheelWidth = 0.28;
      const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 32);
      const wheelPositions = [
        [bodyScale.x / 2 - 0.25, 0.35, bodyScale.z / 2 + 0.12],
        [bodyScale.x / 2 - 0.25, 0.35, -bodyScale.z / 2 - 0.12],
        [-bodyScale.x / 2 + 0.25, 0.35, bodyScale.z / 2 + 0.12],
        [-bodyScale.x / 2 + 0.25, 0.35, -bodyScale.z / 2 - 0.12]
      ];

      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        
        // Rim detail - Toyota-style alloy wheels
        const rimGeometry = new THREE.CylinderGeometry(wheelRadius * 0.6, wheelRadius * 0.6, wheelWidth + 0.05, 16);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xaaaaaa,
          metalness: 0.95,
          roughness: 0.1
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        wheel.add(rim);
        
        // Spokes
        for (let i = 0; i < 5; i++) {
          const spokeGeometry = new THREE.BoxGeometry(0.05, wheelRadius * 0.5, 0.05);
          const spoke = new THREE.Mesh(spokeGeometry, rimMaterial);
          spoke.position.set(0, wheelRadius * 0.25, 0);
          spoke.rotation.z = (i * Math.PI * 2) / 5;
          rim.add(spoke);
        }
        
        group.add(wheel);
      });

      // Headlights - More realistic Toyota design
      const headlightSize = modelId === 'tacoma' ? { w: 0.18, h: 0.25, d: 0.4 } : { w: 0.16, h: 0.22, d: 0.35 };
      const headlightGeometry = new THREE.BoxGeometry(headlightSize.w, headlightSize.h, headlightSize.d, 2, 2, 2);
      const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffaa,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.2
      });

      const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight1.position.set(bodyScale.x / 2 + 0.48, 0.48, bodyScale.z / 2 - 0.18);
      headlight1.rotation.y = -0.1;
      group.add(headlight1);

      const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
      headlight2.position.set(bodyScale.x / 2 + 0.48, 0.48, -bodyScale.z / 2 + 0.18);
      headlight2.rotation.y = 0.1;
      group.add(headlight2);

      // DRL (Daytime Running Lights) - Toyota signature
      const drlGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.3, 2, 2, 2);
      const drlMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8
      });
      const drl1 = new THREE.Mesh(drlGeometry, drlMaterial);
      drl1.position.set(bodyScale.x / 2 + 0.46, 0.42, bodyScale.z / 2 - 0.18);
      group.add(drl1);
      const drl2 = new THREE.Mesh(drlGeometry, drlMaterial);
      drl2.position.set(bodyScale.x / 2 + 0.46, 0.42, -bodyScale.z / 2 + 0.18);
      group.add(drl2);

      // Tail lights - More refined
      const taillightSize = modelId === 'tacoma' ? { w: 0.12, h: 0.18, d: 0.3 } : { w: 0.1, h: 0.16, d: 0.28 };
      const taillightGeometry = new THREE.BoxGeometry(taillightSize.w, taillightSize.h, taillightSize.d, 2, 2, 2);
      const taillightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        emissive: 0xff3333,
        emissiveIntensity: 0.4
      });

      const taillight1 = new THREE.Mesh(taillightGeometry, taillightMaterial);
      taillight1.position.set(-bodyScale.x / 2 - (modelId === 'tacoma' ? 0.3 : 0.28), 0.48, bodyScale.z / 2 - 0.18);
      group.add(taillight1);

      const taillight2 = new THREE.Mesh(taillightGeometry, taillightMaterial);
      taillight2.position.set(-bodyScale.x / 2 - (modelId === 'tacoma' ? 0.3 : 0.28), 0.48, -bodyScale.z / 2 + 0.18);
      group.add(taillight2);

      // Toyota Logo on front grille
      const logoGeometry = new THREE.RingGeometry(0.08, 0.12, 32);
      const logoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.1
      });
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.position.set(bodyScale.x / 2 + 0.48, 0.5, 0);
      logo.rotation.y = Math.PI / 2;
      group.add(logo);
      
      // Logo center
      const logoCenter = new THREE.Mesh(
        new THREE.CircleGeometry(0.08, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
      );
      logoCenter.position.set(bodyScale.x / 2 + 0.48, 0.5, 0);
      logoCenter.rotation.y = Math.PI / 2;
      group.add(logoCenter);

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

    // Try to load GLTF model first, fallback to procedural
    const modelUrl = MODEL_URLS[modelId];
    let carGroup = null;
    
    if (modelUrl) {
      // Load GLTF model from Sketchfab
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          carGroup = gltf.scene;
          
          // Scale and position the model
          carGroup.scale.set(1, 1, 1);
          carGroup.position.set(0, 0, 0);
          
          // Apply color if provided
          if (color) {
            let carColor = '#C1272D'; // Default red
            if (typeof color === 'string') {
              carColor = color;
            } else if (color?.hex) {
              carColor = color.hex;
            }
            
            carGroup.traverse((child) => {
              if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    if (mat.name?.toLowerCase().includes('body') || mat.name?.toLowerCase().includes('paint')) {
                      mat.color.set(carColor);
                    }
                  });
                } else {
                  if (child.material.name?.toLowerCase().includes('body') || 
                      child.material.name?.toLowerCase().includes('paint')) {
                    child.material.color.set(carColor);
                  }
                }
              }
            });
          }
          
          carGroupRef.current = carGroup;
          scene.add(carGroup);
          setModelLoaded(true);
        },
        (progress) => {
          // Loading progress
          if (progress.total > 0) {
            console.log('Loading model:', (progress.loaded / progress.total * 100) + '%');
          }
        },
        (error) => {
          console.error('Error loading GLTF model, using fallback:', error);
          // Fallback to procedural model
          carGroup = createProceduralCar();
          carGroupRef.current = carGroup;
          scene.add(carGroup);
          setModelLoaded(true);
        }
      );
    } else {
      // Use procedural model
      carGroup = createProceduralCar();
      carGroupRef.current = carGroup;
      scene.add(carGroup);
      setModelLoaded(true);
    }

    // Animation loop - works for both GLTF and procedural models
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