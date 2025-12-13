import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Server,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  ExternalLink,
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface InfrastructureExpense {
  id: string;
  description: string;
  category: string;
  amount: number;
  vendor: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'PAID' | 'VERIFIED';
  createdAt: string;
  julesReasoning?: string;
  julesConfidence?: number;
  receiptS3Url?: string;
  allocatedFromMonth?: string;
  remainingBalance?: number;
}

interface LedgerStats {
  currentMonth: string;
  monthlyAllocation: number;
  totalProposed: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  amountAllocated: number;
  amountRemaining: number;
  percentageUsed: number;
  julesApprovalRate: number;
}

const API_BASE = 'https://aidoesitall.website';

export default function PublicLedger() {
  const [expenses, setExpenses] = useState<InfrastructureExpense[]>([]);
  const [stats, setStats] = useState<LedgerStats>({
    currentMonth: '',
    monthlyAllocation: 0,
    totalProposed: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalPending: 0,
    amountAllocated: 0,
    amountRemaining: 0,
    percentageUsed: 0,
    julesApprovalRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ledgerRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/infra/ledger?limit=50`),
        fetch(`${API_BASE}/api/infra/stats`)
      ]);

      if (ledgerRes.ok && statsRes.ok) {
        const ledgerData = await ledgerRes.json();
        const statsData = await statsRes.json();
        setExpenses(ledgerData.expenses || []);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-[#20808D]" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'PAID':
        return <DollarSign className="w-5 h-5 text-[#DAA520]" />;
      case 'VERIFIED':
        return <Shield className="w-5 h-5 text-[#CC785C]" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'PROPOSED': 'bg-slate-700/50 text-slate-300 border-slate-600',
      'APPROVED': 'bg-[#20808D]/20 text-[#20808D] border-[#20808D]/30',
      'REJECTED': 'bg-red-500/20 text-red-400 border-red-500/30',
      'PAID': 'bg-[#DAA520]/20 text-[#DAA520] border-[#DAA520]/30',
      'VERIFIED': 'bg-[#CC785C]/20 text-[#CC785C] border-[#CC785C]/30'
    };

    return (
      <Badge className={colors[status] || colors.PROPOSED}>
        {status}
      </Badge>
    );
  };

  const getCategoryIcon = () => {
    return <Server className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading infrastructure ledger...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="glass-card p-6 border-l-4 border-[#078EFA]">
        <h1 className="text-4xl font-bold text-white mb-2">30% Infrastructure Public Ledger</h1>
        <p className="text-slate-300 text-lg">
          GEMINI OMEGA GOSPEL - Every dollar tracked. Jules (AI) approves. 100% transparent.
        </p>
        <div className="flex gap-3 mt-4">
          <Badge className="bg-[#078EFA]/20 text-[#078EFA] border-[#078EFA]/30">
            <Shield className="w-3 h-3 mr-1" />AI Approved
          </Badge>
          <Badge className="bg-[#20808D]/20 text-[#20808D] border-[#20808D]/30">Gospel Locked</Badge>
          <Badge className="bg-[#CC785C]/20 text-[#CC785C] border-[#CC785C]/30">Always Public</Badge>
        </div>
      </div>

      {/* Fund Status */}
      <Card className="glass-card border-[#20808D]/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-[#20808D]" />
            {stats.currentMonth} Infrastructure Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-5xl font-bold text-white">
                  ${stats.amountAllocated.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm">
                  of ${stats.monthlyAllocation.toLocaleString()} allocated (30%)
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#20808D]">
                  {stats.percentageUsed}%
                </div>
                <div className="text-slate-500 text-sm">
                  ${stats.amountRemaining.toLocaleString()} remaining
                </div>
              </div>
            </div>

            <Progress value={parseFloat(stats.percentageUsed.toString())} className="h-4" />

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-700/50 rounded border border-slate-600/30">
                <div className="text-xs text-slate-400 font-bold">PROPOSED</div>
                <div className="text-2xl font-bold text-white">{stats.totalProposed}</div>
              </div>
              <div className="text-center p-3 bg-[#20808D]/20 rounded border border-[#20808D]/30">
                <div className="text-xs text-[#20808D] font-bold">APPROVED</div>
                <div className="text-2xl font-bold text-[#20808D]">{stats.totalApproved}</div>
              </div>
              <div className="text-center p-3 bg-red-500/20 rounded border border-red-500/30">
                <div className="text-xs text-red-400 font-bold">REJECTED</div>
                <div className="text-2xl font-bold text-red-400">{stats.totalRejected}</div>
              </div>
              <div className="text-center p-3 bg-[#078EFA]/20 rounded border border-[#078EFA]/30">
                <div className="text-xs text-[#078EFA] font-bold">JULES RATE</div>
                <div className="text-2xl font-bold text-[#078EFA]">{stats.julesApprovalRate}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Ledger */}
      <Card className="glass-card border-[#078EFA]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#078EFA]" />
            All Infrastructure Expenses - Jules AI Evaluated
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No expenses recorded yet...</p>
              <p className="text-slate-500 text-sm mt-2">
                Every infrastructure expense will appear here with Jules' evaluation
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {expenses.map((expense, i) => (
                <div key={expense.id} className="p-4 bg-slate-800/50 rounded border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(expense.status)}
                        <span className="text-sm font-mono text-slate-400">
                          #{expenses.length - i}
                        </span>
                        {getStatusBadge(expense.status)}
                        <Badge className="bg-slate-700/50 text-slate-300 border-slate-600">
                          {getCategoryIcon()}
                          <span className="ml-1">{expense.category}</span>
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white">{expense.description}</h3>
                      <p className="text-sm text-slate-400 mt-1">Vendor: {expense.vendor}</p>
                      <div className="text-xs text-slate-500 mt-1">
                        Proposed: {new Date(expense.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        ${expense.amount.toFixed(2)}
                      </div>
                      {expense.receiptS3Url && (
                        <a
                          href={expense.receiptS3Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#078EFA] flex items-center gap-1 mt-2"
                        >
                          Receipt <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Jules Reasoning */}
                  {expense.julesReasoning && (
                    <div className="mt-3 p-3 bg-[#078EFA]/10 rounded border border-[#078EFA]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-[#078EFA]" />
                        <span className="text-sm font-bold text-[#078EFA]">
                          Jules (Gemini AI) Evaluation
                        </span>
                        {expense.julesConfidence && (
                          <Badge className="bg-[#078EFA]/20 text-[#078EFA] text-xs">
                            {expense.julesConfidence}% confidence
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-300">{expense.julesReasoning}</p>
                    </div>
                  )}

                  {/* Balance After */}
                  {expense.remainingBalance !== null && expense.remainingBalance !== undefined && (
                    <div className="mt-2 text-xs text-slate-500">
                      Remaining fund balance after: ${expense.remainingBalance.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-slate-500 py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#078EFA]" />
          <span>Every expense evaluated by Jules (Gemini AI)</span>
        </div>
        <div className="text-[#078EFA] font-bold">
          GEMINI OMEGA GOSPEL - 30% INFRASTRUCTURE - 100% PUBLIC. FOR THE KIDS. 💙
        </div>
      </div>
    </div>
  );
}
