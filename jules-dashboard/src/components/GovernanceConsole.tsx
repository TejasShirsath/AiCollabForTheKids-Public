import React, { useState, useEffect } from 'react';
import { 
  Vote, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus,
  MessageSquare,
  Calendar,
  DollarSign,
  Target,
  Shield,
  AlertCircle
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'funding' | 'governance' | 'feature' | 'policy';
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorumRequired: number;
  endsAt: Date;
  createdAt: Date;
  fundingAmount?: number;
  impact?: string;
}

const GovernanceConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'create'>('active');

  // Production: Fetch proposals from API
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'https://combination-pay-resulted-drill.trycloudflare.com';
        const res = await fetch(`${API_URL}/api/governance/proposals`);
        if (res.ok) {
          const data = await res.json();
          setProposals(data.proposals || []);
        } else {
          setProposals([]);
        }
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
        setProposals([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const activeProposals = proposals.filter(p => p.status === 'active');
  const historicalProposals = proposals.filter(p => p.status !== 'active');

  const calculateVotePercentage = (votes: number, total: number) => {
    return total > 0 ? ((votes / total) * 100).toFixed(1) : '0.0';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      funding: 'text-green-400 bg-green-400/10 border-green-400/20',
      governance: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      feature: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      policy: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
    };
    return colors[category as keyof typeof colors] || 'text-gray-400';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'text-green-400 bg-green-400/10', icon: Clock, label: 'Active' },
      passed: { color: 'text-blue-400 bg-blue-400/10', icon: CheckCircle2, label: 'Passed' },
      rejected: { color: 'text-red-400 bg-red-400/10', icon: XCircle, label: 'Rejected' },
      pending: { color: 'text-yellow-400 bg-yellow-400/10', icon: Clock, label: 'Pending' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const formatTimeRemaining = (endsAt: Date) => {
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
    const statusBadge = getStatusBadge(proposal.status);
    const StatusIcon = statusBadge.icon;
    const quorumMet = proposal.totalVotes >= proposal.quorumRequired;
    const approvalRate = parseFloat(calculateVotePercentage(proposal.votesFor, proposal.totalVotes));

    return (
      <div 
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(proposal.category)}`}>
                {proposal.category.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color} flex items-center gap-1`}>
                <StatusIcon size={12} />
                {statusBadge.label}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
              {proposal.title}
            </h3>
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
              {proposal.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {proposal.fundingAmount && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign size={16} className="text-green-400" />
              <span className="text-gray-300">
                ${(proposal.fundingAmount / 1000).toFixed(0)}K requested
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Users size={16} className="text-blue-400" />
            <span className="text-gray-300">{proposal.totalVotes.toLocaleString()} votes</span>
          </div>
          {proposal.impact && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <Target size={16} className="text-purple-400" />
              <span className="text-gray-300">{proposal.impact}</span>
            </div>
          )}
        </div>

        {/* Vote Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Approval Rate</span>
            <span className={`font-semibold ${approvalRate >= 75 ? 'text-green-400' : approvalRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {approvalRate}%
            </span>
          </div>
          
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${calculateVotePercentage(proposal.votesFor, proposal.totalVotes)}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${calculateVotePercentage(proposal.votesAgainst, proposal.totalVotes)}%` }}
              />
              <div 
                className="bg-gray-500 transition-all duration-500"
                style={{ width: `${calculateVotePercentage(proposal.votesAbstain, proposal.totalVotes)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-400" />
                {proposal.votesFor.toLocaleString()} For
              </span>
              <span className="flex items-center gap-1">
                <XCircle size={12} className="text-red-400" />
                {proposal.votesAgainst.toLocaleString()} Against
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gray-400" />
                {proposal.votesAbstain.toLocaleString()} Abstain
              </span>
            </div>
          </div>

          {/* Quorum Status */}
          <div className={`flex items-center gap-2 text-xs mt-2 ${quorumMet ? 'text-green-400' : 'text-yellow-400'}`}>
            {quorumMet ? (
              <>
                <CheckCircle2 size={14} />
                <span>Quorum reached ({proposal.totalVotes}/{proposal.quorumRequired})</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} />
                <span>Quorum needed: {proposal.quorumRequired - proposal.totalVotes} more votes</span>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <span className="text-xs text-gray-400">
            by {proposal.proposer}
          </span>
          {proposal.status === 'active' && (
            <span className="text-xs text-purple-400 font-medium flex items-center gap-1">
              <Calendar size={12} />
              {formatTimeRemaining(proposal.endsAt)}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Vote className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">DAO Governance Console</h1>
              <p className="text-gray-400 mt-1">Community-driven decision making for #FOR THE KIDS</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Proposals</p>
                  <p className="text-2xl font-bold text-white mt-1">{activeProposals.length}</p>
                </div>
                <Clock className="text-purple-400" size={24} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Voters</p>
                  <p className="text-2xl font-bold text-white mt-1">0</p>
                </div>
                <Users className="text-blue-400" size={24} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Proposals Passed</p>
                  <p className="text-2xl font-bold text-white mt-1">0</p>
                </div>
                <CheckCircle2 className="text-green-400" size={24} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Funds Allocated</p>
                  <p className="text-2xl font-bold text-white mt-1">$0</p>
                </div>
                <DollarSign className="text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'active'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active Proposals ({activeProposals.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'history'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            History ({historicalProposals.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus size={18} />
            Create Proposal
          </button>
        </div>

        {/* Content */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 gap-4">
            {activeProposals.length > 0 ? (
              activeProposals.map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
                <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Active Proposals</h3>
                <p className="text-gray-400 mb-6">Be the first to create a proposal for the community to vote on.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create First Proposal
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 gap-4">
            {historicalProposals.length > 0 ? (
              historicalProposals.map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Proposal History Yet</h3>
                <p className="text-gray-400">Completed proposals will appear here once voting concludes.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Create New Proposal</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proposal Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a clear, concise title for your proposal"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors">
                  <option value="funding">Funding</option>
                  <option value="governance">Governance</option>
                  <option value="feature">Feature</option>
                  <option value="policy">Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide detailed information about your proposal, including expected impact and implementation plan"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Funding Amount (if applicable)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voting Duration (days)
                  </label>
                  <input
                    type="number"
                    placeholder="7"
                    defaultValue="7"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Impact
                </label>
                <input
                  type="text"
                  placeholder="e.g., 500 additional kids helped annually"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} />
                  Submit Proposal
                </button>
                <button className="px-6 py-3 border border-white/20 text-gray-300 rounded-lg hover:bg-white/5 transition-all">
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Proposals require a minimum of 500 votes to reach quorum. Voting period can be 3-30 days.
              </p>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <MessageSquare className="text-purple-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">How DAO Governance Works</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Submit Proposals:</strong> Any community member can create proposals for funding, features, policies, or governance changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Community Voting:</strong> All members vote For, Against, or Abstain on active proposals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Quorum Required:</strong> Minimum 500 votes needed for proposal validity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>Transparent Execution:</strong> Passed proposals are implemented with full community visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span><strong>100% Accountability:</strong> Every decision is tracked on-chain for permanent transparency</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceConsole;
