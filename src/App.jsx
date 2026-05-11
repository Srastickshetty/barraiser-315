import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  CheckCircle2, Circle, LayoutDashboard, Search, Trophy, ExternalLink, 
  Flame, Zap, Target, Code, Settings, Clock, Shuffle, TrendingUp, 
  Layers, Activity, Cpu, ShieldCheck, Calendar, Command, GitBranch, 
  Box, Hash, Database, Grid, Terminal, Share2, AlertCircle, Bookmark,
  Loader2
} from 'lucide-react';

// --- YOUR FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBfT4EmIYLJM5Hzs4KZwTSrK4fDsO-g3uc",
  authDomain: "dsa-prep-4f524.firebaseapp.com",
  projectId: "dsa-prep-4f524",
  storageBucket: "dsa-prep-4f524.firebasestorage.app",
  messagingSenderId: "1032227986084",
  appId: "1:1032227986084:web:8039884d6b4348902e2431",
  measurementId: "G-E2L0BF91KJ"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'barraiser-300'; // Unique ID for your app's data namespace

// --- DATASET ---
const CATEGORIES = [
  {
    id: "ARRAYS",
    name: "Arrays & Sliding Window",
    icon: <Cpu size={18} />,
    color: "from-blue-500 to-cyan-500",
    priority: "🔴 MUST DO",
    patterns: [
      {
        name: "Sliding Window & Pointers",
        problems: [
          { id: 3, name: "Longest Substring Without Repeating Characters", lc: 3, diff: 'Med', freq: 1 },
          { id: 11, name: "Container With Most Water", lc: 11, diff: 'Med', freq: 1 },
          { id: 15, name: "3Sum", lc: 15, diff: 'Med', freq: 1 },
          { id: 42, name: "Trapping Rain Water", lc: 42, diff: 'Hard', freq: 1 },
          { id: 76, name: "Minimum Window Substring", lc: 76, diff: 'Hard', freq: 1 },
          { id: 239, name: "Sliding Window Maximum", lc: 239, diff: 'Hard', freq: 1 },
          { id: 567, name: "Permutation in String", lc: 567, diff: 'Med', freq: 2 },
          { id: 424, name: "Longest Repeating Character Replacement", lc: 424, diff: 'Med', freq: 2 },
          { id: 438, name: "Find All Anagrams in a String", lc: 438, diff: 'Med', freq: 2 },
          { id: 209, name: "Minimum Size Subarray Sum", lc: 209, diff: 'Med', freq: 3 },
          { id: 18, name: "4Sum", lc: 18, diff: 'Med', freq: 3 }
        ]
      },
      {
        name: "Prefix Sum & Hashing",
        problems: [
          { id: 560, name: "Subarray Sum Equals K", lc: 560, diff: 'Med', freq: 1 },
          { id: 523, name: "Continuous Subarray Sum", lc: 523, diff: 'Med', freq: 2 },
          { id: 930, name: "Binary Subarrays With Sum", lc: 930, diff: 'Med', freq: 3 },
          { id: 974, name: "Subarray Sums Divisible by K", lc: 974, diff: 'Med', freq: 3 },
          { id: 1248, name: "Count Number of Nice Subarrays", lc: 1248, diff: 'Med', freq: 3 },
          { id: 303, name: "Range Sum Query", lc: 303, diff: 'Easy', freq: 0 }
        ]
      },
      {
        name: "Array Manipulation",
        problems: [
          { id: 1, name: "Two Sum", lc: 1, diff: 'Easy', freq: 1 },
          { id: 121, name: "Best Time to Buy Stock", lc: 121, diff: 'Easy', freq: 1 },
          { id: 238, name: "Product of Array Except Self", lc: 238, diff: 'Med', freq: 1 },
          { id: 53, name: "Maximum Subarray", lc: 53, diff: 'Med', freq: 1 },
          { id: 128, name: "Longest Consecutive Sequence", lc: 128, diff: 'Med', freq: 2 },
          { id: 189, name: "Rotate Array", lc: 189, diff: 'Med', freq: 2 }
        ]
      }
    ]
  },
  {
    id: "TREES",
    name: "Trees & BST",
    icon: <GitBranch size={18} />,
    color: "from-emerald-500 to-teal-500",
    priority: "🔴 MUST DO",
    patterns: [
      {
        name: "Core Tree Logic",
        problems: [
          { id: 102, name: "Binary Tree Level Order Traversal", lc: 102, diff: 'Med', freq: 1 },
          { id: 236, name: "Lowest Common Ancestor", lc: 236, diff: 'Med', freq: 1 },
          { id: 104, name: "Maximum Depth of Binary Tree", lc: 104, diff: 'Easy', freq: 1 },
          { id: 226, name: "Invert Binary Tree", lc: 226, diff: 'Easy', freq: 2 },
          { id: 543, name: "Diameter of Binary Tree", lc: 543, diff: 'Easy', freq: 1 },
          { id: 124, name: "Binary Tree Max Path Sum", lc: 124, diff: 'Hard', freq: 2 },
          { id: 100, name: "Same Tree", lc: 100, diff: 'Easy', freq: 3 },
          { id: 110, name: "Balanced Binary Tree", lc: 110, diff: 'Easy', freq: 3 },
          { id: 112, name: "Path Sum", lc: 112, diff: 'Easy', freq: 3 }
        ]
      },
      {
        name: "BST Patterns",
        problems: [
          { id: 98, name: "Validate Binary Search Tree", lc: 98, diff: 'Med', freq: 1 },
          { id: 230, name: "Kth Smallest Element in BST", lc: 230, diff: 'Med', freq: 2 },
          { id: 235, name: "LCA of BST", lc: 235, diff: 'Easy', freq: 2 },
          { id: 108, name: "Convert Sorted Array to BST", lc: 108, diff: 'Easy', freq: 3 }
        ]
      }
    ]
  },
  {
    id: "GRAPHS",
    name: "Graphs & Matrix",
    icon: <Hash size={18} />,
    color: "from-red-500 to-rose-500",
    priority: "🔴 MUST DO",
    patterns: [
      {
        name: "BFS / DFS & Cycles",
        problems: [
          { id: 200, name: "Number of Islands", lc: 200, diff: 'Med', freq: 1 },
          { id: 994, name: "Rotting Oranges", lc: 994, diff: 'Med', freq: 1 },
          { id: 207, name: "Course Schedule", lc: 207, diff: 'Med', freq: 1 },
          { id: 210, name: "Course Schedule II", lc: 210, diff: 'Med', freq: 1 },
          { id: 127, name: "Word Ladder", lc: 127, diff: 'Hard', freq: 2 },
          { id: 695, name: "Max Area of Island", lc: 695, diff: 'Med', freq: 2 },
          { id: 133, name: "Clone Graph", lc: 133, diff: 'Med', freq: 3 },
          { id: 733, name: "Flood Fill", lc: 733, diff: 'Easy', freq: 3 }
        ]
      },
      {
        name: "Matrix Manipulation",
        problems: [
          { id: 54, name: "Spiral Matrix", lc: 54, diff: 'Med', freq: 1 },
          { id: 48, name: "Rotate Image", lc: 48, diff: 'Med', freq: 2 },
          { id: 73, name: "Set Matrix Zeroes", lc: 73, diff: 'Med', freq: 3 }
        ]
      }
    ]
  },
  {
    id: "HEAPS",
    name: "Heaps & Priority Queue",
    icon: <Database size={18} />,
    color: "from-amber-500 to-orange-500",
    priority: "🔴 MUST DO",
    patterns: [
      {
        name: "K-Elements Patterns",
        problems: [
          { id: 973, name: "K Closest Points to Origin", lc: 973, diff: 'Med', freq: 1 },
          { id: 23, name: "Merge K Sorted Lists", lc: 23, diff: 'Hard', freq: 1 },
          { id: 215, name: "Kth Largest Element", lc: 215, diff: 'Med', freq: 1 },
          { id: 347, name: "Top K Frequent Elements", lc: 347, diff: 'Med', freq: 2 },
          { id: 295, name: "Find Median from Data Stream", lc: 295, diff: 'Hard', freq: 2 },
          { id: 621, name: "Task Scheduler", lc: 621, diff: 'Med', freq: 2 },
          { id: 692, name: "Top K Frequent Words", lc: 692, diff: 'Med', freq: 1 }
        ]
      }
    ]
  },
  {
    id: "DP",
    name: "Dynamic Programming",
    icon: <Layers size={18} />,
    color: "from-fuchsia-500 to-pink-500",
    priority: "🟡 GOOD TO DO",
    patterns: [
      {
        name: "Classic DP Pattern",
        problems: [
          { id: 139, name: "Word Break", lc: 139, diff: 'Med', freq: 1 },
          { id: 322, name: "Coin Change", lc: 322, diff: 'Med', freq: 1 },
          { id: 70, name: "Climbing Stairs", lc: 70, diff: 'Easy', freq: 2 },
          { id: 300, name: "Longest Increasing Subsequence", lc: 300, diff: 'Med', freq: 2 }
        ]
      }
    ]
  }
];

