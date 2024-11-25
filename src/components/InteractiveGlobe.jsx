import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from '@tweenjs/tween.js';
import { useMediaQuery } from 'react-responsive';
import countriesData from './countries.json';
import Controls from './Controls';
import NeonTitle from './NeonTitle';
import TeamInfoBox from './TeamInfoBox';
import CountryDashboard from './CountryDashboard';
import GlobalDashboard from "./GlobalDashboard";
import { Activity, Globe, BarChart, Star, BookOpen, TreePine } from 'lucide-react';
import SimulationDashboard from './SimulationDashboard';
import PredictionsDashboard from './PredictionsDashboard';
import GlobalPredictionsWindow from './GlobalPredictionsWindow';
import EducationalDashboard from './EducationalDashboard';
import CarbonDictionary from './CarbonDictionary';
import WelcomeAnimation from './WelcomeAnimation';
import RatingButton from './RatingButton';
import RatingModal from './RatingModal';
import RatingsDashboard from './RatingDashboard';
import MenuButton from './MenuButton';

const AnimatedCountryHeader = ({ country, isMobile }) => {
    return (
        <div className={`fixed ${isMobile ? 'top-16 left-2' : 'top-24 left-4'} z-50`}>
            <div className="flex flex-col items-center gap-2">
                <div className={`flag-container ${isMobile ? 'w-32 h-20' : 'w-40 h-24'} relative overflow-hidden rounded-lg shadow-lg`}>
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
                    <h1 className={`text-white ${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-wider bg-black bg-opacity-50 px-4 py-2 rounded text-center`}>
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
    const [rotationSpeed, setRotationSpeed] = useState(0.0001);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showGlobal, setShowGlobal] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [showGlobalPredictions, setShowGlobalPredictions] = useState(false);
    const [showEducational, setShowEducational] = useState(false);
    const [showDictionary, setShowDictionary] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showRatingsDashboard, setShowRatingsDashboard] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const isTouchingRef = useRef(false);
    const touchTimeoutRef = useRef(null);
    // Media queries para responsive
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

    // Función para obtener dimensiones responsivas
    const getResponsiveDimensions = useCallback(() => {
        if (isMobile) {
            return {
                earthRadius: 3,
                cameraDistance: 10,
                markerSize: 0.05,
                minDistance: 5,
                maxDistance: 15,
                starCount: 5000,
                starSize: 0.08
            };
        } else if (isTablet) {
            return {
                earthRadius: 4,
                cameraDistance: 12,
                markerSize: 0.08,
                minDistance: 6,
                maxDistance: 20,
                starCount: 7500,
                starSize: 0.09
            };
        }
        return {
            earthRadius: 5,
            cameraDistance: 15,
            markerSize: 0.1,
            minDistance: 7,
            maxDistance: 25,
            starCount: 10000,
            starSize: 0.1
        };
    }, [isMobile, isTablet]);

    useEffect(() => {
        const dimensions = getResponsiveDimensions();

        // Basic setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(
            isMobile ? 60 : 75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(isMobile ? 1 : window.devicePixelRatio);
        mountRef.current?.appendChild(renderer.domElement);

        // Crear estrellas con cantidad adaptativa
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: dimensions.starSize,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true
        });

        // Generar posiciones aleatorias para las estrellas
        const starVertices = [];
        for (let i = 0; i < dimensions.starCount; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starBlinkData = new Float32Array(starVertices.length / 3);
        for (let i = 0; i < starBlinkData.length; i++) {
            starBlinkData[i] = Math.random() * Math.PI * 2;
        }
        starGeometry.setAttribute('blinkOffset', new THREE.Float32BufferAttribute(starBlinkData, 1));

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Texture loader con manejo de carga progresivo
        const loadingManager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(loadingManager);

        // Cargar texturas con calidad adaptativa
        const textureQuality = isMobile ? '2k' : '8k';
        const dayTexture = textureLoader.load(`textures/${textureQuality}_earth_daymap.jpg`);
        const nightTexture = textureLoader.load(`textures/${textureQuality}_earth_nightmap.jpg`);
        const normalTexture = textureLoader.load(`textures/${textureQuality}_earth_normal_map.jpg`);
        const cloudsTexture = textureLoader.load(`textures/${textureQuality}_earth_clouds.jpg`);

        dayTexture.colorSpace = THREE.SRGBColorSpace;
        nightTexture.colorSpace = THREE.SRGBColorSpace;

        // Earth shader material optimizado
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
        // Create Earth con geometría adaptativa
        const earthGeometry = new THREE.SphereGeometry(
            dimensions.earthRadius,
            isMobile ? 64 : 128,
            isMobile ? 64 : 128
        );
        const earth = new THREE.Mesh(earthGeometry, customMaterial);
        earthRef.current = earth;
        scene.add(earth);

        // Create clouds con geometría adaptativa
        const cloudsGeometry = new THREE.SphereGeometry(
            dimensions.earthRadius * 1.006,
            isMobile ? 64 : 128,
            isMobile ? 64 : 128
        );
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        scene.add(clouds);

        // Create atmosphere con geometría adaptativa
        const atmosphereGeometry = new THREE.SphereGeometry(
            dimensions.earthRadius * 1.03,
            isMobile ? 64 : 128,
            isMobile ? 64 : 128
        );
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x93b8df,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Add markers adaptativo
        const markersGroup = new THREE.Group();
        scene.add(markersGroup);
        markersRef.current = [];

        // Helper function para convertir lat/lng a vector3
        function latLngToVector3(lat, lng, radius) {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);

            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }

        // Create markers for each country
        countriesData.countries.forEach((country) => {
            const markerGeometry = new THREE.SphereGeometry(
                dimensions.markerSize,
                isMobile ? 8 : 16,
                isMobile ? 8 : 16
            );
            const markerMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
                opacity: 0.6
            });

            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            const position = latLngToVector3(country.lat, country.lng, dimensions.earthRadius * 1.02);
            marker.position.copy(position);
            marker.userData.countryData = country;
            markersGroup.add(marker);
            markersRef.current.push(marker);
        });

        // Lighting optimizado para rendimiento
        const ambientLight = new THREE.AmbientLight(0x404040, isMobile ? 0.7 : 0.6);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, isMobile ? 1.0 : 1.2);
        sunLight.position.set(5, 3, 5);
        scene.add(sunLight);

        // Camera setup con posición adaptativa
        camera.position.z = dimensions.cameraDistance;

        // Controls setup adaptativo
        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = isMobile ? 0.07 : 0.05;
        controls.rotateSpeed = isMobile ? 0.5 : 0.3;
        controls.enableZoom = true;
        controls.minDistance = dimensions.minDistance;
        controls.maxDistance = dimensions.maxDistance;
        controls.autoRotate = isPlaying;
        controls.autoRotateSpeed = isMobile ? 0.3 : 0.5;
        controls.enablePan = false;

        // Prevenir rotación extrema
        controls.minPolarAngle = Math.PI * 0.2;
        controls.maxPolarAngle = Math.PI * 0.8;

        // Configuración táctil optimizada
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE
        };

        // Raycaster para selección
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Optimized touch handling
        const handleTouchStart = (event) => {
            event.preventDefault();
            isTouchingRef.current = true;
            
            const touch = event.touches[0];
            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };

            if (touchTimeoutRef.current) {
                clearTimeout(touchTimeoutRef.current);
            }
        };

        const handleTouchMove = (event) => {
            if (!isTouchingRef.current) return;
            event.preventDefault();
            
            if (controlsRef.current) {
                controlsRef.current.autoRotate = false;
            }
        };

        const handleTouchEnd = (event) => {
            event.preventDefault();
            const touchEnd = event.changedTouches[0];
            const touchStartTime = touchStartRef.current.time;
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            const distX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
            const distY = Math.abs(touchEnd.clientY - touchStartRef.current.y);
            const totalDist = Math.sqrt(distX * distX + distY * distY);

            if (touchDuration < 200 && totalDist < 10) {
                const x = touchEnd.clientX;
                const y = touchEnd.clientY;

                mouse.x = (x / window.innerWidth) * 2 - 1;
                mouse.y = -(y / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(markersRef.current, true);

                if (intersects.length > 0) {
                    const country = intersects[0].object.userData.countryData;
                    if (country) {
                        setSelectedCountry(country);
                        focusOnCountry(country, camera, controls);
                    }
                }
            }

            touchTimeoutRef.current = setTimeout(() => {
                if (controlsRef.current && isPlaying) {
                    controlsRef.current.autoRotate = true;
                }
            }, 1500);

            isTouchingRef.current = false;
        };

        const handleInteraction = (event) => {
            event.preventDefault();
            const x = event.clientX;
            const y = event.clientY;

            mouse.x = (x / window.innerWidth) * 2 - 1;
            mouse.y = -(y / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(markersRef.current, true);

            if (intersects.length > 0) {
                const country = intersects[0].object.userData.countryData;
                if (country) {
                    setSelectedCountry(country);
                    focusOnCountry(country, camera, controls);
                }
            }
        };
        // Animación optimizada para el enfoque en países
        const focusOnCountry = (country, camera, controls) => {
            controls.autoRotate = false;

            const targetLookAt = latLngToVector3(country.lat, country.lng, dimensions.earthRadius);
            const zoomDistance = isMobile ? dimensions.earthRadius + 2 : dimensions.earthRadius + 4;
            const targetPosition = latLngToVector3(country.lat, country.lng, zoomDistance);

            new TWEEN.Tween(camera.position)
                .to(
                    {
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z
                    },
                    isMobile ? 1000 : 1500
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate(() => {
                    camera.lookAt(targetLookAt);
                    controls.target.copy(targetLookAt);
                })
                .start();

            markersRef.current.forEach((marker) => {
                const isSelected = marker.userData.countryData.code === country.code;
                marker.material.color.setHex(isSelected ? 0xff0000 : 0x00ff00);
                marker.material.opacity = isSelected ? 1 : 0.6;
            });
        };

        // Manejo optimizado de cambios de tamaño y orientación
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);

            const newDimensions = getResponsiveDimensions();
            camera.position.z = newDimensions.cameraDistance;
            controls.minDistance = newDimensions.minDistance;
            controls.maxDistance = newDimensions.maxDistance;
        };

        // Event listeners optimizados
        if (isMobile) {
            renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
            renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
            renderer.domElement.addEventListener('touchend', handleTouchEnd, { passive: false });
            renderer.domElement.style.touchAction = 'none';
        } else {
            window.addEventListener('click', handleInteraction);
        }

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('orientationchange', handleResize);

        // Loop de animación optimizado
        let time = 0;
        let frameId = null;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            time += isMobile ? 0.0008 : 0.001;

            if (!isMobile || time % 2 === 0) {
                const positions = stars.geometry.attributes.position;
                const blinkOffsets = stars.geometry.attributes.blinkOffset;
                for (let i = 0; i < positions.count; i++) {
                    const blinkFactor = Math.sin(time * 3 + blinkOffsets.array[i]) * 0.3 + 0.7;
                    stars.material.opacity = blinkFactor;
                }
            }

            stars.rotation.y += isMobile ? 0.00005 : 0.0001;
            stars.rotation.x += isMobile ? 0.00005 : 0.0001;

            const sunX = Math.cos(time);
            const sunZ = Math.sin(time);
            customMaterial.uniforms.sunDirection.value.set(sunX, 0, sunZ);
            sunLight.position.set(sunX * 5, 3, sunZ * 5);

            if (isPlaying) {
                const currentRotationSpeed = isMobile ? rotationSpeed * 0.75 : rotationSpeed;
                earth.rotation.y += currentRotationSpeed;
                clouds.rotation.y += currentRotationSpeed * 1.1;
                atmosphere.rotation.y += currentRotationSpeed;
                markersGroup.rotation.y += currentRotationSpeed;
            }

            TWEEN.update();
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            if (isMobile) {
                renderer.domElement.removeEventListener('touchstart', handleTouchStart);
                renderer.domElement.removeEventListener('touchmove', handleTouchMove);
                renderer.domElement.removeEventListener('touchend', handleTouchEnd);
                if (touchTimeoutRef.current) {
                    clearTimeout(touchTimeoutRef.current);
                }
            } else {
                window.removeEventListener('click', handleInteraction);
            }
            
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);

            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (object.material.map) object.material.map.dispose();
                    object.material.dispose();
                }
            });

            renderer.dispose();
            if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [isMobile, isTablet, isPlaying, rotationSpeed, getResponsiveDimensions]);

    const handleSpeedChange = (change) => {
        const speedChange = isMobile ? 0.00005 : 0.0001;
        setRotationSpeed((prevSpeed) => prevSpeed + (change * speedChange));
    };

    const handlePause = () => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden select-none">
            <div
                ref={mountRef}
                className="w-full h-screen bg-black touch-manipulation"
                style={{
                    cursor: isMobile ? 'default' : 'grab',
                    overscrollBehavior: 'none',
                    WebkitTapHighlightColor: 'transparent'
                }}
            />

            <NeonTitle isMobile={isMobile} />

            {selectedCountry && (
                <AnimatedCountryHeader
                    country={selectedCountry}
                    isMobile={isMobile}
                />
            )}

            <Controls
                onPause={handlePause}
                isPlaying={isPlaying}
                isMobile={isMobile}
                onSpeedChange={handleSpeedChange}
            />

            <TeamInfoBox isMobile={isMobile} />
            
            <MenuButton
                isMobile={isMobile}
                setShowGlobal={setShowGlobal}
                setShowSimulation={setShowSimulation}
                setShowPredictions={setShowPredictions}
                setShowGlobalPredictions={setShowGlobalPredictions}
                setShowDictionary={setShowDictionary}
                setShowEducational={setShowEducational}
                setIsRatingModalOpen={setIsRatingModalOpen}
            />

            <GlobalDashboard
                isVisible={showGlobal}
                onClose={() => setShowGlobal(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            <SimulationDashboard
                isVisible={showSimulation}
                onClose={() => setShowSimulation(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            <PredictionsDashboard
                isVisible={showPredictions}
                onClose={() => setShowPredictions(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            <GlobalPredictionsWindow
                isVisible={showGlobalPredictions}
                onClose={() => setShowGlobalPredictions(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            <EducationalDashboard
                isVisible={showEducational}
                onClose={() => setShowEducational(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            <CarbonDictionary
                isVisible={showDictionary}
                onClose={() => setShowDictionary(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                isMobile={isMobile}
                className={isMobile ? 'w-[90vw] max-w-sm mx-auto' : 'w-96'}
            />

            <RatingsDashboard
                isVisible={showRatingsDashboard}
                onClose={() => setShowRatingsDashboard(false)}
                isMobile={isMobile}
                className={`fixed transition-all duration-300 ease-in-out ${
                    isMobile ? 'inset-x-0 bottom-0 h-[80vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                }`}
            />

            {showWelcome && (
                <WelcomeAnimation
                    onComplete={() => setShowWelcome(false)}
                    isMobile={isMobile}
                />
            )}

            {selectedCountry && (
                <CountryDashboard
                    country={selectedCountry}
                    controlsRef={controlsRef}
                    onClose={() => {
                        setSelectedCountry(null);
                        if (controlsRef.current) {
                            controlsRef.current.autoRotate = true;
                        }
                    }}
                    isMobile={isMobile}
                    className={`fixed transition-all duration-300 ease-in-out ${
                        isMobile ? 'inset-x-0 bottom-0 h-[70vh] rounded-t-2xl' : 'right-8 bottom-8 w-96 rounded-xl'
                    }`}
                />
            )}
        </div>
    );
};

export default InteractiveGlobe;

