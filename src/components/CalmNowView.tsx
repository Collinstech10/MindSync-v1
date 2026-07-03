import React, { useState, useEffect, useRef } from "react";
import { Eye, ShieldCheck, Heart, UserCheck, Play, Pause, RotateCcw, Compass, Sparkles, Smile, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SessionLog } from "../types";

// Ambient Breath Audio Synthesizer utilizing lowpass-filtered Brown Noise for gentle air/wind simulation
// paired with a warm, grounding sound-bowl styled triangle wave oscillator that swells and fades in sync.
class BreatheSoundSynth {
  private ctx: AudioContext | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  
  private toneOsc: OscillatorNode | null = null;
  private toneGainNode: GainNode | null = null;

  private volume: number = 0.85; // Rich, easily audible ambient balance
  private isMuted: boolean = true; // Safe default

  constructor() {}

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      // --- Brown Noise Setup (gentle physical breathing air) ---
      const bufferSize = 3 * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Lowpass filter to create brown noise from white noise
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 4.5;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.value = 250;
      this.filterNode.Q.value = 1.1;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.0;

      this.noiseSource.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      this.noiseSource.start(0);

      // --- Grounding Warm Tone Setup (Cozy warm meditation hum) ---
      this.toneOsc = this.ctx.createOscillator();
      this.toneOsc.type = "triangle";
      this.toneOsc.frequency.value = 110; // Grounding A2 pitch

      this.toneGainNode = this.ctx.createGain();
      this.toneGainNode.gain.value = 0.0;

      const toneFilter = this.ctx.createBiquadFilter();
      toneFilter.type = "lowpass";
      toneFilter.frequency.value = 140;

      this.toneOsc.connect(toneFilter);
      toneFilter.connect(this.toneGainNode);
      this.toneGainNode.connect(this.ctx.destination);
      this.toneOsc.start(0);

    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    const now = this.ctx?.currentTime || 0;
    if (muted && this.ctx) {
      if (this.gainNode) {
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setTargetAtTime(0, now, 0.15);
      }
      if (this.toneGainNode) {
        this.toneGainNode.gain.cancelScheduledValues(now);
        this.toneGainNode.gain.setTargetAtTime(0, now, 0.15);
      }
    } else if (!muted && this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
  }

  triggerPhase(phase: "Inhale" | "Hold" | "Exhale" | "Hold (Rest)", duration: number) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    this.filterNode?.frequency.cancelScheduledValues(now);
    this.gainNode?.gain.cancelScheduledValues(now);
    
    this.toneOsc?.frequency.cancelScheduledValues(now);
    this.toneGainNode?.gain.cancelScheduledValues(now);

