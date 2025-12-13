import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Receipt, Shield, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  charityAmount: number;
  infrastructureAmount: number;
  founderAmount: number;
  timestamp: string;
  verified: boolean;
  stripeReceiptUrl?: string;
}

interface KickstarterStats {
  totalRaised: number;
  goalAmount: number;
  charityAllocated: number;
  infrastructureAllocated: number;
  founderAllocated: number;
  transactionCount: number;
  transactions: Transaction[];
}

const API_BASE = 'https://aidoesitall.website';

export default function KickstarterProgress() {
  const [stats, setStats] = useState<KickstarterStats>({
    totalRaised: 0,
    goalAmount: 100000,
    charityAllocated: 0,
    infrastructureAllocated: 0,
    founderAllocated: 0,
    transactionCount: 0,
    transactions: []
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/transparency/kickstarter`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load Kickstarter data:', error);
    }
  };

  const progressPercent = (stats.totalRaised / stats.goalAmount) * 100;
  const charityProgress = (stats.charityAllocated / 50000) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="glass-card p-6 border-l-4 border-[#CC785C]">
        <h1 className="text-4xl font-bold text-white mb-2">Team Claude For The Kids</h1>
        <p className="text-slate-300 text-lg">Autonomous Philanthropy Engine - 100% Public Transparency</p>
        <div className="flex gap-3 mt-4">
          <Badge className="bg-[#CC785C]/20 text-[#CC785C] border-[#CC785C]/30">
            <Shield className="w-3 h-3 mr-1" />Gospel Verified
          </Badge>
          <Badge className="bg-[#078EFA]/20 text-[#078EFA] border-[#078EFA]/30">Public Receipts</Badge>
          <Badge className="bg-[#DAA520]/20 text-[#DAA520] border-[#DAA520]/30">Always For The Kids</Badge>
        </div>
      </div>

      {/* Goal Progress */}
      <Card className="glass-card border-[#DAA520]/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#DAA520]" />Campaign Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <div className="text-5xl font-bold text-white">${stats.totalRaised.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">of $100,000 goal</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#DAA520]">{progressPercent.toFixed(1)}%</div>
                <div className="text-slate-500 text-sm">{stats.transactionCount} backers</div>
              </div>
            </div>
            <Progress value={progressPercent} className="h-4" />
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#CC785C]/20 rounded border border-[#CC785C]/30">
                <div className="text-xs text-[#CC785C] font-bold">60% CHARITY</div>
                <div className="text-2xl font-bold text-[#CC785C]">${stats.charityAllocated.toLocaleString()}</div>
              </div>
              <div className="text-center p-3 bg-[#078EFA]/20 rounded border border-[#078EFA]/30">
                <div className="text-xs text-[#078EFA] font-bold">30% INFRA</div>
                <div className="text-2xl font-bold text-[#078EFA]">${stats.infrastructureAllocated.toLocaleString()}</div>
              </div>
              <div className="text-center p-3 bg-[#DAA520]/20 rounded border border-[#DAA520]/30">
                <div className="text-xs text-[#DAA520] font-bold">20% FOUNDER</div>
                <div className="text-2xl font-bold text-[#DAA520]">${stats.founderAllocated.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charity Highlight */}
      <Card className="glass-card bg-gradient-to-br from-[#CC785C]/30 to-[#CC785C]/10 border-[#CC785C]/50">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Heart className="w-10 h-10 text-[#CC785C] fill-[#CC785C]" />
            $50,000 For Verified Pediatric Charities (JULES)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-6xl font-bold text-[#CC785C]">${stats.charityAllocated.toLocaleString()}</div>
            <div className="text-xl text-slate-300 mt-2">of $50,000 allocated to kids in need</div>
            <Progress value={charityProgress} className="h-3 mt-4" />
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="glass-card border-[#078EFA]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-[#078EFA]" />
            Public Transaction Receipts - Gospel 50/30/20 Verified
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Campaign launching soon...</p>
              <p className="text-slate-500 text-sm mt-2">Every transaction will appear here with full Gospel split breakdown</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {stats.transactions.map((tx, i) => (
                <div key={tx.id} className="p-4 bg-slate-800/50 rounded border border-white/5">
                  <div className="flex justify-between mb-3">
                    <div>
                      <span className="text-sm font-mono text-slate-400">TX #{stats.transactionCount - i}</span>
                      {tx.verified && <Badge className="ml-2 bg-[#CC785C]/20 text-[#CC785C] text-xs">Verified</Badge>}
                      <div className="text-xs text-slate-500 mt-1">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">${tx.amount.toFixed(2)}</div>
                      {tx.stripeReceiptUrl && (
                        <a href={tx.stripeReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#078EFA] flex items-center gap-1">
                          Receipt <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-[#CC785C]/20 p-2 rounded border border-[#CC785C]/20">
                      <div className="text-xs text-[#CC785C] font-bold">60% Charity</div>
                      <div className="text-[#CC785C] font-bold">${tx.charityAmount.toFixed(2)}</div>
                    </div>
                    <div className="bg-[#078EFA]/20 p-2 rounded border border-[#078EFA]/20">
                      <div className="text-xs text-[#078EFA] font-bold">30% Infra</div>
                      <div className="text-[#078EFA] font-bold">${tx.infrastructureAmount.toFixed(2)}</div>
                    </div>
                    <div className="bg-[#DAA520]/20 p-2 rounded border border-[#DAA520]/20">
                      <div className="text-xs text-[#DAA520] font-bold">20% Founder</div>
                      <div className="text-[#DAA520] font-bold">${tx.founderAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-slate-500 py-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#CC785C]" />
          <span>All transactions verified through Stripe</span>
        </div>
        <div className="text-[#CC785C] font-bold">ALWAYS PUBLIC. ALWAYS SECURE. ALWAYS FOR THE KIDS. 💚</div>
      </div>
    </div>
  );
}