const STAGES = [
  { id: 'learned', label: 'Learned', color: 'text-blue-400', interval: 0 },
  { id: 'rev1', label: 'Rev 1', color: 'text-indigo-400', interval: 1 },    
  { id: 'rev2', label: 'Rev 2', color: 'text-purple-400', interval: 3 },    
  { id: 'rev3', label: 'Rev 3', color: 'text-orange-400', interval: 7 },    
  { id: 'rev4', label: 'Mastery', color: 'text-emerald-400', interval: 30 }, 
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Authentication Listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Firebase Auth failed. Check if Anonymous Auth is enabled in Console:", err);
        setLoading(false);
      }
    };

    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Sync
  useEffect(() => {
    if (!user) return;
    
    // Path: /artifacts/barraiser-300/users/{uid}/progress/main
    const progressDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'main');
    
    const unsubscribe = onSnapshot(progressDoc, (docSnap) => {
      if (docSnap.exists()) {
        setUserProgress(docSnap.data().data || {});
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Save Progress to Firestore
  const toggleCheck = async (problemId, stageId) => {
    if (!user) return;

    const now = Date.now();
    const currentProblemData = userProgress[problemId] || {};
    const isChecking = !currentProblemData[stageId];
    
    const updatedProgress = {
      ...userProgress,
      [problemId]: { 
        ...currentProblemData, 
        [stageId]: isChecking ? now : null 
      }
    };

    // Optimistic UI update
    setUserProgress(updatedProgress);

    try {
      const progressDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'progress', 'main');
      await setDoc(progressDoc, { data: updatedProgress }, { merge: true });
    } catch (err) {
      console.error("Failed to save to cloud:", err);
    }
  };

  const isDue = (problemId, stageId) => {
    const data = userProgress[problemId];
    if (!data) return false;
    const stageIdx = STAGES.findIndex(s => s.id === stageId);
    if (stageIdx === 0) return false;
    
    const prevStageId = STAGES[stageIdx - 1].id;
    const prevTime = data[prevStageId];
    if (!prevTime || data[stageId]) return false;

    const intervalMs = STAGES[stageIdx].interval * 24 * 60 * 60 * 1000;
    return Date.now() >= (prevTime + intervalMs);
  };

  const analytics = useMemo(() => {
    let totalCount = 0, learnedCount = 0, masteredCount = 0, dueCount = 0;
    const queue = [];
    const catStats = {};

    CATEGORIES.forEach(cat => {
      let catTotal = 0, catLearned = 0;
      cat.patterns.forEach(pattern => {
        pattern.problems.forEach(p => {
          totalCount++;
          catTotal++;
          const prog = userProgress[p.id] || {};
          if (prog.learned) { learnedCount++; catLearned++; }
          if (prog.rev4) masteredCount++;

          STAGES.forEach(s => {
            if (isDue(p.id, s.id)) {
              dueCount++;
              queue.push({ ...p, stageLabel: s.label, stageId: s.id, cat: cat.name, pattern: pattern.name });
            }
          });
        });
      });
      catStats[cat.id] = { done: catLearned, total: catTotal, percent: Math.round((catLearned / catTotal) * 100) || 0 };
    });

    return { totalCount, learnedCount, masteredCount, dueCount, queue, catStats };
  }, [userProgress]);

  const pickRandom = () => {
    const all = CATEGORIES.flatMap(c => c.patterns.flatMap(p => p.problems));
    const random = all[Math.floor(Math.random() * all.length)];
    window.open(`https://leetcode.com/problems/${random.name.toLowerCase().replace(/ /g, '-')}/`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Initialising Cloud Sync...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-400 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-20 border-r border-zinc-800/40 bg-[#08080a]/80 backdrop-blur-xl flex flex-col items-center py-10 z-50">
        <div className="w-12 h-12 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl mb-12">
          <Zap className="text-white fill-current" size={24} />
        </div>
        <div className="flex flex-col gap-8">
          <NavItem icon={<LayoutDashboard />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} tooltip="Dashboard" />
          <NavItem icon={<Layers />} active={activeTab === 'matrix'} onClick={() => setActiveTab('matrix')} tooltip="The Matrix" />
          <NavItem icon={<TrendingUp />} active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} tooltip="Analytics" />
        </div>
        <div className="mt-auto flex flex-col gap-4 items-center">
          <div className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} title={user ? "Cloud Connected" : "Disconnected"} />
          <NavItem icon={<Shuffle />} onClick={pickRandom} tooltip="Random Grind" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20">
        <div className="max-w-[1400px] mx-auto px-12 py-10">
          
          <header className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight underline decoration-orange-500/30 underline-offset-4">BAR<span className="text-orange-500 italic">RAISER</span>_300</h1>
              <div className="flex items-center gap-2 mt-1 text-zinc-600 font-bold uppercase tracking-widest text-[9px]">
                <ShieldCheck size={11} className="text-orange-500" />
                UID: {user?.uid?.slice(0, 8)}... (Cloud Sync Enabled)
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Mastery</span>
                  <span className="text-xs font-bold text-white">{analytics.learnedCount}/{analytics.totalCount}</span>
               </div>
               <div className="w-[100px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-700" style={{ width: `${(analytics.learnedCount/analytics.totalCount)*100}%` }} />
               </div>
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Due for Revision" value={analytics.dueCount} sub="High Priority" color="text-orange-500" icon={<Clock size={20} />} />
                <StatCard label="Mastered" value={analytics.masteredCount} sub="Phase 4" color="text-emerald-500" icon={<Trophy size={20} />} />
                <StatCard label="First Pass" value={analytics.learnedCount} sub="Completed" color="text-blue-500" icon={<Flame size={20} />} />
                <StatCard label="Connection" value={user ? "Live" : "Offline"} sub="Persistent" color="text-purple-500" icon={<Activity size={20} />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-8">
                      <Target className="text-orange-500" size={20} /> Priority Revisions
                    </h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {analytics.queue.length > 0 ? analytics.queue.map((p, idx) => (
                        <div key={idx} className="group flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:border-orange-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center font-mono text-[10px]">#{p.lc}</div>
                            <div>
                              <h4 className="font-bold text-white text-sm">{p.name}</h4>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase">{p.cat} • {p.pattern}</p>
                            </div>
                          </div>
                          <button onClick={() => toggleCheck(p.id, p.stageId)} className="px-4 py-2 bg-orange-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-orange-600 transition-all active:scale-95">
                            Complete {p.stageLabel}
                          </button>
                        </div>
                      )) : (
                        <div className="h-40 flex flex-col items-center justify-center opacity-30 italic text-sm">
                          No pending revisions in the cloud.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-8">
                   <h3 className="text-lg font-bold text-white mb-6 underline decoration-orange-500/50 underline-offset-8">Category Strength</h3>
                   <div className="space-y-6">
                      {CATEGORIES.map(cat => (
                        <div key={cat.id}>
                           <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase mb-2">
                              <span>{cat.name}</span>
                              <span>{analytics.catStats[cat.id]?.percent}%</span>
                           </div>
                           <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r transition-all duration-1000 ${cat.color}`} style={{ width: `${analytics.catStats[cat.id]?.percent}%` }} />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all border ${selectedCat === cat.id ? 'bg-white text-black border-white font-black' : 'bg-zinc-900/40 text-zinc-500 border-zinc-800/50 hover:text-zinc-300'}`}>
                    {cat.icon} <span className="text-[10px] uppercase tracking-widest">{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {CATEGORIES.find(c => c.id === selectedCat).patterns.map((pattern, pIdx) => (
                  <div key={pIdx} className="bg-zinc-900/10 border border-zinc-800/40 rounded-[2rem] overflow-hidden">
                    <div className="p-6 border-b border-zinc-800/30 flex items-center justify-between">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">{pattern.name}</h3>
                      <span className="text-[10px] font-bold text-zinc-600">{pattern.problems.length} Units</span>
                    </div>
                    <div className="divide-y divide-zinc-800/20">
                      {pattern.problems.map(p => (
                        <div key={p.id} className="p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#0a0a0c] border border-zinc-800/50 flex items-center justify-center font-mono text-[9px] group-hover:text-orange-500 transition-colors">#{p.lc}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-zinc-200 text-sm group-hover:text-white transition-colors">{p.name}</h4>
                                <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border ${p.diff === 'Hard' ? 'text-rose-500 border-rose-500/20' : p.diff === 'Med' ? 'text-amber-500 border-amber-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>{p.diff}</span>
                                
                                {p.freq === 1 && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded border text-red-500 border-red-500/20 bg-red-500/5">AMZ: HIGH</span>}
                                {p.freq === 2 && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded border text-yellow-500 border-yellow-500/20 bg-yellow-500/5">AMZ: MED</span>}
                                {p.freq === 3 && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded border text-emerald-500 border-emerald-500/20 bg-emerald-500/5">AMZ: LOW</span>}
                              </div>
                              <a href={`https://leetcode.com/problems/${p.name.toLowerCase().replace(/ /g, '-')}/`} target="_blank" className="text-[9px] text-zinc-600 flex items-center gap-1 mt-1 hover:text-zinc-400"><ExternalLink size={8} /> LeetCode</a>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {STAGES.map(s => (
                              <button key={s.id} onClick={() => toggleCheck(p.id, s.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${userProgress[p.id]?.[s.id] ? s.color + ' bg-zinc-800/40' : isDue(p.id, s.id) ? 'text-orange-500 bg-orange-500/10 animate-pulse' : 'text-zinc-800 hover:text-zinc-600 hover:bg-zinc-800/20'}`}>
                                {userProgress[p.id]?.[s.id] ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
              <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-10">
                <h3 className="text-xl font-bold text-white mb-8">Detailed Mastery</h3>
                <div className="space-y-6">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id}>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-zinc-400">{cat.name}</span>
                        <span className="text-zinc-600">{analytics.catStats[cat.id]?.done} / {analytics.catStats[cat.id]?.total}</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${cat.color}`} style={{ width: `${analytics.catStats[cat.id]?.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-3xl p-10 flex flex-col items-center justify-center">
                 <div className="text-center">
                    <p className="text-5xl font-black text-white">{Math.round((analytics.learnedCount / analytics.totalCount) * 100) || 0}%</p>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Overall Progress</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}} />
    </div>
  );
}

function NavItem({ icon, active, onClick, tooltip }) {
  return (
    <button onClick={onClick} className={`p-3 rounded-xl transition-all relative group ${active ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-zinc-300'}`}>
      {React.cloneElement(icon, { size: 20 })}
      <span className="absolute left-16 bg-white text-black text-[10px] font-black uppercase px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-[100]">{tooltip}</span>
    </button>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-3xl backdrop-blur-sm">
      <div className="mb-4 text-zinc-500">{icon}</div>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${color} tracking-tighter`}>{value}</span>
        <span className="text-[10px] font-bold text-zinc-700">{sub}</span>
      </div>
    </div>
  );
}