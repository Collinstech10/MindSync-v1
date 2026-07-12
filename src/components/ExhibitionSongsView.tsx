import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Music,
  Youtube,
  Plus,
  Trash2,
  Play,
  Volume2,
  BookOpen,
  Sparkles,
  Award,
  Link,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  ExternalLink,
  FileMusic,
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
  lyrics?: string;
  createdAt: string;
}

const DEFAULT_SONGS: ExhibitionSong[] = [];

const GROUP_MEMBERS = [
  "TEMI JOHNSON AYOBAMIDELE ENIOLA",
  "CHIJIOKE IJEOMA FAVOUR",
  "ILORI FAVOUR IBUKUNOLUWA",
  "ODERINDE MARY OLUWAPELUMI",
  "BODURIN ODUNAYO VICTORIA",
  "ONYEMAOBI LILIAN CHINENYE",
  "AZEEZ RUKAYAT OLUWAKEMI",
  "BELLO FAVOUR TITILAYO",
  "OJO OLUWATOFUNMI ELIZABETH"
];

// Helper to extract video ID from various YouTube URL formats
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function ExhibitionSongsView() {
  const [songs, setSongs] = useState<ExhibitionSong[]>([]);
  const [activeSong, setActiveSong] = useState<ExhibitionSong | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedLyrics, setExpandedLyrics] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newContributor, setNewContributor] = useState("");
  const [customContributor, setCustomContributor] = useState("");
  const [newCategory, setNewCategory] = useState("Afrobeat");
  const [newDescription, setNewDescription] = useState("");
  const [newLyrics, setNewLyrics] = useState("");
  const [formError, setFormError] = useState("");

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mindsync_exhibition_songs");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clean out any old mock songs (like song_1, song_2, song_3) to start with a fresh personal empty list
        const containsOldMock = parsed.some((s: any) => s.id === "song_1" || s.id === "song_2" || s.id === "song_3");
        if (containsOldMock) {
          setSongs([]);
          localStorage.setItem("mindsync_exhibition_songs", JSON.stringify([]));
          setActiveSong(null);
        } else {
          setSongs(parsed);
          if (parsed.length > 0) {
            setActiveSong(parsed[0]);
          } else {
            setActiveSong(null);
          }
        }
      } else {
        setSongs([]);
        localStorage.setItem("mindsync_exhibition_songs", JSON.stringify([]));
        setActiveSong(null);
      }
    } catch (err) {
      console.error("Failed to load exhibition songs:", err);
      setSongs([]);
      setActiveSong(null);
    }
  }, []);

  const saveSongs = (updatedSongs: ExhibitionSong[]) => {
    setSongs(updatedSongs);
    try {
      localStorage.setItem("mindsync_exhibition_songs", JSON.stringify(updatedSongs));
    } catch (err) {
      console.error("Failed to save exhibition songs:", err);
    }
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newTitle.trim()) {
      setFormError("Song title is required.");
      return;
    }

    const videoId = extractYouTubeId(newUrl);
    if (!videoId) {
      setFormError("Invalid YouTube URL. Please enter a valid YouTube video link (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)");
      return;
    }

    const finalContributor = newContributor === "custom" ? customContributor : newContributor;
    if (!finalContributor.trim()) {
      setFormError("Please select or enter a contributor name.");
      return;
    }

    const newSong: ExhibitionSong = {
      id: "song_" + Date.now(),
      title: newTitle.trim(),
      youtubeUrl: newUrl.trim(),
      videoId,
      contributor: finalContributor.trim(),
      category: newCategory,
      description: newDescription.trim() || "A personal exhibition sound track.",
      lyrics: newLyrics.trim() || "[Instrumental Sound Track]",
      createdAt: new Date().toISOString()
    };

    const updated = [newSong, ...songs];
    saveSongs(updated);
    setActiveSong(newSong);

    // Reset Form
    setNewTitle("");
    setNewUrl("");
    setNewContributor("");
    setCustomContributor("");
    setNewCategory("Afrobeat");
    setNewDescription("");
    setNewLyrics("");
    setShowAddForm(false);
  };

  const handleDeleteSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this exhibition song?")) return;

    const updated = songs.filter(s => s.id !== id);
    saveSongs(updated);

    if (activeSong?.id === id) {
      setActiveSong(updated.length > 0 ? updated[0] : null);
    }
  };

  const toggleLyrics = (id: string) => {
    if (expandedLyrics === id) {
      setExpandedLyrics(null);
    } else {
      setExpandedLyrics(id);
    }
  };

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
              Group Exhibition Feature
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mt-1">
            Exhibition Songs.
          </h1>
          <p className="text-lg font-medium text-[#57f1db] mt-1">
            "Our Group's Personal Music & Creative Tracks"
          </p>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
            A dedicated presentation stage for our personal music releases and songs (like Afrobeat, Pop, and more) posted on YouTube. Play them live during the exhibition and showcase our creative talents.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-3 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-center"
            title="Help & Presentation Tips"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-[#57f1db] to-[#2dd4bf] text-slate-950 font-black text-sm shadow-lg shadow-[#57f1db]/10 hover:scale-103 transition-transform cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Add YouTube Song</span>
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
                  Exhibition & Presentation Guide
                  <span className="text-[10px] bg-cyan-500/20 text-[#57f1db] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                    Tips
                  </span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  During your group presentation, you can use this tab to showcase the personal creative songs and tracks (Afrobeat, etc.) you have posted on YouTube:
                </p>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong className="text-slate-200">Live Listening:</strong> Click any song to load it on the main stage. Use the native full-screen button inside the YouTube player for a big-screen display.</li>
                  <li><strong className="text-slate-200">Paste Your Real Video:</strong> Copy the YouTube share link of your track, paste it using the <strong className="text-[#57f1db]">"Add YouTube Song"</strong> button, and select the group member who contributed or sang it. It will instantly render and stay stored on this device!</li>
                  <li><strong className="text-slate-200">Scroll Lyrics:</strong> Click <strong className="text-slate-200">"Exhibition Presentation Outline / Lyrics"</strong> below the active track to view song lyrics, timestamps, or fun stories about its production.</li>
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
                    <span className="text-slate-500 uppercase font-bold text-[9px] tracking-widest">Contributed By:</span>
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

            {/* Lyrics Accordion */}
            <div className="bg-[#0b0f19]/30 border border-slate-900/60 rounded-3xl overflow-hidden">
              <button
                onClick={() => toggleLyrics(activeSong.id)}
                className="w-full px-6 py-4 flex justify-between items-center bg-slate-900/20 hover:bg-slate-900/40 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <BookOpen className="w-4.5 h-4.5 text-[#57f1db]/80" />
                  <span>Exhibition Presentation Outline / Lyrics</span>
                </div>
                {expandedLyrics === activeSong.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedLyrics === activeSong.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 border-t border-slate-900/80 bg-[#070b13]/40">
                      <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {activeSong.lyrics || "[No lyrics or presentation outline saved for this song]"}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Exhibition Song List (Right/Bottom) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-extrabold text-slate-500 uppercase tracking-widest pl-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-500/70" />
              <span>Available Exhibition Songs ({songs.length})</span>
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
                      <button
                        onClick={(e) => handleDeleteSong(song.id, e)}
                        className="text-red-500/60 hover:text-red-400 p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Exhibition Song"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0b0f19]/30 border border-slate-800/80 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <FileMusic className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Exhibition Songs Yet</h3>
          <p className="text-sm text-slate-400">
            Start by adding the YouTube link of your personal exhibition songs using the button above. They will stay safely saved in your browser and ready for the presentation!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 rounded-full bg-[#57f1db]/10 text-[#57f1db] border border-[#57f1db]/30 hover:bg-[#57f1db]/20 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Song</span>
          </button>
        </div>
      )}

      {/* Add Song Slide-Over Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-screen bg-[#070b13] border-l border-slate-800 shadow-2xl flex flex-col justify-between"
            >
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#57f1db]" />
                    <h3 className="text-lg font-black text-white">
                      Add YouTube Exhibition Song
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 text-xs text-cyan-400 leading-relaxed">
                  Provide the YouTube link of your personal track. The app will parse the link and embed the player live.
                </div>

                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                    {formError}
                  </div>
                )}

                {/* Form Elements */}
                <form id="add-song-form" onSubmit={handleAddSong} className="space-y-4">
                  {/* YouTube Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-slate-500" />
                      <span>YouTube Video URL *</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://www.youtube.com/watch?v=lFcSrYw-ARY"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db]/30 outline-none text-white font-mono placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Song Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                      Song Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Syncing Hearts - Lofi Grounding Session"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db]/30 outline-none text-white placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Contributor Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span>Led/Contributed By *</span>
                    </label>
                    <select
                      value={newContributor}
                      required
                      onChange={(e) => setNewContributor(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] outline-none text-slate-300 transition-colors"
                    >
                      <option value="">-- Select Member --</option>
                      {GROUP_MEMBERS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                      <option value="custom">Other / Custom Name</option>
                    </select>

                    {newContributor === "custom" && (
                      <input
                        type="text"
                        required
                        placeholder="Enter custom contributor name"
                        value={customContributor}
                        onChange={(e) => setCustomContributor(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db]/30 outline-none text-white placeholder:text-slate-600 transition-colors mt-2"
                      />
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                      Song Category / Genre
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] outline-none text-slate-300 transition-colors"
                    >
                      <option value="Afrobeat">Afrobeat</option>
                      <option value="Pop">Pop</option>
                      <option value="R&B">R&B</option>
                      <option value="Hip-Hop">Hip-Hop</option>
                      <option value="Acoustic / Soul">Acoustic / Soul</option>
                      <option value="Dance / Electronic">Dance / Electronic</option>
                      <option value="Highlife">Highlife</option>
                      <option value="Gospel / Inspirational">Gospel / Inspirational</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Concept Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                      Song Vibe / Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the vibe, style, theme, or behind-the-scenes production of your personal song..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db]/30 outline-none text-white placeholder:text-slate-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Lyrics & Outline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>Lyrics & Timestamps (Optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g.&#10;0:00 - Intro&#10;0:15 - Verse 1: Singing the rhythms of life...&#10;1:00 - Chorus: Fell in love with the Afrobeat..."
                      value={newLyrics}
                      onChange={(e) => setNewLyrics(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-sm focus:border-[#57f1db] focus:ring-1 focus:ring-[#57f1db]/30 outline-none text-white font-mono placeholder:text-slate-600 transition-colors resize-none"
                    />
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-song-form"
                  className="flex-1 py-3 bg-gradient-to-r from-[#57f1db] to-[#2dd4bf] text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-[#57f1db]/5 hover:scale-103 transition-transform cursor-pointer"
                >
                  Save & Play Song
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
