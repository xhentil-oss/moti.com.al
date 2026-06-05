import React, { useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type WeatherMode = "sun" | "rain" | "snow" | "night" | "cloudy" | "storm" | "none";

interface WeatherSceneProps {
  symbolCode: string;
  className?: string;
}

// ─── Detect mode from symbol code ─────────────────────────────────────────────

function detectMode(code: string): WeatherMode {
  if (!code) return "none";
  const c = code.toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return "storm";
  if (c.includes("snow") || c.includes("sleet")) return "snow";
  if (c.includes("rain") || c.includes("shower")) return "rain";
  if (c.includes("fog")) return "cloudy";
  if (c.includes("cloudy")) return "cloudy";
  if (c.includes("night")) return "night";
  if (c.includes("clearsky_night") || c.includes("fair_night") || c.includes("partlycloudy_night")) return "night";
  if (c.includes("clearsky_day") || c.includes("fair_day")) return "sun";
  if (c.includes("partlycloudy_day")) return "sun";
  return "none";
}

// ─── Audio Engine (Web Audio API — no external files needed) ─────────────────

class AmbientAudio {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private gainNode: GainNode | null = null;
  private mode: WeatherMode = "none";
  private running = false;
  private interval: ReturnType<typeof setInterval> | null = null;

  start(mode: WeatherMode) {
    if (this.running && this.mode === mode) return;
    this.stop();
    this.mode = mode;
    if (mode === "none" || mode === "cloudy") return;

    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 2);
      this.gainNode.connect(this.ctx.destination);
      this.running = true;

      if (mode === "rain" || mode === "storm") {
        this.startRainSound();
      } else if (mode === "snow") {
        this.startWindSound(0.08);
      } else if (mode === "sun") {
        this.startBirdsLoop();
      } else if (mode === "night") {
        this.startNightCrickets();
      }
    } catch (e) {
      // Web Audio not available
    }
  }

  private startRainSound() {
    if (!this.ctx || !this.gainNode) return;
    // White noise → bandpass = rain on leaves
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.3;

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = "lowpass";
    filter2.frequency.value = 3000;

    src.connect(filter);
    filter.connect(filter2);
    filter2.connect(this.gainNode);
    src.start();
    this.nodes.push(src);

    // Add low rumble for storm
    if (this.mode === "storm") {
      const rumble = this.ctx.createOscillator();
      rumble.type = "sawtooth";
      rumble.frequency.value = 40;
      const rumbleGain = this.ctx.createGain();
      rumbleGain.gain.value = 0.04;
      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = "lowpass";
      rumbleFilter.frequency.value = 80;
      rumble.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.gainNode);
      rumble.start();
      this.nodes.push(rumble);
    }
  }

  private startWindSound(vol: number) {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    const g = this.ctx.createGain();
    g.gain.value = vol;

    src.connect(filter);
    filter.connect(g);
    g.connect(this.gainNode);
    src.start();
    this.nodes.push(src);
  }

  private startBirdsLoop() {
    if (!this.ctx || !this.gainNode) return;
    // Schedule bird chirps periodically
    this.scheduleBirdChirp();
    this.interval = setInterval(() => this.scheduleBirdChirp(), 2800 + Math.random() * 3000);
  }

  private scheduleBirdChirp() {
    if (!this.ctx || !this.gainNode) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Chirp = quick freq glide on oscillator
    const chirps = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < chirps; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const baseFreq = 2000 + Math.random() * 1200;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now + i * 0.18);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.4, now + i * 0.18 + 0.06);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, now + i * 0.18 + 0.12);
      g.gain.setValueAtTime(0, now + i * 0.18);
      g.gain.linearRampToValueAtTime(0.12, now + i * 0.18 + 0.03);
      g.gain.linearRampToValueAtTime(0, now + i * 0.18 + 0.13);
      osc.connect(g);
      g.connect(this.gainNode!);
      osc.start(now + i * 0.18);
      osc.stop(now + i * 0.18 + 0.15);
    }
  }

  private startNightCrickets() {
    if (!this.ctx || !this.gainNode) return;
    this.scheduleCricket();
    this.interval = setInterval(() => this.scheduleCricket(), 600 + Math.random() * 800);
  }

  private scheduleCricket() {
    if (!this.ctx || !this.gainNode) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = 4200 + Math.random() * 600;
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + i * 0.07);
      g.gain.linearRampToValueAtTime(0.04, now + i * 0.07 + 0.02);
      g.gain.linearRampToValueAtTime(0, now + i * 0.07 + 0.05);
      osc.connect(g);
      g.connect(this.gainNode!);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.06);
    }
  }

  setVolume(v: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.5);
    }
  }

  stop() {
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
    this.nodes.forEach((n) => { try { (n as any).stop?.(); n.disconnect(); } catch (_) {} });
    this.nodes = [];
    if (this.gainNode) { try { this.gainNode.disconnect(); } catch (_) {} this.gainNode = null; }
    if (this.ctx) { try { this.ctx.close(); } catch (_) {} this.ctx = null; }
    this.running = false;
  }
}

