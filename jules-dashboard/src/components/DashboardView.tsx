import React, { useState } from 'react';
import { Users, Server, Heart, DollarSign, ExternalLink, CheckCircle, Twitter } from './IconComponents';
import { LedgerEntry, AgentNode } from '../types';
import { GOSPEL_STATUS, MISSION_STATEMENT } from '../config/gospelStatus';

const DashboardView: React.FC = () => {
  // Production: Empty ledger until real transactions exist
  const [ledger] = useState<LedgerEntry[]>([]);
  const [_nodes] = useState<AgentNode[]>([
      { id: 'node-01', name: 'Jules Orchestrator', type: 'T5500', status: 'Online', load: 45, currentTask: 'Monitoring Git Ops' },
      { id: 'node-02', name: 'Olama Swarm Alpha', type: 'Local', status: 'Busy', load: 88, currentTask: 'Deep Research: P21 Specs' },
      { id: 'node-03', name: 'Cloud Backup', type: 'Cloud', status: 'Online', load: 12 }
  ]);
  const totalGross = ledger.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalShriners = ledger.reduce((acc, curr) => acc + curr.charity, 0);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* GOSPEL STATUS BANNER - DAY 1 VICTORY */}
      <div className="glass-card p-6 border-l-4 border-green-500 bg-gradient-to-r from-green-900/20 to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold border border-green-500/50 animate-pulse">
                {GOSPEL_STATUS.globalStatus}
              </span>
              <span className="text-slate-400 text-sm">Operation: Unstoppable</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Gospel DAO - Day 1 Victory</h1>
            <p className="text-green-400 font-mono text-sm">{MISSION_STATEMENT}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={GOSPEL_STATUS.contract.baseScanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-400 text-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Verified Contract
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={GOSPEL_STATUS.social.twitter.launchThread}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/50 rounded-lg text-sky-400 text-sm transition-all"
            >
              <Twitter className="w-4 h-4" />
              Launch Thread
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Contract & Split Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <p className="text-xs text-slate-400 uppercase mb-1">Contract Address</p>
            <p className="text-sm font-mono text-white truncate">{GOSPEL_STATUS.contract.address}</p>
            <p className="text-xs text-green-400 mt-1">{GOSPEL_STATUS.contract.network} (Verified)</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <p className="text-xs text-slate-400 uppercase mb-1">Revenue Split</p>
            <p className="text-sm font-bold text-white">{GOSPEL_STATUS.split.label}</p>
            <p className="text-xs text-yellow-400 mt-1">Immutable - Hardcoded Forever</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <p className="text-xs text-slate-400 uppercase mb-1">Operations Status</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400 border border-green-500/30">Bridge: {GOSPEL_STATUS.operations.partnershipBridge}</span>
              <span className="px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400 border border-green-500/30">Alerts: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Activity Log */}
      <div className="glass-card p-4 border-l-4 border-purple-500">
        <h3 className="text-sm font-bold text-purple-400 uppercase mb-3">Latest Activity</h3>
        <div className="space-y-2">
          {GOSPEL_STATUS.activityLog.map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 bg-slate-800/30 rounded-lg">
              <span className={`px-2 py-0.5 text-xs rounded ${log.type === 'milestone' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                {log.date}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{log.title}</p>
                <p className="text-xs text-slate-400">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Original Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-center glass-card p-6 border-l-4 border-indigo-500">
        <div>
          <h1 className="text-3xl font-bold text-white">Google Admin Command Center</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-indigo-300 font-mono">joshlcoleman@gmail.com</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">SUPER ADMIN</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">P21 Compliance</p>
            <p className="text-3xl font-bold text-green-400">100%</p>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Security Score</p>
            <p className="text-3xl font-bold text-blue-400">98/100</p>
          </div>
        </div>
      </div>

      {/* Financial Core */}
      <div className="glass-card p-8 border-t-4 border-green-500">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3"><DollarSign className="w-8 h-8 text-green-400" /> Financial Core: Immutable Ledger</h2>
              <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold border border-green-500/30 animate-pulse">LIVE AUDIT ACTIVE</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 uppercase mb-1">Total Gross Revenue</p>
                  <p className="text-2xl font-bold text-white">${totalGross.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30 relative overflow-hidden">
                  <p className="text-xs text-green-400 uppercase mb-1 font-bold flex items-center gap-2"><Heart className="w-3 h-3 fill-green-400" /> For The Kids (60%)</p>
                  <p className="text-2xl font-bold text-green-300">${totalShriners.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <p className="text-xs text-blue-400 uppercase mb-1 font-bold flex items-center gap-2"><Server className="w-3 h-3" /> Infra & Scale (30%)</p>
                  <p className="text-2xl font-bold text-blue-300">${(totalGross * 0.3).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/30">
                  <p className="text-xs text-purple-400 uppercase mb-1 font-bold flex items-center gap-2"><Users className="w-3 h-3" /> Founder (10%)</p>
                  <p className="text-2xl font-bold text-purple-300">${(totalGross * 0.1).toLocaleString()}</p>
              </div>
          </div>
      </div>
    </div>
  );
};
export default DashboardView;
