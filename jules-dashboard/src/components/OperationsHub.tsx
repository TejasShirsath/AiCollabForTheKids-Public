import React from 'react';
import { Terminal, Code, GitPullRequest, GraduationCap, Wrench, Zap } from 'lucide-react';

const OperationsHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-600 to-indigo-600">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Operations Hub</h1>
            <p className="text-slate-300">Developer & Admin Tools</p>
          </div>
        </div>
        <p className="text-slate-200 text-lg max-w-3xl">
          Powerful automation tools for developers, educators, and administrators managing #FOR THE KIDS infrastructure.
        </p>
      </div>

      {/* Mission Banner */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-indigo-500/20 to-slate-500/20 border border-indigo-400/30">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Automation for Good
        </h2>
        <p className="text-slate-100">
          These tools help developers contribute faster, educators manage content easier, and administrators maintain infrastructure that serves kids 24/7.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* P21 Setup Scripts */}
        <FeatureCard
          icon={<Terminal className="w-6 h-6 text-green-400" />}
          title="P21 Setup Scripts"
          description="Automated deployment and configuration scripts for rapid project setup and infrastructure provisioning."
          status="Phase 3 - Full Build"
          features={[
            'One-command deployment',
            'Docker compose orchestration',
            'Environment configuration',
            'Database migration automation',
            'SSL certificate setup',
            'Health check monitoring'
          ]}
          color="green"
        />

        {/* Code Reviewer */}
        <FeatureCard
          icon={<GitPullRequest className="w-6 h-6 text-purple-400" />}
          title="AI Code Reviewer"
          description="Automated code review with AI assistance to maintain quality and #FOR THE KIDS standards."
          status="Phase 3 - Full Build"
          features={[
            'Security vulnerability scanning',
            'Code quality analysis',
            'Best practice suggestions',
            'Kid-safety compliance checks',
            'Performance optimization tips',
            'Documentation completeness'
          ]}
          color="purple"
        />

        {/* PR Wizard */}
        <FeatureCard
          icon={<Code className="w-6 h-6 text-blue-400" />}
          title="PR Wizard"
          description="Streamlined pull request creation with templates, automated checks, and contributor guidance."
          status="Phase 3 - Full Build"
          features={[
            'PR template auto-fill',
            'Change log generation',
            'Breaking change detection',
            'Test coverage verification',
            'Documentation updates',
            'Contributor guidelines'
          ]}
          color="blue"
        />

        {/* Edu Nexus (IT) */}
        <FeatureCard
          icon={<GraduationCap className="w-6 h-6 text-cyan-400" />}
          title="Edu Nexus IT Portal"
          description="Educational content management system for teachers creating kid-friendly learning materials."
          status="Phase 3 - Full Build"
          features={[
            'Content creation tools',
            'Lesson plan templates',
            'Interactive demo builder',
            'Age-appropriate filtering',
            'Progress tracking',
            'Multi-language support'
          ]}
          color="cyan"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Developer Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon={<Terminal className="w-5 h-5" />}
            label="Deploy Dev"
            description="Launch development environment"
            command="docker compose up"
          />
          <QuickAction
            icon={<Code className="w-5 h-5" />}
            label="Run Tests"
            description="Execute test suite"
            command="npm test"
          />
          <QuickAction
            icon={<GitPullRequest className="w-5 h-5" />}
            label="Create PR"
            description="Open pull request wizard"
            command="Coming Soon"
          />
          <QuickAction
            icon={<Wrench className="w-5 h-5" />}
            label="Health Check"
            description="Verify all systems"
            command="npm run health"
          />
        </div>
      </div>

      {/* Documentation Links */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <DocCard
          title="Contributing Guide"
          description="Learn how to contribute code, docs, or ideas"
          link="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/blob/master/CONTRIBUTING.md"
        />
        <DocCard
          title="API Documentation"
          description="Backend API reference and examples"
          link="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/blob/master/docs/API.md"
        />
        <DocCard
          title="Deployment Guide"
          description="Deploy to production or staging environments"
          link="https://github.com/Ai-Solutions-Store/AiCollabForTheKids/blob/master/docs/DEPLOYMENT.md"
        />
      </div>

      {/* Footer CTA */}
      <div className="mt-8 p-8 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Build Tools That Help Kids Forever</h3>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
          Every automation script, every code review, every deployment brings us closer to a platform that serves children autonomously—even in the clouds.
        </p>
        <a
          href="https://github.com/Ai-Solutions-Store/AiCollabForTheKids"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors"
        >
          View on GitHub →
        </a>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-slate-300 text-sm">
          Operations tools built with love for developers who care about kids. 💙
        </p>
        <p className="text-slate-400 text-xs mt-2">
          #FOR THE KIDS - Code for good, automate for impact
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
    green: 'border-green-400/30',
    purple: 'border-purple-400/30',
    blue: 'border-blue-400/30',
    cyan: 'border-cyan-400/30',
  };

  return (
    <div className={`p-6 rounded-xl bg-white/5 border ${colorClasses[color as keyof typeof colorClasses]} hover:bg-white/10 transition-colors`}>
      <div className="flex items-start gap-3 mb-3">
        {icon}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            {status}
          </span>
        </div>
      </div>
      <p className="text-slate-200 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-slate-100">
            <span className="text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  command: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, description, command }) => {
  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer">
      <div className="flex items-center gap-2 mb-2 text-indigo-400">
        {icon}
        <span className="font-semibold text-white text-sm">{label}</span>
      </div>
      <p className="text-xs text-slate-300 mb-2">{description}</p>
      <code className="text-xs text-green-400 font-mono">{command}</code>
    </div>
  );
};

interface DocCardProps {
  title: string;
  description: string;
  link: string;
}

const DocCard: React.FC<DocCardProps> = ({ title, description, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-200 mb-3">{description}</p>
      <span className="text-sm text-indigo-400 hover:text-indigo-300">
        Read docs →
      </span>
    </a>
  );
};

export default OperationsHub;
