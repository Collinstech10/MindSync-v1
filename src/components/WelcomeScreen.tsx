import React from "react";
import { 
  ArrowRight, 
  Brain, 
  Activity, 
  Compass, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles,
  Lock,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MindsyncLogo from "./MindsyncLogo";

interface WelcomeScreenProps {
  isOpen: boolean;
  onEnterApp: (dontShowAgain?: boolean) => void;
}

export default function WelcomeScreen({ isOpen, onEnterApp }: WelcomeScreenProps) {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  if (!isOpen) return null;

  const features = [
    {
      icon: Brain,
      title: "Cognitive Reframing",
      subtitle: "Thought Battle Engine",
      description: "Deconstruct negative thoughts, identify cognitive distortions, and build balanced perspective reframes.",
      color: "text-[#57f1db]",
      bgColor: "bg-[#57f1db]/10",
      borderColor: "border-[#57f1db]/20",
    },
    {
      icon: Activity,
      title: "Mood & Anxiety Tracking",
      subtitle: "Daily Emotional Anchor",
      description: "Log anxiety intensity, physical sensations, and triggers to discover trends over time.",
      color: "text-[#cebdff]",
      bgColor: "bg-[#cebdff]/10",
      borderColor: "border-[#cebdff]/20",
    },
    {
      icon: Compass,
      title: "Step Exposure Missions",
      subtitle: "Gradual Growth",
      description: "Conquer social and situational fears step-by-step with guided pre- and post-reflections.",
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      icon: HeartHandshake,
      title: "Calm Now Toolkit",
      subtitle: "Emergency Grounding",
      description: "Access 4-7-8 breathing exercises, 5-4-3-2-1 sensory grounding, and emergency support.",
      color: "text-rose-400",
      bgColor: "bg-rose-400/10",
      borderColor: "border-rose-400/20",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] bg-[#090d16] text-slate-100 flex flex-col justify-between overflow-y-auto"
      >
        {/* Ambient Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#57f1db]/5 via-transparent to-[#cebdff]/5 pointer-events-none" />
        
        {/* Top Header Bar */}
        <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <MindsyncLogo iconSize={32} showSlogan={true} textSize="sm" />
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#57f1db]" />
            <span>100% Private & Local</span>
          </div>
        </header>

        {/* Hero Content Section */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-4 flex-1 flex flex-col justify-center space-y-10">
          
          {/* Main Title & Subtitle */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#57f1db]/10 border border-[#57f1db]/30 text-[#57f1db] text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Anxiety & Cognitive Reframing Companion</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
            >
              Welcome to <span className="bg-gradient-to-r from-[#57f1db] to-cyan-400 bg-clip-text text-transparent">Mindsync</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal"
            >
              Transform your mental wellbeing with evidence-based CBT tools, structured exposure challenges, and grounding techniques designed to reduce anxiety and calm your nervous system.
            </motion.p>
          </div>

          {/* Grid of Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl transition-all flex items-start gap-4 group"
                >
                  <div className={`p-3 rounded-xl ${feat.bgColor} ${feat.color} ${feat.borderColor} border shrink-0`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white group-hover:text-[#57f1db] transition-colors">
                        {feat.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                        {feat.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Bottom Action CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center space-y-4 pt-2"
          >
            <button
              onClick={() => onEnterApp(dontShowAgain)}
              className="w-full max-w-md py-4 px-8 bg-gradient-to-r from-[#57f1db] via-teal-400 to-cyan-500 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-[#57f1db]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-3 group"
            >
              <span>Get Started & Open Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#57f1db] focus:ring-0 cursor-pointer"
              />
              <span>Don't show this welcome screen again on startup</span>
            </label>
          </motion.div>
        </main>

        {/* Footer info */}
        <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-900">
          <p>Mindsync Cognitive & Emotional Health Companion • Evidence-Based CBT Framework</p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
