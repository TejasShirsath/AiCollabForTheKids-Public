import React, { useState, useEffect } from 'react';
import { Heart, Shield, Users, CheckCircle, TrendingUp, DollarSign, UserCheck, MessageSquare, Star, ExternalLink } from './IconComponents';

interface DatingStats {
  totalUsers: number;
  verifiedUsers: number;
  activeMatches: number;
  messagesExchanged: number;
  preorders: number;
  maxFounders: number;
  revenueForCharity: number;
}

const DatingPlatform: React.FC = () => {
  const [stats, setStats] = useState<DatingStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    activeMatches: 0,
    messagesExchanged: 0,
    preorders: 0,
    maxFounders: 100,
    revenueForCharity: 0
  });
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'verification' | 'revenue'>('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://theoretical-bras-difference-kirk.trycloudflare.com';
      const response = await fetch(`${apiUrl}/api/dating/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log('Dating stats not available yet');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtext, color }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    subtext?: string;
    color: string;
  }) => (
    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color.includes('pink') ? 'from-pink-500/20 to-red-500/20' : color.includes('green') ? 'from-green-500/20 to-emerald-500/20' : color.includes('blue') ? 'from-blue-500/20 to-indigo-500/20' : 'from-amber-500/20 to-orange-500/20'}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  const VerificationStep = ({ step, title, description, status }: {
    step: number;
    title: string;
    description: string;
    status: 'active' | 'pending' | 'completed';
  }) => (
    <div className={`flex items-start gap-4 p-4 rounded-lg border ${
      status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
      status === 'active' ? 'bg-indigo-500/10 border-indigo-500/30' :
      'bg-slate-800/30 border-white/5'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        status === 'completed' ? 'bg-green-500 text-white' :
        status === 'active' ? 'bg-indigo-500 text-white' :
        'bg-slate-700 text-slate-400'
      }`}>
        {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <div>
        <h4 className={`font-semibold ${status === 'pending' ? 'text-slate-400' : 'text-white'}`}>{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto bg-brand-void p-6 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg">
            <Heart className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">You AND i Not AI</h1>
            <p className="text-slate-400">Dating Platform - 100% Human Verified</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
            60% to charity
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
            No Bots Allowed
          </span>
          <a
            href="https://youandinotai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Live Site
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        {(['overview', 'users', 'verification', 'revenue'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers.toLocaleString()}
              subtext="Registered profiles"
              color="text-pink-400"
            />
            <StatCard
              icon={UserCheck}
              label="Verified Humans"
              value={stats.verifiedUsers.toLocaleString()}
              subtext="Passed verification"
              color="text-green-400"
            />
            <StatCard
              icon={Heart}
              label="Active Matches"
              value={stats.activeMatches.toLocaleString()}
              subtext="Mutual connections"
              color="text-blue-400"
            />
            <StatCard
              icon={MessageSquare}
              label="Messages"
              value={stats.messagesExchanged.toLocaleString()}
              subtext="AI-checked conversations"
              color="text-amber-400"
            />
          </div>

          {/* Founding Members Progress */}
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Founding Members</h3>
                <p className="text-slate-400 text-sm">$14.99/month locked forever (100 spots)</p>
              </div>
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{stats.preorders} / {stats.maxFounders} claimed</span>
                <span className="text-amber-400">{Math.round((stats.preorders / stats.maxFounders) * 100)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.preorders / stats.maxFounders) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">{stats.maxFounders - stats.preorders} founding member spots remaining</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5">
              <Shield className="w-8 h-8 text-green-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">AI Bot Detection</h4>
              <p className="text-sm text-slate-400">Every message scanned for AI-generated content. Real humans only.</p>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5">
              <UserCheck className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">Multi-Layer Verification</h4>
              <p className="text-sm text-slate-400">Video, CAPTCHA, and live call options to prove you're human.</p>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5">
              <Heart className="w-8 h-8 text-pink-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">For The Kids</h4>
              <p className="text-sm text-slate-400">60% of every subscription goes directly to charity Children's.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Human Verification Process</h3>
            <p className="text-slate-400 text-sm">Our multi-step verification ensures every user is a real person.</p>
          </div>

          <VerificationStep
            step={1}
            title="Age Verification"
            description="Confirm 18+ through ID verification or trusted third-party services"
            status="completed"
          />
          <VerificationStep
            step={2}
            title="Email Confirmation"
            description="Verify email address ownership through confirmation link"
            status="completed"
          />
          <VerificationStep
            step={3}
            title="Human Verification"
            description="Choose from: Video selfie, advanced CAPTCHA, or live video call"
            status="active"
          />
          <VerificationStep
            step={4}
            title="Profile Review"
            description="AI-assisted review to detect fake profiles and stock photos"
            status="pending"
          />
          <VerificationStep
            step={5}
            title="Ongoing Monitoring"
            description="Continuous message scanning for AI-generated content"
            status="pending"
          />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
            <div className="text-center py-10">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">User management dashboard coming soon</p>
              <p className="text-slate-500 text-sm mt-2">Connect to API to view registered users</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 border border-white/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.verifiedUsers}</p>
              <p className="text-xs text-slate-500">Verified</p>
            </div>
            <div className="bg-slate-800/30 border border-white/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.totalUsers - stats.verifiedUsers}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
            <div className="bg-slate-800/30 border border-white/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{stats.activeMatches}</p>
              <p className="text-xs text-slate-500">Matches</p>
            </div>
            <div className="bg-slate-800/30 border border-white/5 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-pink-400">{stats.preorders}</p>
              <p className="text-xs text-slate-500">Founders</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Split */}
          <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Revenue Distribution</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-slate-400 text-sm">60%</div>
                <div className="flex-1">
                  <div className="h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center px-4">
                    <span className="text-white font-semibold text-sm">charity Children's Hospitals</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-slate-400 text-sm">30%</div>
                <div className="flex-1">
                  <div className="h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center px-4" style={{ width: '60%' }}>
                    <span className="text-white font-semibold text-sm">Infrastructure</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-right text-slate-400 text-sm">20%</div>
                <div className="flex-1">
                  <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center px-4" style={{ width: '40%' }}>
                    <span className="text-white font-semibold text-sm">Founder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charity Total */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <p className="text-slate-300 text-sm mb-1">Total Raised for Charity</p>
            <p className="text-4xl font-bold text-green-400">${stats.revenueForCharity.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">60% of all dating app revenue</p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5 text-center">
              <h4 className="font-semibold text-white mb-2">Basic</h4>
              <p className="text-3xl font-bold text-pink-400 mb-2">$9.99<span className="text-sm text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-500">Unlimited swipes</p>
            </div>
            <div className="bg-slate-800/50 border border-amber-500/30 rounded-xl p-5 text-center relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded">POPULAR</div>
              <h4 className="font-semibold text-white mb-2">Premium</h4>
              <p className="text-3xl font-bold text-pink-400 mb-2">$19.99<span className="text-sm text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-500">Priority matching</p>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5 text-center">
              <h4 className="font-semibold text-white mb-2">VIP</h4>
              <p className="text-3xl font-bold text-pink-400 mb-2">$29.99<span className="text-sm text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-500">Concierge support</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatingPlatform;
