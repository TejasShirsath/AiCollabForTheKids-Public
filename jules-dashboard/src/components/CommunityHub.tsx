import React from 'react';
import { Users, Heart, MessageCircle, Sparkles, Globe, Target } from 'lucide-react';

const CommunityHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Community Hub</h1>
            <p className="text-purple-300">Building Together #FOR THE KIDS</p>
          </div>
        </div>
        <p className="text-purple-200 text-lg max-w-3xl">
          Connect with developers, educators, supporters, and volunteers who believe AI should serve those in need, not greed.
        </p>
      </div>

      {/* Mission Banner */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-400" />
          Our Community Promise
        </h2>
        <p className="text-purple-100">
          Every contributor, every community member, every user is part of something eternal. Together, we build tools that help children forever.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Dating Platform → Community Connection */}
        <FeatureCard
          icon={<Heart className="w-6 h-6 text-pink-400" />}
          title="Community Connection Platform"
          description="Connect with like-minded people who care about helping kids through technology."
          status="Phase 3 - Full Build"
          features={[
            'Volunteer matching for projects',
            'Educator collaboration network',
            'Developer pairing for features',
            'Mentor/mentee connections',
            'Safe, moderated community',
            'Privacy-first design'
          ]}
          color="pink"
        />

        {/* DAO Launches → Community Governance */}
        <FeatureCard
          icon={<Target className="w-6 h-6 text-indigo-400" />}
          title="DAO Governance & Voting"
          description="Democratic decision-making for project direction, fund allocation, and feature priorities."
          status="Phase 3 - Full Build"
          features={[
            'Proposal submission system',
            'Community voting on features',
            'Fund allocation decisions',
            'Transparent vote tallying',
            'Delegation mechanisms',
            'Proposal discussion forums'
          ]}
          color="indigo"
        />

        {/* AI Chat → Community Support */}
        <FeatureCard
          icon={<MessageCircle className="w-6 h-6 text-cyan-400" />}
          title="AI-Powered Community Support"
          description="Jules AI assists with onboarding, questions, and guidance for all community members."
          status="Active - Jules Console Available"
          features={[
            'Real-time help from Jules AI',
            'Onboarding assistance',
            'Technical support',
            'Feature explanations',
            'Kid-friendly language',
            'Multi-language support'
          ]}
          color="cyan"
        />

        {/* Kickstarter → Community Funding */}
        <FeatureCard
          icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
          title="Community Project Launcher"
          description="Propose and fund new initiatives that help children. Transparent crowdfunding for good."
          status="Phase 3 - Full Build"
          features={[
            'Project proposal system',
            'Transparent fund tracking',
            'Milestone-based releases',
            'Community voting on projects',
            '100% goes to approved projects',
            'Impact reporting'
          ]}
          color="yellow"
        />
      </div>

      {/* Active Channels */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Active Community Channels</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <ChannelCard
            icon={<MessageCircle className="w-5 h-5" />}
            title="GitHub Discussions"
            description="Ask questions, share ideas, propose features"
            link="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/discussions"
            linkText="Join Discussion"
          />
          <ChannelCard
            icon={<Globe className="w-5 h-5" />}
            title="Issue Tracker"
            description="Report bugs, request features, give feedback"
            link="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/issues"
            linkText="View Issues"
          />
          <ChannelCard
            icon={<Users className="w-5 h-5" />}
            title="Contributors"
            description="See who's building #FOR THE KIDS"
            link="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/graphs/contributors"
            linkText="Meet the Team"
          />
        </div>
      </div>

      {/* Get Involved CTA */}
      <div className="p-8 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Ready to Make an Impact?</h3>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Whether you're a developer, educator, supporter, or just passionate about helping kids—there's a place for you here.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/blob/master/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
          >
            Start Contributing →
          </a>
          <a
            href="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/issues/new?template=feedback.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors"
          >
            Share Feedback →
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-purple-300 text-sm">
          Built by humans and AI, for the children of the world. 💙
        </p>
        <p className="text-purple-400 text-xs mt-2">
          #FOR THE KIDS - AI for those in need, not for greed
        </p>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  features: string[];
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, status, features, color }) => {
  const colorClasses = {
    pink: 'border-pink-400/30',
    indigo: 'border-indigo-400/30',
    cyan: 'border-cyan-400/30',
    yellow: 'border-yellow-400/30',
  };

  return (
    <div className={`p-6 rounded-xl bg-white/5 border ${colorClasses[color as keyof typeof colorClasses]} hover:bg-white/10 transition-colors`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
      </div>
      <p className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-block mb-3">
        {status}
      </p>
      <p className="text-purple-200 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-purple-100">
            <span className="text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ChannelCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ icon, title, description, link, linkText }) => {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3 mb-3 text-purple-300">
        {icon}
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-purple-200 mb-4">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-purple-400 hover:text-purple-300 hover:underline"
      >
        {linkText} →
      </a>
    </div>
  );
};

export default CommunityHub;
