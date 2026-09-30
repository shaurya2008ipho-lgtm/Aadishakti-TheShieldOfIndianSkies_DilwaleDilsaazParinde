import React, { useState, useEffect } from 'react';

// 1. We tell TypeScript exactly what props this component expects
interface LoginGateProps {
    onLoginSuccess?: () => void;
}

// 2. We apply the interface to the component
export default function LoginGate({ onLoginSuccess }: LoginGateProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [currentTime, setCurrentTime] = useState('--:--:-- UTC');
    const [officerId, setOfficerId] = useState('GCS-OP-8921');
    const [passphrase, setPassphrase] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toTimeString().split(' ')[0] + ' UTC';
            setCurrentTime(timeString);
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    // 3. We tell TypeScript this 'e' is specifically a Form Event
   const handleAuthenticate = (e: React.FormEvent) => {
        e.preventDefault(); // <-- CRITICAL: This stops the page from refreshing!
        
        if (onLoginSuccess) {
            onLoginSuccess();
        } else {
            console.error("onLoginSuccess prop is missing!");
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#030712] text-slate-100 font-sans antialiased tactical-grid select-none">
            {/* Ambient background glows */}
            <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Radar center rings & sweep line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-[300px] h-[300px] rounded-full border border-sky-500/20"></div>
                <div className="absolute w-[550px] h-[550px] rounded-full border border-sky-500/15"></div>
                <div className="absolute w-[800px] h-[800px] rounded-full border border-sky-500/10"></div>
                <div className="radar-sweep"></div>
            </div>

            {/* HUD Overlay Header */}
            <header className="absolute top-0 left-0 w-full z-30 px-8 py-5 flex justify-between items-center border-b border-sky-500/10 backdrop-blur-sm bg-slate-950/40">
                <div className="flex items-center space-x-4">
                    {/* 3D Flowing Indian Flag */}
                    <div className="border border-slate-700/60 rounded-[2px] overflow-hidden shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                        <svg width="90" height="60" className="w-[26px] h-[18px] flag-wave block" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
                            <rect fill="#FF9933" width="90" height="20" />
                            <rect fill="#FFFFFF" y="20" width="90" height="20" />
                            <rect fill="#138808" y="40" width="90" height="20" />
                            <circle fill="none" stroke="#000080" strokeWidth="2" cx="45" cy="30" r="7" />
                            <circle fill="#000080" cx="45" cy="30" r="2.5" />
                        </svg>
                        
                    </div>

                    <div className="flex items-center space-x-3 border-l border-sky-500/20 pl-4">
                        <div className="relative">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping absolute"></div>
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
                        </div>
                        <div>
                            <span className="text-xs font-mono font-bold tracking-[0.25em] text-sky-400">DEFENSE GRID ACTIVE</span>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">SECTOR: NORTHERN COMMAND // MALE UAV PATROL</span>
                        </div>
                    </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400 hidden sm:block">
                    <span>UAV TRACKING: <strong className="text-emerald-400 font-normal">3 UNITS ACTIVE</strong></span>
                    <span className="mx-3 text-slate-600">|</span>
                    <span className="text-sky-300">{currentTime}</span>
                </div>
            </header>

            {/* Drone Flight Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                <svg width="24" height="24" style={{ transform: 'rotate(105deg)' }} className="w-16 h-16 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor"></svg>
                {/* UAV 1 */}
                <div className="absolute drone-flight-1">
                    <div className="flex items-center gap-3 jet-glow">
                        <svg style={{ transform: 'rotate(105deg)' }} className="w-16 h-16 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2 C12.5,2 13,2.5 13,3 L13.5,9 L23,11 L23,13 L13.5,13 L13,18 L16,21 L16,22 L12,21.5 L8,22 L8,21 L11,18 L11.5,13 L1,13 L1,11 L10.5,9 L11,3 C11,2.5 11.5,2 12,2 Z" />
                        </svg>
                        <div className="font-mono text-[9px] text-sky-300/80 bg-slate-900/80 px-2 py-1 rounded border border-sky-500/30 whitespace-nowrap">
                            <div>TAG: UAV-TRIDENT-01</div>
                            <div>ALT: 28,000 FT | SPD: 195 KT</div>
                            <div className="text-emerald-400">HEALTH: 98% (NORMAL)</div>
                        </div>
                    </div>
                </div>

                {/* UAV 2 */}
                <div className="absolute drone-flight-2">
                    <div className="flex flex-row-reverse items-center gap-3 jet-glow">
                        <svg style={{ transform: 'rotate(-72deg)' }} className="w-14 h-14 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2 C12.5,2 13,2.5 13,3 L13.5,9 L23,11 L23,13 L13.5,13 L13,18 L16,21 L16,22 L12,21.5 L8,22 L8,21 L11,18 L11.5,13 L1,13 L1,11 L10.5,9 L11,3 C11,2.5 11.5,2 12,2 Z" />
                        </svg>
                        <div className="font-mono text-[9px] text-purple-300/80 bg-slate-900/80 px-2 py-1 rounded border border-purple-500/30 whitespace-nowrap text-right">
                            <div>TAG: UAV-GARUDA-04</div>
                            <div>ALT: 24,500 FT | SPD: 172 KT</div>
                            <div className="text-emerald-400">HEALTH: SYNCED</div>
                        </div>
                    </div>
                </div>

                {/* UAV 3 */}
                <div className="absolute drone-flight-3">
                    <div className="flex items-center gap-2 jet-glow">
                        <svg style={{ transform: 'rotate(69deg)' }} className="w-10 h-10 text-cyan-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2 C12.5,2 13,2.5 13,3 L13.5,9 L23,11 L23,13 L13.5,13 L13,18 L16,21 L16,22 L12,21.5 L8,22 L8,21 L11,18 L11.5,13 L1,13 L1,11 L10.5,9 L11,3 C11,2.5 11.5,2 12,2 Z" />
                        </svg>
                        <div className="font-mono text-[8px] text-cyan-200/80 bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                            TAG: SHAKTI-TWIN-02
                        </div>
                    </div>
                </div>
            </div>

            {/* Airspace View */}
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-700 ${showLoginModal ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <div className="text-center px-4 max-w-2xl">
                    <div className="inline-block py-1 px-4 mb-4 rounded-full border border-sky-500/30 bg-sky-950/40 text-sky-400 font-mono text-xs tracking-[0.2em]">
                        AIRSPACE PATROL & ENGINE TELEMETRY ACTIVE
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 tracking-wider">
                        AADI-SHAKTI
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm tracking-[0.3em] font-medium mt-3 mb-10">
                        THE SHIELD OF INDIAN SKIES
                    </p>

                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.45)] hover:shadow-[0_0_50px_rgba(56,189,248,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <span>Access GCS Login Terminal</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Authentication Terminal Modal */}
            <div className={`absolute inset-0 z-30 flex items-center justify-center p-4 transition-all duration-700 backdrop-blur-md bg-black/60 ${showLoginModal ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-700/60 rounded-2xl shadow-[0_0_60px_rgba(59,130,246,0.25)] p-8">
                    <button
                        onClick={() => setShowLoginModal(false)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-2 text-xs font-mono tracking-wider cursor-pointer"
                    >
                        ✕
                    </button>

                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-400 via-purple-500 to-sky-400 rounded-t-2xl"></div>

                    <div className="text-center mb-8 mt-2">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-sky-950/70 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-black tracking-widest text-slate-100">OPERATOR CLEARANCE</h2>
                        <p className="text-[10px] font-mono text-sky-400 tracking-[0.2em] mt-1">GCS PORTAL // MALE UAV TWIN</p>
                    </div>

                    <form onSubmit={handleAuthenticate} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-mono font-bold text-slate-400 tracking-wider mb-2">OFFICER / CLEARANCE ID</label>
                            <input
                                type="text"
                                value={officerId}
                                onChange={(e) => setOfficerId(e.target.value)}
                                className="w-full bg-slate-950/70 border border-slate-700 text-sky-200 px-4 py-3 rounded-lg focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 font-mono text-sm tracking-wider"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono font-bold text-slate-400 tracking-wider mb-2">TELEMETRY PASSPHRASE</label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={passphrase}
                                onChange={(e) => setPassphrase(e.target.value)}
                                className="w-full bg-slate-950/70 border border-slate-700 text-purple-200 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono text-sm tracking-wider"
                            />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="accent-sky-500 rounded" />
                                <span>Save Session Key</span>
                            </label>
                            <span className="text-sky-400 hover:underline cursor-pointer">Secure Reset</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-mono font-bold text-xs tracking-[0.25em] rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.35)] transition duration-200 cursor-pointer"
                        >
                            INITIALIZE DIGITAL TWIN
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                        <span className="text-[9px] font-mono text-slate-500 tracking-[0.25em]">MONITOR. ANALYSE. PREDICT. PROTECT. // JAI HIND</span>
                    </div>
                </div>
            </div>
        </div>
    );
}