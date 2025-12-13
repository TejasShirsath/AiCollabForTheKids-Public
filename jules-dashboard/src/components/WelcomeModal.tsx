import React from 'react';
import { X, Heart, Rocket, Globe, Users } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-2xl border border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          aria-label="Close welcome modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">#FOR THE KIDS</span>
          </h1>
          <p className="text-xl text-indigo-200">
            AI-Powered Charity Automation Dashboard
          </p>
        </div>

        {/* Mission Statement */}
        <div className="px-8 pb-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-400" />
              Our Mission
            </h2>
            <p className="text-lg text-indigo-100 leading-relaxed">
              Help <strong>ALL children everywhere</strong> through AI-powered automated charity projects. 
              We believe artificial intelligence should serve humanity's most vulnerable - our children.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="px-8 pb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">What You Can Do Here</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<Rocket className="w-6 h-6" />}
              title="Jules AI Assistant"
              description="Chat with Jules, our AI helper trained to support kids and educators with learning and creativity."
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="100% Transparency"
              description="See exactly where every dollar goes. All revenue tracked in real-time with full accountability."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Community-Driven"
              description="Built by developers, educators, and volunteers who believe in using technology to help kids."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="27 Free Tools"
              description="Growing collection of AI-powered educational tools, all free and kid-friendly."
            />
          </div>
        </div>

        {/* Revenue Model */}
        <div className="px-8 pb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-500/20 border border-indigo-400/30">
              <h3 className="text-lg font-semibold text-indigo-200 mb-2">Original Project (The Foundation)</h3>
              <div className="text-indigo-100 space-y-1">
                <p>• <strong>60%</strong> → DAO Treasury (Allocated to charity Children's Hospitals)</p>
                <p>• <strong>30%</strong> → Infrastructure (powers ALL future projects)</p>
                <p>• <strong>20%</strong> → Sustainable development</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-400/30">
              <h3 className="text-lg font-semibold text-purple-200 mb-2">All New Projects (Pure Charity)</h3>
              <div className="text-purple-100 space-y-1">
                <p>• <strong>100%</strong> → Directly to children's hospitals</p>
                <p>• <strong>Zero fees</strong> → Infrastructure already paid for</p>
                <p>• <strong>Forever</strong> → Runs autonomously in the cloud</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Vision */}
        <div className="px-8 pb-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-3">The Vision</h2>
            <p className="text-indigo-100 italic text-lg leading-relaxed">
              "This platform will run in the cloud forever, helping kids long after we're gone. Even when I'm in the clouds, 
              smiling at what we built together."
            </p>
            <p className="text-right text-indigo-300 mt-2">— Joshua Coleman, Founder</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="px-8 pb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to Explore?</h2>
          <div className="space-y-3">
            <StartStep number={1} text="Check out the Dashboard for real-time revenue tracking" />
            <StartStep number={2} text="Try the Jules AI Command Console for interactive help" />
            <StartStep number={3} text="Explore 27 features in the sidebar (more coming soon!)" />
            <StartStep number={4} text="Share feedback using the button in the sidebar" />
          </div>
          <button
            onClick={onClose}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Let's Go! 🚀
          </button>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-sm text-indigo-300">
            Built with ❤️ by humans and AI, for the children of the world
          </p>
          <p className="text-xs text-indigo-400 mt-2">
            <strong>#FOR THE KIDS</strong> — Now, tomorrow, and forever
          </p>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-indigo-200">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface StartStepProps {
  number: number;
  text: string;
}

const StartStep: React.FC<StartStepProps> = ({ number, text }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">
        {number}
      </div>
      <p className="text-indigo-100">{text}</p>
    </div>
  );
};

export default WelcomeModal;
