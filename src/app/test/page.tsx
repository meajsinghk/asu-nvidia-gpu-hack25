'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Cpu, Zap, Database, Rocket, Globe, BarChart3, TrendingUp, Brain, Dna, Activity, Gamepad2, ShoppingCart, Camera } from 'lucide-react';

const MultiverseGame = () => {
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [gameState, setGameState] = useState('galaxy'); // 'galaxy' or 'planet'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({ cpu: 0, gpu: 0 });
  const [results, setResults] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    planetsVisited: 0,
    datasetsProcessed: 0,
    computePoints: 0
  });
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Planet data with different datasets
  const planets = [
    {
      id: 'terra-ai',
      name: 'Terra-AI',
      color: '#4ade80',
      position: { x: 200, y: 150 },
      size: 25,
      dataset: {
        name: 'Neural Network Training Data',
        type: 'Deep Learning',
        size: '2.3TB',
        complexity: 'High',
        description: 'Multi-layer perceptron training dataset for image classification',
        samples: 1000000,
        features: 784,
        gpuAdvantage: 8.5,
        icon: Brain
      }
    },
    {
      id: 'crypto-prime',
      name: 'Crypto-Prime',
      color: '#f59e0b',
      position: { x: 400, y: 200 },
      size: 30,
      dataset: {
        name: 'Cryptocurrency Mining Data',
        type: 'Blockchain',
        size: '500GB',
        complexity: 'Extreme',
        description: 'Hash computation and blockchain verification datasets',
        samples: 50000000,
        features: 256,
        gpuAdvantage: 15.2,
        icon: Zap
      }
    },
    {
      id: 'bio-helix',
      name: 'Bio-Helix',
      color: '#8b5cf6',
      position: { x: 150, y: 300 },
      size: 28,
      dataset: {
        name: 'Genomic Sequencing Data',
        type: 'Bioinformatics',
        size: '1.8TB',
        complexity: 'High',
        description: 'DNA sequence analysis and protein folding simulations',
        samples: 3000000,
        features: 1024,
        gpuAdvantage: 6.8,
        icon: Dna
      }
    },
    {
      id: 'quantum-flux',
      name: 'Quantum-Flux',
      color: '#06b6d4',
      position: { x: 500, y: 120 },
      size: 32,
      dataset: {
        name: 'Quantum Simulation Data',
        type: 'Physics',
        size: '3.1TB',
        complexity: 'Extreme',
        description: 'Quantum state calculations and particle interactions',
        samples: 10000000,
        features: 512,
        gpuAdvantage: 12.3,
        icon: Activity
      }
    },
    {
      id: 'game-world',
      name: 'Game-World',
      color: '#ef4444',
      position: { x: 350, y: 350 },
      size: 26,
      dataset: {
        name: 'Game Physics Data',
        type: 'Real-time Simulation',
        size: '800GB',
        complexity: 'Medium',
        description: 'Real-time physics calculations and rendering data',
        samples: 5000000,
        features: 128,
        gpuAdvantage: 4.2,
        icon: Gamepad2
      }
    },
    {
      id: 'market-nexus',
      name: 'Market-Nexus',
      color: '#f97316',
      position: { x: 300, y: 80 },
      size: 24,
      dataset: {
        name: 'Financial Trading Data',
        type: 'Time Series',
        size: '1.2TB',
        complexity: 'Medium',
        description: 'High-frequency trading algorithms and market analysis',
        samples: 50000000,
        features: 64,
        gpuAdvantage: 3.8,
        icon: TrendingUp
      }
    },
    {
      id: 'vision-prime',
      name: 'Vision-Prime',
      color: '#ec4899',
      position: { x: 450, y: 280 },
      size: 29,
      dataset: {
        name: 'Computer Vision Data',
        type: 'Image Processing',
        size: '4.5TB',
        complexity: 'High',
        description: 'Object detection and image segmentation datasets',
        samples: 20000000,
        features: 2048,
        gpuAdvantage: 9.7,
        icon: Camera
      }
    }
  ];

  // Galaxy background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.02 + 0.01
    }));

    let time = 0;

    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        star.x -= star.speed;
        if (star.x < -10) {
          star.x = canvas.width + 10;
          star.y = Math.random() * canvas.height;
        }
        
        star.opacity += Math.sin(time * star.twinkle) * 0.1;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const visitPlanet = (planet) => {
    setCurrentPlanet(planet);
    setGameState('planet');
    setPlayerStats(prev => ({
      ...prev,
      planetsVisited: prev.planetsVisited + 1
    }));
  };

  const returnToGalaxy = () => {
    setGameState('galaxy');
    setCurrentPlanet(null);
  };

  const runDatasetAnalysis = async () => {
    if (!currentPlanet) return;
    
    setIsProcessing(true);
    setProcessingProgress({ cpu: 0, gpu: 0 });
    setResults(null);

    const dataset = currentPlanet.dataset;
    const cpuSpeed = 1;
    const gpuSpeed = dataset.gpuAdvantage;

    // Simulate processing
    const cpuInterval = setInterval(() => {
      setProcessingProgress(prev => ({
        ...prev,
        cpu: Math.min(100, prev.cpu + cpuSpeed)
      }));
    }, 100);

    const gpuInterval = setInterval(() => {
      setProcessingProgress(prev => ({
        ...prev,
        gpu: Math.min(100, prev.gpu + gpuSpeed)
      }));
    }, 100);

    // Calculate completion time
    const cpuTime = 10000 / cpuSpeed;
    const gpuTime = 10000 / gpuSpeed;

    setTimeout(() => {
      clearInterval(cpuInterval);
      clearInterval(gpuInterval);
      setIsProcessing(false);
      
      const computePointsEarned = Math.floor(dataset.gpuAdvantage * 10);
      setResults({
        cpuTime: `${(cpuTime / 1000).toFixed(1)}s`,
        gpuTime: `${(gpuTime / 1000).toFixed(1)}s`,
        speedup: `${dataset.gpuAdvantage.toFixed(1)}x`,
        efficiency: `${((dataset.gpuAdvantage - 1) * 20).toFixed(0)}%`,
        pointsEarned: computePointsEarned
      });

      setPlayerStats(prev => ({
        ...prev,
        datasetsProcessed: prev.datasetsProcessed + 1,
        computePoints: prev.computePoints + computePointsEarned
      }));
    }, Math.max(cpuTime, gpuTime));
  };

  // Galaxy View
  if (gameState === 'galaxy') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        
        <div className="relative z-10">
          {/* Header */}
          <header className="p-6 bg-black/30 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Rocket className="w-8 h-8 text-cyan-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Multiverse Dataset Explorer
                </h1>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span>Planets: {playerStats.planetsVisited}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>Datasets: {playerStats.datasetsProcessed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Points: {playerStats.computePoints}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Galaxy Map */}
          <div className="relative h-screen flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-96">
              <h2 className="text-2xl font-bold text-center mb-8 text-cyan-400">
                Select a Planet to Explore
              </h2>
              
              {/* Planets */}
              <svg className="w-full h-full" viewBox="0 0 600 400">
                {planets.map((planet) => {
                  const IconComponent = planet.dataset.icon;
                  return (
                    <g key={planet.id}>
                      {/* Planet glow */}
                      <circle
                        cx={planet.position.x}
                        cy={planet.position.y}
                        r={planet.size + 10}
                        fill={planet.color}
                        opacity="0.2"
                        className="animate-pulse"
                      />
                      {/* Planet */}
                      <circle
                        cx={planet.position.x}
                        cy={planet.position.y}
                        r={planet.size}
                        fill={planet.color}
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => visitPlanet(planet)}
                      />
                      {/* Planet name */}
                      <text
                        x={planet.position.x}
                        y={planet.position.y + planet.size + 20}
                        textAnchor="middle"
                        className="fill-white text-sm font-semibold cursor-pointer"
                        onClick={() => visitPlanet(planet)}
                      >
                        {planet.name}
                      </text>
                    </g>
                  );
                })}
                
                {/* Connection lines */}
                <defs>
                  <linearGradient id="connectionGradient">
                    <stop offset="0%" stopColor="cyan" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="purple" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {planets.map((planet, i) => 
                  planets.slice(i + 1).map((otherPlanet, j) => (
                    <line
                      key={`${i}-${j}`}
                      x1={planet.position.x}
                      y1={planet.position.y}
                      x2={otherPlanet.position.x}
                      y2={otherPlanet.position.y}
                      stroke="url(#connectionGradient)"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  ))
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Planet View
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-30"
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 bg-black/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={returnToGalaxy}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>Return to Galaxy</span>
            </button>
            <h1 className="text-3xl font-bold" style={{ color: currentPlanet?.color }}>
              {currentPlanet?.name}
            </h1>
            <div className="text-sm text-gray-400">
              Compute Points: {playerStats.computePoints}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6">
          {/* Dataset Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div 
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border-2"
              style={{ borderColor: currentPlanet?.color }}
            >
              <div className="flex items-center mb-4">
                {currentPlanet && (
                  <currentPlanet.dataset.icon className="w-8 h-8 mr-3" style={{ color: currentPlanet.color }} />
                )}
                <h2 className="text-2xl font-bold">Dataset Information</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-semibold">{currentPlanet?.dataset.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-semibold">{currentPlanet?.dataset.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="font-semibold">{currentPlanet?.dataset.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Samples:</span>
                  <span className="font-semibold">{currentPlanet?.dataset.samples.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Features:</span>
                  <span className="font-semibold">{currentPlanet?.dataset.features}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GPU Advantage:</span>
                  <span className="font-semibold text-green-400">{currentPlanet?.dataset.gpuAdvantage}x</span>
                </div>
              </div>
              <p className="mt-4 text-gray-300 text-sm">
                {currentPlanet?.dataset.description}
              </p>
            </div>

            {/* Processing Results */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-cyan-400" />
                Processing Analysis
              </h2>
              
              {!isProcessing && !results && (
                <div className="text-center py-8">
                  <button
                    onClick={runDatasetAnalysis}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all text-lg font-semibold"
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Analyze Dataset
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center"><Cpu className="w-4 h-4 mr-2" />CPU Progress</span>
                      <span>{processingProgress.cpu.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="flex items-center"><Zap className="w-4 h-4 mr-2" />GPU Progress</span>
                      <span>{processingProgress.gpu.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress.gpu}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {results && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">{results.cpuTime}</div>
                      <div className="text-sm text-gray-400">CPU Time</div>
                    </div>
                    <div className="text-center p-4 bg-green-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{results.gpuTime}</div>
                      <div className="text-sm text-gray-400">GPU Time</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-cyan-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">{results.speedup}</div>
                      <div className="text-sm text-gray-400">Speedup</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">+{results.pointsEarned}</div>
                      <div className="text-sm text-gray-400">Points Earned</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setResults(null);
                      setProcessingProgress({ cpu: 0, gpu: 0 });
                    }}
                    className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                  >
                    Run Another Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiverseGame;