    if (phase === "Inhale") {
      // Inhalation: Senses opening, sound rising smoothly
      const currentFreq = this.filterNode ? this.filterNode.frequency.value : 250;
      this.filterNode?.frequency.setValueAtTime(currentFreq, now);
      this.filterNode?.frequency.exponentialRampToValueAtTime(620, now + duration);

      const currentGain = this.gainNode ? this.gainNode.gain.value : 0;
      this.gainNode?.gain.setValueAtTime(currentGain, now);
      this.gainNode?.gain.linearRampToValueAtTime(0.18 * this.volume, now + duration);

      this.toneOsc?.frequency.setValueAtTime(110, now);
      this.toneOsc?.frequency.linearRampToValueAtTime(118, now + duration);

      const currentToneGain = this.toneGainNode ? this.toneGainNode.gain.value : 0;
      this.toneGainNode?.gain.setValueAtTime(currentToneGain, now);
      this.toneGainNode?.gain.linearRampToValueAtTime(0.24 * this.volume, now + duration);

    } else if (phase === "Exhale") {
      // Exhalation: Releasing tension, sound falling and fading
      const currentFreq = this.filterNode ? this.filterNode.frequency.value : 450;
      this.filterNode?.frequency.setValueAtTime(currentFreq, now);
      this.filterNode?.frequency.exponentialRampToValueAtTime(150, now + duration);

      const currentGain = this.gainNode ? this.gainNode.gain.value : 0;
      this.gainNode?.gain.setValueAtTime(currentGain, now);
      this.gainNode?.gain.linearRampToValueAtTime(0.05 * this.volume, now + duration - 0.8);
      this.gainNode?.gain.linearRampToValueAtTime(0.001, now + duration);

      const currentToneFreq = this.toneOsc ? this.toneOsc.frequency.value : 110;
      this.toneOsc?.frequency.setValueAtTime(currentToneFreq, now);
      this.toneOsc?.frequency.linearRampToValueAtTime(95, now + duration);

      const currentToneGain = this.toneGainNode ? this.toneGainNode.gain.value : 0;
      this.toneGainNode?.gain.setValueAtTime(currentToneGain, now);
      this.toneGainNode?.gain.linearRampToValueAtTime(0.08 * this.volume, now + duration - 0.8);
      this.toneGainNode?.gain.linearRampToValueAtTime(0.001, now + duration);

    } else if (phase === "Hold") {
      // Hold breath: Very soft comforting, steady micro-drone
      this.filterNode?.frequency.setTargetAtTime(300, now, 0.8);
      
      const currentGain = this.gainNode ? this.gainNode.gain.value : 0;
      this.gainNode?.gain.setValueAtTime(currentGain, now);
      this.gainNode?.gain.linearRampToValueAtTime(0.02 * this.volume, now + 1.0);

      this.toneOsc?.frequency.setTargetAtTime(110, now, 0.8);
      
      const currentToneGain = this.toneGainNode ? this.toneGainNode.gain.value : 0;
      this.toneGainNode?.gain.setValueAtTime(currentToneGain, now);
      this.toneGainNode?.gain.linearRampToValueAtTime(0.08 * this.volume, now + 1.0);

    } else {
      // Hold (Rest): Complete calm pause
      const currentGain = this.gainNode ? this.gainNode.gain.value : 0;
      this.gainNode?.gain.setValueAtTime(currentGain, now);
      this.gainNode?.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      const currentToneGain = this.toneGainNode ? this.toneGainNode.gain.value : 0;
      this.toneGainNode?.gain.setValueAtTime(currentToneGain, now);
      this.toneGainNode?.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    }
  }

  stop() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(0, now, 0.15);
    }
    if (this.toneGainNode) {
      this.toneGainNode.gain.cancelScheduledValues(now);
      this.toneGainNode.gain.setTargetAtTime(0, now, 0.15);
    }
  }
}

