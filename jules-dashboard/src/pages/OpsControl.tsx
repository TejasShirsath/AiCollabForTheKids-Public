import React from 'react';
import {
  CheckCircle,
  ExternalLink,
  Twitter,
  Server,
  Heart,
  Users,
  Activity,
  Shield,
  Zap,
  Globe,
  DollarSign
} from '../components/IconComponents';
import { GOSPEL_STATUS, MISSION_STATEMENT } from '../config/gospelStatus';

/**
 * OPS CONTROL - Unified Operations Dashboard
 *
 * Consolidates:
 * - System Status (Gospel Contract, Ops Center)
 * - Activity Logs
 * - Scoreboard (Financial Overview)
 * - Quick Actions
 *
 * FOR THE KIDS. ALWAYS.
 */
const OpsControl: React.FC = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-brand-void">
      {/* HEADER - Mission Status */}
      <div className="glass-card p-6 border-l-4 border-green-500 bg-gradient-to-r from-green-900/20 to-transparent">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-lg font-bold border border-green-500/50 animate-pulse">
                {GOSPEL_STATUS.globalStatus}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Gospel Ops Control</h1>
            <p className="text-green-400 font-mono text-lg">{MISSION_STATEMENT}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={GOSPEL_STATUS.contract.baseScanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-400 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Verified Contract
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={GOSPEL_STATUS.social.twitter.launchThread}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/50 rounded-lg text-sky-400 transition-all"
            >
              <Twitter className="w-5 h-5" />
              Launch Thread
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={GOSPEL_STATUS.social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg text-purple-400 transition-all"
            >
              <Globe className="w-5 h-5" />
              Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* GRID: Contract Info + Operations Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Details */}
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" /> Contract Details
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase mb-1">Contract Address</p>
              <p className="text-sm font-mono text-white break-all">{GOSPEL_STATUS.contract.address}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400 border border-green-500/30">
                  {GOSPEL_STATUS.contract.network}
                </span>
                <span className="px-2 py-0.5 text-xs rounded bg-blue-900/30 text-blue-400 border border-blue-500/30">
                  Chain ID: {GOSPEL_STATUS.contract.chainId}
                </span>
                {GOSPEL_STATUS.contract.verified && (
                  <span className="px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400 border border-green-500/30">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase mb-1">Revenue Split (Immutable)</p>
              <p className="text-lg font-bold text-white">{GOSPEL_STATUS.split.label}</p>
              <p className="text-xs text-yellow-400 mt-1">Hardcoded in smart contract - Cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Operations Status */}
        <div className="glass-card p-6 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6" /> Operations Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase mb-2">Partnership Bridge</p>
              <span className={`px-3 py-1 text-sm rounded-full ${
                GOSPEL_STATUS.operations.partnershipBridge === 'ONLINE'
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                {GOSPEL_STATUS.operations.partnershipBridge}
              </span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase mb-2">Ops Center</p>
              <span className={`px-3 py-1 text-sm rounded-full ${
                GOSPEL_STATUS.operations.opsCenter === 'ONLINE'
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                {GOSPEL_STATUS.operations.opsCenter}
              </span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase mb-2">Discord Alerts</p>
              <span className={`px-3 py-1 text-sm rounded-full ${
                GOSPEL_STATUS.operations.discordAlerts === 'ACTIVE'
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
              }`}>
                {GOSPEL_STATUS.operations.discordAlerts}
              </span>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-slate-400 uppercase mb-2">Telegram Alerts</p>
              <span className={`px-3 py-1 text-sm rounded-full ${
                GOSPEL_STATUS.operations.telegramAlerts === 'ACTIVE'
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
              }`}>
                {GOSPEL_STATUS.operations.telegramAlerts}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SCOREBOARD - Financial Overview */}
      <div className="glass-card p-6 border-t-4 border-green-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-green-400" /> Financial Scoreboard
          </h2>
          <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold border border-green-500/30 animate-pulse">
            LIVE
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-slate-800/50 rounded-xl border border-white/5">
            <p className="text-xs text-slate-400 uppercase mb-2">Total Contributions</p>
            <p className="text-3xl font-bold text-white">$0</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting first contribution</p>
          </div>
          <div className="p-5 bg-green-900/20 rounded-xl border border-green-500/30">
            <p className="text-xs text-green-400 uppercase mb-2 font-bold flex items-center gap-2">
              <Heart className="w-4 h-4 fill-green-400" /> Kids Fund ({GOSPEL_STATUS.split.charity}%)
            </p>
            <p className="text-3xl font-bold text-green-300">$0</p>
            <p className="text-xs text-green-500/70 mt-1 font-mono truncate">{GOSPEL_STATUS.wallets.charity.address.slice(0,10)}...</p>
          </div>
          <div className="p-5 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <p className="text-xs text-blue-400 uppercase mb-2 font-bold flex items-center gap-2">
              <Server className="w-4 h-4" /> Infrastructure ({GOSPEL_STATUS.split.infrastructure}%)
            </p>
            <p className="text-3xl font-bold text-blue-300">$0</p>
            <p className="text-xs text-blue-500/70 mt-1 font-mono truncate">{GOSPEL_STATUS.wallets.infrastructure.address.slice(0,10)}...</p>
          </div>
          <div className="p-5 bg-purple-900/20 rounded-xl border border-purple-500/30">
            <p className="text-xs text-purple-400 uppercase mb-2 font-bold flex items-center gap-2">
              <Users className="w-4 h-4" /> Founder ({GOSPEL_STATUS.split.founder}%)
            </p>
            <p className="text-3xl font-bold text-purple-300">$0</p>
            <p className="text-xs text-purple-500/70 mt-1 font-mono truncate">{GOSPEL_STATUS.wallets.founder.address.slice(0,10)}...</p>
          </div>
        </div>
      </div>

      {/* ACTIVITY LOG */}
      <div className="glass-card p-6 border-l-4 border-indigo-500">
        <h2 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" /> Activity Log
        </h2>
        <div className="space-y-3">
          {GOSPEL_STATUS.activityLog.map((log, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all">
              <span className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
                log.type === 'milestone'
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
              }`}>
                {log.date}
              </span>
              <div className="flex-1">
                <p className="text-base font-medium text-white">{log.title}</p>
                <p className="text-sm text-slate-400 mt-1">{log.description}</p>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded uppercase ${
                log.type === 'milestone' ? 'text-green-400' : 'text-blue-400'
              }`}>
                {log.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="glass-card p-6 border-l-4 border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
            <h3 className="font-bold text-white mb-2">Log New Backer</h3>
            <p className="text-sm text-slate-400 mb-3">Run after Kickstarter notification</p>
            <code className="block text-xs bg-black/30 p-2 rounded text-green-400 font-mono">
              node scripts/log-backer.js --name="Name" --amount=99
            </code>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
            <h3 className="font-bold text-white mb-2">Log Partner Response</h3>
            <p className="text-sm text-slate-400 mb-3">Process incoming partnership emails</p>
            <code className="block text-xs bg-black/30 p-2 rounded text-green-400 font-mono">
              node scripts/log-partnership-response.js
            </code>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
            <h3 className="font-bold text-white mb-2">Send Alert</h3>
            <p className="text-sm text-slate-400 mb-3">Discord + Telegram notification</p>
            <code className="block text-xs bg-black/30 p-2 rounded text-green-400 font-mono">
              node scripts/discord-alert.js --type=success
            </code>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-6">
        <p className="text-slate-500 text-sm">
          Gospel Ops Control v1.0 | Contract: {GOSPEL_STATUS.contract.address.slice(0,10)}...
        </p>
        <p className="text-green-400 font-bold mt-2">FOR THE KIDS. ALWAYS.</p>
      </div>
    </div>
  );
};

export default OpsControl;
