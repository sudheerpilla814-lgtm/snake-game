import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, LayoutGrid, List } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../constants';

interface MusicPlayerProps {
  viewOnlyList?: boolean;
  controlsOnly?: boolean;
}

export default function MusicPlayer({ viewOnlyList, controlsOnly }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
      setProgress(p);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (viewOnlyList) {
    return (
      <div className="flex flex-col gap-2">
         <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
         {DUMMY_TRACKS.map((track, i) => (
            <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(i);
                  setIsPlaying(true);
                }}
                className={`p-3 text-left transition-all duration-200 border-l-2 rounded-r-md ${
                  currentTrackIndex === i 
                  ? 'bg-cyan-500/10 border-cyan-500' 
                  : 'hover:bg-white/5 border-transparent'
                }`}
            >
              <div className="text-sm font-semibold truncate leading-none mb-1">{track.title}</div>
              <div className={`text-[10px] font-mono tracking-tighter uppercase ${
                currentTrackIndex === i ? 'text-cyan-400' : 'text-zinc-500'
              }`}>
                {track.genre} • {formatTime(track.duration)}
              </div>
            </button>
         ))}
      </div>
    );
  }

  if (controlsOnly) {
    return (
      <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-lg flex flex-col justify-between gap-6">
        <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
        
        <div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-bold">Playback Control</div>
          <div className="flex justify-center items-center gap-6">
            <button onClick={prevTrack} className="text-zinc-400 hover:text-white transition-colors">
               <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full border-2 border-cyan-500 flex items-center justify-center text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-zinc-400 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 tracking-widest">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(audioRef.current?.duration || currentTrack.duration)}</span>
          </div>
          <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative group" onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const p = (e.clientX - rect.left) / rect.width;
             if (audioRef.current) audioRef.current.currentTime = p * audioRef.current.duration;
          }}>
            <div className="absolute inset-y-0 left-0 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" style={{ width: `${progress}%` }} />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="text-[9px] text-zinc-400 font-mono tracking-widest">VOLUME</div>
            <div className="flex gap-1 items-end h-3">
              {[...Array(5)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setVolume((i + 1) * 0.2)}
                  className={`w-1 transition-all ${
                    volume >= (i + 1) * 0.2 ? 'bg-cyan-500' : 'bg-zinc-700'
                  }`}
                  style={{ height: `${(i + 1) * 20 + 20}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback default view (unused in newest App structure)
  return <div>Select music player variant</div>;
}
