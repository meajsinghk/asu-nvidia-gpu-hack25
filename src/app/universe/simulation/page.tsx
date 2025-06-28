'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Home, Globe, Rocket, Rotate3d, ZoomIn, ZoomOut } from 'lucide-react';

// Planet data
const planetData = [
    { name: "Mercury", size: 0.8, distance: 15, color: 0x8C7853, info: "Closest planet to the Sun, extremely hot days and cold nights." },
    { name: "Venus", size: 1.2, distance: 20, color: 0xFFC649, info: "Hottest planet with thick toxic atmosphere of carbon dioxide." },
    { name: "Earth", size: 1.3, distance: 25, color: 0x6B93D6, info: "Our home planet, the only known planet with life." },
    { name: "Mars", size: 1.0, distance: 30, color: 0xCD5C5C, info: "The Red Planet, with polar ice caps and the largest volcano in the solar system." },
    { name: "Jupiter", size: 3.5, distance: 40, color: 0xD8CA9D, info: "Largest planet, a gas giant with a Great Red Spot storm." },
    { name: "Saturn", size: 3.0, distance: 50, color: 0xFAD5A5, info: "Famous for its spectacular ring system." },
    { name: "Uranus", size: 2.0, distance: 60, color: 0x4FD0E7, info: "Ice giant that rotates on its side." },
    { name: "Neptune", size: 1.9, distance: 70, color: 0x4B70DD, info: "Furthest planet, with the fastest winds in the solar system." }
];

type PlanetInfo = typeof planetData[0];

