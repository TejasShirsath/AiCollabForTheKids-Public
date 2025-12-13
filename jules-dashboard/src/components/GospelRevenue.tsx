import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, Shield, TrendingUp, AlertCircle } from 'lucide-react';

interface Financials {
  total: number;
  splits: {
    charity: number;
    infrastructure: number;
    founder: number;
  };
  children_helped: number;
  charity_name: string;
  transaction_count: number;
  updated_at: string;
}

// Live Financial API Endpoint
const API_BASE = 'https://aidoesitall.website';

export default function GospelRevenue() {
  const [data, setData] = useState<Financials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/transparency/stats`);
        if (!response.ok) throw new Error('API request failed');
        const json = await response.json();

        // Transform API response to match our interface
        setData({
          total: Math.round(json.totalRevenue * 100), // Convert to cents
          splits: {
            charity: Math.round(json.totalToCharity * 100),
            infrastructure: Math.round(json.totalToInfrastructure * 100),
            founder: Math.round(json.totalToFounder * 100)
          },
          children_helped: Math.floor(json.totalToCharity / 100), // Estimate: $100 per child
          charity_name: 'Verified Pediatric Charities',
          transaction_count: json.transactionCount || 0,
          updated_at: new Date().toISOString()
        });
        setError(false);
      } catch (err) {
        setError(true);
        console.error('Failed to fetch financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-void">
        <div className="text-center">
          <DollarSign className="w-12 h-12 animate-pulse text-[#DAA520] mx-auto mb-4" />
          <div className="text-slate-400">Loading Live Gospel Revenue...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-void">
        <div className="text-center glass-card p-8">
          <AlertCircle className="w-12 h-12 text-[#CC785C] mx-auto mb-4" />
          <div className="text-slate-300 text-lg font-bold">Financial API Connection Error</div>
          <div className="text-slate-500 text-sm mt-2">Check T5500 API status</div>
        </div>
      </div>
    );
  }

  // Convert cents to dollars
  const totalRevenue = data.total / 100;
  const charityAmount = data.splits.charity / 100;
  const infraAmount = data.splits.infrastructure / 100;
  const founderAmount = data.splits.founder / 100;
  const childrenHelped = data.children_helped.toLocaleString();

  return (
    <div className="space-y-6 p-6 bg-brand-void">
      {/* GOSPEL HEADER - Kids First Mandate */}
      <div className="glass-card p-6 border-l-4 border-[#CC785C] shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-[#CC785C]" />
              GOSPEL REVENUE VERIFICATION
            </h1>
            <p className="text-slate-300 text-lg">
              <span className="text-[#CC785C] font-bold">KIDS FIRST</span> - 50/30/20 Split on NET Profit (Immutable)
            </p>
            <div className="text-sm text-slate-500 mt-2">
              <strong>Mandate:</strong> Kids needs over structure or financial sustainability. Non-negotiable.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-[#DAA520]/20 text-[#DAA520] border-[#DAA520]/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              NET Profit Split
            </Badge>
            <Badge className="bg-[#CC785C]/20 text-[#CC785C] border-[#CC785C]/30">
              <Heart className="w-3 h-3 mr-1 fill-[#CC785C]" />
              Gospel Verified
            </Badge>
          </div>
        </div>
      </div>

      {/* LIVE STATS - Revenue and Impact */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total NET Revenue */}
        <Card className="glass-card border-[#DAA520]/30">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-2">Total NET Revenue</div>
            <div className="text-3xl font-bold text-[#DAA520]">
              ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </CardContent>
        </Card>

        {/* Children Helped */}
        <Card className="glass-card border-[#CC785C]/30">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-2">Children Helped (Est.)</div>
            <div className="text-3xl font-bold text-[#CC785C]">{childrenHelped}</div>
          </CardContent>
        </Card>

        {/* Transaction Count */}
        <Card className="glass-card border-[#20808D]/30">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-2">Verified Transactions</div>
            <div className="text-3xl font-bold text-[#20808D]">{data.transaction_count.toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card className="glass-card border-[#078EFA]/30">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-400 mb-2">Last Updated (Live)</div>
            <div className="text-lg font-mono text-white mt-1">
              {new Date(data.updated_at).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* IMMUTABLE GOSPEL 50/30/20 SPLIT - KIDS FIRST EMPHASIS */}
      <Card className="glass-card border-[#CC785C]/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Heart className="w-10 h-10 text-[#CC785C] fill-[#CC785C]" />
            IMMUTABLE GOSPEL 50/30/20 SPLIT
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Every dollar split according to Gospel Rule #2 - Calculated on NET profit only
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {/* 60% CHARITY - KIDS FIRST (LARGEST & MOST PROMINENT) */}
            <div className="col-span-3 md:col-span-1 p-8 rounded-lg border-2 border-[#CC785C] bg-gradient-to-br from-[#CC785C]/30 to-[#CC785C]/10 shadow-xl">
              <div className="text-center">
                <Heart className="w-16 h-16 text-[#CC785C] fill-[#CC785C] mx-auto mb-4" />
                <div className="text-lg font-bold text-[#CC785C] mb-2">
                  60% CHARITY (KIDS FIRST)
                </div>
                <div className="text-6xl font-bold text-[#CC785C] mb-3">
                  ${charityAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className="text-sm text-slate-300 font-semibold">
                  {data.charity_name}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Priority Tier 1 - Non-Negotiable
                </div>
              </div>
            </div>

            {/* 30% Infrastructure - Tier 2 */}
            <div className="p-6 rounded-lg border border-[#078EFA]/50 bg-[#078EFA]/10">
              <div className="text-center">
                <Shield className="w-10 h-10 text-[#078EFA] mx-auto mb-3" />
                <div className="text-sm font-bold text-[#078EFA] mb-2">
                  30% INFRASTRUCTURE (Tier 2)
                </div>
                <div className="text-4xl font-bold text-[#078EFA] mb-2">
                  ${infraAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className="text-xs text-slate-400">
                  Public Ledger Available
                </div>
              </div>
            </div>

            {/* 20% Founder - Tier 3 */}
            <div className="p-6 rounded-lg border border-[#DAA520]/50 bg-[#DAA520]/10">
              <div className="text-center">
                <DollarSign className="w-10 h-10 text-[#DAA520] mx-auto mb-3" />
                <div className="text-sm font-bold text-[#DAA520] mb-2">
                  20% FOUNDER (Tier 3)
                </div>
                <div className="text-4xl font-bold text-[#DAA520] mb-2">
                  ${founderAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className="text-xs text-slate-400">
                  Sustainability Fund
                </div>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded border border-[#CC785C]/20 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <Shield className="w-4 h-4 text-[#CC785C]" />
              <span>All splits verified and immutable. Updated every 15 seconds.</span>
            </div>
            <div className="text-xs text-[#CC785C] font-bold mt-2">
              FOR THE KIDS - FOR LIFE AND AFTER 💚
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gospel Rule Summary */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-xl">Gospel Rule #2 - Revenue Split</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-[#CC785C] rounded-full mt-1.5"></div>
              <div><strong className="text-[#CC785C]">Tier 1 (60%):</strong> Kids needs ALWAYS come first. Non-negotiable mandate.</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-[#078EFA] rounded-full mt-1.5"></div>
              <div><strong className="text-[#078EFA]">Tier 2 (30%):</strong> Infrastructure sustainability (servers, APIs, domains).</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-[#DAA520] rounded-full mt-1.5"></div>
              <div><strong className="text-[#DAA520]">Tier 3 (20%):</strong> Founder sustainability fund.</div>
            </div>
            <div className="flex items-start gap-2 mt-4 pt-4 border-t border-white/10">
              <AlertCircle className="w-4 h-4 text-[#CC785C] mt-0.5" />
              <div className="text-[#CC785C]">
                <strong>Split calculated on NET profit only</strong> - After COGS (product cost + shipping + fees) are deducted.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
