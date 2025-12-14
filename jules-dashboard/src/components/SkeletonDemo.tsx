/**
 * Skeleton Demo Component
 * Demonstrates various skeleton loading patterns for the dashboard
 */
import React, { useState } from 'react';
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonFinancialCard, 
  SkeletonActivityLog 
} from './ui/skeleton';
import { Button } from './ui/button';

const SkeletonDemo: React.FC = () => {
  const [showSkeletons, setShowSkeletons] = useState(true);

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="glass-card p-6 border-l-4 border-indigo-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Skeleton Loading Demo</h1>
          <Button onClick={toggleSkeletons} className="bg-indigo-600 hover:bg-indigo-700">
            {showSkeletons ? 'Show Content' : 'Show Skeletons'}
          </Button>
        </div>
        
        <p className="text-slate-300 mb-6">
          This demo shows how skeleton loading states provide smooth user experience during data fetching.
        </p>
      </div>

      {/* Basic Skeleton Examples */}
      <div className="glass-card p-6 border-l-4 border-purple-500">
        <h2 className="text-xl font-bold text-white mb-4">Basic Skeleton Components</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Text Skeletons</h3>
            <div className="space-y-2">
              {showSkeletons ? (
                <>
                  <SkeletonText width="100%" />
                  <SkeletonText width="80%" />
                  <SkeletonText width="60%" />
                </>
              ) : (
                <>
                  <p className="text-white">This is a full-width text line</p>
                  <p className="text-white">This is a shorter text line</p>
                  <p className="text-white">Short text</p>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Custom Skeletons</h3>
            <div className="flex gap-4 items-center">
              {showSkeletons ? (
                <>
                  <Skeleton width="4rem" height="4rem" variant="circle" />
                  <div className="space-y-2">
                    <SkeletonText width="8rem" />
                    <SkeletonText width="6rem" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-slate-400 text-sm">Software Engineer</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Card Examples */}
      <div className="glass-card p-6 border-l-4 border-green-500">
        <h2 className="text-xl font-bold text-white mb-4">Financial Card Skeletons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {showSkeletons ? (
            <>
              <SkeletonFinancialCard />
              <SkeletonFinancialCard className="bg-green-900/20 border-green-500/30" />
              <SkeletonFinancialCard className="bg-blue-900/20 border-blue-500/30" />
            </>
          ) : (
            <>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 uppercase mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$124,500</p>
              </div>
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                <p className="text-xs text-green-400 uppercase mb-1 font-bold">Growth</p>
                <p className="text-2xl font-bold text-green-300">+23.5%</p>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                <p className="text-xs text-blue-400 uppercase mb-1 font-bold">Active Users</p>
                <p className="text-2xl font-bold text-blue-300">1,234</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Activity Log Example */}
      <div className="glass-card p-6 border-l-4 border-yellow-500">
        <h2 className="text-xl font-bold text-white mb-4">Activity Log Skeleton</h2>
        {showSkeletons ? (
          <SkeletonActivityLog />
        ) : (
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2 bg-slate-800/30 rounded-lg">
              <span className="px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400">Dec 14</span>
              <div>
                <p className="text-sm font-medium text-white">System deployment completed</p>
                <p className="text-xs text-slate-400">All services are running smoothly</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-slate-800/30 rounded-lg">
              <span className="px-2 py-0.5 text-xs rounded bg-blue-900/30 text-blue-400">Dec 13</span>
              <div>
                <p className="text-sm font-medium text-white">Database backup completed</p>
                <p className="text-xs text-slate-400">Backup size: 2.3GB</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-slate-800/30 rounded-lg">
              <span className="px-2 py-0.5 text-xs rounded bg-green-900/30 text-green-400">Dec 12</span>
              <div>
                <p className="text-sm font-medium text-white">New user registration spike</p>
                <p className="text-xs text-slate-400">+45 new users in the last hour</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkeletonDemo;