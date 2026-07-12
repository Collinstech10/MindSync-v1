import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  User, 
  Award, 
  Star, 
  Search, 
  Mail, 
  Phone, 
  Globe, 
  BookOpen, 
  FileText, 
  Grid, 
  List, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from "lucide-react";

interface GroupMember {
  sn: number;
  fullName: string;
  matricNo: string;
  programme: string;
  phone: string;
  email: string;
  domainName: string;
  contribution: string;
  roleBadge?: string;
  colorTheme: string; // Tailwind tint class
  imageUrl?: string;
}

const MEMBERS_DATA: GroupMember[] = [
  {
    sn: 1,
    fullName: "TEMI JOHNSON AYOBAMIDELE ENIOLA",
    matricNo: "CSC/2024/015",
    programme: "COMPUTER SCIENCE",
    phone: "08134717670",
    email: "eniolaayobamidele0@gmail.com",
    domainName: "Stackverse.com.ng",
    contribution: "He served as our lead tech support, engineered the core application, resolved bugs, and guided all group members on the end-to-end steps of creating and operating this app.",
    roleBadge: "Tech Support & Lead Developer",
    colorTheme: "from-cyan-500/20 to-teal-500/10 border-cyan-500/40 text-[#57f1db]",
  },
  {
    sn: 2,
    fullName: "CHIJIOKE IJEOMA FAVOUR",
    matricNo: "NSC/2024/012",
    programme: "NURSING",
    phone: "08068893844",
    email: "chijiokefavour631@gmail.com",
    domainName: "Ijeomaaccessories.com.ng",
    contribution: "Crafted the optimal prompt sequence, managed edits in the Google AI Studio environment, and meticulously supervised the assignment of roles and project lifecycle workflow.",
    roleBadge: "Prompter & Project Supervisor",
    colorTheme: "from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-[#cebdff]",
  },
  {
    sn: 3,
    fullName: "ILORI FAVOUR IBUKUNOLUWA",
    matricNo: "CYB/2024/006",
    programme: "CYBER SECURITY",
    phone: "07057547753",
    email: "favourilori312@gmail.com",
    domainName: "InfiTech.com.ng",
    contribution: "As the group leader, he was playing with girls.",
    roleBadge: "Group Leader",
    colorTheme: "from-blue-500/20 to-slate-500/10 border-blue-500/40 text-blue-400",
  },
  {
    sn: 4,
    fullName: "ODERINDE MARY OLUWAPELUMI",
    matricNo: "PBH/2024/013",
    programme: "PUBLIC HEALTH",
    phone: "09030992497",
    email: "oluwapelumimary58@gmail.com",
    domainName: "Folliscience.com.ng",
    contribution: "Generated structured domain prompts, remained highly active throughout the creation pipeline, and led initial alpha testing sessions to deliver critical functional feedback.",
    roleBadge: "Primary Tester & Prompt Designer",
    colorTheme: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400",
  },
  {
    sn: 5,
    fullName: "BODURIN ODUNAYO VICTORIA",
    matricNo: "NSC/2024/080",
    programme: "NURSING",
    phone: "09014726779",
    email: "odunayobodunrin1@gmail.com",
    domainName: "Presynabespublishers.com.ng",
    contribution: "Formulated creative design ideas, actively participated in group brainstorms, and successfully identified core post-launch workflow issues for adjustment.",
    roleBadge: "QA & Concept Innovator",
    colorTheme: "from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400",
  },
  {
    sn: 6,
    fullName: "ONYEMAOBI LILIAN CHINENYE",
    matricNo: "NSC/2024/058",
    programme: "NURSING",
    phone: "07015987757",
    email: "onyemaobililian813@gmail.com",
    domainName: "OCL cakes& pastries.com.ng",
    contribution: "Formulated and shared specific prompts to support our workflow, and remained fully present throughout the active system development cycle.",
    roleBadge: "Prompt Engineer & Co-Researcher",
    colorTheme: "from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-400",
  },
  {
    sn: 7,
    fullName: "OMILABU INIOLUWA JOSEPHINE",
    matricNo: "PBH/2024/006",
    programme: "PUBLIC HEALTH",
    phone: "09167592135",
    email: "ayomidejosephine2007@gmail.com",
    domainName: "HeritageNaturals.org.ng",
    contribution: "Contributed highly structured prompt files, assisted with documentation guidelines, and stayed engaged throughout the step-by-step creation phase.",
    roleBadge: "Prompt Architect & Auditor",
    colorTheme: "from-indigo-500/20 to-purple-500/10 border-indigo-500/40 text-indigo-400",
  },
  {
    sn: 8,
    fullName: "OKEKE MICHAEL METUMARIBE",
    matricNo: "CSC/2024/032",
    programme: "COMPUTER STUDENT",
    phone: "08183989394",
    email: "okekemetu15@gmail.com",
    domainName: "Nova-tech.com.ng",
    contribution: "Generated functional instructions, facilitated technical reviews, and helped isolate and resolve interface problems during app design.",
    roleBadge: "Technical QA & Prompter",
    colorTheme: "from-violet-500/20 to-purple-500/10 border-violet-500/40 text-violet-400",
  },
  {
    sn: 9,
    fullName: "PEPEOLUWA OLUWADARA OYENEYE",
    matricNo: "ACC/2024/008",
    programme: "ACCOUNTING",
    phone: "09015500273",
    email: "pepeoluwaoyeneye@gmail.com",
    domainName: "Maison.com.ng",
    contribution: "Authored structured system prompts, aligned group materials, and took complete ownership of designing the presentation slide deck explaining the app creation process.",
    roleBadge: "Slide Deck Architect & Prompter",
    colorTheme: "from-teal-500/20 to-emerald-500/10 border-teal-500/40 text-teal-400",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

export default function AboutUsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProgramme, setSelectedProgramme] = useState<string>("All");

  const programmes = useMemo(() => {
    const list = new Set(MEMBERS_DATA.map(m => m.programme));
    return ["All", ...Array.from(list)];
  }, []);

  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter((member) => {
      const matchesSearch = 
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.domainName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProgramme = 
        selectedProgramme === "All" || member.programme === selectedProgramme;

      return matchesSearch && matchesProgramme;
    });
  }, [searchTerm, selectedProgramme]);

  // Statistics summaries
  const stats = useMemo(() => {
    return {
      total: MEMBERS_DATA.length,
      programmesCount: new Set(MEMBERS_DATA.map(m => m.programme)).size,
      domainsCount: MEMBERS_DATA.filter(m => m.domainName).length,
    };
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Editorial Header */}
      <motion.div variants={cardVariants} className="text-center max-w-2xl mx-auto py-4 space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#57f1db] font-extrabold px-3 py-1 bg-[#57f1db]/10 rounded-full">
          Academic Group Directory
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
          GST 206 ANXIETY GROUP MEMBERS
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          The collaborative minds behind this clinical companion app. Spearheading structured prompts, system bug fixes, and presentation deliverables.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full mt-4" />
      </motion.div>

      {/* Stats Bento Overview */}
      <motion.div 
        variants={cardVariants} 
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-[#57f1db]/5 rounded-full blur-xl group-hover:bg-[#57f1db]/10 transition-colors" />
          <div className="p-3 bg-cyan-500/10 text-[#57f1db] rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Members</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-[#cebdff]/5 rounded-full blur-xl group-hover:bg-[#cebdff]/10 transition-colors" />
          <div className="p-3 bg-purple-500/10 text-[#cebdff] rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.programmesCount}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Academic Fields</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.domainsCount}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Group Domains</div>
          </div>
        </div>
      </motion.div>

      {/* Control Panel (Search, Filter, View Toggles) */}
      <motion.div 
        variants={cardVariants}
        className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-950/40 border border-slate-800/75 p-4 rounded-2xl"
      >
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, matric no, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#57f1db] focus:border-[#57f1db] transition-colors"
            />
          </div>

          {/* Programme Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold whitespace-nowrap">Filter:</span>
            <select
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#57f1db]"
            >
              {programmes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 border border-slate-800/80 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "grid" 
                ? "bg-[#57f1db]/10 text-[#57f1db]" 
                : "text-slate-500 hover:text-slate-300"
            }`}
            title="Card View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "table" 
                ? "bg-[#57f1db]/10 text-[#57f1db]" 
                : "text-slate-500 hover:text-slate-300"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Grid View Content */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMembers.map((member, index) => {
              const isKeyRank = member.sn <= 2;
              return (
                <motion.div
                  key={member.matricNo}
                  variants={cardVariants}
                  whileHover={{ y: -5, borderColor: isKeyRank ? "rgba(87, 241, 219, 0.45)" : "rgba(87, 241, 219, 0.2)" }}
                  className={`bg-[#0b0f19]/60 border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all shadow-xl group ${
                    isKeyRank 
                      ? "border-[#57f1db]/30 bg-gradient-to-br from-[#0e1627]/80 to-[#070b13]/80" 
                      : "border-slate-800/80"
                  }`}
                >
                  {/* Visual Background Glow for key members */}
                  {isKeyRank && (
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none" />
                  )}

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {member.imageUrl ? (
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-700/80 shrink-0 shadow-lg bg-slate-900 flex items-center justify-center">
                            <img 
                              src={member.imageUrl} 
                              alt={member.fullName} 
                              className="w-full h-full object-cover object-top"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${member.colorTheme} border shrink-0 flex items-center justify-center`}>
                            {isKeyRank ? <Star className="w-5 h-5 fill-current" /> : <User className="w-5 h-5" />}
                          </div>
                        )}
                        <div>
                          <div className="text-[10px] font-mono text-slate-500 font-extrabold uppercase tracking-widest">
                            S/N {member.sn}
                          </div>
                          <div className="text-xs font-mono text-slate-400 font-bold">
                            {member.matricNo}
                          </div>
                        </div>
                      </div>

                      {member.roleBadge && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border tracking-wider font-extrabold uppercase ${member.colorTheme}`}>
                          {member.roleBadge}
                        </span>
                      )}
                    </div>

                    {/* Member Name */}
                    <div>
                      <h4 className="text-base font-black text-white tracking-tight group-hover:text-[#57f1db] transition-colors">
                        {member.fullName}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide mt-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        {member.programme}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-800/60" />

                    {/* Contribution */}
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block mb-1">
                        PROJECT CONTRIBUTION
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans min-h-[5rem]">
                        {member.contribution}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info Footer Panel */}
                  <div className="mt-6 pt-4 border-t border-slate-900/80 space-y-2 text-[11px] font-mono text-slate-400">
                    <div className="grid grid-cols-1 gap-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 hover:text-[#57f1db] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </a>
                      
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-2 hover:text-[#57f1db] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span>{member.phone}</span>
                      </a>
                    </div>

                    {member.domainName && (
                      <div className="flex items-center gap-2 text-[#57f1db]/90 hover:text-white transition-all pt-1 border-t border-slate-900/40">
                        <Globe className="w-3.5 h-3.5 text-[#57f1db]/40 shrink-0" />
                        <span className="truncate font-semibold">{member.domainName}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[#57f1db]/60 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {filteredMembers.length === 0 && (
              <div className="col-span-full text-center py-12 bg-slate-900/20 rounded-3xl border border-slate-800/60">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-mono">No group members match your search criteria.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* Table View Content */
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/30 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                    <th className="py-4 px-6 font-bold w-16">S/N</th>
                    <th className="py-4 px-6 font-bold">Full Name</th>
                    <th className="py-4 px-6 font-bold">Matric No</th>
                    <th className="py-4 px-6 font-bold">Programme</th>
                    <th className="py-4 px-6 font-bold">Contact Info</th>
                    <th className="py-4 px-6 font-bold">Domain Portfolio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMembers.map((member) => (
                    <tr 
                      key={member.matricNo}
                      className="hover:bg-slate-900/30 transition-colors text-xs text-slate-300"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-slate-500">{member.sn}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-white flex items-center gap-2">
                          {member.imageUrl && (
                            <img 
                              src={member.imageUrl} 
                              alt={member.fullName} 
                              className="w-10 h-10 rounded-full object-cover object-top border border-slate-700/80 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {member.fullName}
                          {member.sn <= 2 && (
                            <span className="w-1.5 h-1.5 bg-[#57f1db] rounded-full animate-pulse" />
                          )}
                        </div>
                        {member.roleBadge && (
                          <div className="text-[10px] font-mono text-[#57f1db] mt-0.5 font-semibold">
                            {member.roleBadge}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">{member.matricNo}</td>
                      <td className="py-4 px-6 font-mono text-slate-400 text-[11px]">{member.programme}</td>
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-slate-600" />
                          <a href={`mailto:${member.email}`} className="hover:text-[#57f1db]">{member.email}</a>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-slate-600" />
                          <a href={`tel:${member.phone}`} className="hover:text-[#57f1db]">{member.phone}</a>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {member.domainName ? (
                          <div className="flex items-center gap-1.5 text-[#57f1db] font-mono text-[11px]">
                            <Globe className="w-3 h-3 text-[#57f1db]/50" />
                            <span>{member.domainName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500 font-mono text-xs">
                        No group members match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class/Course Context Card */}
      <motion.div 
        variants={cardVariants}
        className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">GST 206 Academic Context</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
              This system was conceptualized and engineered specifically as part of the GST 206 practical showcase. All prompts, code reviews, presentation slides, and user validation cycles were fully delivered under course guidelines.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#57f1db]/10 text-[#57f1db] border border-[#57f1db]/20 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Practical Evaluation A+</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
