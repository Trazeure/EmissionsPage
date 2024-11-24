import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, TreePine, Activity, Wind } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import audioFile from '/sounds/mixkit-relaxing-harp-sweep-2628.mp3';

const WelcomeAnimation = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const mountRef = useRef(null);
  const sphereRef = useRef(null);
  const controlsRef = useRef(null);
  const audioRef = useRef(null);

  const playSound = async () => {
    try {
      const audio = new Audio(audioFile);
      audioRef.current = audio;

      audio.preload = 'auto';
      audio.volume = 0.5;

      audio.onerror = (e) => {
        console.error('Error loading audio:', e);
        console.error('Error code:', audio.error?.code);
        console.error('Error message:', audio.error?.message);
        setAudioError(true);
      };

      audio.oncanplaythrough = async () => {
        try {
          await audio.play();
          console.log('Audio playing successfully');
        } catch (playError) {
          console.error('Play error:', playError);
          
          if (playError.name === 'NotAllowedError') {
            const retryPlay = async () => {
              try {
                await audio.play();
                document.removeEventListener('click', retryPlay);
              } catch (error) {
                console.error('Retry play error:', error);
              }
            };
            document.addEventListener('click', retryPlay);
          }
        }
      };
    } catch (error) {
      console.error('Audio setup error:', error);
      setAudioError(true);
    }
  };

  const startAnimation = () => {
    setHasInteracted(true);
    setIsAnimating(true);
    playSound().catch(console.error);
    
    setTimeout(() => {
      setShowContent(true);
    }, 1000);

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 1000);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    let animationFrameId;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current?.appendChild(renderer.domElement);

    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        noiseScale: { value: 5.0 },
      },
      vertexShader: `
        uniform float time;
        uniform float progress;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }
        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        float noise(vec3 P) {
          vec3 i0 = mod289(floor(P));
          vec3 i1 = mod289(i0 + vec3(1.0));
          vec3 f0 = fract(P);
          vec3 f1 = f0 - vec3(1.0);
          vec3 f = fade(f0);
          vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x);
          vec4 iy = vec4(i0.yy, i1.yy);
          vec4 iz0 = i0.zzzz;
          vec4 iz1 = i1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, f0);
          float n100 = dot(g100, vec3(f1.x, f0.yz));
          float n010 = dot(g010, vec3(f0.x, f1.y, f0.z));
          float n110 = dot(g110, vec3(f1.xy, f0.z));
          float n001 = dot(g001, vec3(f0.xy, f1.z));
          float n101 = dot(g101, vec3(f1.x, f0.y, f1.z));
          float n011 = dot(g011, vec3(f0.x, f1.yz));
          float n111 = dot(g111, f1);
          vec3 fade_xyz = fade(f0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          float noiseValue = noise(pos * 0.1 + time * 0.2);
          
          float displacement = sin(time * 2.0 + noiseValue * 5.0) * 0.2;
          pos += normal * displacement * progress;
          
          float bounce = sin(progress * 3.14159) * (1.0 - progress) * 0.3;
          pos *= mix(0.0, 1.0 + bounce, progress);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float progress;
        uniform float noiseScale;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 baseColor = vec3(0.133, 0.694, 0.298);
          vec3 highlightColor = vec3(0.831, 0.976, 0.839);
          vec3 accentColor = vec3(0.047, 0.416, 0.137);
          
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          
          float pattern1 = sin(vPosition.x * noiseScale + time * 2.0) * 
                          sin(vPosition.y * noiseScale + time * 1.5) * 
                          sin(vPosition.z * noiseScale + time);
          
          float pattern2 = cos(vPosition.x * noiseScale * 0.5 - time) * 
                          cos(vPosition.y * noiseScale * 0.5 - time * 1.2);
          
          float pulse1 = (sin(time * 2.0) * 0.5 + 0.5) * 0.2;
          float pulse2 = (sin(time * 3.0 + pattern1) * 0.5 + 0.5) * 0.15;
          
          vec3 color1 = mix(baseColor, highlightColor, fresnel + pulse1);
          vec3 color2 = mix(color1, accentColor, pattern1 * 0.5 + pattern2 * 0.3);
          vec3 finalColor = mix(color2, highlightColor, fresnel * pulse2);
          
          float rainbow = sin(vPosition.x * 2.0 + time) * 0.1;
          finalColor += vec3(rainbow, rainbow * 0.5, -rainbow) * (1.0 - fresnel);
          
          float opacity = progress * (1.0 + fresnel * 0.5);
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
    });

    const sphereGeometry = new THREE.SphereGeometry(5, 128, 128);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereRef.current = sphere;
    scene.add(sphere);

    camera.position.z = 15;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    sphere.rotation.x = 0.4;
    
    let time = 0;
    let entryProgress = 0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.01;
      
      if (entryProgress < 1) {
        entryProgress += 0.02;
        sphereMaterial.uniforms.progress.value = THREE.MathUtils.smoothstep(entryProgress, 0, 1);
      }

      sphereMaterial.uniforms.time.value = time;
      sphereMaterial.uniforms.noiseScale.value = 5.0 + Math.sin(time) * 2.0;
      
      sphere.rotation.y += 0.003;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isAnimating, onComplete]);

  if (!hasInteracted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#E7F0DC]/90 to-[#597445]/90">
        <button
          onClick={startAnimation}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            group relative overflow-hidden
            flex items-center gap-3 px-8 py-4 
            text-xl font-bold text-white
            bg-[#2A3B1F] rounded-xl
            transition-all duration-500 ease-out
            transform hover:scale-105
            ${isHovered ? 'shadow-lg shadow-[#2A3B1F]/30' : ''}
          `}
        >
          {/* Fondo animado */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-[#3da063] via-[#2A3B1F] to-[#3da063] opacity-0
            group-hover:opacity-100 transition-opacity duration-500
            bg-[length:200%_100%] animate-shimmer
          `} />
          
          {/* Contenido del botón */}
          <div className="relative flex items-center gap-3">
            <Sparkles className={`
              w-6 h-6 transition-transform duration-500
              ${isHovered ? 'scale-110 rotate-12' : ''}
            `}/>
            <span className={`
              transform transition-all duration-500
              ${isHovered ? 'translate-x-1' : ''}
            `}>
              Iniciar Experiencia
            </span>
          </div>
          
          {/* Partículas brillantes */}
          <div className={`
            absolute inset-0 pointer-events-none
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          `}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-1 h-1 bg-white rounded-full
                  animate-particle opacity-75
                `}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </button>
      </div>
    );
  }

  if (!isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-b from-[#E7F0DC]/90 to-[#597445]/90 
        transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      <div ref={mountRef} className="absolute inset-0" />

      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center
          transition-all duration-1000 ease-out
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          ${isExiting ? 'opacity-0 scale-95' : ''}`}
      >
        <h1 className="text-6xl font-bold text-[#2A3B1F] mb-6 tracking-wide animate-float">
          EcoSphere
        </h1>
        
        <p className="text-2xl text-[#2A3B1F]/90 mb-12 max-w-md text-center animate-float-delayed">
          Explora el impacto ambiental global
        </p>

        <div className="flex gap-8">
          {[TreePine, Activity, Wind, Sparkles].map((Icon, index) => (
            <Icon 
              key={index}
              className={`w-8 h-8 text-[#2A3B1F] transition-all duration-300
                hover:scale-110 hover:text-[#2A3B1F]/80
                animate-bounce-in
                ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animationDelay: `${index * 150}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
      