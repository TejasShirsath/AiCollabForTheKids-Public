/// <reference types="vite/client" />
import React, { useState } from 'react';
import { GitHub, Globe, Terminal, Copy, Share, CheckCircle, AlertCircle } from './IconComponents';
import ReactMarkdown from 'react-markdown';
import { SystemHealth } from '../types';

// Live Jules API endpoint
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.aidoesitall.website';
const JULES_API_URL = `${API_BASE}/api/jules`;

interface CommandCenterProps {
    onLogAction: (action: string, details: string) => void;
    repoStatus: 'Synced' | 'Behind' | 'Conflict' | 'Checking';
    onCheckStatus: () => void;
    systemHealth?: SystemHealth;
}

const CommandCenter: React.FC<CommandCenterProps> = () => {
  const [command, setCommand] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Check API connection on mount
  React.useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) setApiStatus('connected');
        else setApiStatus('disconnected');
      } catch {
        setApiStatus('disconnected');
      }
    };
    checkApi();
  }, []);

  const handleExecute = async (customPrompt?: string) => {
    const promptToUse = customPrompt || command;
    if (!promptToUse.trim()) return;
    setIsProcessing(true);
    setPlan(null);

    try {
      const response = await fetch(`${JULES_API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: promptToUse })
      });

      const data = await response.json();

      if (data.success) {
        setPlan(data.response);
      } else {
        setPlan(`❌ Error: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      setPlan(`❌ API Connection Error: ${error.message || 'Failed to connect to Jules API'}`);
    }
    finally { setIsProcessing(false); }
  };

  const handleCopyLink = (url: string) => {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <header className="glass-card p-6 mb-8 border-l-4 border-indigo-500 flex flex-col md:flex-row justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Terminal className="w-8 h-8 text-indigo-400" /> Unified Command Center</h1>
            <p className="text-slate-400 mt-1">Logged in as: <span className="text-indigo-300 font-mono">joshlcoleman@gmail.com</span></p>
            <div className="mt-2 flex items-center gap-2">
              {apiStatus === 'connected' ? (
                <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400 text-sm font-medium">Jules API Connected (Live)</span></>
              ) : apiStatus === 'disconnected' ? (
                <><AlertCircle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Jules API Disconnected</span></>
              ) : (
                <span className="text-yellow-400 text-sm font-medium">Checking API...</span>
              )}
            </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[250px]">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Share className="w-4 h-4" /> Mission Uplink</div>
            <button onClick={() => handleCopyLink("https://github.com/Ai-Solutions-Store/AiCollabForTheKids")} className="flex items-center justify-between px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 group transition-colors">
                <div className="flex items-center gap-2"><GitHub className="w-4 h-4 text-white" /><span className="text-sm text-slate-300 font-medium">Master Codebase</span></div><Copy className="w-3 h-3 text-slate-500 group-hover:text-white" />
            </button>
            <button onClick={() => handleCopyLink("https://youandinotai.com")} className="flex items-center justify-between px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 group transition-colors">
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /><span className="text-sm text-slate-300 font-medium">Live Dashboard</span></div><Copy className="w-3 h-3 text-slate-500 group-hover:text-white" />
            </button>
        </div>
      </header>
      <div className="glass-card p-6 mb-8">
          <div className="p-4 bg-black/20 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
            {plan ? <ReactMarkdown className="prose prose-invert max-w-none">{plan}</ReactMarkdown> : <p className="text-slate-500 text-center mt-10">Jules is online. Waiting for commands...</p>}
          </div>
          <div className="mt-4 flex gap-2">
              <input type="text" value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleExecute()} placeholder="Enter command..." className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={() => handleExecute()} disabled={isProcessing} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {isProcessing ? 'Processing...' : 'Execute'}
              </button>
          </div>
      </div>
    </main>
  );
};
export default CommandCenter;
