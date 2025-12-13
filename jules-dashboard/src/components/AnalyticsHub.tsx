import React from 'react';
import { BarChart3, TrendingUp, Activity, Eye } from 'lucide-react';

const AnalyticsHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Analytics Hub</h1>
            <p className="text-indigo-300">100% Transparent Impact Tracking</p>
          </div>
        </div>
        <p className="text-indigo-200 text-lg max-w-3xl">
          Every metric tracked with privacy-first analytics. See exactly how #FOR THE KIDS is helping children everywhere.
        </p>
      </div>

      {/* Mission Banner */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
        <h2 className="text-xl font-semibold text-white mb-2">Our Analytics Promise</h2>
        <p className="text-indigo-100">
          📊 Privacy-First • 🔒 No Personal Data • ✅ GDPR/CCPA Compliant • 💙 100% Transparent
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Eye className="w-6 h-6" />}
          label="Page Views"
          value="Coming Soon"
          subtext="Cloudflare Analytics"
          color="indigo"
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          label="Active Users"
          value="Coming Soon"
          subtext="Real-time tracking"
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Tab Interactions"
          value="Coming Soon"
          subtext="Feature usage"
          color="blue"
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Global Reach"
          value="Coming Soon"
          subtext="Countries served"
          color="cyan"
        />
      </div>

      {/* Feature Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cloudflare Analytics */}
        <FeatureCard
          title="Cloudflare Web Analytics"
          description="Privacy-first analytics integrated. Configure token in Cloudflare Dashboard to activate."
          status="Ready for Activation"
          features={[
            'No cookies or tracking',
            'GDPR/CCPA compliant',
            'Page views & unique visitors',
            'Device & browser insights',
            'Geographic distribution',
            'Referral sources'
          ]}
          docsLink="/docs/guides/CLOUDFLARE-ANALYTICS-SETUP.md"
        />

        {/* Dashboard Usage */}
        <FeatureCard
          title="Dashboard Usage Metrics"
          description="Track which features help kids the most. Optimize based on real usage patterns."
          status="Phase 3 Implementation"
          features={[
            'Tab click tracking',
            'Feature engagement time',
            'User flow analysis',
            'Popular features ranking',
            'Session duration',
            'Return visitor rate'
          ]}
          docsLink="#"
        />

        {/* Revenue Impact */}
        <FeatureCard
          title="Revenue Command & Impact Tracker"
          description="Real-time visualization of every dollar allocated to charitable impact."
          status="Phase 3 Implementation"
          features={[
            'Live revenue tracking',
            'DAO Treasury distribution',
            'Monthly/yearly trends',
            '50/30/20 → 100% visualization',
            'Kids helped counter',
            'Geographic impact map'
          ]}
          docsLink="#"
        />

        {/* User Feedback Analytics */}
        <FeatureCard
          title="Feedback Analytics"
          description="Analyze GitHub Issues feedback to improve features that help kids most."
          status="Active - Collecting Data"
          features={[
            'Feedback categorization',
            'Sentiment analysis',
            'Feature request tracking',
            'Bug resolution time',
            'Educator/parent insights',
            'Kid-friendliness ratings'
          ]}
          docsLink="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/issues"
        />
      </div>

      {/* Setup Guide CTA */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30">
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-400" />
          Ready to Activate Analytics?
        </h3>
        <p className="text-green-100 mb-4">
          Follow the setup guide to configure Cloudflare Web Analytics and start tracking your impact on children worldwide.
        </p>
        <a
          href="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/blob/master/docs/guides/CLOUDFLARE-ANALYTICS-SETUP.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
        >
          View Setup Guide →
        </a>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-indigo-300 text-sm">
          All analytics are privacy-first and serve only to improve our service to children. 💙
        </p>
        <p className="text-indigo-400 text-xs mt-2">
          #FOR THE KIDS - Data for good, never for greed
        </p>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtext, color }) => {
  const colorClasses = {
    indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-400/30 text-indigo-300',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-300',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-300',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-400/30 text-cyan-300',
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm opacity-80">{subtext}</div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  status: string;
  features: string[];
  docsLink: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, status, features, docsLink }) => {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
          {status}
        </span>
      </div>
      <p className="text-indigo-200 mb-4">{description}</p>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-indigo-100">
            <span className="text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {docsLink !== '#' && (
        <a
          href={docsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          Learn more →
        </a>
      )}
    </div>
  );
};

export default AnalyticsHub;
