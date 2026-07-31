import React, { useEffect } from "react";
import { Bell, Activity, Compass, X, Sparkles, Clock, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReminderNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckIn: () => void;
  onNavigateToMissions: () => void;
  reminderTime?: string;
}

export default function ReminderNotificationModal({
  isOpen,
  onClose,
  onNavigateToCheckIn,
  onNavigateToMissions,
  reminderTime = "13:00",
}: ReminderNotificationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // 1. Trigger Web Haptic Vibration API if supported
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          // Double pulse vibration pattern: [vibrate 250ms, pause 150ms, vibrate 350ms]
          navigator.vibrate([250, 150, 350]);
        } catch (e) {
          console.warn("Vibration API failed or blocked:", e);
        }
      }

      // 2. Play soft Web Audio API reminder chime
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
          osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5 note
          
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }
      } catch (e) {
        console.warn("Audio Context playback error:", e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-5 text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3.5 pr-6">
            <div className="p-3 rounded-2xl bg-[#cebdff]/10 border border-[#cebdff]/20 text-[#cebdff] shrink-0">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#cebdff] bg-[#cebdff]/10 px-2 py-0.5 rounded">
                  Self-Reflection
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> {reminderTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Time for Your Daily Check-In!</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Taking a moment to pause and notice your emotional state grounds your nervous system and builds long-term resilience.
              </p>
            </div>
          </div>

          {/* Prompt card */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#57f1db]">
              <Sparkles className="w-4 h-4" />
              <span>Today's Reflection Prompt</span>
            </div>
            <p className="text-xs text-slate-300 italic">
              "How is your body feeling right now? Where are you holding tension, and what step can you take today?"
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                onClose();
                onNavigateToCheckIn();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#57f1db] to-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#57f1db]/10 min-h-[42px]"
            >
              <Activity className="w-4 h-4 text-slate-950" />
              <span>Start Mood & Anxiety Check-In</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToMissions();
              }}
              className="w-full py-3 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:border-slate-700 transition-all cursor-pointer min-h-[42px]"
            >
              <Compass className="w-4 h-4 text-[#cebdff]" />
              <span>Log Small Step Reflection</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-slate-400 hover:text-slate-200 text-xs font-medium cursor-pointer"
            >
              Dismiss for now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
