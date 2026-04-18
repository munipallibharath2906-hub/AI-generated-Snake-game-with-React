/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import NeonBackground from './components/NeonBackground';
import { Activity, Cpu, HardDrive, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden font-sans">
      <NeonBackground />
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* SYSTEM HEADER */}
      <header className="w-full h-20 border-b-2 border-[#00ffff] bg-black/80 backdrop-blur-md flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#ff00ff] flex items-center justify-center bg-black/50 rotate-45 shadow-[-4px_4px_0_#00ffff]">
            <Cpu size={24} className="text-[#ff00ff] -rotate-45" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tighter text-[#00ffff] glitch-text" data-text="NEON_PULSE_v.0.99">NEON_PULSE_v.0.99</h1>
            <span className="text-[10px] text-[#ff00ff] font-mono tracking-widest mt-1">S_Y_S_T_E_M: [O_N_L_I_N_E]</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12 font-mono text-[11px] tracking-widest">
           <div className="flex items-center gap-2 text-[#00ffff]">
              <Activity size={14} />
              <span>D_A_T_A_S_T_R_E_A_M</span>
           </div>
           <div className="flex items-center gap-2 text-[#ff00ff]">
              <HardDrive size={14} />
              <span>S_E_C_T_O_R_01</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="px-4 py-2 border-2 border-[#ff00ff] bg-[#ff00ff]/10 text-[#ff00ff] font-bold text-xs shadow-[4px_4px_0_#00ffff]">
              A_U_T_H_E_N_T_I_C_A_T_E_D
           </div>
        </div>
      </header>

      {/* MAIN INTERFACE */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-8 relative z-20 space-y-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl">
          
          {/* SIMULATION_ZONE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyan-magenta-border p-6 bg-black/60 relative"
          >
            <div className="absolute -top-3 -left-3 bg-[#00ffff] text-black px-2 text-[10px] font-bold">Z_O_N_E_00</div>
            <div className="mb-4 flex items-center justify-between w-full font-mono text-[10px] text-[#ff00ff]">
              <span>[S_I_M_U_L_A_T_I_O_N]</span>
              <span className="animate-pulse">_LIVE_FEED</span>
            </div>
            <SnakeGame />
          </motion.div>

          {/* CONTROL_STATION */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-8 w-full max-w-md"
          >
            <div className="magenta-cyan-border p-6 bg-black/60 relative">
               <div className="absolute -top-3 -right-3 bg-[#ff00ff] text-black px-2 text-[10px] font-bold">A_U_D_I_O_L_O_G</div>
               <MusicPlayer />
            </div>

            {/* SYSTEM_INFO */}
            <div className="p-6 border-2 border-[#00ffff]/30 bg-black/40 font-mono space-y-4">
              <h3 className="text-xs text-[#00ffff] border-b border-[#00ffff]/20 pb-2 flex items-center gap-2">
                <ShieldAlert size={14} /> D_I_A_G_N_O_S_T_I_C_S
              </h3>
              <div className="grid grid-cols-1 gap-2 text-[10px]">
                 <div className="flex justify-between">
                    <span className="text-[#ff00ff]">H_U_L_L_I_N_T_E_G_R_I_T_Y</span>
                    <span className="text-[#00ffff]">100%</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[#ff00ff]">G_R_I_D_R_E_S_O_L_U_T_I_O_N</span>
                    <span className="text-[#00ffff]">20x20</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[#ff00ff]">G_L_I_T_C_H_T_O_L_E_R_A_N_C_E</span>
                    <span className="text-[#00ffff]">H_I_G_H</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* SYSTEM FOOTER */}
      <footer className="w-full h-12 border-t-2 border-[#ff00ff] bg-black/80 flex items-center justify-between px-8 text-[9px] font-mono tracking-[0.3em] text-[#00ffff]/50 z-50">
        <div className="flex gap-12">
           <span>T_I_M_E_S_T_A_M_P: {new Date().toLocaleTimeString()}</span>
           <span className="text-[#ff00ff]/50">P_R_O_T_O_C_O_L: R_E_T_R_O__F_U_T_U_R_I_S_T</span>
        </div>
        <div>
           S_Y_S_T_E_M__E_R_R_O_R: [N_O_N_E]
        </div>
      </footer>
    </div>
  );
}


