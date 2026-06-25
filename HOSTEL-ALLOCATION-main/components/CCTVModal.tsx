import React, { useState, useEffect } from 'react';
import { X, Video, ShieldAlert, Monitor, Circle, EyeOff } from 'lucide-react';

interface CCTVModalProps {
  floorNumber: number;
  hostelName: string;
  onClose: () => void;
}

export function CCTVModal({ floorNumber, hostelName, onClose }: CCTVModalProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return time.toLocaleTimeString([], { hour12: false });
  };

  const formatDate = () => {
    return time.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" id="cctv-modal">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-4xl w-full overflow-hidden flex flex-col relative" id="cctv-container">
        
        {/* Header toolbar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between text-white bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl relative">
              <Video size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
            </div>
            <div>
              <h2 className="text-sm font-black font-mono tracking-tight uppercase">{hostelName} - LIVE OUTLET</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Floor #{floorNumber} Security Feed Matrix</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-350 shrink-0">
            <span className="hidden md:inline bg-slate-850 px-2 py-0.5 rounded text-amber-500 border border-slate-800 uppercase tracking-wide text-[10px]">
              System Link Live
            </span>
            <span>{formatDate()} {formatTime()}</span>
            <button 
              onClick={onClose}
              id="btn-cctv-modal-close"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Camera block grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 relative" id="cctv-monitor-screen">
          {/* Grid lines filter */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,0,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-30" />

          {/* CAM 01 */}
          <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 group">
            <div className="flex items-start justify-between relative z-10">
              <span className="bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1.5">
                <Circle size={8} className="fill-rose-500 text-rose-500 animate-pulse" /> CAM 01 - NORTH LANE
              </span>
              <span className="text-[10px] font-mono text-emerald-450 bg-black/60 px-2 py-0.5 rounded-lg border border-emerald-950">
                1080P/30FPS
              </span>
            </div>
            {/* Camera feed placeholder style */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-10">
              <Monitor size={48} className="text-white" />
            </div>
            <div className="flex items-end justify-between relative z-10 mt-auto">
              <span className="text-[9px] font-mono text-white/55">ELEVATOR CORRIDOR</span>
              <span className="text-[9px] font-mono text-slate-500 tracking-widest">{formatTime()}</span>
            </div>
          </div>

          {/* CAM 02 */}
          <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 group">
            <div className="flex items-start justify-between relative z-10">
              <span className="bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1.5">
                <Circle size={8} className="fill-rose-500 text-rose-500 animate-pulse" /> CAM 02 - EAST EXIT
              </span>
              <span className="text-[10px] font-mono text-emerald-450 bg-black/60 px-2 py-0.5 rounded-lg border border-emerald-950">
                1080P/30FPS
              </span>
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-10">
              <Monitor size={48} className="text-white" />
            </div>
            <div className="flex items-end justify-between relative z-10 mt-auto">
              <span className="text-[9px] font-mono text-white/55">MAIN LOBBY OUT</span>
              <span className="text-[9px] font-mono text-slate-500 tracking-widest">{formatTime()}</span>
            </div>
          </div>

          {/* CAM 03 */}
          <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 group">
            <div className="flex items-start justify-between relative z-10">
              <span className="bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1.5">
                <Circle size={8} className="fill-rose-500 text-rose-500 animate-pulse" /> CAM 03 - LAUNDRY BLOCK
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded-lg border border-slate-800">
                1080P/15FPS
              </span>
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-10">
              <EyeOff size={48} className="text-white" />
            </div>
            <div className="flex items-end justify-between relative z-10 mt-auto">
              <span className="text-[9px] font-mono text-white/55">COMMON SERVICE BLOCK</span>
              <span className="text-[9px] font-mono text-slate-550 tracking-widest">STBY</span>
            </div>
          </div>

          {/* CAM 04 */}
          <div className="aspect-video bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 group">
            <div className="flex items-start justify-between relative z-10">
              <span className="bg-black/70 backdrop-blur-md text-[9px] font-mono font-bold text-white uppercase px-2 py-1 rounded-md tracking-wider flex items-center gap-1.5">
                <Circle size={8} className="fill-rose-500 text-rose-500 animate-pulse" /> CAM 04 - SOUTH DECK
              </span>
              <span className="text-[10px] font-mono text-emerald-450 bg-black/60 px-2 py-0.5 rounded-lg border border-emerald-950">
                1080P/30FPS
              </span>
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-10">
              <Monitor size={48} className="text-white" />
            </div>
            <div className="flex items-end justify-between relative z-10 mt-auto">
              <span className="text-[9px] font-mono text-white/55">OUTDOOR PARKING</span>
              <span className="text-[9px] font-mono text-slate-550 tracking-widest">{formatTime()}</span>
            </div>
          </div>
        </div>

        {/* footer telemetry */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-slate-500 shrink-0">
          <ShieldAlert size={12} className="text-amber-500" /> WARDEN ACCESS ONLY · SECURE NETWORK TRANSMISSION CERTIFIED
        </div>

      </div>
    </div>
  );
}