interface CalmNowViewProps {
  onLogSession: (log: Omit<SessionLog, "id" | "timestamp">) => void;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

type Mode = "breathing" | "grounding" | "relax" | "panic";

export default function CalmNowView({ onLogSession, showToast }: CalmNowViewProps) {
  const [currentMode, setCurrentMode] = useState<Mode>("breathing");
  
  // Breathing state
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold (Rest)">("Inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [isBreatheActive, setIsBreatheActive] = useState(true);
  const [breathsCompleted, setBreathsCompleted] = useState(0);

  // Breathing audio state
  const synthRef = useRef<BreatheSoundSynth | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Muted by default to comply with browser policy

  // Initialize synth on mount
  useEffect(() => {
    synthRef.current = new BreatheSoundSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  // Update mute state in synth
  useEffect(() => {
    synthRef.current?.setMuted(isMuted);
  }, [isMuted]);

  // Synchronize phase transitions with synthesizer
  useEffect(() => {
    if (currentMode !== "breathing" || !isBreatheActive) {
      synthRef.current?.stop();
      return;
    }
    // Each step is 4 seconds
    synthRef.current?.triggerPhase(breathePhase, 4);
  }, [breathePhase, isBreatheActive, currentMode, isMuted]);

  // Grounding states
  const [groundingStep, setGroundingStep] = useState(1); // 1 to 5
  const [groundingInputs, setGroundingInputs] = useState<string[]>([]);
  const [currentGroundInput, setCurrentGroundInput] = useState("");

  // Mode descriptions
  const modeDetails = {
    breathing: {
      title: "Box Breathing",
      desc: "A rhythmic 4-4-4-4 box breathing technique designed to slow your heart rate and steady your nervous system.",
    },
    grounding: {
      title: "5-4-3-2-1 Grounding",
      desc: "Gently guide your focus to the physical environment, helping to quiet overwhelming internal chatter.",
    },
    relax: {
      title: "Gentle Body Scan",
      desc: "Scan and relax your muscle groups, systematically letting go of stored physical tension.",
    },
    panic: {
      title: "Panic Reset Guide",
      desc: "Panic is a temporary physical reaction. Paced breathing signals your system that you are completely safe.",
    },
  };

  // Breathing Loop effect
  useEffect(() => {
    if (currentMode !== "breathing" || !isBreatheActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (breathePhase === "Inhale") {
            setBreathePhase("Hold");
            return 4;
          } else if (breathePhase === "Hold") {
            setBreathePhase("Exhale");
            return 4;
          } else if (breathePhase === "Exhale") {
            setBreathePhase("Hold (Rest)");
            return 4;
          } else {
            setBreathePhase("Inhale");
            setBreathsCompleted((b) => b + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMode, isBreatheActive, breathePhase]);

  // Log session when modes change or complete
  const handleLogActiveSession = (type: Mode, name: string, duration: number) => {
    onLogSession({
      type: type === "breathing" ? "breathing" : type === "grounding" ? "grounding" : type === "relax" ? "relaxation" : "panic",
      name,
      durationSeconds: duration,
    });
  };

  // Grounding Next handler
  const handleGroundingNext = () => {
    if (!currentGroundInput.trim()) return;
    const newInputs = [...groundingInputs, currentGroundInput.trim()];
    setGroundingInputs(newInputs);
    setCurrentGroundInput("");

    if (groundingStep < 5) {
      setGroundingStep((s) => s + 1);
    } else {
      // Completed grounding session!
      handleLogActiveSession("grounding", "5-4-3-2-1 Sensory Grounding", 90);
      if (showToast) {
        showToast("Sensory Grounding completed. You have successfully anchored in the present moment.", "success");
      }
      // Reset
      setGroundingStep(1);
      setGroundingInputs([]);
      setCurrentMode("breathing");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          You're safe in this moment.
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          This is your body's alarm system. Let's lower the alarm level one step at a time.
        </p>
      </header>

      {/* Steps Indicator / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setCurrentMode("breathing")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ${
            currentMode === "breathing"
              ? "bg-[#57f1db]/10 border-[#57f1db]/30 text-[#57f1db] shadow-[0_0_15px_rgba(87,241,219,0.15)]"
              : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-[#57f1db] ${currentMode === "breathing" ? "animate-pulse" : ""}`} />
          Breathe
        </button>

        <div className="h-px w-6 bg-slate-800" />

        <button
          onClick={() => setCurrentMode("grounding")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ${
            currentMode === "grounding"
              ? "bg-[#57f1db]/10 border-[#57f1db]/30 text-[#57f1db]"
              : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300"
          }`}
        >
          Ground
        </button>

        <div className="h-px w-6 bg-slate-800" />

        <button
          onClick={() => setCurrentMode("relax")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ${
            currentMode === "relax"
              ? "bg-[#57f1db]/10 border-[#57f1db]/30 text-[#57f1db]"
              : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300"
          }`}
        >
          Relax Body
        </button>

        <div className="h-px w-6 bg-slate-800" />

        <button
          onClick={() => setCurrentMode("panic")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer ${
            currentMode === "panic"
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300"
          }`}
        >
          Panic Guide
        </button>
      </div>

      {/* Main Focus Stage */}
      <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-slate-900/20 via-transparent to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {currentMode === "breathing" && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              {/* Pulsing circle graphic */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale:
                      breathePhase === "Inhale"
                        ? [1, 1.45]
                        : breathePhase === "Hold"
                        ? 1.45
                        : breathePhase === "Exhale"
                        ? [1.45, 1]
                        : 1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-[#57f1db]/5 border border-[#57f1db]/10"
                />
                
                <motion.div
                  animate={{
                    scale:
                      breathePhase === "Inhale"
                        ? [1, 1.3]
                        : breathePhase === "Hold"
                        ? 1.3
                        : breathePhase === "Exhale"
                        ? [1.3, 1]
                        : 1,
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#57f1db]/10 to-cyan-500/10 shadow-[0_0_30px_rgba(87,241,219,0.08)]"
                />

                <div className="z-10 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#57f1db]/70 mb-2">
                    {breathePhase}
                  </span>
                  <span className="text-5xl font-black text-white">{timeLeft}s</span>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <p className="text-sm text-slate-400 font-semibold max-w-sm">
                  {breathePhase === "Inhale" && "Pull air deep into your lower diaphragm."}
                  {breathePhase === "Hold" && "Rest your nervous system in absolute stillness."}
                  {breathePhase === "Exhale" && "Let all physical tension dissolve with the air."}
                  {breathePhase === "Hold (Rest)" && "Pause before starting the next breathing cycle."}
                </p>

                 <div className="flex gap-4 justify-center items-center">
                  <button
                    onClick={() => {
                      const nextBreatheActive = !isBreatheActive;
                      setIsBreatheActive(nextBreatheActive);
                      if (nextBreatheActive) {
                        if (!isMuted) {
                          synthRef.current?.init();
                          synthRef.current?.setMuted(false);
                          synthRef.current?.triggerPhase(breathePhase, 4);
                        }
                      } else {
                        synthRef.current?.stop();
                      }
                    }}
                    className="px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isBreatheActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isBreatheActive ? "Pause" : "Resume"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTimeLeft(4);
                      setBreathePhase("Inhale");
                      setBreathsCompleted(0);
                      if (isBreatheActive && !isMuted) {
                        synthRef.current?.init();
                        synthRef.current?.setMuted(false);
                        synthRef.current?.triggerPhase("Inhale", 4);
                      }
                    }}
                    title="Reset session"
                    className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const nextMute = !isMuted;
                      setIsMuted(nextMute);
                      if (!nextMute) {
                        synthRef.current?.init();
                        synthRef.current?.setMuted(false);
                        synthRef.current?.triggerPhase(breathePhase, 4);
                      } else {
                        synthRef.current?.stop();
                      }
                      if (showToast) {
                        showToast(nextMute ? "Breathing sound muted." : "Breathing sound enabled. Take a deep breath.", "info");
                      }
                    }}
                    title={isMuted ? "Unmute breathing sounds" : "Mute breathing sounds"}
                    className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                      isMuted
                        ? "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                        : "bg-[#57f1db]/10 border-[#57f1db]/30 text-[#57f1db] hover:bg-[#57f1db]/20"
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-2">
                  Completed Breaths: {breathsCompleted} • Sensation: Calming
                </div>
              </div>
            </motion.div>
          )}

          {currentMode === "grounding" && (
            <motion.div
              key="grounding"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md space-y-6 flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-cyan-500/10 p-4 text-cyan-400">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">
                  Step {groundingStep} of 5
                </h2>
                <p className="text-slate-300 font-medium">
                  {groundingStep === 1 && "Name 5 things you can SEE in this room right now."}
                  {groundingStep === 2 && "Name 4 physical sensations you can FEEL (e.g. feet on floor, cool air)."}
                  {groundingStep === 3 && "Name 3 objective sounds you can HEAR in your environment."}
                  {groundingStep === 4 && "Name 2 scents you can SMELL (or memory of deep forest air)."}
                  {groundingStep === 5 && "Name 1 taste you can TASTE right now."}
                </p>
              </div>

              <div className="w-full space-y-4">
                <input
                  type="text"
                  value={currentGroundInput}
                  onChange={(e) => setCurrentGroundInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGroundingNext()}
                  placeholder="Type or observe out loud..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-center transition-all"
                />

                <button
                  onClick={handleGroundingNext}
                  className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold text-sm shadow-md transition-all cursor-pointer"
                >
                  Next Observation
                </button>
              </div>

              {/* Progress indicators */}
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`h-1.5 w-6 rounded-full transition-all ${
                      s <= groundingStep ? "bg-cyan-400" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentMode === "relax" && (
            <motion.div
              key="relax"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg space-y-6 flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-purple-500/10 p-4 text-[#cebdff]">
                <UserCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Progressive Muscle Relaxation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
                  <span className="text-[10px] font-mono text-[#cebdff] font-bold">STAGE 1</span>
                  <h4 className="font-bold text-white mt-1">Unclench the Jaw</h4>
                  <p className="text-xs text-slate-400 mt-1">Let your tongue fall away from the roof of your mouth. Relax your lips.</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
                  <span className="text-[10px] font-mono text-[#cebdff] font-bold">STAGE 2</span>
                  <h4 className="font-bold text-white mt-1">Drop the Shoulders</h4>
                  <p className="text-xs text-slate-400 mt-1">Force your shoulders downwards away from your ears. Release physical tension.</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
                  <span className="text-[10px] font-mono text-[#cebdff] font-bold">STAGE 3</span>
                  <h4 className="font-bold text-white mt-1">Soften the Abdomen</h4>
                  <p className="text-xs text-slate-400 mt-1">Release all tension in your stomach. Allow fluid diaphragmatic breathing.</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
                  <span className="text-[10px] font-mono text-[#cebdff] font-bold">STAGE 4</span>
                  <h4 className="font-bold text-white mt-1">Ground Your Palms</h4>
                  <p className="text-xs text-slate-400 mt-1">Let your fingers curl naturally. Let weight sink completely into your seat.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleLogActiveSession("relax", "Progressive Muscle Scan", 120);
                  if (showToast) {
                    showToast("Progressive relaxation complete. Muscle tension decreased successfully.", "success");
                  }
                  setCurrentMode("breathing");
                }}
                className="px-8 py-3.5 rounded-full bg-[#cebdff] text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
              >
                Log Physical Relaxation Complete
              </button>
            </motion.div>
          )}

          {currentMode === "panic" && (
            <motion.div
              key="panic"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md space-y-6 flex flex-col items-center text-center"
            >
              <div className="rounded-full bg-red-500/10 p-4 text-red-400">
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-red-400">Somatic Panic Guide</h2>
              
              <div className="bg-slate-900/60 border border-red-500/10 p-6 rounded-2xl text-left space-y-4">
                <div className="border-l-2 border-red-500 pl-4">
                  <h4 className="text-sm font-bold text-white">Panic is a physical response</h4>
                  <p className="text-xs text-slate-400 mt-1">Your amygdala has temporarily increased adrenaline levels. This causes rapid heartbeat, shallow breathing, and temporary fear. It is a natural reflex, not a real physical danger.</p>
                </div>
                <div className="border-l-2 border-red-500 pl-4">
                  <h4 className="text-sm font-bold text-white">The 10-Minute Rule</h4>
                  <p className="text-xs text-slate-400 mt-1">Adrenaline naturally peaks and then safely diminishes. It has a strict physiological limit. If you take slow breaths, the panic sensation must decrease. You are safe while waiting it out.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleLogActiveSession("panic", "Emergency Calm Log", 60);
                  if (showToast) {
                    showToast("Somatic reset complete. Adrenaline has successfully quieted.", "success");
                  }
                  setCurrentMode("breathing");
                }}
                className="px-8 py-3.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Complete Calm Guide
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bento Grid Calm Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button
          onClick={() => {
            setCurrentMode("breathing");
            handleLogActiveSession("breathing", "Box Breathing Selector", 30);
          }}
          className={`bg-slate-900/40 border p-6 rounded-3xl flex flex-col items-start text-left hover:bg-slate-900/60 transition-all cursor-pointer ${
            currentMode === "breathing" ? "border-[#57f1db]/30" : "border-slate-800/80"
          }`}
        >
          <Heart className="w-6 h-6 text-[#57f1db] mb-3" />
          <h4 className="font-bold text-white text-base">Box Breathing</h4>
          <p className="text-xs text-slate-400 mt-1">
            A simple 4-second paced breathing cycle to settle your system.
          </p>
        </button>

        <button
          onClick={() => {
            setCurrentMode("grounding");
            setGroundingStep(1);
            setGroundingInputs([]);
          }}
          className={`bg-slate-900/40 border p-6 rounded-3xl flex flex-col items-start text-left hover:bg-slate-900/60 transition-all cursor-pointer ${
            currentMode === "grounding" ? "border-cyan-500/30" : "border-slate-800/80"
          }`}
        >
          <Compass className="w-6 h-6 text-cyan-400 mb-3" />
          <h4 className="font-bold text-white text-base">5-4-3-2-1 Grounding</h4>
          <p className="text-xs text-slate-400 mt-1">
            Engage your senses to bring focus back to the present.
          </p>
        </button>

        <button
          onClick={() => setCurrentMode("relax")}
          className={`bg-slate-900/40 border p-6 rounded-3xl flex flex-col items-start text-left hover:bg-slate-900/60 transition-all cursor-pointer ${
            currentMode === "relax" ? "border-purple-500/30" : "border-slate-800/80"
          }`}
        >
          <UserCheck className="w-6 h-6 text-[#cebdff] mb-3" />
          <h4 className="font-bold text-white text-base">Body Relax</h4>
          <p className="text-xs text-slate-400 mt-1">
            Soften physical tension with a guided muscle scan.
          </p>
        </button>

        <button
          onClick={() => setCurrentMode("panic")}
          className={`bg-slate-900/40 border p-6 rounded-3xl flex flex-col items-start text-left hover:bg-slate-900/60 transition-all cursor-pointer ${
            currentMode === "panic" ? "border-red-500/30" : "border-slate-800/80"
          }`}
        >
          <ShieldCheck className="w-6 h-6 text-red-400 mb-3" />
          <h4 className="font-bold text-white text-base">Panic Reminder</h4>
          <p className="text-xs text-slate-400 mt-1">
            Gentle reminder about how physical panic peaks and safely passes.
          </p>
        </button>
      </div>
    </div>
  );
}
