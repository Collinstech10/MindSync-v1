import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Music,
  Youtube,
  Play,
  Volume2,
  Award,
  HelpCircle,
  X,
  ExternalLink,
  Calendar
} from "lucide-react";

interface ExhibitionSong {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  contributor: string;
  category: string;
  description: string;
  createdAt: string;
}

// These are the hardcoded exhibition songs. 
// You can directly edit, swap, or add your YouTube URLs and video IDs here!
const DEFAULT_SONGS: ExhibitionSong[] = [
  {
    id: "song_temi_1",
    title: "Fine Girl Energy | Nigerian Afropop Love Song",
    youtubeUrl: "https://youtu.be/W5N9xftghjY",
    videoId: "W5N9xftghjY",
    contributor: "TEMI JOHNSON AYOBAMIDELE ENIOLA",
    category: "Afropop / Afrobeat",
    description: "An absolute banger! 'Fine Girl Energy' is a vibrant, melodic Nigerian Afropop love song created by Temi Johnson. Driven by infectious syncopated drums, brilliant rhythm guitars, and extremely catchy, warm, romantic melodies, this track brings ultimate positive energy and creative musical excellence to our group exhibition stage.",
    createdAt: "2026-07-12T07:40:00.000Z"
  }
];

export default function ExhibitionSongsView() {
  const [songs] = useState<ExhibitionSong[]>(DEFAULT_SONGS);
  const [activeSong, setActiveSong] = useState<ExhibitionSong | null>(DEFAULT_SONGS[0] || null);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-10 animate-fade-in text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-[#57f1db]/10 text-[#57f1db] border border-[#57f1db]/20">
              <Youtube className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#cebdff] font-extrabold">
              Personal Creative Stage
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mt-1">
            Group Songs.
          </h1>
          <p className="text-lg font-medium text-[#57f1db] mt-1">
            "Our Group's Personal Music & Creative Tracks"
          </p>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
            A dedicated presentation stage for our personal music releases and creative tracks (like Afrobeat and more) posted on YouTube. Play them live during the exhibition to showcase our team's creative talents.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="px-4 py-2.5 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
            title="Help & Presentation Tips"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Exhibition Guide</span>
          </button>
        </div>
      </div>

      {/* Exhibition Help / Guideline Banner */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-3xl bg-[#0b0f19]/80 border border-cyan-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3">
              <button 
                onClick={() => setShowHelp(false)}
                className="text-slate-500 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-cyan-500/10 rounded-2xl text-[#57f1db] border border-cyan-500/20 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Exhibition & Presentation Tips
                  <span className="text-[10px] bg-cyan-500/20 text-[#57f1db] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                    Tips
                  </span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  During your group presentation, you can use this tab to showcase your creative releases and songs (like Afrobeat) posted on YouTube:
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong className="text-slate-200">Live Listening:</strong> Click any song to load it on the main stage. You can listen directly or hit the YouTube external link to open it in a new window.</li>
                  <li><strong className="text-slate-200">Direct Customization:</strong> To change the video links or add more songs, you can easily edit the <code className="text-[#57f1db]">DEFAULT_SONGS</code> list in this file!</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Exhibition Player Stage */}
      {activeSong ? (
        <div className="grid grid-cols-12 gap-8">
          {/* Active Player (Left/Top) */}
          <div className="col-span-12 lg:col-span-8 space-y-5">
            <div className="bg-[#0b0f19]/40 border border-slate-800/80 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
              {/* YouTube Responsive Video Container */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 relative shadow-inner">
                <iframe
                  src={`https://www.youtube.com/embed/${activeSong.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={activeSong.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Contributor Metas */}
              <div className="mt-5 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#57f1db]/10 border border-[#57f1db]/20 text-[#57f1db]">
                      {activeSong.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(activeSong.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight group-hover:text-[#57f1db] transition-colors">
                    {activeSong.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-500/70" />
                    <span className="text-slate-500 uppercase font-bold text-[9px] tracking-widest">Release By:</span>
                    <span className="font-extrabold text-slate-300">{activeSong.contributor}</span>
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={activeSong.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Watch on YouTube</span>
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-800/40 my-4" />

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-extrabold text-slate-500 uppercase tracking-widest">
                  Song Concept & Story
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {activeSong.description}
                </p>
              </div>
            </div>
          </div>

          {/* Exhibition Song List (Right/Bottom) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-extrabold text-slate-500 uppercase tracking-widest pl-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-500/70" />
              <span>Available Creative Songs ({songs.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {songs.map((song) => {
                const isActive = activeSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => setActiveSong(song)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-3 ${
                      isActive
                        ? "bg-[#57f1db]/5 border-[#57f1db]/40 shadow-lg shadow-[#57f1db]/5"
                        : "bg-[#0b0f19]/50 border-slate-800/80 hover:bg-slate-900/30 hover:border-slate-700/60"
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        {/* Fake Thumbnail style */}
                        <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                          {isActive ? (
                            <Volume2 className="w-5 h-5 text-[#57f1db] animate-pulse" />
                          ) : (
                            <Play className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-extrabold uppercase">
                          {song.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-white truncate mt-1 group-hover:text-[#57f1db] transition-colors">
                          {song.title}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                          {song.contributor}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row Controls */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-900/50 text-[10px] font-mono">
                      <span className="text-slate-500">
                        YouTube ID: {song.videoId}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0b0f19]/30 border border-slate-800/80 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <Music className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Exhibition Songs Yet</h3>
          <p className="text-sm text-slate-400">
            Edit the <code className="text-[#57f1db]">DEFAULT_SONGS</code> list in this file to display your tracks!
          </p>
        </div>
      )}
    </div>
  );
}
