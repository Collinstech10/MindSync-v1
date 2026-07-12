import React from "react";
import {
  Home,
  HeartPulse,
  Activity,
  Brain,
  Compass,
  LineChart,
  Settings,
  AlertOctagon,
  X,
  Users,
  Youtube,
} from "lucide-react";
import MindsyncLogo from "./MindsyncLogo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenEmergency,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const navItems = [
    { id: "home", label: "Mind Dashboard", icon: Home },
    { id: "calm", label: "Calm Now", icon: HeartPulse },
    { id: "checkin", label: "Sync Check-In", icon: Activity },
    { id: "battle", label: "Thought Reframe", icon: Brain },
    { id: "missions", label: "Small Steps", icon: Compass },
    { id: "progress", label: "Progress Insights", icon: LineChart },
    { id: "about", label: "About Us", icon: Users },
    { id: "songs", label: "Exhibition Songs", icon: Youtube },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-20 lg:w-72 border-r border-slate-800 bg-[#0b0f19] h-screen flex flex-col justify-between py-8 shrink-0 select-none transition-all duration-300 md:static md:translate-x-0 md:flex md:bg-slate-950/60 md:backdrop-blur-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Top Branding Section */}
          <div className="px-6 md:px-0 md:justify-center lg:px-6 mb-8 flex items-center justify-between">
            <div className="md:hidden lg:block">
              <MindsyncLogo iconSize={36} textSize="sm" />
            </div>
            <div className="hidden md:block lg:hidden">
              <MindsyncLogo iconSize={36} showText={false} />
            </div>
            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-100 bg-slate-900/60 border border-slate-800/60 md:hidden cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5 px-4 md:px-2 lg:px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  title={item.label}
                  className={`w-full flex items-center justify-start md:justify-center lg:justify-start gap-4 md:gap-0 lg:gap-4 px-5 md:px-0 lg:px-5 py-3.5 md:py-3.5 lg:py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-250 cursor-pointer ${
                    isActive
                      ? "bg-[#57f1db]/10 text-[#57f1db] border-r-2 border-[#57f1db]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#57f1db]" : "text-slate-500"}`} />
                  <span className="md:hidden lg:block">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Emergency Trigger */}
        <div className="px-6 md:px-2 lg:px-6">
          <button
            onClick={() => {
              onOpenEmergency();
              if (onClose) onClose();
            }}
            title="Emergency Calm"
            className="w-full md:w-12 md:h-12 lg:w-full py-4 md:py-0 lg:py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 md:gap-0 lg:gap-2.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shadow-red-500/5 hover:border-red-500/40 mx-auto"
          >
            <AlertOctagon className="w-4.5 h-4.5 animate-pulse shrink-0" />
            <span className="md:hidden lg:inline">Emergency Calm</span>
          </button>
        </div>
      </aside>
    </>
  );
}
