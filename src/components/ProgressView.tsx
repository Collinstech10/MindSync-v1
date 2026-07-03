import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ThoughtBattle, MoodCheckIn, SessionLog } from "../types";
import { Award, Compass, Clock, Zap, Heart, Trash2, Calendar } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b0f19]/95 border border-slate-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold mb-2">
          {label}
        </p>
        <div className="space-y-1.5 text-xs">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 justify-between">
              <span className="flex items-center gap-1.5 font-bold" style={{ color: entry.stroke || entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value} / 10
              </span>
            </div>
          ))}
          {payload[0]?.payload?.mood && (
            <div className="pt-1.5 mt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Primary State:</span>
              <span className="text-[#57f1db] font-extrabold">{payload[0].payload.mood}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

interface ProgressViewProps {
  battles: ThoughtBattle[];
  checkIns: MoodCheckIn[];
  sessions: SessionLog[];
  onClearHistory: () => void;
}

export default function ProgressView({ battles, checkIns, sessions, onClearHistory }: ProgressViewProps) {
  // Calculations
  const totalBattles = battles.length;
  const totalSessions = sessions.length;

  const averageAnxietyReduction =
    battles.length > 0
      ? Math.round(
          (battles.reduce((acc, b) => acc + (b.initialAnxiety - b.newAnxiety), 0) /
            (battles.length * 10)) *
            100
        )
      : 0;

  // Filter checkIns within the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const last30DaysCheckIns = checkIns
    .filter((c) => {
      const checkInDate = new Date(c.timestamp);
      return checkInDate >= thirtyDaysAgo;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Format data for the line graph
  const checkInGraphData = last30DaysCheckIns.map((c) => {
    const d = new Date(c.timestamp);
    return {
      dateStr: d.toLocaleDateString([], { month: "short", day: "numeric" }),
      timestamp: d.getTime(),
      anxiety: c.anxiety,
      energy: c.energy,
      mood: c.mood,
      isReal: true,
    };
  });

  const hasRealData = checkInGraphData.length > 0;

  // Fallback 30-day realistic trajectory if empty
  const generateFallbackData = () => {
    const data = [];
    const anxietyVals = [8, 7, 5, 6, 4, 3, 2];
    const energyVals = [3, 4, 5, 6, 6, 7, 8];
    const moods = ["Restless", "Tired", "Anxious", "Exhausted", "Grounded", "Serene", "Focused"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getTime() - (6 - i) * 5 * 24 * 60 * 60 * 1000);
      data.push({
        dateStr: d.toLocaleDateString([], { month: "short", day: "numeric" }),
        anxiety: anxietyVals[i],
        energy: energyVals[i],
        mood: moods[i],
        isReal: false,
      });
    }
    return data;
  };

  const displayData = hasRealData ? checkInGraphData : generateFallbackData();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Inspirational Quote Header */}
      <div className="text-center max-w-2xl mx-auto py-4 space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#57f1db] font-bold">
          Progress Insights
        </span>
        <blockquote className="text-3xl italic font-serif text-slate-100 font-medium tracking-wide">
          "Calm the alarm. Reclaim control."
        </blockquote>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
          Mindsync Personal Guide • Secure
        </p>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center text-[#57f1db]">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Reframed</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white">{totalBattles}</div>
            <p className="text-xs text-slate-400 mt-1">Thought reframes completed</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center text-[#cebdff]">
            <Zap className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Anxiety Drop</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white">-{averageAnxietyReduction}%</div>
            <p className="text-xs text-slate-400 mt-1">Avg anxiety reduction</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center text-cyan-400">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Mindfulness</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white">{totalSessions}</div>
            <p className="text-xs text-slate-400 mt-1">Calm & grounding rounds</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center text-emerald-400">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Logging</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white">
              {checkIns.length > 0 ? "Active" : "0 Logs"}
            </div>
            <p className="text-xs text-slate-400 mt-1">Daily check-in logs</p>
          </div>
        </div>
      </div>

      {/* Chart Segment */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">30-Day Mood & Anxiety Trend</h3>
            <p className="text-xs text-slate-400">A visual guide of your self-reported anxiety and energy levels over time.</p>
          </div>
          <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider ${
            hasRealData 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-slate-800 text-slate-400"
          }`}>
            {hasRealData ? "Private Local Check-ins" : "Typical Calming Trend"}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="dateStr" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
              />
              <Line
                type="monotone"
                dataKey="anxiety"
                name="Anxiety Level"
                stroke="#57f1db"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 3, strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                name="Energy Level"
                stroke="#cebdff"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 3, strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unified Timeline / History */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-4 mb-6">
          <h3 className="text-lg font-bold text-white">Activity Journal History</h3>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete all wellness history from this device? This is permanent.")) {
                onClearHistory();
              }
            }}
            className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset all progress records</span>
          </button>
        </div>

        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {battles.length === 0 && checkIns.length === 0 && sessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm leading-relaxed">
              History is currently empty. Complete your first check-in, breathing session, or thought reframe to see your history logged here.
            </div>
          ) : (
            <div className="relative border-l border-slate-800 pl-6 ml-3 space-y-6">
              {/* Chronological map of battles */}
              {battles.map((b) => (
                <div key={b.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#57f1db] border border-slate-950" />
                  <div className="bg-slate-950/20 border border-slate-800/40 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-[#57f1db] tracking-wider">
                        Thought Reframe
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(b.timestamp).toLocaleDateString()} at {new Date(b.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-through italic">
                      "{b.anxiousThought}"
                    </p>
                    <p className="text-xs text-[#57f1db] font-bold">
                      "{b.counterThought}"
                    </p>
                  </div>
                </div>
              ))}

              {/* Check-ins */}
              {checkIns.map((c) => (
                <div key={c.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950" />
                  <div className="bg-slate-950/20 border border-slate-800/40 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                        Check-In • {c.mood}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(c.timestamp).toLocaleDateString()} at {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      Anxiety: {c.anxiety}/10 • Energy: {c.energy}/10
                    </p>
                    {c.physical.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {c.physical.map((p, idx) => (
                          <span key={idx} className="text-[9px] font-mono bg-slate-900 border border-slate-800/60 text-slate-400 px-2 py-0.5 rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Mindful Sessions */}
              {sessions.map((s) => (
                <div key={s.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#cebdff] border border-slate-950" />
                  <div className="bg-slate-950/20 border border-slate-800/40 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-[#cebdff] tracking-wider">
                        Mindful Session • {s.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(s.timestamp).toLocaleDateString()} at {new Date(s.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      Practiced {s.durationSeconds} seconds of calming mindfulness.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
