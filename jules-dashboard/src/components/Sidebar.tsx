import React from 'react';
import { LayoutDashboard, Rocket, Target, MessageSquare, GitHub, Aperture, Mic, X, Terminal, ClipboardList, Image, BookOpen, Heart, Globe, Compass, ShieldCheck, Users, Smartphone, Zap, GraduationCap, ShoppingBag, Code, GitPullRequest, CreditCard, Activity } from './IconComponents';
import type { View } from '../types';

interface SidebarProps {
  currentView: View;
  onSetView: (view: View) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  repoStatus?: 'Synced' | 'Behind' | 'Conflict' | 'Checking';
  onOpenMission?: () => void;
  onShowWelcome?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, isMobileOpen, onMobileClose, repoStatus = 'Synced', onOpenMission, onShowWelcome }) => {
  const menuGroups = [
    {
      title: "Command Center",
      items: [
        { view: 'ops', label: 'Ops Control', icon: Activity },
        { view: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { view: 'command', label: 'Jules Console', icon: Terminal },
        { view: 'domains', label: 'Domain Command', icon: Globe },
        { view: 'governance', label: 'DAO Governance', icon: Users },
        { view: 'gospel', label: 'Gospel Revenue', icon: Heart },
        { view: 'audit', label: 'Audit Logs', icon: ClipboardList },
        { view: 'security', label: 'Security Nexus', icon: ShieldCheck },
        { view: 'impact', label: 'Global Impact', icon: Globe },
      ]
    },
    {
      title: "Ventures",
      items: [
         { view: 'subscribe', label: 'Subscribe', icon: CreditCard },
         // HIDDEN DURING KICKSTARTER CAMPAIGN - Restore after funding
         // { view: 'dating', label: 'Dating Platform', icon: Heart },
         // { view: 'store', label: 'Ai-Solutions Store', icon: ShoppingBag },
         { view: 'dao', label: 'DAO Launches', icon: Rocket },
         { view: 'kickstarter', label: 'Kickstarter', icon: Target },
         { view: 'antigravity', label: 'Antigravity Program', icon: Zap },
      ]
    },
    {
      title: "Operations & Dev",
      items: [
        { view: 'scripts', label: 'P21 Setup Scripts', icon: Terminal },
        { view: 'edu', label: 'Edu Nexus (IT)', icon: GraduationCap },
        { view: 'pr', label: 'PR Wizard', icon: GitPullRequest },
        { view: 'review', label: 'Code Reviewer', icon: Code },
      ]
    },
    {
      title: "Creative Suite",
      items: [
        { view: 'media', label: 'Media Studio', icon: Image },
        { view: 'kids', label: 'Edu-Gen Studio', icon: BookOpen }, 
      ]
    },
    {
      title: "Intelligence",
      items: [
        { view: 'browser', label: 'Comet Browser', icon: Compass },
        { view: 'chat', label: 'AI Chat', icon: MessageSquare },
        { view: 'live', label: 'Live Console', icon: Mic },
        { view: 'mobile', label: 'Mobile Bridge', icon: Smartphone },
      ]
    }
  ];

  const getStatusColor = () => {
      switch (repoStatus) {
          case 'Synced': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
          case 'Behind': return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]';
          case 'Conflict': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
          case 'Checking': return 'bg-blue-500 animate-pulse';
          default: return 'bg-slate-500';
      }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onMobileClose} />
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-[60px] flex items-center px-6 border-b border-white/10 relative">
            <div className="flex items-center gap-2 font-bold text-white tracking-tight">
                <Aperture className="w-6 h-6 text-indigo-500" />
                <span>AiCollab<span className="text-indigo-400">Admin</span></span>
            </div>
            <button onClick={onMobileClose} className="md:hidden absolute right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
            {menuGroups.map((group, idx) => (
                <div key={idx}>
                    <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{group.title}</h3>
                    <div className="space-y-1">
                        {group.items.map((item) => (
                            <button key={item.view} onClick={() => onSetView(item.view as View)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === item.view ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                                <item.icon className={`w-4 h-4 ${currentView === item.view ? 'text-indigo-400' : 'opacity-70'}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">System Status</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5 mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <GitHub className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-slate-300 truncate" title="Trollz1004/AiCollabFortheKids">AiCollabFortheKids</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-bold tracking-tight">MASTER REPO</span>
                    {onOpenMission && <button onClick={onOpenMission} className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline">View Mission</button>}
                </div>
            </div>
            <div className="space-y-2">
                <button 
                    onClick={onShowWelcome}
                    className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-400/30 rounded-lg text-xs font-semibold text-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                    <Heart className="w-3.5 h-3.5" />
                    About #FOR THE KIDS
                </button>
                <a 
                    href="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/issues/new?template=feedback.md&title=%5BFEEDBACK%5D%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 rounded-lg text-xs font-semibold text-green-200 transition-all flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Send Feedback
                </a>
            </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
