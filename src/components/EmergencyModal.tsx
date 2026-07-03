import React, { useState, useEffect } from "react";
import { AlertTriangle, X, Phone, Heart, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [breathePhase, setBreathePhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (breathePhase === "inhale") {
            setBreathePhase("hold");
            return 4;
          } else if (breathePhase === "hold") {
            setBreathePhase("exhale");
            return 4;
          } else {
            setBreathePhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, breathePhase]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-teal-500/10 bg-slate-950 p-8 shadow-2xl shadow-teal-500/5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-8">
            <div className="rounded-2xl bg-[#57f1db]/10 p-3 text-[#57f1db]">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Emergency Calm</h1>
              <p className="text-sm text-slate-400">Supportive Guide • Restoring Calm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Guided breathing */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800 p-6 text-center">
              <h3 className="text-sm uppercase tracking-widest text-[#57f1db] mb-4 font-bold">Steady Breathing Circle</h3>
              
              <div className="relative flex items-center justify-center w-40 h-40 mb-6">
                {/* Dynamic pulsing background */}
                <motion.div
                  animate={{
                    scale: breathePhase === "inhale" ? [1, 1.4] : breathePhase === "hold" ? 1.4 : [1.4, 1],
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-teal-500/5 blur-xl"
                />
                
                {/* Breathing circle outline */}
                <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="60"
                    className="stroke-[#57f1db] fill-none"
                    strokeWidth="4"
                    strokeDasharray={377}
                    animate={{
                      strokeDashoffset: [377, 0],
                    }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  />
                </svg>

                {/* Inner countdown */}
                <div className="z-10 flex flex-col items-center justify-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400">
                    {breathePhase}
                  </span>
                  <span className="text-4xl font-black text-white mt-1">
                    {seconds}s
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Anxiety can cause short chest breathing. Gently guide air deep into your stomach. Follow the rhythm.
              </p>
            </div>

            {/* Right: Anchors & Resources */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Safety Grounding Anchors</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#57f1db] shrink-0 mt-0.5" />
                    <span>This is a temporary physical sensation. It will pass.</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#57f1db] shrink-0 mt-0.5" />
                    <span>Your heartbeat is just doing its job. You are safe.</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-[#57f1db] shrink-0 mt-0.5" />
                    <span>Focus solely on this screen and your breath.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span>Immediate human contact</span>
                </div>
                <div className="space-y-2">
                  <a
                    href="tel:988"
                    className="flex items-center justify-between rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 text-sm font-bold text-red-400 transition-colors"
                  >
                    <span>Call 988 Lifeline (USA)</span>
                    <span className="text-xs font-mono bg-red-500/20 px-2 py-0.5 rounded-full">24/7 Free</span>
                  </a>
                  <a
                    href="sms:741741?body=HOME"
                    className="flex items-center justify-between rounded-xl bg-slate-850 hover:bg-slate-750 border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 transition-colors"
                  >
                    <span>Text HOME to 741741</span>
                    <span className="text-xs text-slate-400">Crisis Text Line</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-slate-900 pt-6 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm transition-colors"
            >
              Close Overlay
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#57f1db] to-cyan-500 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-teal-500/10 flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span>I Am Grounded</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
