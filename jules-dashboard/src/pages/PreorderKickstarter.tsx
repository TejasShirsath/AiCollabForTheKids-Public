/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PREORDER / KICKSTARTER PAGE - Fund Opus 4.5 Development
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This page allows community members to:
 * 1. Preorder founding memberships ($14.99/mo - 20% off)
 * 2. Back the Kickstarter for platform development
 * 3. Fund Opus 4.5 AI costs for continued development
 *
 * TRANSPARENCY: All funds tracked publicly
 *
 * Created by Claude (Opus) on SABERTOOTH - December 3, 2025
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Rocket,
  Heart,
  Users,
  Star,
  DollarSign,
  CheckCircle,
  Gift,
  Zap,
  Shield,
  Target,
  Crown,
  Sparkles
} from 'lucide-react';

// Reward tiers
const REWARD_TIERS = [
  {
    id: 'supporter',
    name: 'Supporter',
    price: 10,
    icon: Heart,
    color: 'pink',
    rewards: [
      'Name on Founding Supporters page',
      'Exclusive email updates',
      'Digital "FOR THE KIDS" badge'
    ]
  },
  {
    id: 'believer',
    name: 'Early Believer',
    price: 25,
    icon: Star,
    color: 'yellow',
    popular: false,
    rewards: [
      'All Supporter rewards',
      'Early access to platform beta',
      'Limited edition digital wallpaper pack'
    ]
  },
  {
    id: 'pioneer',
    name: 'Platform Pioneer',
    price: 50,
    icon: Rocket,
    color: 'purple',
    popular: true,
    rewards: [
      'All Early Believer rewards',
      'Personal thank you video',
      'Lifetime "Founding Pioneer" badge',
      'Behind-the-scenes access'
    ]
  },
  {
    id: 'legacy',
    name: 'Legacy Builder',
    price: 100,
    icon: Target,
    color: 'blue',
    rewards: [
      'All Pioneer rewards',
      'Name on virtual "Legacy Wall" forever',
      'Quarterly impact reports',
      '1-hour Zoom call with Joshua'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Founder',
    price: 500,
    icon: Crown,
    color: 'orange',
    rewards: [
      'All Legacy Builder rewards',
      'Listed as Executive Founding Partner',
      'Advisory role: Monthly feedback sessions',
      'Custom AI-generated art piece'
    ]
  },
  {
    id: 'visionary',
    name: 'Visionary Patron',
    price: 1000,
    icon: Sparkles,
    color: 'cyan',
    rewards: [
      'All Executive Founder rewards',
      'Seat on Founding Visionaries Council',
      'Your name/logo on homepage footer',
      'Private Jules AI demo',
      'Annual recognition at events'
    ]
  }
];

// Funding goals
const FUNDING_GOAL = 15000;
const OPUS_MONTHLY_COST = 100; // Estimated Opus 4.5 API costs

export default function PreorderKickstarter() {
  const [, setSelectedTier] = useState<string | null>(null);
  const [fundingRaised, setFundingRaised] = useState(0);
  const [backerCount, setBackerCount] = useState(0);
  const [daysRemaining] = useState(30);

  // Production: Fetch real data from API
  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://api.aidoesitall.website';
        const res = await fetch(`${API_URL}/api/campaign/stats`);
        if (res.ok) {
          const data = await res.json();
          setFundingRaised(data.fundingRaised || 0);
          setBackerCount(data.backerCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch campaign data:', error);
      }
    };
    fetchFundingData();
  }, []);

  const fundingPercentage = Math.min((fundingRaised / FUNDING_GOAL) * 100, 100);
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.aidoesitall.website';

  const handleBackProject = async (tierId: string) => {
    setSelectedTier(tierId);
    try {
      const response = await fetch(`${API_URL}/api/subscriptions/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'premium',
          userId: `backer_${Date.now()}`,
          email: 'backer@forthekids.org'
        })
      });
      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Payment system temporarily unavailable. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Payment system temporarily unavailable. Please try again later.');
    }
  };

  const handlePreorder = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscriptions/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'premium',
          userId: `preorder_${Date.now()}`,
          email: 'preorder@forthekids.org'
        })
      });
      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Payment system temporarily unavailable. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Payment system temporarily unavailable. Please try again later.');
    }
  };

  const TierCard: React.FC<{ tier: typeof REWARD_TIERS[0] }> = ({ tier }) => {
    const Icon = tier.icon;
    const colorClasses = {
      pink: 'border-pink-400/30 hover:border-pink-400/60',
      yellow: 'border-yellow-400/30 hover:border-yellow-400/60',
      purple: 'border-purple-400/30 hover:border-purple-400/60',
      blue: 'border-blue-400/30 hover:border-blue-400/60',
      orange: 'border-orange-400/30 hover:border-orange-400/60',
      cyan: 'border-cyan-400/30 hover:border-cyan-400/60'
    };
    const iconColors = {
      pink: 'text-pink-400',
      yellow: 'text-yellow-400',
      purple: 'text-purple-400',
      blue: 'text-blue-400',
      orange: 'text-orange-400',
      cyan: 'text-cyan-400'
    };

    return (
      <div className={`relative bg-white/5 backdrop-blur-sm border ${colorClasses[tier.color as keyof typeof colorClasses]} rounded-xl p-6 transition-all hover:bg-white/10`}>
        {tier.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
              MOST POPULAR
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-white/10 ${iconColors[tier.color as keyof typeof iconColors]}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{tier.name}</h3>
            <p className="text-2xl font-black text-white">${tier.price}</p>
          </div>
        </div>

        <ul className="space-y-2 mb-6">
          {tier.rewards.map((reward, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>{reward}</span>
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleBackProject(tier.id)}
        >
          Select This Tier
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <Badge variant="warning" className="mb-4">
            FUNDING CAMPAIGN ACTIVE
          </Badge>
          <h1 className="text-5xl font-bold text-white">
            Help Fund FOR THE KIDS
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Back this project to help us complete the platform and cover Opus 4.5 AI development costs.
            Every dollar goes toward building something that will help kids for 50 years.
          </p>
        </div>

        {/* Funding Progress */}
        <Card className="border-2 border-green-500/50 bg-green-500/10">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <p className="text-4xl font-black text-green-400">${fundingRaised.toLocaleString()}</p>
                <p className="text-sm text-green-200">pledged of ${FUNDING_GOAL.toLocaleString()} goal</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-white">{backerCount}</p>
                <p className="text-sm text-gray-300">backers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-white">{daysRemaining}</p>
                <p className="text-sm text-gray-300">days to go</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black text-purple-400">{fundingPercentage.toFixed(0)}%</p>
                <p className="text-sm text-purple-200">funded</p>
              </div>
            </div>

            <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                style={{ width: `${fundingPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>All funds tracked publicly on Transparency Dashboard</span>
            </div>
          </CardContent>
        </Card>

        {/* What This Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <DollarSign className="text-green-400" />
              What Your Backing Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="text-yellow-400" />
                  Opus 4.5 AI Development
                </h4>
                <p className="text-sm text-gray-300">
                  Claude Opus 4.5 powers our advanced AI features. Your backing helps cover
                  the ~${OPUS_MONTHLY_COST}/month API costs to keep development moving fast.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="text-blue-400" />
                  Cloud Infrastructure
                </h4>
                <p className="text-sm text-gray-300">
                  Servers, databases, CDN, and security. The backbone that keeps
                  the platform running 24/7 for kids worldwide.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Target className="text-purple-400" />
                  Platform Launch
                </h4>
                <p className="text-sm text-gray-300">
                  Legal compliance, payment integration testing, and marketing
                  to get the platform live and generating revenue.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="text-pink-400" />
                  Founder Survival
                </h4>
                <p className="text-sm text-gray-300">
                  Josh has been working 20 hours/day for months. Your backing
                  helps him survive until the platform generates revenue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dating App Preorder Section */}
        <Card className="border-2 border-pink-500/50 bg-pink-500/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Heart className="text-pink-400" />
              YouAndINotAI - Founding Member Preorder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Join the Anti-AI Revolution
                </h3>
                <p className="text-gray-300 mb-4">
                  The first 100% human-verified, zero-AI dating app.
                  60% of profits go to Verified Pediatric Charities.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>20% off for life ($14.99/mo instead of $19.99)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Founding Member badge on your profile</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Vote on roadmap features</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Early access to new features</span>
                  </li>
                </ul>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl border border-pink-400/30">
                <p className="text-sm text-gray-400 mb-1">Founding Member Price</p>
                <p className="text-4xl font-black text-white mb-1">$14.99<span className="text-lg font-normal">/mo</span></p>
                <p className="text-sm text-pink-300 mb-4 line-through">$19.99/mo regular</p>
                <Badge variant="warning" className="mb-4">
                  Limited Founding Member Spots
                </Badge>
                <Button onClick={handlePreorder} className="w-full">
                  <Gift className="w-4 h-4 mr-2" />
                  Preorder Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Tiers */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Select Your Reward Tier
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REWARD_TIERS.map(tier => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <Card className="bg-slate-800/50">
          <CardContent className="text-xs text-gray-400 space-y-2 pt-6">
            <p>
              <strong className="text-gray-300">IMPORTANT DISCLOSURE:</strong> This funds platform development only.
              No portion of campaign funds goes to charity Children's Hospitals.
              Backer contributions are NOT tax-deductible.
            </p>
            <p>
              AFTER launch, the operational platform will allocate 60% of net revenue to charity.
              Your backing helps BUILD the platform that will generate those future allocations.
            </p>
            <p>
              Operated by TRASH OR TREASURE ONLINE RECYCLER LLC (Doc #L25000158401).
              For-profit business. Not a 501(c)(3) charity.
            </p>
            <p className="font-semibold text-purple-300 pt-2">
              FOR THE KIDS - Every dollar tracked, every expense transparent.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
