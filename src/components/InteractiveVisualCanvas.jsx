import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Waves, 
  Orbit, 
  Network, 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Info,
  Maximize2,
  ChevronDown,
  Check
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MODES = [
  { id: 'waves', label: 'Wave Harmonics', icon: Waves },
  { id: 'gravity', label: 'Orbital Gravity', icon: Orbit },
  { id: 'neural', label: 'Neural Network', icon: Network },
  { id: 'field', label: 'Vector Field', icon: Compass },
];

const MODE_EQUATIONS = {
  waves: {
    title: 'Wave Harmonics',
    subtitle: 'Superposition & Interference',
    latex: 'y(x, t) = A_1 \\sin(k_1 x - \\omega_1 t) + A_2 \\sin(k_2 x + \\omega_2 t)',
  },
  gravity: {
    title: 'Orbital Gravity',
    subtitle: 'Keplerian Gravitation',
    latex: 'F = G \\frac{m_1 m_2}{r^2} \\quad \\left(\\mathbf{a} = -\\frac{\\mu}{r^3}\\mathbf{r}\\right)',
  },
  neural: {
    title: 'Neural Network',
    subtitle: 'Synaptic Activation & Flow',
    latex: 'a_j = \\sigma\\left(\\sum_{i} w_{ij} x_i + b_j\\right)',
  },
  field: {
    title: 'Vector Field',
    subtitle: 'Streamlines & Curl Dynamics',
    latex: '\\vec{v}(x,y) = \\begin{pmatrix} \\sin(ky) + v_{\\text{curl}} \\\\[2pt] \\cos(kx) \\end{pmatrix}',
  },
};

function LatexFormula({ tex }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        containerRef.current.innerHTML = katex.renderToString(tex, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (err) {
        containerRef.current.innerText = tex;
      }
    }
  }, [tex]);

  return <div ref={containerRef} className="visual-latex-display" />;
}

