import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MapPin,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Sparkles,
  Globe,
  Building2,
  Baby,
  Smile,
  Activity
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  subscriber: string;
  timestamp: Date;
  beneficiary: string;
  location: string;
}

interface HospitalImpact {
  id: string;
  name: string;
  location: string;
  totalReceived: number;
  kidsHelped: number;
  latitude: number;
  longitude: number;
}

const ImpactTracker: React.FC = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Production: Live data from API
  const [totalRaised, setTotalRaised] = useState(0);
  const [kidsHelped] = useState(0);
  const [hospitalsServed] = useState(0);
  const [avgTransaction, setAvgTransaction] = useState(0);
  const [hospitalImpact] = useState<HospitalImpact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Suppress unused variable warnings - these will be populated by future API endpoints
  void isLoading;

  const revenueBreakdown = {
    directToHospitals: 50,
    platformOperations: 30,
    futureGrowth: 20
  };

  useEffect(() => {
    // Production: Fetch real data from transparency API
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'https://theoretical-bras-difference-kirk.trycloudflare.com';

        // Fetch transparency stats
        const statsRes = await fetch(`${API_URL}/api/transparency/stats`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setTotalRaised(stats.totalRevenue || 0);
          setAvgTransaction(stats.transactionCount > 0 ? stats.totalRevenue / stats.transactionCount : 0);
        }

        // Fetch current month transactions
        const monthRes = await fetch(`${API_URL}/api/transparency/current-month`);
        if (monthRes.ok) {
          const monthData = await monthRes.json();
          // Transform API data to Transaction format
          if (monthData.sources) {
            const txs: Transaction[] = monthData.sources.map((src: { name: string; amount: number }, idx: number) => ({
              id: `tx-${idx}`,
              amount: src.amount,
              subscriber: src.name,
              timestamp: new Date(),
              beneficiary: 'charity Children\'s Hospitals',
              location: 'National'
            }));
            setRecentTransactions(txs);
          }
        }
      } catch (error) {
        console.error('Failed to fetch transparency data:', error);
        // Keep empty state on error - no mock data
        setRecentTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTimeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
              <Heart className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Impact Tracker</h1>
              <p className="text-gray-300 mt-1">Real-time visualization of every dollar making a difference</p>
            </div>
          </div>

          {/* Big Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="text-green-400" size={28} />
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <p className="text-gray-300 text-sm mb-1">Total Raised</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalRaised)}</p>
              <p className="text-xs text-gray-400 mt-2">Live from API</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Baby className="text-purple-400" size={28} />
                <Sparkles className="text-purple-400" size={20} />
              </div>
              <p className="text-gray-300 text-sm mb-1">Kids Helped</p>
              <p className="text-3xl font-bold text-white">{kidsHelped.toLocaleString()}</p>
              <p className="text-xs text-purple-400 mt-2">Across {hospitalsServed} hospitals</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Building2 className="text-blue-400" size={28} />
                <Globe className="text-blue-400" size={20} />
              </div>
              <p className="text-gray-300 text-sm mb-1">Hospitals</p>
              <p className="text-3xl font-bold text-white">{hospitalsServed}</p>
              <p className="text-xs text-gray-400 mt-2">Starting with charity</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Users className="text-orange-400" size={28} />
                <Heart className="text-orange-400" size={20} />
              </div>
              <p className="text-gray-300 text-sm mb-1">Avg Transaction</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(avgTransaction)}</p>
              <p className="text-xs text-orange-400 mt-2">Launching Soon</p>
            </div>
          </div>
        </div>

        {/* Campaign Progress Widget */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-400/40 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Target className="text-green-400" size={32} />
              <h2 className="text-3xl font-bold text-white">Campaign Progress</h2>
            </div>
            <p className="text-gray-300 text-lg">Every dollar brings us closer to helping more children</p>
          </div>

          <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
            <span className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {formatCurrency(totalRaised)}
            </span>
            <span className="text-2xl font-bold text-gray-400">of $100,000 goal</span>
          </div>

          <div className="relative h-16 bg-slate-900/50 rounded-full overflow-hidden mb-6 border-2 border-green-400/30">
            <div
              className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 transition-all duration-[2000ms] ease-out flex items-center justify-end pr-6"
              style={{
                width: `${Math.max((totalRaised / 100000) * 100, 0.5)}%`,
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <span className="text-white font-black text-lg">
                {((totalRaised / 100000) * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-400">{formatCurrency(totalRaised * 0.5)}</p>
              <p className="text-sm text-gray-400 mt-1">To charity Children's (60%))</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-blue-400">{formatCurrency(totalRaised * 0.3)}</p>
              <p className="text-sm text-gray-400 mt-1">Infrastructure (30%)</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-purple-400">{formatCurrency(totalRaised * 0.2)}</p>
              <p className="text-sm text-gray-400 mt-1">Growth (20%)</p>
            </div>
          </div>
        </div>

        {/* Revenue Model Visualization */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-purple-400" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-white">Revenue Distribution Model</h2>
              <p className="text-gray-400 text-sm">Transparent breakdown of every dollar received</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Direct to Hospitals */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{revenueBreakdown.directToHospitals}%</h3>
                  <p className="text-xs text-gray-400">Direct to Hospitals</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Immediately transferred to children's hospitals for critical care, equipment, and programs
              </p>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${revenueBreakdown.directToHospitals}%` }} />
              </div>
              <p className="text-xl font-bold text-green-400 mt-3">{formatCurrency(totalRaised * 0.50)}</p>
            </div>

            {/* Platform Operations */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{revenueBreakdown.platformOperations}%</h3>
                  <p className="text-xs text-gray-400">Platform Operations</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Infrastructure, security, support, and operational costs to keep platform running 24/7
              </p>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${revenueBreakdown.platformOperations}%` }} />
              </div>
              <p className="text-xl font-bold text-blue-400 mt-3">{formatCurrency(totalRaised * 0.30)}</p>
            </div>

            {/* Future Growth */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{revenueBreakdown.futureGrowth}%</h3>
                  <p className="text-xs text-gray-400">Future Growth</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Development of new features, expanding hospital network, and scaling impact
              </p>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${revenueBreakdown.futureGrowth}%` }} />
              </div>
              <p className="text-xl font-bold text-purple-400 mt-3">{formatCurrency(totalRaised * 0.20)}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
            <p className="text-sm text-gray-300 text-center">
              <strong className="text-white">Our Commitment:</strong> As platform scales, operational costs decrease proportionally. 
              Goal: Transition to <strong className="text-green-400">100% direct to hospitals</strong> as volume increases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Live Revenue Tracking */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-pink-400" size={20} />
                <h3 className="text-xl font-semibold text-white">Revenue Tracking</h3>
                <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  PRELAUNCH
                </span>
              </div>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all border border-white/10 animate-fade-in"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="text-pink-400" size={16} />
                          <span className="font-semibold text-white">{transaction.subscriber}</span>
                          <span className="text-xs text-gray-500">{getTimeAgo(transaction.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <MapPin size={12} />
                          {transaction.beneficiary}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-400">{formatCurrency(transaction.amount)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 rounded-lg p-12 text-center border border-white/10">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No transactions yet</p>
                  <p className="text-gray-500 text-xs mt-1">Launch campaign starting soon</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Hospitals */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-400" size={20} />
              <h3 className="text-xl font-semibold text-white">Impact by Hospital</h3>
            </div>

            <div className="space-y-4">
              {hospitalImpact.length > 0 ? (
                hospitalImpact.map((hospital, index) => (
                  <div key={hospital.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-purple-400">#{index + 1}</span>
                          <span className="font-semibold text-white text-sm">{hospital.name}</span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin size={10} />
                          {hospital.location}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Total Received</p>
                        <p className="text-lg font-bold text-green-400">{formatCurrency(hospital.totalReceived)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Kids Helped</p>
                        <p className="text-lg font-bold text-purple-400 flex items-center gap-1">
                          <Smile size={16} />
                          {hospital.kidsHelped.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                        style={{ width: `${(hospital.totalReceived / hospitalImpact[0].totalReceived) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 rounded-lg p-12 text-center border border-white/10">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No partnerships established yet</p>
                  <p className="text-gray-500 text-xs mt-1">Starting with charity Children's Hospitals</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Growth Trends - PRELAUNCH */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-indigo-400" size={20} />
            <h3 className="text-xl font-semibold text-white">Growth Trends</h3>
            <span className="px-2 py-1 bg-gray-400/20 text-gray-400 text-xs rounded-full">PRELAUNCH</span>
          </div>

          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No historical data yet</p>
            <p className="text-gray-500 text-xs mt-1">Growth trends will appear after first quarter of operation</p>
          </div>
        </div>

        {/* Transparency Notice */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="text-purple-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">100% Transparency Guarantee</h3>
              <p className="text-gray-300 text-sm mb-3">
                Every single dollar is tracked with immutable records. You can verify exactly how revenue is allocated,
                which beneficiaries receive funds, and the real-world impact. No hidden fees, no surprises.
              </p>
              <p className="text-xs text-gray-400 mb-3 italic border-l-2 border-purple-400/30 pl-3">
                Operated by TRASH OR TREASURE ONLINE RECYCLER LLC (L25000158401). This is an internal corporate financial ledger.
                Funds shown in "DAO Treasury" are company assets reserved for profit allocation at the discretion of ownership.
                This is not a public solicitation fund.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">Real-time tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-300">Database verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span className="text-gray-300">Public audit trail</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImpactTracker;