// ─── Canvas particle systems ──────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  life: number; maxLife: number;
}

interface SunRay {
  angle: number; length: number; speed: number; opacity: number;
}

interface Star {
  x: number; y: number; r: number; twinkleSpeed: number; twinkleOffset: number;
}

class SceneRenderer {
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
  mode: WeatherMode = "none";
  running = false;
  raf = 0;
  particles: Particle[] = [];
  rays: SunRay[] = [];
  stars: Star[] = [];
  tick = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx2d = canvas.getContext("2d")!;
  }

  setMode(mode: WeatherMode) {
    this.mode = mode;
    this.particles = [];
    this.rays = [];
    this.stars = [];
    this.tick = 0;

    if (mode === "sun") {
      for (let i = 0; i < 16; i++) {
        this.rays.push({
          angle: (i / 16) * Math.PI * 2,
          length: 60 + Math.random() * 40,
          speed: 0.002 + Math.random() * 0.003,
          opacity: 0.3 + Math.random() * 0.4,
        });
      }
    }

    if (mode === "night") {
      const W = this.canvas.width, H = this.canvas.height;
      for (let i = 0; i < 80; i++) {
        this.stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.7,
          r: 0.5 + Math.random() * 1.5,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  spawnRain() {
    const W = this.canvas.width;
    this.particles.push({
      x: Math.random() * W * 1.2 - W * 0.1,
      y: -10,
      vx: -1.5,
      vy: 14 + Math.random() * 8,
      size: 0.8 + Math.random() * 0.8,
      opacity: 0.4 + Math.random() * 0.4,
      life: 0, maxLife: 999,
    });
  }

  spawnSnow() {
    const W = this.canvas.width;
    this.particles.push({
      x: Math.random() * W,
      y: -10,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.2 + Math.random() * 1.8,
      size: 2 + Math.random() * 3,
      opacity: 0.6 + Math.random() * 0.4,
      life: 0, maxLife: 999,
    });
  }

  drawFrame() {
    const { ctx2d: c, canvas, mode, tick } = this;
    const W = canvas.width, H = canvas.height;
    c.clearRect(0, 0, W, H);

    if (mode === "sun") {
      // Pulsing orb
      const cx = W * 0.85, cy = H * 0.15;
      const pulse = Math.sin(tick * 0.03) * 6;
      const grad = c.createRadialGradient(cx, cy, 0, cx, cy, 80 + pulse);
      grad.addColorStop(0, "rgba(255,220,80,0.55)");
      grad.addColorStop(0.4, "rgba(255,180,30,0.18)");
      grad.addColorStop(1, "rgba(255,140,0,0)");
      c.fillStyle = grad;
      c.beginPath();
      c.arc(cx, cy, 80 + pulse, 0, Math.PI * 2);
      c.fill();

      // Rotating rays
      this.rays.forEach((ray) => {
        ray.angle += ray.speed;
        const ox = cx + Math.cos(ray.angle) * 30;
        const oy = cy + Math.sin(ray.angle) * 30;
        const ex = cx + Math.cos(ray.angle) * (30 + ray.length);
        const ey = cy + Math.sin(ray.angle) * (30 + ray.length);
        c.save();
        c.globalAlpha = ray.opacity * (0.7 + 0.3 * Math.sin(tick * 0.05 + ray.angle));
        c.strokeStyle = "rgba(255,210,60,0.8)";
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(ox, oy);
        c.lineTo(ex, ey);
        c.stroke();
        c.restore();
      });

      // Floating light particles
      if (tick % 8 === 0 && this.particles.length < 25) {
        this.particles.push({
          x: cx + (Math.random() - 0.5) * 60,
          y: cy + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.5 - Math.random() * 0.5,
          size: 1.5 + Math.random() * 2,
          opacity: 0.6,
          life: 0, maxLife: 80,
        });
      }
      this.particles = this.particles.filter((p) => p.life < p.maxLife);
      this.particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        const fade = 1 - p.life / p.maxLife;
        c.save();
        c.globalAlpha = p.opacity * fade;
        c.fillStyle = "rgba(255,230,100,1)";
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      });
    }

    if (mode === "rain" || mode === "storm") {
      const spawnCount = mode === "storm" ? 6 : 3;
      for (let i = 0; i < spawnCount; i++) this.spawnRain();
      this.particles = this.particles.filter((p) => p.y < H + 20);
      this.particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        c.save();
        c.globalAlpha = p.opacity;
        c.strokeStyle = mode === "storm" ? "rgba(150,200,255,0.7)" : "rgba(120,190,255,0.6)";
        c.lineWidth = p.size;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(p.x, p.y);
        c.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
        c.stroke();
        c.restore();
      });

      // Lightning flash for storm
      if (mode === "storm" && tick % 180 === 0) {
        c.save();
        c.fillStyle = "rgba(200,220,255,0.12)";
        c.fillRect(0, 0, W, H);
        c.restore();
      }
    }

    if (mode === "snow") {
      for (let i = 0; i < 2; i++) if (this.particles.length < 120) this.spawnSnow();
      this.particles = this.particles.filter((p) => p.y < H + 20);
      this.particles.forEach((p) => {
        p.x += p.vx + Math.sin(tick * 0.02 + p.y * 0.05) * 0.4;
        p.y += p.vy;
        c.save();
        c.globalAlpha = p.opacity;
        c.fillStyle = "rgba(220,240,255,0.9)";
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fill();
        // soft glow
        const sg = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        sg.addColorStop(0, "rgba(200,230,255,0.3)");
        sg.addColorStop(1, "rgba(200,230,255,0)");
        c.fillStyle = sg;
        c.beginPath();
        c.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        c.fill();
        c.restore();
      });
    }

    if (mode === "night") {
      this.stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(tick * s.twinkleSpeed + s.twinkleOffset);
        c.save();
        c.globalAlpha = 0.3 + 0.7 * twinkle;
        const sg = c.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
        sg.addColorStop(0, "rgba(255,255,240,1)");
        sg.addColorStop(0.4, "rgba(200,220,255,0.6)");
        sg.addColorStop(1, "rgba(100,130,255,0)");
        c.fillStyle = sg;
        c.beginPath();
        c.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "rgba(255,255,250,0.95)";
        c.beginPath();
        c.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        c.fill();
        c.restore();
      });

      // Crescent moon
      const mx = W * 0.82, my = H * 0.14;
      c.save();
      c.fillStyle = "rgba(255,240,180,0.85)";
      c.shadowColor = "rgba(255,220,100,0.4)";
      c.shadowBlur = 20;
      c.beginPath();
      c.arc(mx, my, 22, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "rgba(8,22,50,1)";
      c.shadowBlur = 0;
      c.beginPath();
      c.arc(mx + 10, my - 4, 18, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    this.tick++;
  }

  start(mode: WeatherMode) {
    this.stop();
    this.setMode(mode);
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.drawFrame();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    if (this.ctx2d) this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize(w: number, h: number) {
    this.canvas.width = w;
    this.canvas.height = h;
    if (this.mode === "night") {
      // re-seed stars to fill new size
      this.stars = [];
      for (let i = 0; i < 80; i++) {
        this.stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.7,
          r: 0.5 + Math.random() * 1.5,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }
  }
}

// ─── React Component ──────────────────────────────────────────────────────────

const audioEngine = new AmbientAudio();

export const WeatherScene: React.FC<WeatherSceneProps> = ({ symbolCode, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SceneRenderer | null>(null);
  const modeRef = useRef<WeatherMode>("none");
  const [soundOn, setSoundOn] = React.useState(false);

  const mode = detectMode(symbolCode);

  const startScene = useCallback((m: WeatherMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!rendererRef.current) rendererRef.current = new SceneRenderer(canvas);
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) rendererRef.current.resize(rect.width, rect.height);
    rendererRef.current.start(m);
    modeRef.current = m;
  }, []);

  // Start / switch scene when symbolCode changes
  useEffect(() => {
    startScene(mode);
    // Stop sound on mode change (user must re-enable)
    audioEngine.stop();
    setSoundOn(false);

    const onResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !rendererRef.current) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) rendererRef.current.resize(rect.width, rect.height);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      rendererRef.current?.stop();
      audioEngine.stop();
    };
  }, [symbolCode]);

  const toggleSound = useCallback(() => {
    if (soundOn) {
      audioEngine.stop();
      setSoundOn(false);
    } else {
      audioEngine.start(modeRef.current);
      setSoundOn(true);
    }
  }, [soundOn]);

  if (mode === "none" || mode === "cloudy") return null;

  const soundLabels: Record<WeatherMode, string> = {
    sun: "Zëra zogjsh",
    rain: "Zë shiu",
    storm: "Zë stuhie",
    snow: "Erë e qetë",
    night: "Zëra nate",
    cloudy: "",
    none: "",
  };

  return (
    <div className={`relative pointer-events-none ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: mode === "night" ? "screen" : "normal" }}
      />
      {/* Sound toggle — restore pointer events only on this button */}
      <button
        onClick={toggleSound}
        className="pointer-events-auto absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 text-white/70 hover:text-white hover:bg-black/50 transition-all text-xs font-medium z-10"
        title={soundOn ? "Fik tingullin" : "Ndiz tingullin"}
        aria-label={soundOn ? "Fik tingullin e ambientit" : "Ndiz tingullin e ambientit"}
      >
        <span className="text-sm">{soundOn ? "🔊" : "🔇"}</span>
        <span className="hidden sm:inline">{soundOn ? "Fik" : soundLabels[mode]}</span>
      </button>
    </div>
  );
};
