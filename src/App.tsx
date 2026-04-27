import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, Database, Activity, LayoutGrid, Music } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden flex flex-col p-6">
      {/* Header Navigation */}
      <header className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm shadow-[0_0_10px_#06b6d4] flex items-center justify-center">
            <Terminal className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">SynthGrid <span className="text-cyan-400">v2.0</span></h1>
        </div>
        <div className="flex gap-6 text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest leading-none">
          <span className="flex items-center gap-2">Status: <span className="text-green-400">Online</span></span>
          <span>Latency: 12ms</span>
          <span>Session: 00:42:15</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar: Audio Context */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 bg-zinc-900/50 border border-white/5 p-4 rounded-lg">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Neural Audio Stream</div>
          <MusicPlayer viewOnlyList />
          
          <div className="mt-auto hidden lg:block">
            <div className="h-24 w-full bg-gradient-to-t from-cyan-500/10 to-transparent rounded-lg flex items-center justify-center border border-white/5">
              <div className="flex gap-1 items-end h-8">
                {[...Array(5)].map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={{ height: [12, Math.random() * 32 + 8, 12] }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                    className="w-1 bg-cyan-400/60" 
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Snake Game Window */}
        <main className="flex-1 flex flex-col items-center justify-center bg-black rounded-xl border-2 border-cyan-500/20 relative shadow-[0_0_50px_rgba(6,182,212,0.05)] py-12 px-4 min-h-[500px]">
          <div className="absolute top-4 left-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">SYSTEM.GAME_ENGINE.ACTIVE</div>
          <div className="absolute top-4 right-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">v2.0.01_STABLE</div>
          
          <SnakeGame />

          <div className="mt-8 flex gap-12">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Difficulty</span>
              <span className="text-sm font-bold text-cyan-400 italic tracking-tighter">HARDCORE</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-12 pr-12 border-r">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Graphics</span>
              <span className="text-sm font-bold text-cyan-400 tracking-tighter">NEON_ULTRA</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Frame Sync</span>
              <span className="text-sm font-bold text-cyan-400 tracking-tighter">RENDERED_60.0</span>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Stats & Controls */}
        <aside className="w-full lg:w-72 flex flex-col gap-6">
          <MusicPlayer controlsOnly />

          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-lg flex flex-col gap-4">
             <div className="flex items-center gap-3 text-cyan-400">
               <Activity className="w-4 h-4" />
               <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Diagnostics</h3>
             </div>
             <p className="text-[11px] text-zinc-500 font-mono leading-relaxed uppercase">Neural pathways clear. Input buffer sanitized for keyboard interrupt events.</p>
             <div className="h-[1px] bg-white/5" />
             <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
               <span>MEMORY</span>
               <span className="text-cyan-400">42.4MB / 512MB</span>
             </div>
          </div>
          
          <div className="mt-auto hidden lg:block text-right">
            <div className="text-sm font-bold tracking-widest text-zinc-400 italic uppercase">NEON_PLAYER_OS</div>
            <div className="text-[9px] text-zinc-600 tracking-[0.2em] uppercase mt-1">© 2024 CYBER_DYNAMICS</div>
          </div>
        </aside>
      </div>

      {/* Footer Stats */}
      <footer className="mt-8 flex justify-between items-end h-12 border-t border-white/5 pt-4">
        <div className="text-[9px] text-zinc-500 flex gap-12 font-mono uppercase tracking-widest">
          <div>
            <span className="block text-zinc-600 mb-1">Control Mode</span>
            <span className="text-cyan-400">Arrows_V1</span>
          </div>
          <div>
            <span className="block text-zinc-600 mb-1">Hardware Accel</span>
            <span className="text-cyan-400">NV_VULKAN</span>
          </div>
          <div>
            <span className="block text-zinc-600 mb-1">Global Seed</span>
            <span className="text-cyan-400">X7-99-R4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
