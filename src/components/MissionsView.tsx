import React, { useState } from "react";
import {
  Compass,
  CheckCircle2,
  Lock,
  Plus,
  BookOpen,
  ChevronRight,
  TrendingDown,
  Info,
  Calendar,
  Smile,
  Zap,
  Award,
  RefreshCw,
  X,
  Play,
  Check,
  Heart,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Mission } from "../types";

interface MissionsViewProps {
  missions: Mission[];
  onCompleteMission: (missionId: string, fearBefore: number, fearAfter: number) => void;
  onResetMissions: () => void;
  onUpdateMissions: (updated: Mission[]) => void;
}

const CATEGORIES = [
  "Social Confidence",
  "Work Stress",
  "Health Anxiety",
  "Panic Sensations",
  "Sleep Worry",
  "Difficult Conversations",
  "Custom"
];

const STATUS_OPTIONS = [
  "Not Started",
  "Planned",
  "Tried It",
  "Completed",
  "Skipped for Now",
  "Repeat This Step"
];

export default function MissionsView({
  missions,
  onCompleteMission,
  onResetMissions,
  onUpdateMissions,
}: MissionsViewProps) {
  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  
  // Modals & Panels State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeLogStep, setActiveLogStep] = useState<Mission | null>(null);
  const [activeResult, setActiveResult] = useState<{
    stepTitle: string;
    fearBefore: number;
    fearAfter: number;
    change: number;
    status: string;
    lesson: string;
  } | null>(null);

  // Form State - Create Step
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Social Confidence");
  const [customCategory, setCustomCategory] = useState("");
  const [newDifficulty, setNewDifficulty] = useState(3);
  const [newFearBefore, setNewFearBefore] = useState(7);
  const [newPrediction, setNewPrediction] = useState("");
  const [newPlannedDate, setNewPlannedDate] = useState("");

  // Form State - Reflection Log
  const [logTrialStatus, setLogTrialStatus] = useState<string>("Completed");
  const [logFearAfter, setLogFearAfter] = useState(4);
  const [logActuallyHappened, setLogActuallyHappened] = useState("");
  const [logLearned, setLogLearned] = useState("");
  const [logNextMove, setLogNextMove] = useState("Try the next step");

  // Inline Breathing Guide in Log Modal
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathSeconds, setBreathSeconds] = useState(4);

  // Stats Calculations
  const stepsPlanned = missions.filter(m => m.status === "Planned" || m.status === "Not Started").length;
  const stepsTried = missions.filter(m => m.status === "Tried It" || m.status === "Repeat This Step").length;
  const stepsCompleted = missions.filter(m => m.status === "Completed").length;
  const stepsRepeated = missions.filter(m => m.status === "Repeat This Step").length;

  const validBeforeSteps = missions.filter(m => m.fearBefore > 0);
  const averageFearBefore = validBeforeSteps.length > 0 
    ? (validBeforeSteps.reduce((acc, m) => acc + m.fearBefore, 0) / validBeforeSteps.length).toFixed(1)
    : "N/A";

  const loggedAfterSteps = missions.filter(m => m.fearAfter !== undefined);
  const averageFearAfter = loggedAfterSteps.length > 0
    ? (loggedAfterSteps.reduce((acc, m) => acc + (m.fearAfter || 0), 0) / loggedAfterSteps.length).toFixed(1)
    : "N/A";

  // Calculate most practiced category
  const practicedCatCounts: { [key: string]: number } = {};
  missions.forEach(m => {
    if (m.status !== "Not Started" && m.status !== "Planned") {
      practicedCatCounts[m.category] = (practicedCatCounts[m.category] || 0) + 1;
    }
  });
  let mostPracticedCategory = "None yet";
  let maxCount = 0;
  Object.entries(practicedCatCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPracticedCategory = cat;
    }
  });

  // Filter List of Steps
  const filteredMissions = missions.filter((m) => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || m.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  // Handle Save New Custom Step
  const handleCreateStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const finalCategory = newCategory === "Custom" ? (customCategory.trim() || "Custom") : newCategory;
    
    const newStep: Mission = {
      id: "step_" + Date.now(),
      title: newTitle.trim(),
      category: finalCategory,
      difficulty: newDifficulty,
      status: "Planned",
      fearBefore: newFearBefore,
      prediction: newPrediction.trim(),
      plannedDate: newPlannedDate || undefined,
    };

    const updated = [newStep, ...missions];
    onUpdateMissions(updated);

    // Reset Form
    setNewTitle("");
    setNewCategory("Social Confidence");
    setCustomCategory("");
    setNewDifficulty(3);
    setNewFearBefore(7);
    setNewPrediction("");
    setNewPlannedDate("");
    setIsCreateOpen(false);
  };

  // Trigger Log Modal
  const handleOpenLogModal = (step: Mission) => {
    setActiveLogStep(step);
    // Initialize log inputs based on existing values if any
    setLogTrialStatus(step.status === "Planned" || step.status === "Not Started" ? "Completed" : step.status);
    setLogFearAfter(step.fearAfter !== undefined ? step.fearAfter : Math.max(1, step.fearBefore - 2));
    setLogActuallyHappened(step.actuallyHappened || "");
    setLogLearned(step.learned || "");
    setLogNextMove(step.nextMove || "Try the next step");
    setIsBreathingActive(false);
  };

  // Handle Save Reflection
  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogStep) return;

    const updated = missions.map((m) => {
      if (m.id === activeLogStep.id) {
        return {
          ...m,
          status: logTrialStatus as any,
          fearAfter: logFearAfter,
          actuallyHappened: logActuallyHappened.trim(),
          learned: logLearned.trim(),
          nextMove: logNextMove,
          completedAt: new Date().toISOString()
        };
      }
      return m;
    });

    onUpdateMissions(updated);

    // Save active result for visual card
    setActiveResult({
      stepTitle: activeLogStep.title,
      fearBefore: activeLogStep.fearBefore,
      fearAfter: logFearAfter,
      change: logFearAfter - activeLogStep.fearBefore,
      status: logTrialStatus,
      lesson: logLearned.trim() || "I faced this step and stayed present."
    });

    setActiveLogStep(null);
  };

  // Breathing pacer effect inside log modal
  React.useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          if (breathPhase === "Inhale") {
            setBreathPhase("Hold");
            return 4;
          } else if (breathPhase === "Hold") {
            setBreathPhase("Exhale");
            return 4;
          } else {
            setBreathPhase("Inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathPhase("Inhale");
      setBreathSeconds(4);
    }
    setIsBreathingActive(!isBreathingActive);
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
      case "Planned":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
      case "Tried It":
        return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20";
      case "Repeat This Step":
        return "bg-violet-500/15 text-violet-400 border border-violet-500/20";
      case "Skipped for Now":
        return "bg-slate-800 text-slate-400 border border-slate-700";
      default:
        return "bg-slate-900 text-slate-500 border border-slate-800";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#57f1db] font-bold">
            Behavioral Shaping
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mt-1">
            Small Steps
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl text-base leading-relaxed">
            Practice small, steady actions against avoidance. Trying counts.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-gradient-to-r from-[#57f1db] to-cyan-500 text-slate-950 font-bold text-xs hover:scale-102 active:scale-98 transition-transform cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Create Small Step</span>
          </button>
          
          <button
            onClick={() => {
              // Scroll down to the list area or open first step
              const el = document.getElementById("steps-list-anchor");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Log What Happened
          </button>
        </div>
      </div>

      {/* Intro Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#57f1db]/5 blur-3xl rounded-full" />
        <div className="flex items-start gap-4 z-10 relative">
          <div className="rounded-2xl bg-cyan-500/10 p-3 text-[#57f1db] shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Self-Directed Exposure Principle</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Small Steps are not about proving anything. They help you notice what anxiety predicted, what actually happened, and what you learned.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Insights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
        {/* KPI: Planned */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Planned</span>
          <div>
            <div className="text-2xl font-black text-white mt-1">{stepsPlanned}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Steps in queue</p>
          </div>
        </div>

        {/* KPI: Tried */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-[#cebdff] font-bold">Tried It</span>
          <div>
            <div className="text-2xl font-black text-white mt-1">{stepsTried}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Steady efforts</p>
          </div>
        </div>

        {/* KPI: Completed */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-[#57f1db] font-bold">Completed</span>
          <div>
            <div className="text-2xl font-black text-white mt-1">{stepsCompleted}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Steps finished</p>
          </div>
        </div>

        {/* KPI: Repeated */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Repeated</span>
          <div>
            <div className="text-2xl font-black text-white mt-1">{stepsRepeated}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Deepening habits</p>
          </div>
        </div>

        {/* KPI: Fear Before */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Fear Before</span>
          <div>
            <div className="text-2xl font-black text-white mt-1">{averageFearBefore}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Average out of 10</p>
          </div>
        </div>

        {/* KPI: Fear After */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Fear After</span>
          <div>
            <div className="text-2xl font-black text-white mt-1">{averageFearAfter}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Post-practice average</p>
          </div>
        </div>

        {/* KPI: Top Category */}
        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 col-span-2 lg:col-span-1 flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Top Focus</span>
          <div>
            <div className="text-xs font-bold text-[#57f1db] mt-1 truncate">{mostPracticedCategory}</div>
            <p className="text-[9px] text-slate-400 mt-0.5">Most active area</p>
          </div>
        </div>
      </div>

      {/* Insight Line */}
      <div className="flex items-center gap-2 justify-center text-xs text-slate-500 font-mono py-1">
        <Info className="w-4 h-4 text-slate-500" />
        <span>Insight: Repeated practice matters more than perfect completion.</span>
      </div>

      {/* Active Post-Reflection Saved Result */}
      <AnimatePresence>
        {activeResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900/50 border border-[#57f1db]/20 rounded-3xl p-6 space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-full bg-slate-850 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-[#57f1db]/10 p-2 text-[#57f1db]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase text-[#57f1db] font-bold">Reflection Saved</h4>
                <p className="text-xs text-slate-400">Your clinical feedback has been recorded locally.</p>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Step Target</span>
                <p className="text-sm font-bold text-white mt-0.5 truncate">{activeResult.stepTitle}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Anxiety Shift</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {activeResult.fearBefore}/10 → {activeResult.fearAfter}/10{" "}
                  <span className={`text-xs ml-1 font-mono ${activeResult.change <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                    ({activeResult.change <= 0 ? "" : "+"}{activeResult.change})
                  </span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">New Status</span>
                <p className="text-xs font-bold text-[#cebdff] mt-1">{activeResult.status}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Lesson Learned</span>
                <p className="text-xs text-slate-300 mt-1 italic truncate">"{activeResult.lesson}"</p>
              </div>
            </div>

            <div className="bg-slate-950/40 rounded-2xl p-4 text-xs leading-relaxed text-slate-300">
              {activeResult.change > 0 ? (
                <div className="flex items-start gap-2.5 text-amber-400">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                  <p>
                    <strong>This was a hard step.</strong> That does not mean it failed. You can make it smaller or repeat it when ready. Every attempt teaches your amygdala how to process discomfort safely.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 text-[#57f1db]">
                  <Smile className="w-5 h-5 shrink-0 mt-0.5 text-[#57f1db]" />
                  <p>
                    <strong>Trying counts.</strong> Your brain learns from small, repeated experiences. Each reflection dismantles anxious warnings and rewires confidence.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel: Step List with Filters */}
      <div id="steps-list-anchor" className="space-y-6 pt-2">
        
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold mr-2">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#57f1db]/15 border-[#57f1db]/30 text-[#57f1db]"
                  : "bg-slate-950/20 border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#57f1db]/15 border-[#57f1db]/30 text-[#57f1db]"
                    : "bg-slate-950/20 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold mr-2">
              Status:
            </span>
            <button
              onClick={() => setSelectedStatus("All")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedStatus === "All"
                  ? "bg-[#cebdff]/15 border-[#cebdff]/30 text-[#cebdff]"
                  : "bg-slate-950/20 border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              All
            </button>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  selectedStatus === status
                    ? "bg-[#cebdff]/15 border-[#cebdff]/30 text-[#cebdff]"
                    : "bg-slate-950/20 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMissions.length > 0 ? (
            filteredMissions.map((step) => {
              const stars = Array.from({ length: 5 }, (_, i) => i < step.difficulty);
              const isLogged = step.fearAfter !== undefined;
              
              return (
                <div
                  key={step.id}
                  className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-slate-700/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-850 text-slate-400 uppercase tracking-wider">
                        {step.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(step.status)}`}>
                        {step.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-base leading-snug">
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>Difficulty:</span>
                      <div className="flex items-center gap-0.5">
                        {stars.map((active, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              active ? "bg-cyan-400" : "bg-slate-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-950/30 rounded-2xl p-3.5 text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Anxiety Before</span>
                        <span className="font-mono text-sm font-bold text-white">{step.fearBefore} / 10</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Anxiety After</span>
                        <span className="font-mono text-sm font-bold text-white">
                          {isLogged ? `${step.fearAfter} / 10` : "Not logged"}
                        </span>
                      </div>
                    </div>

                    {/* Prediction Statement */}
                    {step.prediction && (
                      <div className="text-[11px] leading-relaxed text-slate-400 pl-2.5 border-l-2 border-slate-800 italic">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block not-italic">Predicted outcome:</span>
                        "{step.prediction}"
                      </div>
                    )}

                    {/* Reflection Preview (actuallyHappened & learned) */}
                    {isLogged && (step.actuallyHappened || step.learned) && (
                      <div className="bg-slate-950/20 border border-slate-850 p-3 rounded-xl space-y-1 text-[11px]">
                        {step.actuallyHappened && (
                          <p className="text-slate-400">
                            <strong className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">What happened:</strong>{" "}
                            {step.actuallyHappened}
                          </p>
                        )}
                        {step.learned && (
                          <p className="text-slate-300">
                            <strong className="text-[9px] font-mono uppercase text-[#57f1db] tracking-wider">Learned:</strong>{" "}
                            {step.learned}
                          </p>
                        )}
                      </div>
                    )}

                    {step.plannedDate && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Planned: {step.plannedDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-850 flex justify-between items-center mt-4">
                    <button
                      onClick={() => handleOpenLogModal(step)}
                      className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-400" />
                      <span>Log What Happened</span>
                    </button>

                    <button
                      onClick={() => {
                        // Toggle Status inline easily
                        const currentIdx = STATUS_OPTIONS.indexOf(step.status);
                        const nextIdx = (currentIdx + 1) % STATUS_OPTIONS.length;
                        const nextStatus = STATUS_OPTIONS[nextIdx];
                        const updated = missions.map(m => m.id === step.id ? { ...m, status: nextStatus as any } : m);
                        onUpdateMissions(updated);
                      }}
                      className="text-[10px] text-slate-500 hover:text-[#57f1db] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Rotate Status</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-16 bg-slate-900/10 border border-slate-850 rounded-3xl space-y-3">
              <Compass className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                No active steps found matching the selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                }}
                className="text-xs text-[#57f1db] font-bold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Global Action Reset Area */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => {
              if (confirm("Reset all Small Steps to default seed steps? This will erase custom entries.")) {
                onResetMissions();
              }
            }}
            className="px-5 py-2.5 rounded-full border border-slate-900 hover:bg-slate-900 text-slate-500 hover:text-slate-300 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset All Steps to Default
          </button>
        </div>
      </div>

      {/* MODAL 1: CREATE STEP FORM */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-5 right-5 rounded-full bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Title Header */}
              <div>
                <span className="text-xs uppercase tracking-widest text-[#57f1db] font-bold">New Exercise</span>
                <h2 className="text-xl font-bold text-white">Create Small Step</h2>
                <p className="text-xs text-slate-400 mt-1">Design a customized, structured behavior shaping step.</p>
              </div>

              {/* Form content */}
              <form onSubmit={handleCreateStep} className="space-y-5">
                {/* 1. Step Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Step Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Example: Send one message first"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#57f1db]"
                  />
                </div>

                {/* 2. Category Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          newCategory === cat
                            ? "bg-[#57f1db]/15 border-[#57f1db]/30 text-[#57f1db]"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Custom input if selected Custom */}
                  {newCategory === "Custom" && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 mt-2 text-xs text-white focus:outline-none focus:border-[#57f1db]"
                    />
                  )}
                </div>

                {/* 3. Difficulty + 4. Fear Slider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Difficulty Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Difficulty (1-5)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewDifficulty(num)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            newDifficulty === num
                              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
                              : "bg-slate-900 border-slate-800 text-slate-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fear Before Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 block">Fear before (1-10)</label>
                      <span className="font-mono text-xs font-bold text-cyan-400">{newFearBefore}/10</span>
                    </div>
                    <div className="pt-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newFearBefore}
                        onChange={(e) => setNewFearBefore(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-[#57f1db]"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Prediction Text Area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Predicted Anxiety Outcome</label>
                  <textarea
                    rows={2}
                    value={newPrediction}
                    onChange={(e) => setNewPrediction(e.target.value)}
                    placeholder="What does anxiety predict might happen?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#57f1db] resize-none"
                  />
                </div>

                {/* 6. Optional planned date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Planned Date (Optional)</label>
                  <input
                    type="date"
                    value={newPlannedDate}
                    onChange={(e) => setNewPlannedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#57f1db]"
                  />
                </div>

                {/* Helper text */}
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                  Choose something small enough that it feels possible, even if uncomfortable.
                </p>

                {/* Save button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#57f1db] to-cyan-500 text-slate-950 font-bold text-xs rounded-full cursor-pointer hover:scale-101 transition-transform text-center flex items-center justify-center gap-1.5 mt-2"
                >
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Save Small Step</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LOG WHAT HAPPENED FORM */}
      <AnimatePresence>
        {activeLogStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-8 shadow-2xl space-y-6 my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveLogStep(null);
                  setIsBreathingActive(false);
                }}
                className="absolute top-5 right-5 rounded-full bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Title Header */}
              <div>
                <span className="text-xs uppercase tracking-widest text-[#cebdff] font-bold">Reflection Logger</span>
                <h2 className="text-xl font-bold text-white">Log What Happened</h2>
                <p className="text-xs text-slate-400 mt-1">
                  You do not need a perfect result. An honest reflection is progress.
                </p>
              </div>

              {/* Action Targets */}
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-850/60 text-xs space-y-1">
                <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">Active Target Step:</span>
                <h3 className="font-extrabold text-[#57f1db] text-sm">{activeLogStep.title}</h3>
                <p className="text-slate-400 text-[11px] italic mt-1">"Anxiety predicted: {activeLogStep.prediction || "N/A"}"</p>
              </div>

              {/* Form Reflection content */}
              <form onSubmit={handleSaveReflection} className="space-y-5">
                
                {/* 1. Did you try this step? */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Did you try this step?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { value: "Planned", label: "Not yet" },
                      { value: "Tried It", label: "Tried it" },
                      { value: "Completed", label: "Completed it" },
                      { value: "Skipped for Now", label: "Skipped for now" },
                      { value: "Repeat This Step", label: "I want to repeat" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setLogTrialStatus(opt.value)}
                        className={`py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                          logTrialStatus === opt.value
                            ? "bg-[#57f1db]/15 border-[#57f1db]/30 text-[#57f1db]"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid for Slider & Breath Helper */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-1">
                  
                  {/* 2. Fear After Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 block">Anxiety Level AFTER practicing</label>
                      <span className="font-mono text-xs font-bold text-cyan-400">{logFearAfter}/10</span>
                    </div>
                    <div className="pt-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={logFearAfter}
                        onChange={(e) => setLogFearAfter(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>1 = Relaxed Calm</span>
                      <span>10 = Peak Tension</span>
                    </div>
                  </div>

                  {/* Breathing / Grounding Mini Assist Tool */}
                  <div className="bg-slate-900/40 rounded-2xl border border-slate-850 p-4 space-y-3 flex flex-col justify-between min-h-[110px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase text-[#cebdff] font-bold">Immediate Grounding Helper</span>
                      <button
                        type="button"
                        onClick={toggleBreathing}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          isBreathingActive ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"
                        }`}
                      >
                        {isBreathingActive ? "Pause Guide" : "Start Breath Guide"}
                      </button>
                    </div>

                    {isBreathingActive ? (
                      <div className="flex items-center gap-4 animate-fade-in py-1">
                        {/* Little pulsing circle */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <motion.div
                            animate={{
                              scale: breathPhase === "Inhale" ? [1, 1.4] : breathPhase === "Hold" ? 1.4 : [1.4, 1]
                            }}
                            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-sm"
                          />
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 z-10" />
                        </div>
                        <div>
                          <p className="text-xs text-white font-bold">{breathPhase}...</p>
                          <p className="text-[10px] text-slate-400 font-mono">{breathSeconds} seconds remaining</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Heart racing or anxious? Take a 12-second mindful pause before typing your reflection.
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. What actually happened? */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">What actually happened?</label>
                  <textarea
                    rows={2}
                    required
                    value={logActuallyHappened}
                    onChange={(e) => setLogActuallyHappened(e.target.value)}
                    placeholder="Describe what happened in a few words."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#57f1db] resize-none"
                  />
                </div>

                {/* 4. What did you learn? */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">What did you learn?</label>
                  <textarea
                    rows={2}
                    required
                    value={logLearned}
                    onChange={(e) => setLogLearned(e.target.value)}
                    placeholder="What did this step teach you?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#57f1db] resize-none"
                  />
                </div>

                {/* 5. Next move */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Your Next Move</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: "Repeat this step", label: "Repeat this step" },
                      { id: "Make it easier", label: "Make it easier" },
                      { id: "Try the next step", label: "Try next step" },
                      { id: "Pause for now", label: "Pause for now" }
                    ].map((move) => (
                      <button
                        key={move.id}
                        type="button"
                        onClick={() => setLogNextMove(move.id)}
                        className={`py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                          logNextMove === move.id
                            ? "bg-[#cebdff]/15 border-[#cebdff]/30 text-[#cebdff]"
                            : "bg-slate-900 border-slate-800 text-slate-400"
                        }`}
                      >
                        {move.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-900/60 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Trigger breath guide and also prompt modal action
                      toggleBreathing();
                    }}
                    className="px-6 py-3 rounded-full border border-slate-800 bg-slate-900/40 text-slate-300 font-bold text-xs hover:bg-slate-900 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 text-cyan-400" />
                    <span>Go to Calm Now</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#57f1db] to-cyan-500 text-slate-950 font-bold text-xs hover:scale-101 active:scale-99 transition-transform text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Save Reflection</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
