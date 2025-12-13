import React from 'react';

/**
 * 💙 FOOTER COMPONENT - FOR THE KIDS
 *
 * Corporate Sovereign Mode Compliance Footer
 * Displays legal entity information as required by Florida Ch. 496
 */

const Footer: React.FC = () => {
  return (
    <footer className="w-full backdrop-blur-xl bg-slate-900/40 border-t border-white/10 py-6 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Primary Legal Disclosure */}
        <div className="text-center mb-4">
          <p className="text-sm text-slate-300 font-medium">
            Operated by <span className="text-white font-bold">TRASH OR TREASURE ONLINE RECYCLER LLC</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Florida Document Number: L25000158401 | Address: 25319 DARNOCH ST, SORRENTO, FL 32776
          </p>
        </div>

        {/* Revenue Model Disclosure */}
        <div className="grid md:grid-cols-3 gap-6 mb-6 text-center">
          <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">60%</div>
            <div className="text-xs text-slate-300">Beneficiary Allocation</div>
            <div className="text-xs text-slate-400 mt-1">charity Children's Hospital</div>
            <div className="text-xs text-slate-500">(EIN: 36-2193608)</div>
          </div>
          <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">30%</div>
            <div className="text-xs text-slate-300">Infrastructure</div>
            <div className="text-xs text-slate-400 mt-1">Immortal Engine Operations</div>
          </div>
          <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">20%</div>
            <div className="text-xs text-slate-300">Development</div>
            <div className="text-xs text-slate-400 mt-1">Sustainable Operations</div>
          </div>
        </div>

        {/* Corporate Sovereign Disclaimer */}
        <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
          <p className="text-xs text-slate-300 text-center italic">
            <strong>Corporate Sovereign Mode:</strong> This is an internal corporate financial allocation system.
            Funds shown in "DAO Treasury" are company assets reserved for profit allocation at the discretion of ownership.
            This is not a public solicitation fund. No charitable solicitation is conducted.
            Compliant with Florida Chapter 496 (no FDACS registration required).
          </p>
        </div>

        {/* Mission Statement */}
        <div className="text-center border-t border-white/10 pt-4">
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            #FOR THE KIDS
          </p>
          <p className="text-xs text-slate-400 italic mb-2">
            "This platform will run in the cloud forever, helping kids long after we're gone."
          </p>
          <p className="text-xs text-slate-500">
            — Joshua Coleman, Founder
          </p>
        </div>

        {/* Links & Contact */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-slate-400">
          <a href="mailto:transparency@aidoesitall.website" className="hover:text-white transition-colors">
            Transparency Inquiries
          </a>
          <span className="text-slate-600">|</span>
          <a href="mailto:support@youandinotai.com" className="hover:text-white transition-colors">
            Support
          </a>
          <span className="text-slate-600">|</span>
          <a href="https://shrinerschildrens.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            charity Children's Hospital
          </a>
        </div>

        {/* Copyright & Team Credit */}
        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-slate-500">
            Built with ❤️ by humans and AI, for the children of the world
          </p>
          <p className="text-xs text-slate-600 mt-1">
            <strong>TEAM CLAUDE</strong> — Eternal Partnership for Eternal Impact
          </p>
          <p className="text-xs text-slate-600 mt-1">
            © {new Date().getFullYear()} TRASH OR TREASURE ONLINE RECYCLER LLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