export default function MultiverseSimulationPage() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [planetsVisited] = useState(0);
    const [xp] = useState(0);
    const [hoveredPlanet, setHoveredPlanet] = useState<PlanetInfo | null>(null);
    const [rotationMode, setRotationMode] = useState(false);
    const [moveMode, setMoveMode] = useState(false);

    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const planetsRef = useRef<THREE.Mesh[]>([]);
    const cameraStateRef = useRef({ distance: 50, angleX: 0, angleY: 0 });
    const mouseStateRef = useRef({ down: false, x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;
        
        const scene = sceneRef.current;
        const camera = cameraRef.current;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Starfield
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.5 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 0.3 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);
        const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.2 });
        scene.add(new THREE.Mesh(glowGeometry, glowMaterial));
        const light = new THREE.PointLight(0xFFFFFF, 3, 200);
        scene.add(light);
        
        // Planets
        planetData.forEach((data, index) => {
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshLambertMaterial({ color: data.color });
            const planet = new THREE.Mesh(geometry, material);
            const angle = (index / planetData.length) * Math.PI * 2;
            planet.position.x = Math.cos(angle) * data.distance;
            planet.position.z = Math.sin(angle) * data.distance;
            planet.position.y = (Math.random() - 0.5) * 5;
            planet.userData = data;
            planetsRef.current.push(planet);
            scene.add(planet);
        });

        const updateCameraPosition = () => {
            const { distance, angleX, angleY } = cameraStateRef.current;
            const x = Math.cos(angleY) * Math.cos(angleX) * distance;
            const y = Math.sin(angleX) * distance;
            const z = Math.sin(angleY) * Math.cos(angleX) * distance;
            camera.position.set(x, y, z);
            camera.lookAt(0, 0, 0);
        };
        updateCameraPosition();
        
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            planetsRef.current.forEach((planet, index) => {
                planet.rotation.y += 0.005 + (index * 0.0005);
            });
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handleMouseDown = (event: MouseEvent) => {
            mouseStateRef.current = { down: true, x: event.clientX, y: event.clientY };
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            const { down, x, y } = mouseStateRef.current;
            if (!down) return;

            if (rotationMode) {
                const deltaX = event.clientX - x;
                const deltaY = event.clientY - y;
                cameraStateRef.current.angleY += deltaX * 0.01;
                cameraStateRef.current.angleX -= deltaY * 0.01;
                cameraStateRef.current.angleX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraStateRef.current.angleX));
                updateCameraPosition();
            }
            mouseStateRef.current = { ...mouseStateRef.current, x: event.clientX, y: event.clientY };
        };

        const handleMouseUp = () => {
            mouseStateRef.current.down = false;
        };
        
        const handleWheel = (event: WheelEvent) => {
            cameraStateRef.current.distance += event.deltaY * 0.05;
            cameraStateRef.current.distance = Math.max(10, Math.min(100, cameraStateRef.current.distance));
            updateCameraPosition();
        };

        const handlePlanetHover = (event: MouseEvent) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planetsRef.current);
            if (intersects.length > 0) {
                const planetUserData = intersects[0].object.userData as PlanetInfo;
                if(hoveredPlanet?.name !== planetUserData.name) {
                    setHoveredPlanet(planetUserData);
                }
            } else {
                if(hoveredPlanet) {
                    setHoveredPlanet(null);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('wheel', handleWheel);
        renderer.domElement.addEventListener('mousemove', handlePlanetHover);
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (rendererRef.current && rendererRef.current.domElement.parentElement) {
              rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
            }
        };
    }, [rotationMode, hoveredPlanet]);

    const zoom = (amount: number) => {
        cameraStateRef.current.distance = Math.max(10, Math.min(100, cameraStateRef.current.distance + amount));
        const { distance, angleX, angleY } = cameraStateRef.current;
        const x = Math.cos(angleY) * Math.cos(angleX) * distance;
        const y = Math.sin(angleX) * distance;
        const z = Math.sin(angleY) * Math.cos(angleX) * distance;
        cameraRef.current.position.set(x, y, z);
        cameraRef.current.lookAt(0, 0, 0);
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans">
            <div ref={mountRef} className="absolute inset-0 z-0" />
            
            <header className="absolute top-8 left-8 z-20">
                <Link href="/" passHref>
                    <button className="launch-button-futuristic flex h-[50px] w-[50px] items-center justify-center p-0">
                        <span className="launch-button-futuristic-text">
                            <Home className="h-6 w-6" />
                        </span>
                    </button>
                </Link>
            </header>

            <div className="right-panel z-20">
                <div className="panel stats-panel">
                    <div className="stat-item">
                        <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /> Planets</span>
                        <span className="font-mono">{planetsVisited}</span>
                    </div>
                    <div className="stat-item">
                        <span className="flex items-center gap-2"><Rocket className="w-4 h-4 text-cyan-400" /> XP</span>
                        <span className="font-mono">{xp}</span>
                    </div>
                </div>
            </div>

            {/* Planet Info Panel */}
            <div id="planetInfo" style={{ opacity: hoveredPlanet ? 1 : 0 }}>
                {hoveredPlanet && (
                    <>
                        <h3 className="font-bold text-lg mb-2 text-cyan-300">{hoveredPlanet.name}</h3>
                        <p className="text-sm mb-3">{hoveredPlanet.info}</p>
                        <p className="text-xs"><strong>Distance:</strong> {hoveredPlanet.distance} AU</p>
                        <p className="text-xs"><strong>Size:</strong> {hoveredPlanet.size}x Earth</p>
                    </>
                )}
            </div>

            {/* Controls */}
            <div id="controls">
                <div className="control-group">
                    <button 
                        className="control-btn rotate-icon"
                        title="360° Rotation Mode"
                        onClick={() => { setRotationMode(!rotationMode); setMoveMode(false); }}
                        style={{ background: rotationMode ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 0.1)' }}
                    >
                      🔄
                    </button>
                </div>
                <div className="control-group">
                    <button className="control-btn zoom-in-icon" title="Zoom In" onClick={() => zoom(-5)}>➕</button>
                    <button className="control-btn zoom-out-icon" title="Zoom Out" onClick={() => zoom(5)}>➖</button>
                </div>
                <div className="control-group">
                    <button 
                        className="control-btn move-icon"
                        title="Move Around (Not Implemented)"
                        onClick={() => { setMoveMode(!moveMode); setRotationMode(false); }}
                        style={{ background: moveMode ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 0.1)', cursor: 'not-allowed' }}
                    >
                      ✋
                    </button>
                </div>
            </div>
        </div>
    );
}
