import React from 'react';
import { Construction, Rocket, Clock } from './IconComponents';

interface ComingSoonProps {
  viewName: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  category?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ viewName, icon: Icon, description, category }) => {
  return (
    <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 shadow-[0_0_30px_rgba(79,70,229,0.15)] text-center">
          
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
              <div className="relative backdrop-blur-xl bg-indigo-500/10 border border-indigo-500/30 rounded-full p-8">
                <Icon className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Category Badge */}
          {category && (
            <div className="mb-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                {category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            {viewName}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {/* Under Construction Message */}
          <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Construction className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-yellow-300">Under Construction</h2>
            </div>
            <p className="text-slate-300 text-sm">
              This feature is currently being developed and will be available soon.
            </p>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Coming Soon</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 font-medium">#FOR THE KIDS</span>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-slate-500 italic">
              Every feature we build serves the mission: 60% charity for children's causes,
              <br />30% infrastructure, 20% developer sustainability.
            </p>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-1">Phase 2</div>
            <div className="text-xs text-slate-400">Development Stage</div>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
            <div className="text-xs text-slate-400">For The Kids</div>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">Q1 2025</div>
            <div className="text-xs text-slate-400">Target Launch</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ComingSoon;
