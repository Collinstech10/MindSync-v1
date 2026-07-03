import React from "react";
import {
  Heart,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { ThoughtBattle, Mission, MoodCheckIn } from "../types";
import MindsyncLogo from "./MindsyncLogo";

interface HomeViewProps {
  battles: ThoughtBattle[];
  missions: Mission[];
  checkIns: MoodCheckIn[];
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
}

export default function HomeView({
  battles,
  missions,
  checkIns,
  setActiveTab,
  onOpenEmergency,
}: HomeViewProps) {
  const activeMission = missions.find((m) => ["Planned", "Repeat This Step", "active"].includes(m.status)) || missions[0];
  const lastCheckIn = checkIns[checkIns.length - 1];
  const lastBattle = battles[battles.length - 1];

  // Calculations
  const averageAnxietyReduction =
    battles.length > 0
      ? Math.round(
          (battles.reduce((acc, b) => acc + (b.initialAnxiety - b.newAnxiety), 0) /
            (battles.length * 10)) *
            100
        )
      : 0;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MindsyncLogo iconSize={26} showText={false} />
            <span className="text-xs uppercase tracking-widest text-[#cebdff] font-bold">
              Private Anxiety Management Toolkit
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mt-1">
            Mind Dashboard.
          </h1>
          <p className="text-xl font-medium text-[#57f1db] mt-1.5">
            "Calm the alarm. Reclaim control."
          </p>
          <p className="text-slate-400 mt-2 max-w-xl text-base leading-relaxed">
            Mindsync is your private, offline-first space to steady your heart rate, deconstruct overwhelming worries, and practice small coping habits. No accounts, no data leaves your device.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("checkin")}
            className="px-6 py-3 rounded-full border border-slate-800 bg-slate-900/40 text-slate-300 font-semibold text-sm hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Sync Check-In
          </button>
          <button
            onClick={() => setActiveTab("battle")}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#57f1db] to-[#2dd4bf] text-slate-950 font-bold text-sm shadow-lg shadow-[#57f1db]/10 hover:scale-103 transition-transform cursor-pointer"
          >
            Thought Reframe
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Quick Stats Bento */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Thoughts Reframed
              </span>
              <TrendingDown className="w-5 h-5 text-[#57f1db]" />
            </div>
            <div>
              <div className="text-4xl font-black text-white">
                {battles.length}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Worries balanced and cleared
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold tracking-wider text-[#cebdff] uppercase">
                Anxiety Decrease
              </span>
              <Zap className="w-5 h-5 text-[#cebdff]" />
            </div>
            <div>
              <div className="text-4xl font-black text-white">
                {averageAnxietyReduction}%
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Average worry level relief
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold tracking-wider text-[#57f1db] uppercase">
                Mind State
              </span>
              <CheckCircle2 className="w-5 h-5 text-[#57f1db]" />
            </div>
            <div>
              <div className="text-4xl font-black text-white">
                Steady
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Grounded and present
              </p>
            </div>
          </div>
        </div>

        {/* Quick Panic Button Card */}
        <div className="col-span-12 lg:col-span-4 bg-gradient-to-r from-red-950/20 to-red-900/10 border border-red-500/20 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
          <div className="z-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
              <Heart className="w-4 h-4 animate-pulse" />
              <span>Calm Safeguard</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              Feeling overwhelmed or experiencing a panic spike?
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Bypass stressful thoughts. Start a gentle, paced breathing cycle immediately.
            </p>
          </div>
          <button
            onClick={onOpenEmergency}
            className="w-full mt-6 py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 font-bold text-xs rounded-xl transition-all cursor-pointer text-center z-10"
          >
            Start Calm Now Reset
          </button>
        </div>

        {/* Active Exposure Mission */}
        {activeMission && (
          <div className="col-span-12 md:col-span-6 lg:col-span-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="bg-slate-800/80 text-xs px-3 py-1 rounded-full text-[#57f1db] font-bold uppercase tracking-wide">
                  Active Small Step
                </span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Difficulty {activeMission.difficulty}/5
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-4">
                {activeMission.title}
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {activeMission.description}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/50 pt-6 mt-6">
              <div className="flex gap-4">
                <div className="text-xs text-slate-400">
                  Challenge Level: <span className="text-white font-bold">{activeMission.difficulty}/5</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("missions")}
                className="text-xs font-bold text-[#57f1db] flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>Continue Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Last Reframed Thought */}
        <div className="col-span-12 md:col-span-6 lg:col-span-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="bg-[#cebdff]/10 text-xs px-3 py-1 rounded-full text-[#cebdff] font-bold uppercase tracking-wide">
                Thought Reframe
              </span>
              <span className="text-xs text-slate-500">
                {lastBattle ? new Date(lastBattle.timestamp).toLocaleDateString() : "No record"}
              </span>
            </div>
            {lastBattle ? (
              <div className="mt-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Anxious Thought</p>
                <p className="text-sm text-slate-400 italic mt-1 font-medium line-through decoration-red-500/40">
                  "{lastBattle.anxiousThought}"
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-4">Balanced Reframe</p>
                <p className="text-sm text-[#57f1db] font-semibold mt-1 leading-relaxed">
                  "{lastBattle.counterThought}"
                </p>
              </div>
            ) : (
              <div className="mt-8 text-center text-slate-500 text-sm">
                No reframed thoughts yet. Map your first worry in the Thought Reframe screen to balance it.
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveTab("battle")}
            className="w-full text-center border border-slate-800 hover:border-slate-700 bg-slate-950/20 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-200 mt-6 transition-all cursor-pointer"
          >
            Explore Thought Reframing
          </button>
        </div>

        {/* Biometric Status / Last Mood Check In */}
        <div className="col-span-12 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Sync Check-In Status</h3>
            <button
              onClick={() => setActiveTab("checkin")}
              className="text-xs font-bold text-[#cebdff] hover:underline cursor-pointer"
            >
              Log New Check-In
            </button>
          </div>
          {lastCheckIn ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Current Mood State</p>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#57f1db] animate-pulse" />
                  {lastCheckIn.mood}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Energy Level</p>
                <div className="text-lg font-bold text-[#cebdff]">
                  {lastCheckIn.energy} / 10
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Anxiety Level</p>
                <div className="text-lg font-bold text-red-400">
                  {lastCheckIn.anxiety} / 10
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Physical Sensations</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {lastCheckIn.physical.length > 0 ? (
                    lastCheckIn.physical.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None logged</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 text-sm">
              No check-ins logged today. Complete a gentle 30-second Sync Check-In.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
