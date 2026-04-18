import React, { useState, useRef, useEffect } from 'react';
import { TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); } 
      else { audioRef.current.play().catch(e => console.log('Audio play failed:', e)); }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setProgress(0); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };
  const handleTimeUpdate = () => { if (audioRef.current) setProgress(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = time; setProgress(time); }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) audioRef.current.play().catch(e => console.log('Audio play failed:', e));
  }, [currentTrackIndex]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-8 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-20 h-20 border-2 border-[#ff00ff] bg-black shadow-[4px_4px_0_#00ffff]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover opacity-70 grayscale"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-bold truncate text-[#00ffff] glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
            <p className="text-[9px] text-[#ff00ff]/80 tracking-widest mt-1 truncate">{currentTrack.artist}</p>
            <div className="mt-2 flex gap-1">
               <span className="text-[8px] border border-[#00ffff]/30 px-1 text-[#00ffff]">A_I</span>
               <span className="text-[8px] border border-[#ff00ff]/30 px-1 text-[#ff00ff]">H_D</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="relative h-4 w-full bg-[#111] border border-[#00ffff]/20">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            {/* Scramble effect */}
            {isPlaying && (
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.1 }}
                className="absolute top-0 h-full w-2 bg-white"
                style={{ left: `${(progress / duration) * 100}%` }}
              />
            )}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[8px] text-[#00ffff]/50">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-10">
          <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"><SkipBack size={24} fill="currentColor" /></button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center border-4 border-[#ff00ff] text-[#ff00ff] shadow-[4px_4px_0_#00ffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors"><SkipForward size={24} fill="currentColor" /></button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;

