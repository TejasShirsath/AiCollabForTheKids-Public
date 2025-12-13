import React from 'react';
import { Globe, Lock, CheckCircle } from './IconComponents';
import { DomainConfig } from '../types';

const DomainManager: React.FC = () => {
    const domains: DomainConfig[] = [
        { id: '1', url: 'youandinotai.com', status: 'Active', ssl: true, ageGate: true, dataPipe: '100%' },
        { id: '2', url: 'youandinotai.online', status: 'Active', ssl: true, ageGate: true, dataPipe: '100%' },
        { id: '3', url: 'ai-solutions-store.com', status: 'Active', ssl: true, ageGate: true, dataPipe: '100%' },
        { id: '4', url: '6b2f4c58.youandinotai.pages.dev', status: 'Active', ssl: true, ageGate: true, dataPipe: '100%' }
    ];

    return (
        <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
            <header className="glass-card p-6 mb-8 border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Globe className="w-8 h-8 text-blue-400" /> Domain Command Center</h1>
                    <p className="text-slate-400 mt-1">Centralized Management & Data Piping</p>
                </div>
                <div className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-400">NETWORK: SECURE</span>
                </div>
            </header>
            <div className="mt-8 glass-card overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-xs uppercase font-bold text-slate-300">
                        <tr><th className="px-6 py-4">Domain URL</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Security</th><th className="px-6 py-4">Age Gate</th><th className="px-6 py-4">Data Pipe</th></tr>
                    </thead>
                    <tbody>
                        {domains.map((domain) => (
                            <tr key={domain.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-6 py-4 font-mono text-white">{domain.url}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">{domain.status.toUpperCase()}</span></td>
                                <td className="px-6 py-4 flex items-center gap-2 text-green-400"><Lock className="w-4 h-4" /> Valid</td>
                                <td className="px-6 py-4"><span className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-4 h-4 text-blue-400" /> Enforced</span></td>
                                <td className="px-6 py-4 text-xs font-mono text-slate-500">{domain.dataPipe}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
};
export default DomainManager;
