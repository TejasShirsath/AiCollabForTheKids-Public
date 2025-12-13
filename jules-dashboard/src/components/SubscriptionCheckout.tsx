import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Heart, Sparkles, Crown, Zap } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay: string;
  interval: string;
  features: string[];
}

interface DonationStats {
  totalDonated: number;
  thisMonth: number;
  transactionCount: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://theoretical-bras-difference-kirk.trycloudflare.com';

const SubscriptionCheckout: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donationStats] = useState<DonationStats>({
    totalDonated: 0,
    thisMonth: 0,
    transactionCount: 0
  });

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stripe/plans`);
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      // Fallback plans
      setPlans([
        {
          id: 'starter',
          name: 'Starter',
          description: 'Perfect for individuals getting started',
          price: 999,
          priceDisplay: '$9.99',
          interval: 'month',
          features: [
            '100 AI queries per month',
            'Basic chat support',
            'Email support',
            '60% goes to charity'
          ]
        },
        {
          id: 'pro',
          name: 'Pro',
          description: 'Best for professionals and small teams',
          price: 2999,
          priceDisplay: '$29.99',
          interval: 'month',
          features: [
            '1,000 AI queries per month',
            'Priority chat support',
            'Phone support',
            'Advanced analytics',
            '60% goes to charity'
          ]
        },
        {
          id: 'vip',
          name: 'VIP',
          description: 'Enterprise-grade features for power users',
          price: 9999,
          priceDisplay: '$99.99',
          interval: 'month',
          features: [
            'Unlimited AI queries',
            'Dedicated account manager',
            '24/7 priority support',
            'Custom integrations',
            'Early access to features',
            '60% goes to charity'
          ]
        }
      ]);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !email) {
      setError('Please select a plan and enter your email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Map frontend plan IDs to backend tier names
      const tierMap: Record<string, string> = {
        'starter': 'premium',
        'pro': 'premium',
        'vip': 'vip'
      };

      const response = await fetch(`${API_URL}/api/subscriptions/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tierMap[selectedPlan] || 'premium',
          userId: `user_${Date.now()}`,
          email: email
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || 'Payment system temporarily unavailable. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Payment system temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return <Zap className="w-8 h-8 text-brand-coral" />;
      case 'pro':
        return <Sparkles className="w-8 h-8 text-brand-blue" />;
      case 'vip':
        return <Crown className="w-8 h-8 text-amber-400" />;
      default:
        return <CreditCard className="w-8 h-8" />;
    }
  };

  const getPlanBorder = (planId: string) => {
    if (selectedPlan === planId) {
      return 'border-brand-coral ring-2 ring-brand-coral';
    }
    return 'border-brand-surface hover:border-brand-coral/50';
  };

  return (
    <div className="min-h-full bg-brand-void p-6 overflow-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-brand-coral" />
          <h1 className="text-3xl font-bold text-brand-text">Subscribe & Support</h1>
        </div>
        <p className="text-brand-text/70 text-lg">
          60% of every subscription goes directly to charity Children's Hospitals
        </p>
      </div>

      {/* Donation Tracker Widget */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-brand-coral/20 to-brand-teal/20 rounded-xl p-6 border border-brand-coral/30">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-brand-coral animate-pulse" />
            <span className="text-brand-coral font-semibold">Live Impact Tracker</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-text">
                ${donationStats.totalDonated.toFixed(2)}
              </div>
              <div className="text-sm text-brand-text/60">Total Donated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-coral">
                ${donationStats.thisMonth.toFixed(2)}
              </div>
              <div className="text-sm text-brand-text/60">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal">
                {donationStats.transactionCount}
              </div>
              <div className="text-sm text-brand-text/60">Transactions</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-brand-text/60">
            Recipient: charity Children's Hospitals (EIN: 36-2193608)
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-brand-surface rounded-xl p-6 border-2 cursor-pointer transition-all duration-200 ${getPlanBorder(plan.id)}`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                {getPlanIcon(plan.id)}
                <div>
                  <h3 className="text-xl font-bold text-brand-text">{plan.name}</h3>
                  <p className="text-sm text-brand-text/60">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-brand-text">{plan.priceDisplay}</span>
                <span className="text-brand-text/60">/{plan.interval}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 mt-0.5 ${feature.includes('charity') ? 'text-brand-coral' : 'text-brand-teal'}`} />
                    <span className={`text-sm ${feature.includes('charity') ? 'text-brand-coral font-semibold' : 'text-brand-text/80'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Form */}
      <div className="max-w-md mx-auto">
        <div className="bg-brand-surface rounded-xl p-6 border border-brand-surface">
          <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-coral" />
            Complete Your Subscription
          </h2>

          <div className="mb-4">
            <label className="block text-sm text-brand-text/70 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-brand-void border border-brand-surface rounded-lg text-brand-text placeholder-brand-text/40 focus:outline-none focus:border-brand-coral"
            />
          </div>

          {selectedPlan && (
            <div className="mb-4 p-3 bg-brand-void rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text/70">Selected Plan:</span>
                <span className="text-brand-text font-semibold">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-brand-text/70">To charity (60%):</span>
                <span className="text-brand-coral font-semibold">
                  ${((plans.find(p => p.id === selectedPlan)?.price || 0) / 100 * 0.5).toFixed(2)}/mo
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={!selectedPlan || !email || loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedPlan && email && !loading
                ? 'bg-brand-coral text-white hover:bg-brand-coral/90'
                : 'bg-brand-surface text-brand-text/50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Subscribe Now
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-brand-text/50">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-brand-coral" />
          <span className="text-brand-coral font-semibold">FOR THE KIDS</span>
          <Heart className="w-5 h-5 text-brand-coral" />
        </div>
        <p className="text-brand-text/60 text-sm">
          Every subscription directly supports charity Children's Hospitals, providing
          specialized care for children regardless of their families' ability to pay.
          60% of your subscription goes directly to their mission.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
