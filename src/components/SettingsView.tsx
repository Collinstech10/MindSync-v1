import React, { useRef, useState } from "react";
import { AppSettings } from "../types";
import { Lock, Download, Upload, Trash2, Heart, ExternalLink, Phone, Key, Bell, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
  onClearHistory: () => void;
  onOpenEmergency: () => void;
  onLockAppNow?: () => void;
  onSetPin?: () => void;
  onTestReminder?: () => void;
  onOpenWelcome?: () => void;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onClearHistory,
  onOpenEmergency,
  onLockAppNow,
  onSetPin,
  onTestReminder,
  onOpenWelcome,
  showToast,
}: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notifPermission, setNotifPermission] = useState<string>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );

  const handleTogglePinLock = () => {
    const nextVal = !settings.localPinLock;
    onUpdateSettings({ localPinLock: nextVal });
    if (nextVal) {
      if (showToast) showToast("Local App PIN Lock enabled. PIN code is active.", "success");
      if (!settings.pinCode && onSetPin) {
        onSetPin();
      }
    } else {
      if (showToast) showToast("Local App PIN Lock disabled.", "info");
    }
  };

  const handleReminderChange = async (newVal: string) => {
    onUpdateSettings({ dailyReminder: newVal });
    if (newVal !== "disabled" && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        try {
          const perm = await Notification.requestPermission();
          setNotifPermission(perm);
          if (perm === "granted" && showToast) {
            showToast("Notifications enabled! You will receive daily self-reflection reminders.", "success");
          }
        } catch (e) {
          console.error("Notification permission error:", e);
        }
      } else if (Notification.permission === "granted" && showToast) {
        showToast(`Self-reflection reminder scheduled for ${newVal}`, "success");
      }
    }
  };

  const handleRequestNotifPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === "granted" && showToast) {
        showToast("Notification permission granted!", "success");
      } else if (perm === "denied" && showToast) {
        showToast("Notification permission was denied in browser settings. In-app popups will still work.", "error");
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportData(text);
        if (showToast) {
          showToast("Data backup was successfully restored.", "success");
        } else {
          alert("Your data backup was successfully restored.");
        }
      } catch (err) {
        if (showToast) {
          showToast("Failed to parse import backup. Please verify file integrity.", "error");
        } else {
          alert("Failed to parse import backup. Please verify file integrity.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#57f1db] font-bold">
          App Preferences
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mt-1">
          Settings & Privacy
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl text-base leading-relaxed">
          Manage your secure local storage, customize your interface, and read our clinical safety guidelines.
        </p>
      </div>

      {/* Local Privacy Banner */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-2 right-2 w-24 h-24 bg-teal-500/5 blur-2xl rounded-full" />
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#57f1db]/10 p-3.5 text-[#57f1db] shrink-0 mt-0.5">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 z-10">
            <h3 className="font-extrabold text-white text-base">Your Data is Private • Locally Saved</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your anxiety logs, reflections, and completed reframes stay strictly on this device inside your local sandboxed browser storage. We never collect, store, or sell any of your personal mental health entries.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Settings Toggles */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 space-y-8">
          
          {/* Customization Switches */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/60 pb-3">
              User Interface Settings
            </h3>

            <div className="space-y-4">
              {/* Toggle 1: Gentle Animations */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/20 border border-slate-800/60">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white">Gentle Animations</h4>
                  <p className="text-xs text-slate-400">Reduce screen transitions and movement when feeling overwhelmed.</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ gentleAnimations: !settings.gentleAnimations })}
                  className={`w-12 h-6.5 rounded-full transition-all flex items-center p-1 cursor-pointer ${
                    settings.gentleAnimations ? "bg-[#57f1db] justify-end" : "bg-slate-800 justify-start"
                  }`}
                >
                  <span className="w-4.5 h-4.5 rounded-full bg-slate-950 shadow-md" />
                </button>
              </div>

              {/* Toggle 2: Local PIN lock */}
              <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Local App PIN Lock</h4>
                      {settings.localPinLock && (
                        <span className="text-[10px] font-mono bg-[#57f1db]/10 text-[#57f1db] border border-[#57f1db]/20 px-2 py-0.5 rounded-full font-bold">
                          Active ({settings.pinCode ? "****" : "Default 1234"})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Instate a local PIN lock before opening the Mindsync Dashboard.</p>
                  </div>
                  <button
                    onClick={handleTogglePinLock}
                    className={`w-12 h-6.5 rounded-full transition-all flex items-center p-1 cursor-pointer shrink-0 ${
                      settings.localPinLock ? "bg-[#57f1db] justify-end" : "bg-slate-800 justify-start"
                    }`}
                  >
                    <span className="w-4.5 h-4.5 rounded-full bg-slate-950 shadow-md" />
                  </button>
                </div>

                {settings.localPinLock && (
                  <div className="pt-2 border-t border-slate-800/40 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={onSetPin}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5 text-[#57f1db]" />
                      <span>{settings.pinCode ? "Change PIN Code" : "Set Custom 4-Digit PIN"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onLockAppNow}
                      className="px-3 py-1.5 rounded-lg bg-[#57f1db]/10 border border-[#57f1db]/30 hover:bg-[#57f1db]/20 text-xs text-[#57f1db] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock App Now</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Daily Reminder Select */}
              <div className="p-4 rounded-2xl bg-slate-950/20 border border-slate-800/60 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">Self-Reflection Reminder</h4>
                      {settings.dailyReminder !== "disabled" && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                          Active at {settings.dailyReminder}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Schedule daily check-in notifications to prompt emotional reflection.</p>
                  </div>

                  <select
                    value={settings.dailyReminder}
                    onChange={(e) => handleReminderChange(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-bold focus:outline-none focus:border-[#57f1db] cursor-pointer"
                  >
                    <option value="09:00">09:00 AM // Morning Alignment</option>
                    <option value="13:00">01:00 PM // Midday Anchor</option>
                    <option value="17:00">05:00 PM // Afternoon Reset</option>
                    <option value="20:00">08:00 PM // Evening Reframe</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                {settings.dailyReminder !== "disabled" && (
                  <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Bell className="w-3.5 h-3.5 text-[#cebdff]" />
                      <span>
                        Permission:{" "}
                        <strong className="text-slate-200 uppercase">
                          {notifPermission === "granted" ? "Allowed" : notifPermission === "denied" ? "Blocked (In-App Only)" : "Default"}
                        </strong>
                      </span>
                      {notifPermission === "default" && (
                        <button
                          type="button"
                          onClick={handleRequestNotifPermission}
                          className="text-[#57f1db] underline font-bold cursor-pointer ml-1"
                        >
                          Enable Browser Notifications
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={onTestReminder}
                      className="px-3 py-1.5 rounded-lg bg-[#cebdff]/10 border border-[#cebdff]/30 hover:bg-[#cebdff]/20 text-xs text-[#cebdff] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Test Reminder Now</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Welcome Screen Option */}
              {onOpenWelcome && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/20 border border-slate-800/60">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Welcome Page & Tour</span>
                      <Sparkles className="w-4 h-4 text-[#57f1db]" />
                    </h4>
                    <p className="text-xs text-slate-400">Re-open the intro welcome screen to review Mindsync capabilities.</p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenWelcome}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-[#57f1db] font-bold transition-all cursor-pointer"
                  >
                    Open Welcome Page
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Secure Backup & Restores */}
          <div className="space-y-6 pt-4 border-t border-slate-800/40">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/60 pb-3">
              Device Sync & Backups
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onExportData}
                className="p-5 bg-slate-950/20 border border-slate-800 hover:border-slate-700 rounded-2xl text-left flex items-start gap-4 transition-all cursor-pointer hover:bg-slate-900/20"
              >
                <div className="rounded-xl bg-slate-900 p-2 text-slate-400">
                  <Download className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Export Backup File</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Download your entire de-escalation history as a secure, portable JSON backup.</p>
                </div>
              </button>

              <button
                onClick={handleImportClick}
                className="p-5 bg-slate-950/20 border border-slate-800 hover:border-slate-700 rounded-2xl text-left flex items-start gap-4 transition-all cursor-pointer hover:bg-slate-900/20"
              >
                <div className="rounded-xl bg-slate-900 p-2 text-slate-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Import Backup File</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Restore previous data backups securely into your local sandboxed instance.</p>
                </div>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* Permanent Data Wipe */}
          <div className="space-y-4 pt-6 border-t border-slate-800/40">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-400">
              Reset All Data
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-950/10 border border-red-500/15 p-5 rounded-2xl">
              <div className="space-y-0.5 max-w-md">
                <h4 className="text-sm font-bold text-red-400">Delete All Device Data</h4>
                <p className="text-xs text-slate-400">Wipe all completed thought reframes, daily check-ins, small steps, and settings permanently. This action is irreversible.</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Execute final data purge? This wipes all client data permanently and is completely irreversible.")) {
                    onClearHistory();
                    if (showToast) {
                      showToast("Local sandbox database purged successfully.", "info");
                    } else {
                      alert("Local sandbox purged successfully.");
                    }
                  }
                }}
                className="px-5 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Delete All Data
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Resources and Crisis Lines */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800/60 pb-3">
              <Phone className="w-4.5 h-4.5 text-red-400" />
              <span>Safety & Crisis Support</span>
            </div>

            {/* Crucial safety disclaimer in settings */}
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
              <p className="font-bold text-red-400 flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5" />
                <span>Safety Disclaimer</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Mindsync provides self-help tools and education. It does not provide diagnosis, therapy, medical advice, or emergency support. If you feel unsafe or at risk of harming yourself or someone else, contact local emergency services or a qualified mental-health professional immediately.
              </p>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              If you are experiencing immediate crisis, panic, or thoughts of self-harm, please connect with specialized crisis responders instantly:
            </p>

            <div className="space-y-3">
              <a
                href="tel:988"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 text-red-400 font-bold text-xs transition-all"
              >
                <div className="space-y-0.5">
                  <p>988 Suicide & Crisis Lifeline</p>
                  <p className="text-[10px] text-slate-400 font-normal">Call 24/7 inside the US & Canada</p>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="sms:741741?body=HOME"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                <div className="space-y-0.5">
                  <p>Text HOME to 741741</p>
                  <p className="text-[10px] text-slate-500 font-normal">Free Crisis Text Support Line</p>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="https://www.findahelpline.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                <div className="space-y-0.5">
                  <p>Find A Helpline (International)</p>
                  <p className="text-[10px] text-slate-500 font-normal">Explore global emergency support channels</p>
                </div>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </div>

            <button
              onClick={onOpenEmergency}
              className="w-full mt-2 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs rounded-full transition-all cursor-pointer text-center animate-pulse"
            >
              Open Guided Emergency Calm
            </button>
          </div>

          <div className="bg-slate-950/30 border border-slate-800/40 rounded-2xl p-4 text-center mt-6">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Clinical & Educational Basis
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Mindsync provides evidence-based self-help tools inspired by CBT (Cognitive Behavioral Therapy).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
