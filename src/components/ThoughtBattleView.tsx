import React, { useState } from "react";
import { Brain, Plus, Trash2, Sparkles, Award, TrendingDown, ShieldCheck, RefreshCw, Compass, Heart } from "lucide-react";
import { ThoughtBattle } from "../types";

interface ThoughtBattleViewProps {
  onAddBattle: (battle: Omit<ThoughtBattle, "id" | "timestamp">) => void;
  battles: ThoughtBattle[];
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function ThoughtBattleView({ onAddBattle, battles, showToast }: ThoughtBattleViewProps) {
  const [anxiousThought, setAnxiousThought] = useState("");
  const [initialAnxiety, setInitialAnxiety] = useState(7);
  const [evidenceForInput, setEvidenceForInput] = useState("");
  const [evidenceFor, setEvidenceFor] = useState<string[]>([]);
  const [evidenceAgainstInput, setEvidenceAgainstInput] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState<string[]>([]);
  
  // AI Reframing states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDistortions, setAiDistortions] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  
  const [counterThought, setCounterThought] = useState("");
  const [newAnxiety, setNewAnxiety] = useState(3);
  const [isLogged, setIsLogged] = useState(false);

  // Lists helpers
  const addEvidenceFor = () => {
    if (evidenceForInput.trim()) {
      setEvidenceFor([...evidenceFor, evidenceForInput.trim()]);
      setEvidenceForInput("");
    }
  };

  const removeEvidenceFor = (index: number) => {
    setEvidenceFor(evidenceFor.filter((_, idx) => idx !== index));
  };

  const addEvidenceAgainst = () => {
    if (evidenceAgainstInput.trim()) {
      setEvidenceAgainst([...evidenceAgainst, evidenceAgainstInput.trim()]);
      setEvidenceAgainstInput("");
    }
  };

  const removeEvidenceAgainst = (index: number) => {
    setEvidenceAgainst(evidenceAgainst.filter((_, idx) => idx !== index));
  };

  // Trigger Gemini Reframing API securely on the server
  const triggerAiDeconstruct = async () => {
    if (!anxiousThought.trim()) {
      if (showToast) {
        showToast("Please define your anxious thought first.", "error");
      } else {
        alert("Please define your anxious thought first.");
      }
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch("/api/deconstruct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anxiousThought,
          evidenceFor,
          evidenceAgainst,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact reframing server.");
      }

      const data = await response.json();
      setAiDistortions(data.distortions || []);
      setAiAnalysis(data.analysis || "");
      setCounterThought(data.counterThought || "");
    } catch (err: any) {
      console.error(err);
      // Fallback in case key is missing or server is down
      setAiDistortions(["Emotional Reasoning", "Fortune Telling"]);
      setAiAnalysis("Analysis indicates this thought relies on emotional anticipation rather than concrete evidence.");
      setCounterThought(`Even if ${anxiousThought.toLowerCase().replace(/i'm/gi, "I am").replace(/i will/gi, "I will")}, I have walked through difficult moments before, and I have the strength to handle whatever comes next.`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anxiousThought.trim() || !counterThought.trim()) {
      if (showToast) {
        showToast("Please enter the anxious thought and your balanced reframe.", "error");
      } else {
        alert("Please enter the anxious thought and your balanced reframe.");
      }
      return;
    }

    onAddBattle({
      anxiousThought,
      initialAnxiety,
      evidenceFor,
      evidenceAgainst,
      counterThought,
      newAnxiety,
    });

    if (showToast) {
      showToast("Balanced Reframe logged successfully. Another step forward.", "success");
    }
    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      // Reset board
      setAnxiousThought("");
      setInitialAnxiety(7);
      setEvidenceFor([]);
      setEvidenceAgainst([]);
      setAiDistortions([]);
      setAiAnalysis("");
      setCounterThought("");
      setNewAnxiety(3);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#57f1db] font-bold">
          Cognitive Restructuring
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mt-1">
          Thought Reframe
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl text-base leading-relaxed">
          Examine anxious thoughts objectively. Put your worries on trial, look at the actual facts, and build a calm, grounded perspective.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Board */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 space-y-8">
          {/* Section 1: Define Target */}
          <div className="space-y-4">
            <div className="flex gap-2.5 items-center text-xs font-bold uppercase tracking-widest text-[#57f1db]">
              <Compass className="w-5 h-5" />
              <span>Identify the Thought // 01</span>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">
                Anxious Thought
              </label>
              <input
                type="text"
                value={anxiousThought}
                onChange={(e) => setAnxiousThought(e.target.value)}
                placeholder="e.g. I will mess up my presentation today and look completely incompetent."
                className="w-full bg-slate-950/30 border border-slate-800/80 rounded-2xl px-5 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db] text-sm leading-relaxed"
              />
            </div>

            <div className="bg-slate-950/20 border border-slate-800/60 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Initial Anxiety Level
                </label>
                <span className="text-sm font-bold text-[#57f1db]">{initialAnxiety} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={initialAnxiety}
                onChange={(e) => setInitialAnxiety(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#57f1db]"
              />
            </div>
          </div>

          {/* Section 2: Examining Evidence */}
          <div className="space-y-4">
            <div className="flex gap-2.5 items-center text-xs font-bold uppercase tracking-widest text-[#cebdff]">
              <Brain className="w-5 h-5" />
              <span>Examine the Evidence // 02</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Evidence For */}
              <div className="bg-slate-950/20 border border-slate-800/60 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-red-400">
                  Evidence Supporting the Thought
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={evidenceForInput}
                    onChange={(e) => setEvidenceForInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addEvidenceFor()}
                    placeholder="e.g. My heart is pounding fast."
                    className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-400"
                  />
                  <button
                    type="button"
                    onClick={addEvidenceFor}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {evidenceFor.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-red-950/10 border border-red-500/10 text-xs text-slate-300 leading-relaxed"
                    >
                      <span className="flex-1 pr-2">"{item}"</span>
                      <button
                        type="button"
                        onClick={() => removeEvidenceFor(idx)}
                        className="text-slate-500 hover:text-red-400 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Against */}
              <div className="bg-slate-950/20 border border-slate-800/60 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#57f1db]">
                  Evidence Questioning the Thought
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={evidenceAgainstInput}
                    onChange={(e) => setEvidenceAgainstInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addEvidenceAgainst()}
                    placeholder="e.g. I know the material inside-out."
                    className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#57f1db]"
                  />
                  <button
                    type="button"
                    onClick={addEvidenceAgainst}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {evidenceAgainst.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-teal-950/10 border border-teal-500/10 text-xs text-slate-300 leading-relaxed"
                    >
                      <span className="flex-1 pr-2">"{item}"</span>
                      <button
                        type="button"
                        onClick={() => removeEvidenceAgainst(idx)}
                        className="text-slate-500 hover:text-red-400 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Deconstruct Actions */}
          <div className="border-t border-slate-800/40 pt-6">
            <button
              type="button"
              onClick={triggerAiDeconstruct}
              disabled={aiLoading || !anxiousThought.trim()}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg hover:border-[#57f1db]/30 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4.5 h-4.5 animate-spin text-[#57f1db]" />
                  <span>Analyzing Thought Patterns...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-[#57f1db]" />
                  <span>Analyze Patterns with Gemini Core AI</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output (Conditional) */}
          {(aiDistortions.length > 0 || aiAnalysis) && (
            <div className="bg-slate-950/40 border border-[#57f1db]/10 rounded-2xl p-6 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-[#57f1db] uppercase tracking-widest font-bold">
                  Reframing Insights
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aiDistortions.map((d, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                {aiAnalysis}
              </p>
            </div>
          )}

          {/* Section 3: Reframe */}
          <div className="space-y-4 border-t border-slate-800/40 pt-6">
            <div className="flex gap-2.5 items-center text-xs font-bold uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span>Balanced Reframe // 03</span>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300">
                Balanced Counter-Thought
              </label>
              <textarea
                value={counterThought}
                onChange={(e) => setCounterThought(e.target.value)}
                placeholder="Draft a highly objective, balanced reframe. e.g. Even if my heart is beating fast, my adrenaline is high because I care about doing well. I have prepared thoroughly and know the material. My physical reaction is a normal rush of energy, not a sign of failure."
                rows={4}
                className="w-full bg-slate-950/30 border border-slate-800/80 rounded-2xl px-5 py-4 text-[#57f1db] placeholder-slate-600 focus:outline-none focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db] text-sm leading-relaxed font-semibold"
              />
            </div>

            <div className="bg-slate-950/20 border border-slate-800/60 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  New Anxiety Rating
                </label>
                <span className="text-sm font-bold text-emerald-400">{newAnxiety} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={newAnxiety}
                onChange={(e) => setNewAnxiety(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Reframe submit */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={isLogged || !anxiousThought.trim() || !counterThought.trim()}
              className={`w-full py-4.5 rounded-full font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isLogged
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/10"
                  : "bg-gradient-to-r from-[#57f1db] to-emerald-400 text-slate-950 hover:scale-101 hover:brightness-105 active:scale-99 shadow-[#57f1db]/10 disabled:opacity-50"
              }`}
            >
              {isLogged ? (
                <>
                  <Award className="w-5 h-5 animate-bounce" />
                  <span>Thought Reframed and Saved!</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>Log Balanced Reframe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* History Records Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/60 pb-4 mb-4">
              <Award className="w-4.5 h-4.5 text-[#57f1db]" />
              <span>Reframed Thoughts</span>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {battles.length > 0 ? (
                [...battles].reverse().map((b) => {
                  const dropPercentage = b.initialAnxiety > 0 ? Math.round(((b.initialAnxiety - b.newAnxiety) / b.initialAnxiety) * 100) : 0;
                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800/50 space-y-2.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(b.timestamp).toLocaleDateString()}
                        </span>
                        {dropPercentage > 0 && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" />
                            <span>-{dropPercentage}% anxiety</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-through italic leading-relaxed">
                        "{b.anxiousThought}"
                      </p>
                      <p className="text-xs text-[#57f1db] font-semibold leading-relaxed">
                        "{b.counterThought}"
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs font-medium leading-relaxed">
                  No reframed thoughts logged yet. Write down an anxious worry and balance it above.
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/30 border border-slate-800/40 rounded-2xl p-4 text-center mt-6">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Cognitive Self-Correction
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              When we analyze the supporting and questioning facts of a worry, our prefrontal cortex takes over processing, softening emotional panic triggers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
