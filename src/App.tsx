import React, { useState, useEffect } from "react";
import { Menu, AlertOctagon, CheckCircle2, AlertTriangle, X, Info } from "lucide-react";
import Sidebar from "./components/Sidebar";
import HomeView from "./components/HomeView";
import CalmNowView from "./components/CalmNowView";
import CheckInView from "./components/CheckInView";
import ThoughtBattleView from "./components/ThoughtBattleView";
import MissionsView from "./components/MissionsView";
import ProgressView from "./components/ProgressView";
import SettingsView from "./components/SettingsView";
import AboutUsView from "./components/AboutUsView";
import ExhibitionSongsView from "./components/ExhibitionSongsView";
import EmergencyModal from "./components/EmergencyModal";
import MindsyncLogo from "./components/MindsyncLogo";
import { ThoughtBattle, Mission, MoodCheckIn, AppSettings, SessionLog } from "./types";
import { motion, AnimatePresence } from "motion/react";

// Default seed missions (Small Steps)
const DEFAULT_MISSIONS: Mission[] = [
  {
    id: "s1",
    title: "Make warm eye contact with a cashier",
    description: "Practice brief, polite eye contact and offer a gentle nod or smile during your next transaction.",
    category: "Social Confidence",
    difficulty: 1,
    status: "Planned",
    fearBefore: 5,
    prediction: "They might stare back at me with judgment or look annoyed."
  },
  {
    id: "s2",
    title: "Send one message first to check in on a friend",
    description: "Reach out to someone you haven't spoken to recently with a simple, friendly greeting.",
    category: "Social Confidence",
    difficulty: 2,
    status: "Planned",
    fearBefore: 6,
    prediction: "They will ignore me, proving they don't want to talk."
  },
  {
    id: "w1",
    title: "Send an unfinished draft to a colleague",
    description: "Share a rough, unpolished outline or design to ask for early feedback.",
    category: "Work Stress",
    difficulty: 2,
    status: "Planned",
    fearBefore: 6,
    prediction: "They will think I'm incompetent for sharing imperfect work."
  },
  {
    id: "w2",
    title: "Express support for an idea in a team meeting",
    description: "Briefly voice your agreement or add a short suggestion out loud.",
    category: "Work Stress",
    difficulty: 3,
    status: "Not Started",
    fearBefore: 7,
    prediction: "My voice will shake and everyone will think my idea is silly."
  },
  {
    id: "h1",
    title: "Refrain from checking wellness symptoms for 4 hours",
    description: "Notice physical sensations without searching about them online or asking others.",
    category: "Health Anxiety",
    difficulty: 3,
    status: "Planned",
    fearBefore: 8,
    prediction: "I might miss a life-threatening symptom if I don't look it up."
  },
  {
    id: "p1",
    title: "Sit in a busy coffee shop for 5 minutes without a phone",
    description: "Sit quietly in a high-stimulation environment and focus entirely on breathing.",
    category: "Panic Sensations",
    difficulty: 2,
    status: "Planned",
    fearBefore: 7,
    prediction: "I will have a panic attack and everyone will notice me."
  },
  {
    id: "p2",
    title: "Raise your heart rate, then practice slow belly breathing",
    description: "Do light physical movement to trigger physical heart sensations, then settle your breathing.",
    category: "Panic Sensations",
    difficulty: 3,
    status: "Not Started",
    fearBefore: 8,
    prediction: "My heart will keep racing and spin completely out of control."
  },
  {
    id: "sl1",
    title: "Keep screens out of your reach before sleep",
    description: "Charge your phone across the room to avoid late-night checking when sleepless.",
    category: "Sleep Worry",
    difficulty: 3,
    status: "Planned",
    fearBefore: 6,
    prediction: "I won't be able to sleep at all if I can't browse."
  },
  {
    id: "c1",
    title: "Say hello to a neighbor or doorman clearly",
    description: "Initiate a basic, friendly greeting when passing by.",
    category: "Difficult Conversations",
    difficulty: 1,
    status: "Planned",
    fearBefore: 4,
    prediction: "They won't reply or will find it strange."
  },
  {
    id: "c2",
    title: "Politely express a different preference in a group",
    description: "Gently share your genuine opinion on a movie, meal, or book when it differs from others.",
    category: "Difficult Conversations",
    difficulty: 3,
    status: "Not Started",
    fearBefore: 7,
    prediction: "They will think I'm being argumentative and reject me."
  }
];

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  gentleAnimations: false,
  dailyReminder: "13:00",
  localPinLock: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [battles, setBattles] = useState<ThoughtBattle[]>([]);
  const [checkIns, setCheckIns] = useState<MoodCheckIn[]>([]);
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedBattles = localStorage.getItem("mindsync_battles");
      const storedCheckIns = localStorage.getItem("mindsync_checkins");
      const storedSessions = localStorage.getItem("mindsync_sessions");
      const storedMissions = localStorage.getItem("mindsync_missions");
      const storedSettings = localStorage.getItem("mindsync_settings");

      if (storedBattles) setBattles(JSON.parse(storedBattles));
      if (storedCheckIns) setCheckIns(JSON.parse(storedCheckIns));
      if (storedSessions) setSessions(JSON.parse(storedSessions));
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      if (storedMissions) {
        setMissions(JSON.parse(storedMissions));
      } else {
        setMissions(DEFAULT_MISSIONS);
        localStorage.setItem("mindsync_missions", JSON.stringify(DEFAULT_MISSIONS));
      }
    } catch (err) {
      console.error("Local Storage Hydration Failure:", err);
    }
  }, []);

  // Sync to local storage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Sync failure for key ${key}:`, err);
    }
  };

  // Actions
  const handleAddBattle = (battleData: Omit<ThoughtBattle, "id" | "timestamp">) => {
    const newBattle: ThoughtBattle = {
      ...battleData,
      id: "b_" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...battles, newBattle];
    setBattles(updated);
    saveToStorage("mindsync_battles", updated);
  };

  const handleAddCheckIn = (checkInData: Omit<MoodCheckIn, "id" | "timestamp">) => {
    const newCheckIn: MoodCheckIn = {
      ...checkInData,
      id: "c_" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...checkIns, newCheckIn];
    setCheckIns(updated);
    saveToStorage("mindsync_checkins", updated);
  };

  const handleLogSession = (sessionData: Omit<SessionLog, "id" | "timestamp">) => {
    const newSession: SessionLog = {
      ...sessionData,
      id: "s_" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...sessions, newSession];
    setSessions(updated);
    saveToStorage("mindsync_sessions", updated);
  };

  const handleCompleteMission = (missionId: string, fBefore: number, fAfter: number) => {
    const updatedMissions = missions.map((m) => {
      if (m.id === missionId) {
        return {
          ...m,
          status: "completed" as const,
          fearBefore: fBefore,
          fearAfter: fAfter,
          completedAt: new Date().toISOString(),
        };
      }
      return m;
    });

    // Simple unlock mechanic: Unlock level + 1 of the completed mission's category
    const completedMission = missions.find((m) => m.id === missionId);
    if (completedMission) {
      const nextLevel = completedMission.level + 1;
      const finalMissions = updatedMissions.map((m) => {
        if (m.category === completedMission.category && m.level === nextLevel && m.status === "locked") {
          return { ...m, status: "active" as const };
        }
        return m;
      });
      setMissions(finalMissions);
      saveToStorage("mindsync_missions", finalMissions);
    } else {
      setMissions(updatedMissions);
      saveToStorage("mindsync_missions", updatedMissions);
    }

    // Log this exposure session into the session logs too!
    handleLogSession({
      type: "panic",
      name: `Exposure Mission: ${completedMission?.title || "Somatic Exposure"}`,
      durationSeconds: 180,
    });
  };

  const handleResetMissions = () => {
    setMissions(DEFAULT_MISSIONS);
    saveToStorage("mindsync_missions", DEFAULT_MISSIONS);
  };

  const handleUpdateMissions = (updated: Mission[]) => {
    setMissions(updated);
    saveToStorage("mindsync_missions", updated);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveToStorage("mindsync_settings", updated);
  };

  const handleExportData = () => {
    const fullBackup = {
      battles,
      checkIns,
      sessions,
      missions,
      settings,
      backupVersion: "1.0",
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindsync_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonData: string) => {
    try {
      const backup = JSON.parse(jsonData);
      if (backup.battles) {
        setBattles(backup.battles);
        saveToStorage("mindsync_battles", backup.battles);
      }
      if (backup.checkIns) {
        setCheckIns(backup.checkIns);
        saveToStorage("mindsync_checkins", backup.checkIns);
      }
      if (backup.sessions) {
        setSessions(backup.sessions);
        saveToStorage("mindsync_sessions", backup.sessions);
      }
      if (backup.missions) {
        setMissions(backup.missions);
        saveToStorage("mindsync_missions", backup.missions);
      }
      if (backup.settings) {
        setSettings(backup.settings);
        saveToStorage("mindsync_settings", backup.settings);
      }
    } catch (err) {
      throw new Error("Invalid format");
    }
  };

  const handleClearHistory = () => {
    setBattles([]);
    setCheckIns([]);
    setSessions([]);
    setMissions(DEFAULT_MISSIONS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("mindsync_battles");
    localStorage.removeItem("mindsync_checkins");
    localStorage.removeItem("mindsync_sessions");
    localStorage.removeItem("mindsync_settings");
    localStorage.setItem("mindsync_missions", JSON.stringify(DEFAULT_MISSIONS));
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#0e1322] min-h-screen text-slate-100 font-sans overflow-hidden antialiased">
      {/* Mobile Top Header bar */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#0b0f19] sticky top-0 z-40 w-full shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800/60 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <MindsyncLogo iconSize={28} showSlogan={false} textSize="sm" />
        </div>
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <AlertOctagon className="w-3.5 h-3.5 animate-pulse text-red-400" />
          <span>Emergency</span>
        </button>
      </header>

      {/* Sidebar Command Center Panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => {
          setIsEmergencyOpen(true);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Action Stage */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-69px)] md:h-screen px-4 md:px-12 py-6 md:py-10 relative">
        <div className="max-w-6xl mx-auto pb-20">
          {activeTab === "home" && (
            <HomeView
              battles={battles}
              missions={missions}
              checkIns={checkIns}
              setActiveTab={setActiveTab}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />
          )}

          {activeTab === "calm" && (
            <CalmNowView onLogSession={handleLogSession} showToast={showToast} />
          )}

          {activeTab === "checkin" && (
            <CheckInView
              onAddCheckIn={handleAddCheckIn}
              checkIns={checkIns}
            />
          )}

          {activeTab === "battle" && (
            <ThoughtBattleView
              onAddBattle={handleAddBattle}
              battles={battles}
              showToast={showToast}
            />
          )}

          {activeTab === "missions" && (
            <MissionsView
              missions={missions}
              onCompleteMission={handleCompleteMission}
              onResetMissions={handleResetMissions}
              onUpdateMissions={handleUpdateMissions}
            />
          )}

          {activeTab === "progress" && (
            <ProgressView
              battles={battles}
              checkIns={checkIns}
              sessions={sessions}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === "about" && (
            <AboutUsView />
          )}

          {activeTab === "songs" && (
            <ExhibitionSongsView />
          )}

          {activeTab === "settings" && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onClearHistory={handleClearHistory}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            {toast.type === "success" && (
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {toast.type === "error" && (
              <div className="rounded-xl bg-red-500/10 p-2 text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            {toast.type === "info" && (
              <div className="rounded-xl bg-cyan-500/10 p-2 text-[#57f1db] shrink-0">
                <Info className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-slate-100 font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Calm Modal Panel Overlay */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
