import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from '@tweenjs/tween.js';
import countriesData from './countries.json'; // Necesitarás crear este archivo
import Controls from './Controls';
import NeonTitle from './NeonTitle';
import TeamInfoBox from './TeamInfoBox';
import CountryDashboard from './CountryDashboard';


const AnimatedCountryHeader = ({ country }) => {
    return (
      <div className="fixed top-24 left-4 z-50"> {/* Cambiado de top-4 a top-24 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flag-container w-40 h-24 relative overflow-hidden rounded-lg shadow-lg">
            <div 
              className="flag-static w-full h-full"
              style={{
                background: `url(https://flagcdn.com/w160/${country.code.toLowerCase()}.png) no-repeat center center`,
                backgroundSize: 'contain',
                backgroundColor: '#f0f0f0'
              }}
            />
          </div>
          <div className="text-content">
            <h1 className="text-white text-3xl font-bold tracking-wider bg-black bg-opacity-50 px-4 py-2 rounded text-center">
              {country.name}
            </h1>
          </div>
        </div>

        <style jsx>{`
          .flag-container {
            transform-style: preserve-3d;
            perspective: 1000px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .flag-container::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              45deg,
              rgba(0,0,0,0.2) 0%,
              rgba(0,0,0,0) 70%
            );
            pointer-events: none;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
          }
        `}</style>
      </div>
    );
};

const InteractiveGlobe = () => {
    const mountRef = useRef(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const controlsRef = useRef(null);
    const earthRef = useRef(null);
    const markersRef = useRef([]);
    const [rotationSpeed, setRotationSpeed] = useState(0.0001); // Agregar el estado de velocidad de rotación
    const [isPlaying, setIsPlaying] = useState(true); // Estado para manejar la pausa y reproducción

    useEffect(() => {
        // Basic setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Crear estrellas
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true
        });

        // Generar posiciones aleatorias para las estrellas
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        // Crear buffer de posiciones para las estrellas
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        // Agregar atributo personalizado para el parpadeo
        const starBlinkData = new Float32Array(starVertices.length / 3);
        for (let i = 0; i < starBlinkData.length; i++) {
            starBlinkData[i] = Math.random() * Math.PI * 2;
        }
        starGeometry.setAttribute('blinkOffset', new THREE.Float32BufferAttribute(starBlinkData, 1));

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Texture loader
        const textureLoader = new THREE.TextureLoader();

        const dayTexture = textureLoader.load('textures/8k_earth_daymap.jpg');
        const nightTexture = textureLoader.load('textures/8k_earth_nightmap.jpg');
        const normalTexture = textureLoader.load('textures/8k_earth_normal_map.tif');
        const cloudsTexture = textureLoader.load('textures/8k_earth_clouds.jpg');

        dayTexture.colorSpace = THREE.SRGBColorSpace;
        nightTexture.colorSpace = THREE.SRGBColorSpace;

        // Earth shader material
        const customMaterial = new THREE.ShaderMaterial({
            uniforms: {
                dayTexture: { value: dayTexture },
                nightTexture: { value: nightTexture },
                normalMap: { value: normalTexture },
                sunDirection: { value: new THREE.Vector3(1, 0, 0) },
                normalScale: { value: new THREE.Vector2(0.5, 0.5) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D dayTexture;
                uniform sampler2D nightTexture;
                uniform sampler2D normalMap;
                uniform vec3 sunDirection;
                uniform vec2 normalScale;

                varying vec2 vUv;
                varying vec3 vNormal;

                void main() {
                    vec3 normalMap = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
                    vec3 mixNormal = normalize(vNormal + normalMap.xyz * vec3(normalScale, 1.0));

                    float sunDot = dot(mixNormal, sunDirection);
                    float dayMix = smoothstep(-0.2, 0.2, sunDot);

                    vec4 dayColor = texture2D(dayTexture, vUv);
                    vec4 nightColor = texture2D(nightTexture, vUv);

                    gl_FragColor = mix(nightColor, dayColor, dayMix);
                }
            `
        });

        // Create Earth
        const earthGeometry = new THREE.SphereGeometry(5, 128, 128);
        const earth = new THREE.Mesh(earthGeometry, customMaterial);
        earthRef.current = earth;
        scene.add(earth);

        // Create clouds
        const cloudsGeometry = new THREE.SphereGeometry(5.03, 128, 128);
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        scene.add(clouds);

        // Create atmosphere
        const atmosphereGeometry = new THREE.SphereGeometry(5.15, 128, 128);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x93b8df,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Add country markers
        const markersGroup = new THREE.Group();
        scene.add(markersGroup);

        // Create markers for each country
        countriesData.countries.forEach((country) => {
            const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const markerMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.6
            });

            const marker = new THREE.Mesh(markerGeometry, markerMaterial);

            // Convert lat/lng to 3D position
            const position = latLngToVector3(country.lat, country.lng, 5.1);
            marker.position.copy(position);

            marker.userData.countryData = country;
            markersGroup.add(marker);
            markersRef.current.push(marker);
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(5, 3, 5);
        scene.add(sunLight);

        // Camera setup
        camera.position.z = 15;

        // Controls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.minDistance = 7;
        controls.maxDistance = 25;
        controls.autoRotate = isPlaying;
        controls.autoRotateSpeed = 0.5;
        controls.enablePan = false;

        // Raycaster for selection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Helper function to convert lat/lng to 3D vector
        function latLngToVector3(lat, lng, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);

            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }

        // Handle click
        const handleClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            // Check intersections with markers
            const intersects = raycaster.intersectObjects(markersRef.current, true);

            if (intersects.length > 0) {
                const country = intersects[0].object.userData.countryData;
                if (country) {
                    setSelectedCountry(country);
                    focusOnCountry(country, camera, controls);
                }
            }
        };

        const focusOnCountry = (country, camera, controls) => {
            controls.autoRotate = false;
        
            // Calcular el punto de interés (el país seleccionado)
            const targetLookAt = latLngToVector3(country.lat, country.lng, 5);
        
            // Calcular una posición más cercana al país para el zoom
            const zoomDistance = 4; // Cambié el zoom para acercarse más
            const targetPosition = latLngToVector3(country.lat, country.lng, zoomDistance);
        
            // Animación de la cámara
            new TWEEN.Tween(camera.position)
                .to(
                    {
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z
                    },
                    1500
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(() => {
                    camera.lookAt(targetLookAt);
                    controls.target.copy(targetLookAt);
                })
                .start()
                .onComplete(() => {
                    // Después del zoom, mostrar la información del país
                    setSelectedCountry(country);
                });
        
            // Actualizar la apariencia de los marcadores
            markersRef.current.forEach((marker) => {
                const isSelected = marker.userData.countryData.code === country.code;
                marker.material.color.setHex(isSelected ? 0xff0000 : 0x00ff00);
                marker.material.opacity = isSelected ? 1 : 0.6;
            });
        };

        // Animation loop
        let time = 0;

        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.001;

            // Animar estrellas
            const positions = stars.geometry.attributes.position;
            const blinkOffsets = stars.geometry.attributes.blinkOffset;
            for (let i = 0; i < positions.count; i++) {
                const blinkFactor = Math.sin(time * 3 + blinkOffsets.array[i]) * 0.3 + 0.7;
                stars.material.opacity = blinkFactor;
            }

            // Rotar suavemente las estrellas
            stars.rotation.y += 0.0001;
            stars.rotation.x += 0.0001;

            // Update sun direction
            const sunX = Math.cos(time);
            const sunZ = Math.sin(time);
            customMaterial.uniforms.sunDirection.value.set(sunX, 0, sunZ);
            sunLight.position.set(sunX * 5, 3, sunZ * 5);

            // Rotate elements
            if (isPlaying) {
                earth.rotation.y += rotationSpeed;
                clouds.rotation.y += rotationSpeed * 1.1;
                atmosphere.rotation.y += rotationSpeed;
                markersGroup.rotation.y += rotationSpeed;
            }

            TWEEN.update();
            controls.update();
            renderer.render(scene, camera);
        };

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        // Handle keyboard controls
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowRight':
                    setRotationSpeed((prevSpeed) => prevSpeed + 0.0001);
                    break;
                case 'ArrowLeft':
                    setRotationSpeed((prevSpeed) => prevSpeed - 0.0001);
                    break;
                case ' ':
                    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
                    break;
            }
        };

        // Event listeners
        window.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);

        animate();

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [isPlaying, rotationSpeed]);

    // Funciones de manejo de los controles
    const handleSpeedChange = (change) => {
        setRotationSpeed((prevSpeed) => prevSpeed + change);
    };

    const handlePause = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    };
    return (
        <div className="relative w-full h-screen">
            <div 
                ref={mountRef} 
                className="w-full h-screen bg-black"
                style={{ cursor: 'grab' }}
            />
            
            <NeonTitle />
            
            {selectedCountry && <AnimatedCountryHeader country={selectedCountry} />}
            
            <Controls
                onPause={handlePause}
                isPlaying={isPlaying}
            />
            
            <TeamInfoBox /> {/* Agregar esta línea */}
            {selectedCountry && <CountryDashboard 
                country={selectedCountry}
                controlsRef={controlsRef}
                onClose={() => {
                    setSelectedCountry(null);
                    if (controlsRef.current) {
                        controlsRef.current.autoRotate = true;
                    }
                }} 
            />}
            
            
        </div>
    );
    
    




    

    
    
};
  
  
export default InteractiveGlobe;