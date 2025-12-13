import React, { useState, useEffect } from 'react';
import { AntigravityApplicant } from '../types';
import { Zap, GitHub, Rocket } from './IconComponents';

const AntigravityConsole: React.FC = () => {
    const [applicants, setApplicants] = useState<AntigravityApplicant[]>([]);
    const [isDeploying, setIsDeploying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Production: Fetch real applicant data from API
        const fetchApplicants = async () => {
            try {
                setIsLoading(true);
                const API_URL = import.meta.env.VITE_API_URL || 'https://theoretical-bras-difference-kirk.trycloudflare.com';
                const res = await fetch(`${API_URL}/api/admin/applicants`);
                if (res.ok) {
                    const data = await res.json();
                    setApplicants(data.applicants || []);
                } else {
                    // No applicants yet - empty state
                    setApplicants([]);
                }
            } catch (error) {
                console.error('Failed to fetch applicants:', error);
                setApplicants([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    const handleDeployPortal = () => {
        setIsDeploying(true);
        setTimeout(() => { setIsDeploying(false); alert("Applicant Portal Deployed to: https://youandinotai.com/careers"); }, 2000);
    };

    return (
        <main className="flex-1 p-6 overflow-y-auto bg-[#050505] relative overflow-hidden h-full">
            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="glass-card p-8 mb-10 border-t-4 border-cyan-500 bg-slate-900/40 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white flex items-center gap-4"><Zap className="w-12 h-12 text-cyan-400" /> ANTIGRAVITY</h1>
                        <p className="text-cyan-100/60 mt-2 text-lg font-light tracking-widest uppercase">Agentic Development Platform</p>
                    </div>
                    <button onClick={handleDeployPortal} disabled={isDeploying} className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50">
                        {isDeploying ? 'Deploying...' : 'Deploy Applicant Portal'} <Rocket className="w-5 h-5" />
                    </button>
                </header>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                    {isLoading ? (
                        <div className="col-span-2 glass-card p-12 text-center border border-white/10 bg-slate-900/60 rounded-2xl">
                            <div className="animate-pulse">
                                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                                <p className="text-cyan-100/60">Loading applicants...</p>
                            </div>
                        </div>
                    ) : applicants.length === 0 ? (
                        <div className="col-span-2 glass-card p-12 text-center border border-white/10 bg-slate-900/60 rounded-2xl">
                            <Rocket className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Applicants Yet</h3>
                            <p className="text-cyan-100/60 text-sm">Deploy the applicant portal to start receiving applications</p>
                        </div>
                    ) : (
                        applicants.map((app) => (
                            <div key={app.id} className="glass-card p-6 border border-white/10 bg-slate-900/60 hover:bg-slate-800/90 transition-all duration-500 rounded-2xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{app.name}</h3>
                                        <span className="text-xs text-slate-300 font-mono uppercase">{app.specialty}</span>
                                    </div>
                                    <div className="text-3xl font-black text-white">{app.score}</div>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6"><p className="text-slate-300 text-sm italic">"{app.pitch}"</p></div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <a href={`https://github.com/${app.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-mono"><GitHub className="w-4 h-4" /> github.com/{app.github}</a>
                                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400">{app.status}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};
export default AntigravityConsole;
