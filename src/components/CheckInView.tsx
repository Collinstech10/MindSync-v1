import React, { useState } from "react";
import { HeartPulse, CheckSquare, Square, Save, ShieldCheck, Heart, Sparkles, Activity } from "lucide-react";
import { MoodCheckIn } from "../types";

interface CheckInViewProps {
  onAddCheckIn: (checkIn: Omit<MoodCheckIn, "id" | "timestamp">) => void;
  checkIns: MoodCheckIn[];
}

const MOODS = [
  { name: "Serene", color: "from-[#57f1db]/20 to-teal-500/10 text-[#57f1db] border-[#57f1db]/30" },
  { name: "Anxious", color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30" },
  { name: "Restless", color: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30" },
  { name: "Grounded", color: "from-emerald-500/20 to-green-500/10 text-emerald-400 border-emerald-500/30" },
  { name: "Exhausted", color: "from-blue-500/20 to-slate-500/10 text-blue-400 border-blue-500/30" },
];

const PHYSICAL_SYMPTOMS = [
  "Heart racing",
  "Tight chest",
  "Tense shoulders",
  "Shallow breathing",
  "Normal / Relaxed",
  "Dry mouth",
  "Fidgeting",
];

export default function CheckInView({ onAddCheckIn, checkIns }: CheckInViewProps) {
  const [mood, setMood] = useState("Grounded");
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCheckIn({
      mood,
      energy,
      anxiety,
      physical: selectedSymptoms,
      notes,
    });
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      // Reset some states
      setNotes("");
      setSelectedSymptoms([]);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#cebdff] font-bold">
          Private Self-Reflection
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mt-1">
          Sync Check-In
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl text-base leading-relaxed">
          Take a gentle pause to check in with yourself. Tracking your feelings, energy levels, and physical sensations helps you recognize patterns and build self-awareness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Check-In Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 space-y-8"
        >
          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Select Primary Mood
            </label>
            <div className="flex flex-wrap gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setMood(m.name)}
                  className={`flex-1 min-w-[120px] py-4 rounded-2xl border text-center font-bold text-sm bg-gradient-to-tr transition-all duration-200 cursor-pointer ${
                    mood === m.name
                      ? `${m.color} scale-103 shadow-lg ring-1 ring-white/10`
                      : "bg-slate-950/20 border-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Energy */}
            <div className="bg-slate-950/20 border border-slate-800/60 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Energy level
                </label>
                <span className="text-sm font-bold text-[#cebdff]">{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#cebdff]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>DRAINED</span>
                <span>CHARGED</span>
              </div>
            </div>

            {/* Anxiety */}
            <div className="bg-slate-950/20 border border-slate-800/60 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Anxiety level
                </label>
                <span className="text-sm font-bold text-[#57f1db]">{anxiety} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={anxiety}
                onChange={(e) => setAnxiety(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#57f1db]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>QUIET</span>
                <span>PANIC SPIKE</span>
              </div>
            </div>
          </div>

          {/* Physical Manifestations */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Physical Sensations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PHYSICAL_SYMPTOMS.map((symptom) => {
                const isChecked = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isChecked
                        ? "bg-[#57f1db]/5 border-[#57f1db]/30 text-[#57f1db]"
                        : "bg-slate-950/20 border-slate-800/60 text-slate-400 hover:bg-slate-900/50"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#57f1db] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span>{symptom}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotional Notes */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Optional Context / Active Thoughts
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind? (e.g., oncoming work presentation, feeling restless, caffeine...)"
              rows={3}
              className="w-full bg-slate-950/30 border border-slate-800/80 rounded-2xl px-5 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db] text-sm leading-relaxed"
            />
          </div>

          {/* Log Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLogged}
              className={`w-full py-4.5 rounded-full font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isLogged
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/10"
                  : "bg-gradient-to-r from-[#57f1db] to-cyan-500 text-slate-950 hover:scale-101 hover:brightness-105 active:scale-99 shadow-[#57f1db]/10"
              }`}
            >
              {isLogged ? (
                <>
                  <ShieldCheck className="w-5 h-5 animate-bounce" />
                  <span>Check-In Saved Securely to Device</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Log Check-In State</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Biometrics Log Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/60 pb-4 mb-4">
              <Activity className="w-4.5 h-4.5 text-[#cebdff]" />
              <span>Check-In History</span>
            </div>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {checkIns.length > 0 ? (
                [...checkIns].reverse().map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800/50 space-y-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                        {c.mood}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(c.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">ENG: <span className="text-white font-bold">{c.energy}</span></span>
                      <span className="text-slate-500">ANX: <span className="text-red-400 font-bold">{c.anxiety}</span></span>
                    </div>
                    {c.physical.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {c.physical.map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono bg-slate-900/80 border border-slate-800/40 text-slate-400 px-2 py-0.5 rounded"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs font-medium">
                  No check-ins logged on this device yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/30 border border-slate-800/40 rounded-2xl p-4 text-center mt-6">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Local Storage • Secure
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Mindsync does not cloud-sync your personal data. All check-ins remain completely private on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
