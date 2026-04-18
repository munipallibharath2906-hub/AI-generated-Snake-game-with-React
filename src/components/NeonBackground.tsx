import React from 'react';

const NeonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden select-none pointer-events-none">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00ffff 1px, transparent 1px),
            linear-gradient(to bottom, #00ffff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Dynamic Scanlines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-1 bg-[#ff00ff] animate-[scanline_4s_linear_infinite]" />
        <div className="w-full h-1 bg-[#00ffff] animate-[scanline_6s_linear_infinite_reverse]" />
      </div>

      {/* Large Glitch Blocks */}
      <div className="absolute top-[10%] left-[5%] w-32 h-64 bg-[#ff00ff]/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-64 h-32 bg-[#00ffff]/5 blur-3xl animate-pulse delay-700" />
      
      {/* CRT Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
    </div>
  );
};

export default NeonBackground;