export default function InteractiveVisualCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Modes: 'waves' | 'gravity' | 'neural' | 'field'
  const [activeMode, setActiveMode] = useState('waves');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const activeModeObj = MODES.find((m) => m.id === activeMode) || MODES[0];
  const ActiveIcon = activeModeObj.icon;
  
  // Interactive Controls
  const [speed, setSpeed] = useState(1.2);
  const [intensity, setIntensity] = useState(1.0);
  const [pointDensity, setPointDensity] = useState(60);

  // Telemetry
  const [fps, setFps] = useState(60);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [showControls, setShowControls] = useState(false);

  // Simulation internal state refs for animation loop
  const stateRef = useRef({
    time: 0,
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsUpdateTime: performance.now(),
    particles: [],
    nodes: [],
    pulses: [],
    attractors: [],
    ripples: [],
    width: 800,
    height: 450,
  });

  // Re-initialize particles or nodes when activeMode or density changes
  const initSimulation = useCallback((mode, width, height) => {
    const s = stateRef.current;
    s.width = width;
    s.height = height;
    s.time = 0;
    s.ripples = [];
    s.pulses = [];

    if (mode === 'gravity') {
      const p = [];
      const count = Math.floor(pointDensity * 1.5);
      const cx = width / 2;
      const cy = height / 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * (Math.min(width, height) * 0.42);
        const orbitalSpeed = Math.sqrt(200 / dist) * (0.8 + Math.random() * 0.4);
        p.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: -Math.sin(angle) * orbitalSpeed,
          vy: Math.cos(angle) * orbitalSpeed,
          radius: 1.5 + Math.random() * 2,
          history: [],
          color: Math.random() > 0.4 ? '#DE5844' : '#B45309',
        });
      }
      s.particles = p;
      s.attractors = [{ x: cx, y: cy, mass: 600, main: true }];
    } else if (mode === 'neural') {
      const n = [];
      const nodeCount = Math.floor(pointDensity * 0.85);
      for (let i = 0; i < nodeCount; i++) {
        n.push({
          x: 40 + Math.random() * (width - 80),
          y: 40 + Math.random() * (height - 80),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 3 + Math.random() * 2.5,
          charge: 0,
          color: '#DE5844',
        });
      }
      s.nodes = n;
      s.pulses = [];
    } else if (mode === 'field') {
      const p = [];
      const count = Math.floor(pointDensity * 1.8);
      for (let i = 0; i < count; i++) {
        p.push({
          x: Math.random() * width,
          y: Math.random() * height,
          age: Math.random() * 100,
          maxAge: 70 + Math.random() * 60,
          history: [],
        });
      }
      s.particles = p;
    }
  }, [pointDensity]);

  // Handle Resize & Canvas setup
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = rect.width;
      // Responsive height scaling: compact on mobile, spacious on desktop
      const height = Math.max(260, Math.min(rect.width * 0.54, 460));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      initSimulation(activeMode, width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeMode, initSimulation]);

  // Mouse / Pointer handlers
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: Math.round(x), y: Math.round(y), active: true });

    const s = stateRef.current;
    if (activeMode === 'waves' && (e.buttons === 1 || e.type === 'pointermove')) {
      // Trigger interactive ripple
      if (Math.random() > 0.4) {
        s.ripples.push({
          x,
          y,
          radius: 2,
          maxRadius: 70 * intensity,
          strength: 1.0,
        });
        if (s.ripples.length > 16) s.ripples.shift();
      }
    } else if (activeMode === 'neural' && Math.random() > 0.6) {
      // Excite nearest nodes
      s.nodes.forEach(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          node.charge = 1.0;
          if (Math.random() > 0.7 && s.pulses.length < 30) {
            s.pulses.push({
              from: { x: node.x, y: node.y },
              to: { x: x + (Math.random() - 0.5) * 50, y: y + (Math.random() - 0.5) * 50 },
              progress: 0,
              speed: 0.04 * speed,
            });
          }
        }
      });
    }
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = stateRef.current;
    if (activeMode === 'gravity') {
      // Add a secondary gravitational body on click
      s.attractors.push({
        x,
        y,
        mass: 450 * intensity,
        main: false,
        pulse: 0
      });
      if (s.attractors.length > 4) s.attractors.splice(1, 1);
    } else if (activeMode === 'waves') {
      // Powerful ripple burst
      s.ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 120 * intensity,
        strength: 2.0,
      });
    } else if (activeMode === 'neural') {
      // Fire cascade from click
      s.nodes.forEach(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          node.charge = 1.0;
        }
      });
    }
  };

  const handlePointerLeave = () => {
    setMousePos(prev => ({ ...prev, active: false }));
  };

  // Main Render Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = (now) => {
      const s = stateRef.current;
      const dt = Math.min((now - s.lastFrameTime) / 1000, 0.1);
      s.lastFrameTime = now;

      // Update FPS calculation
      s.frameCount++;
      if (now - s.fpsUpdateTime > 500) {
        setFps(Math.round((s.frameCount * 1000) / (now - s.fpsUpdateTime)));
        s.frameCount = 0;
        s.fpsUpdateTime = now;
      }

      if (isPlaying) {
        s.time += dt * speed;
      }

      const { width, height, time } = s;

      // Clear Canvas with subtle warm ivory tint
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background Cartesian grid lines
      ctx.strokeStyle = '#ECE5DA';
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Render Active Mode
      if (activeMode === 'waves') {
        renderWaves(ctx, width, height, time, s, intensity, mousePos);
      } else if (activeMode === 'gravity') {
        renderGravity(ctx, width, height, dt * speed, s, mousePos, intensity);
      } else if (activeMode === 'neural') {
        renderNeural(ctx, width, height, dt * speed, s, mousePos);
      } else if (activeMode === 'field') {
        renderField(ctx, width, height, dt * speed, s, mousePos, intensity);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeMode, isPlaying, speed, intensity, mousePos]);

  // --- MODE 1: WAVE HARMONICS & SUPERPOSITION ---
  const renderWaves = (ctx, w, h, t, s, userIntensity, mPos) => {
    const centerY = h * 0.52;

    // Center equilibrium axis
    ctx.strokeStyle = '#DFD7C9';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, centerY);
    ctx.lineTo(w - 20, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update & draw ripples
    s.ripples.forEach((r, idx) => {
      r.radius += 1.8;
      r.strength *= 0.96;
      ctx.strokeStyle = `rgba(222, 88, 68, ${0.4 * r.strength})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    s.ripples = s.ripples.filter(r => r.strength > 0.05);

    // Wave 1: Fundamental Sine (Terracotta)
    const k1 = 0.015;
    const w1 = 2.2;
    const a1 = 38 * userIntensity;

    // Wave 2: Second Harmonic (Amber)
    const k2 = 0.032;
    const w2 = 3.6;
    const a2 = 22 * userIntensity;

    // Draw component waves in faint lines
    drawSingleWave(ctx, w, centerY, (x) => Math.sin(k1 * x - w1 * t) * a1, 'rgba(222, 88, 68, 0.25)', 1.5);
    drawSingleWave(ctx, w, centerY, (x) => Math.sin(k2 * x + w2 * t * 0.8) * a2, 'rgba(180, 83, 9, 0.25)', 1.5);

    // Composite Superposition Wave: Y = y1 + y2 + mouseInfluence
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#DE5844';
    
    // Wave gradient fill
    const grad = ctx.createLinearGradient(0, centerY - 60, 0, centerY + 60);
    grad.addColorStop(0, 'rgba(222, 88, 68, 0.22)');
    grad.addColorStop(1, 'rgba(222, 88, 68, 0.02)');

    const points = [];
    const step = 4;
    for (let x = 20; x <= w - 20; x += step) {
      let yDisp = Math.sin(k1 * x - w1 * t) * a1 + Math.sin(k2 * x + w2 * t * 0.8) * a2;
      
      // Add interactive mouse gaussian displacement
      if (mPos.active) {
        const dx = x - mPos.x;
        const dist = Math.abs(dx);
        if (dist < 120) {
          const gaussian = Math.exp(-(dist * dist) / (2 * 45 * 45));
          yDisp += (mPos.y - centerY) * gaussian * 0.6;
        }
      }

      // Add ripple interference
      s.ripples.forEach(r => {
        const dx = Math.abs(x - r.x);
        if (Math.abs(dx - r.radius) < 25) {
          yDisp += Math.sin((dx - r.radius) * 0.3) * 12 * r.strength;
        }
      });

      const y = centerY + yDisp;
      points.push({ x, y });
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill under composite wave
    ctx.lineTo(w - 20, centerY);
    ctx.lineTo(20, centerY);
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw interactive nodes / points along wave
    points.forEach((pt, i) => {
      if (i % 8 === 0) {
        // Wave point
        ctx.fillStyle = '#DE5844';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Drop line to equilibrium axis
        ctx.strokeStyle = 'rgba(222, 88, 68, 0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, centerY);
        ctx.stroke();
      }
    });

    // Formula tag on canvas
    drawFormulaTag(ctx, 30, 36, "y(x,t) = A₁·sin(k₁x - ω₁t) + A₂·sin(k₂x + ω₂t)");
  };

  const drawSingleWave = (ctx, w, centerY, func, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (let x = 20; x <= w - 20; x += 5) {
      const y = centerY + func(x);
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // --- MODE 2: GRAVITATIONAL N-BODY ORBITS ---
  const renderGravity = (ctx, w, h, dt, s, mPos, userIntensity) => {
    // Draw Attractors
    s.attractors.forEach((att) => {
      // Glow rings
      const pulse = (Math.sin(s.time * 3) + 1) * 0.5;
      ctx.fillStyle = att.main ? 'rgba(222, 88, 68, 0.15)' : 'rgba(180, 83, 9, 0.15)';
      ctx.beginPath();
      ctx.arc(att.x, att.y, (att.main ? 28 : 20) + pulse * 6, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = att.main ? '#DE5844' : '#B45309';
      ctx.beginPath();
      ctx.arc(att.x, att.y, att.main ? 10 : 7, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#1C1B18';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(att.main ? "M₀ (Center)" : "m₁ (Attractor)", att.x - 25, att.y - 16);
    });

    // Mouse gravity well if active
    let effectiveAttractors = [...s.attractors];
    if (mPos.active) {
      effectiveAttractors.push({ x: mPos.x, y: mPos.y, mass: 350 * userIntensity, main: false });
      ctx.strokeStyle = 'rgba(222, 88, 68, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(mPos.x, mPos.y, 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Update and draw particles
    s.particles.forEach((p) => {
      // Gravitational force from attractors: F = G * M / r^2
      effectiveAttractors.forEach((att) => {
        const dx = att.x - p.x;
        const dy = att.y - p.y;
        const distSq = dx * dx + dy * dy + 150; // softening factor
        const dist = Math.sqrt(distSq);
        const force = (att.mass * userIntensity) / distSq;
        p.vx += (dx / dist) * force * dt * 25;
        p.vy += (dy / dist) * force * dt * 25;
      });

      // Update position
      p.x += p.vx * dt * 30;
      p.y += p.vy * dt * 30;

      // History trail
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 12) p.history.shift();

      // Draw Orbit Trail
      if (p.history.length > 2) {
        ctx.beginPath();
        ctx.moveTo(p.history[0].x, p.history[0].y);
        for (let i = 1; i < p.history.length; i++) {
          ctx.lineTo(p.history[i].x, p.history[i].y);
        }
        ctx.strokeStyle = p.color === '#DE5844' ? 'rgba(222, 88, 68, 0.28)' : 'rgba(180, 83, 9, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw Particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    drawFormulaTag(ctx, 30, 36, "F = G · (m₁ · m₂) / r²  [Keplerian Orbital Motion]");
  };

  // --- MODE 3: NEURAL SYNAPSE NETWORK ---
  const renderNeural = (ctx, w, h, dt, s, mPos) => {
    const nodes = s.nodes;

    // Update node positions
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 30 || node.x > w - 30) node.vx *= -1;
      if (node.y < 30 || node.y > h - 30) node.vy *= -1;

      // Decay charge
      node.charge *= 0.96;
    });

    // Draw Synaptic Connections
    const maxDist = 95;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.45;
          const isHot = nodes[i].charge > 0.4 || nodes[j].charge > 0.4;
          
          ctx.strokeStyle = isHot 
            ? `rgba(222, 88, 68, ${alpha + 0.3})`
            : `rgba(223, 215, 201, ${alpha + 0.2})`;
          ctx.lineWidth = isHot ? 1.6 : 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw travelling action potentials (pulses)
    s.pulses.forEach(pulse => {
      pulse.progress += pulse.speed;
      const px = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
      const py = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

      ctx.fillStyle = '#DE5844';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    s.pulses = s.pulses.filter(p => p.progress < 1.0);

    // Random spontaneous pulse emission
    if (Math.random() > 0.88 && s.pulses.length < 24) {
      const idx1 = Math.floor(Math.random() * nodes.length);
      const n1 = nodes[idx1];
      for (let k = 0; k < nodes.length; k++) {
        if (k !== idx1) {
          const n2 = nodes[k];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
          if (dist < maxDist) {
            s.pulses.push({
              from: { x: n1.x, y: n1.y },
              to: { x: n2.x, y: n2.y },
              progress: 0,
              speed: 0.03 * speed,
            });
            n1.charge = 1.0;
            break;
          }
        }
      }
    }

    // Draw Nodes
    nodes.forEach(node => {
      const isCharged = node.charge > 0.2;
      const r = node.radius + (isCharged ? node.charge * 3 : 0);

      if (isCharged) {
        ctx.fillStyle = `rgba(222, 88, 68, ${0.25 * node.charge})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = isCharged ? '#DE5844' : '#4A463F';
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    drawFormulaTag(ctx, 30, 36, "aⱼ = σ( Σ wᵢⱼ xᵢ + bⱼ )  [Synaptic Activation & Flow]");
  };

  // --- MODE 4: VECTOR FIELD & DYNAMICS ---
  const renderField = (ctx, w, h, dt, s, mPos, userIntensity) => {
    // Draw vector field arrows grid
    const spacing = 36;
    for (let x = spacing; x < w; x += spacing) {
      for (let y = spacing; y < h; y += spacing) {
        let vx = Math.sin((y * 0.015) + s.time * 0.8);
        let vy = Math.cos((x * 0.015) + s.time * 0.8);

        // Mouse vortex influence
        if (mPos.active) {
          const dx = x - mPos.x;
          const dy = y - mPos.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            const factor = (1 - dist / 140) * 1.8 * userIntensity;
            vx += Math.cos(angle) * factor;
            vy += Math.sin(angle) * factor;
          }
        }

        const len = Math.hypot(vx, vy);
        const nx = (vx / len) * 12;
        const ny = (vy / len) * 12;

        ctx.strokeStyle = 'rgba(201, 191, 176, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + nx, y + ny);
        ctx.stroke();

        ctx.fillStyle = 'rgba(222, 88, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(x + nx, y + ny, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Update & draw tracer particles
    s.particles.forEach(p => {
      p.age++;
      if (p.age > p.maxAge || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.age = 0;
        p.history = [];
      }

      let vx = Math.sin((p.y * 0.015) + s.time * 0.8);
      let vy = Math.cos((p.x * 0.015) + s.time * 0.8);

      if (mPos.active) {
        const dx = p.x - mPos.x;
        const dy = p.y - mPos.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          const factor = (1 - dist / 140) * 2.2 * userIntensity;
          vx += Math.cos(angle) * factor;
          vy += Math.sin(angle) * factor;
        }
      }

      p.x += vx * dt * 50;
      p.y += vy * dt * 50;

      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 8) p.history.shift();

      if (p.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.history[0].x, p.history[0].y);
        for (let i = 1; i < p.history.length; i++) {
          ctx.lineTo(p.history[i].x, p.history[i].y);
        }
        ctx.strokeStyle = 'rgba(222, 88, 68, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    });

    drawFormulaTag(ctx, 30, 36, "v⃗(x,y) = ⟨ sin(ky) + v_{curl},  cos(kx) ⟩  [Vector Streamlines]");
  };

  // Helper for drawing HUD formula tag
  const drawFormulaTag = (ctx, x, y, text) => {
    // Suppress drawing on-canvas HUD tag on mobile screens (<= 768px).
    // On mobile screens, equations are rendered in authentic LaTeX in the dedicated footer block below!
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return;
    }

    ctx.save();
    ctx.font = '12px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(text).width;
    
    // Background capsule
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = '#DFD7C9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y - 18, textWidth + 24, 28, 6);
    ctx.fill();
    ctx.stroke();

    // Terracotta dot
    ctx.fillStyle = '#DE5844';
    ctx.beginPath();
    ctx.arc(x + 10, y - 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = '#1C1B18';
    ctx.fillText(text, x + 20, y);
    ctx.restore();
  };

  return (
    <div className="visual-lab-container" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      margin: '2rem 0',
    }}>
      {/* Simulation Header & Mode Tabs (Desktop Version: untouched) */}
      <div className="visual-lab-toolbar visual-lab-toolbar-desktop">
        {/* Left: Title & Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isPlaying ? 'var(--claude-terracotta)' : 'var(--text-muted)',
            boxShadow: isPlaying ? '0 0 8px var(--claude-terracotta)' : 'none',
          }} />
          <span style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.82rem', 
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Interactive Study Visualizer
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--claude-terracotta-subtle)',
            color: 'var(--claude-terracotta)',
            border: '1px solid var(--claude-terracotta-border)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            Touch &amp; Drag
          </span>
        </div>

        {/* Center: Mode Selectors */}
        <div className="visual-lab-tabs-scroll">
          {[
            { id: 'waves', label: 'Wave Harmonics', icon: Waves },
            { id: 'gravity', label: 'Orbital Gravity', icon: Orbit },
            { id: 'neural', label: 'Neural Network', icon: Network },
            { id: 'field', label: 'Vector Field', icon: Compass },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id)}
                className="mode-tab-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: active ? 600 : 500,
                  borderRadius: 'var(--radius-sm)',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  backgroundColor: active ? 'var(--claude-terracotta)' : 'transparent',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} className="mode-tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 500,
            }}
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              const canvas = canvasRef.current;
              if (canvas) initSimulation(activeMode, canvas.width, canvas.height);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
            }}
            title="Reset simulation parameters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: showControls ? 'var(--claude-terracotta-subtle)' : 'var(--bg-card)',
              borderColor: showControls ? 'var(--claude-terracotta)' : 'var(--border-default)',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: showControls ? 'var(--claude-terracotta)' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
            }}
            title="Toggle parameter sliders"
          >
            <Sliders size={13} />
            <span>Tune</span>
          </button>
        </div>
      </div>

      {/* Mobile Simulation Toolbar (visible only on <= 768px) */}
      <div className="visual-lab-toolbar-mobile">
        {/* Row 1: Single line title without bullet point */}
        <div className="visual-mobile-header-row">
          <span className="visual-mobile-title">
            Interactive Study Visualizer
          </span>
        </div>

        {/* Row 2: Mode Dropdown + Quick Actions (Exact icons & text as desktop, no colored emojis) */}
        <div className="visual-mobile-controls-row">
          <div className="visual-mobile-dropdown-wrap" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="visual-mobile-dropdown-btn"
              aria-expanded={isDropdownOpen}
              aria-label="Select simulation mode"
            >
              <div className="visual-mobile-dropdown-current">
                <ActiveIcon size={15} className="visual-mobile-dropdown-current-icon" />
                <span className="visual-mobile-dropdown-current-label">
                  {activeModeObj.label}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`visual-mobile-select-arrow ${isDropdownOpen ? 'open' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="visual-mobile-dropdown-menu">
                {MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = activeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setActiveMode(mode.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`visual-mobile-dropdown-item ${isSelected ? 'selected' : ''}`}
                    >
                      <Icon size={15} className="dropdown-item-icon" />
                      <span className="dropdown-item-label">{mode.label}</span>
                      {isSelected && (
                        <Check size={14} className="dropdown-item-check" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="visual-mobile-actions">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="visual-mobile-action-btn"
              title={isPlaying ? 'Pause simulation' : 'Play simulation'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (canvas) initSimulation(activeMode, canvas.width, canvas.height);
              }}
              className="visual-mobile-action-btn"
              title="Reset simulation parameters"
              aria-label="Reset simulation"
            >
              <RotateCcw size={15} />
            </button>

            <button
              onClick={() => setShowControls(!showControls)}
              className={`visual-mobile-action-btn ${showControls ? 'active' : ''}`}
              title="Toggle parameter sliders"
              aria-label="Toggle parameter sliders"
            >
              <Sliders size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Optional Tuning Sliders Drawer */}
      {showControls && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          padding: '0.85rem 1.5rem',
          background: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Speed Factor:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--claude-terracotta)' }}>{speed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="2.5" 
              step="0.1" 
              value={speed} 
              onChange={e => setSpeed(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--claude-terracotta)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Field Intensity:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--claude-terracotta)' }}>{intensity.toFixed(1)}x</span>
            </div>
            <input 
              type="range" 
              min="0.4" 
              max="2.0" 
              step="0.1" 
              value={intensity} 
              onChange={e => setIntensity(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--claude-terracotta)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Sample Density:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--claude-terracotta)' }}>{pointDensity}</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="100" 
              step="10" 
              value={pointDensity} 
              onChange={e => setPointDensity(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--claude-terracotta)' }}
            />
          </div>
        </div>
      )}

      {/* Main Interactive Canvas Area */}
      <div 
        ref={containerRef} 
        style={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden',
          cursor: activeMode === 'gravity' ? 'crosshair' : 'grab',
          userSelect: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          style={{ display: 'block', width: '100%', touchAction: 'none' }}
        />

        {/* Live Bottom Telemetry Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 14,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: 'calc(100% - 28px)',
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>FPS: </span>
            <span style={{ fontWeight: 600, color: fps > 45 ? '#15803D' : '#DE5844' }}>{fps}</span>
          </div>
          <div className="canvas-hud-divider" style={{ width: 1, height: 12, background: 'var(--border-default)' }} />
          <div className="canvas-hud-coordinates">
            <span style={{ color: 'var(--text-muted)' }}>POS: </span>
            <span>{mousePos.active ? `(${mousePos.x}, ${mousePos.y})` : 'idle'}</span>
          </div>
          <div style={{ width: 1, height: 12, background: 'var(--border-default)' }} />
          <div style={{ color: 'var(--claude-terracotta)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {activeMode === 'waves' && 'Harmonics'}
            {activeMode === 'gravity' && 'Orbits'}
            {activeMode === 'neural' && 'Synapses'}
            {activeMode === 'field' && 'Vortices'}
          </div>
        </div>
      </div>

      {/* Mobile-Only Interactive Equation Footer with LaTeX & Touch Guide */}
      <div className="visual-lab-footer-mobile">
        <div className="visual-footer-top">
          <div className="visual-footer-mode-tag">
            <span className="visual-footer-indicator" />
            <span className="visual-footer-mode-name">
              {MODE_EQUATIONS[activeMode]?.title}
            </span>
            <span className="visual-footer-mode-sub">
              • {MODE_EQUATIONS[activeMode]?.subtitle}
            </span>
          </div>
          <div className="visual-footer-touch-badge">
            <span>Touch &amp; Drag</span>
          </div>
        </div>

        <div className="visual-footer-latex-card">
          <LatexFormula tex={MODE_EQUATIONS[activeMode]?.latex || ''} />
        </div>
      </div>
    </div>
  );
}
