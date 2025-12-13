import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, ShieldAlert, Heart } from 'lucide-react';

interface AgeVerificationModalProps { onVerify: () => void; }

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerify }) => {
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [isAgeChecked, setIsAgeChecked] = useState(false);
  const [isTosChecked, setIsTosChecked] = useState(false);
  const [isComplianceChecked, setIsComplianceChecked] = useState(false);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [ageCategory, setAgeCategory] = useState<'adult' | 'teen' | 'child' | null>(null);

  // Check for existing block on mount
  useEffect(() => {
    const blockedUntil = localStorage.getItem('age_blocked_until');
    if (blockedUntil && new Date(blockedUntil) > new Date()) {
      setIsBlocked(true);
    }
  }, []);

  const calculateAge = (month: number, day: number, year: number): number => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateDateOfBirth = () => {
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);
    const year = parseInt(birthYear);

    if (!month || !day || !year) {
      setError('Please enter your complete date of birth');
      return false;
    }

    if (month < 1 || month > 12) {
      setError('Invalid month');
      return false;
    }

    if (day < 1 || day > 31) {
      setError('Invalid day');
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      setError('Invalid year');
      return false;
    }

    const age = calculateAge(month, day, year);

    // HARD BLOCK: Under 13 - COPPA Compliance
    if (age < 13) {
      setIsBlocked(true);
      setAgeCategory('child');
      localStorage.setItem('age_blocked', 'true');
      localStorage.setItem('age_blocked_until', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
      return false;
    }

    // Teen mode: 13-17
    if (age >= 13 && age < 18) {
      setAgeCategory('teen');
      localStorage.setItem('user_age_category', 'teen');
    } else {
      // Adult mode: 18+
      setAgeCategory('adult');
      localStorage.setItem('user_age_category', 'adult');
    }

    return true;
  };

  const handleEnter = () => {
    setError('');

    // Check if previously blocked
    const blockedUntil = localStorage.getItem('age_blocked_until');
    if (blockedUntil && new Date(blockedUntil) > new Date()) {
      setIsBlocked(true);
      return;
    }

    if (!validateDateOfBirth()) {
      return;
    }

    if (!isAgeChecked || !isTosChecked || !isComplianceChecked) {
      setError('You must agree to all terms to proceed.');
      return;
    }

    localStorage.setItem('age_verified', 'true');
    localStorage.setItem('age_verification_date', new Date().toISOString());
    onVerify();
  };

  // HARD BLOCK SCREEN - Under 13
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] z-[9999] flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 max-w-lg w-full p-8 rounded-xl border-t-4 border-red-600 shadow-2xl relative z-10 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-2">ACCESS DENIED</h1>
          <p className="text-red-400 font-bold uppercase tracking-widest text-sm mb-6">COPPA Compliance Active</p>

          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-6">
            <p className="text-white mb-4">
              This platform is not available to users under 13 years of age in compliance with the Children's Online Privacy Protection Act (COPPA).
            </p>
            <p className="text-slate-300 text-sm">
              If you believe this is an error, please have a parent or guardian contact us at:
            </p>
            <p className="text-orange-400 font-semibold mt-2">joshlcoleman@gmail.com</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Heart className="w-4 h-4 text-orange-400" />
            <span>FOR THE KIDS - Protecting young users is our priority</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0f172a] z-[9999] flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full p-8 rounded-xl border-t-4 border-orange-500 shadow-2xl relative z-10">
        <h1 className="text-3xl font-black text-center text-white mb-2">AGE VERIFICATION</h1>
        <p className="text-center text-orange-400 font-bold uppercase tracking-widest text-sm mb-6">COPPA Compliant Platform</p>

        {/* Date of Birth Entry */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">Date of Birth</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Month</label>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="MM"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Day</label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="DD"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="YYYY"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Age Category Notice */}
        {ageCategory === 'teen' && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong>Teen Mode Active:</strong> Some features may be restricted for users 13-17. Adult AI features require age 18+.
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={isAgeChecked}
              onChange={() => setIsAgeChecked(!isAgeChecked)}
              className="mt-1 w-4 h-4 accent-orange-500"
            />
            <span className="text-sm text-slate-200">I certify that the date of birth provided is accurate and I am at least <strong>13 years of age</strong>.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={isTosChecked}
              onChange={() => setIsTosChecked(!isTosChecked)}
              className="mt-1 w-4 h-4 accent-orange-500"
            />
            <span className="text-sm text-slate-200">I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
            <input
              type="checkbox"
              checked={isComplianceChecked}
              onChange={() => setIsComplianceChecked(!isComplianceChecked)}
              className="mt-1 w-4 h-4 accent-orange-500"
            />
            <span className="text-sm text-slate-200">I acknowledge <strong>Child Safety Compliance</strong> monitoring is active.</span>
          </label>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleEnter}
          disabled={!birthMonth || !birthDay || !birthYear || !isAgeChecked || !isTosChecked || !isComplianceChecked}
          className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            birthMonth && birthDay && birthYear && isAgeChecked && isTosChecked && isComplianceChecked
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Lock className="w-5 h-5" /> Verify & Enter
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <Heart className="w-3 h-3 text-orange-400" />
          <span>60% of revenue supports charity Children's Hospitals</span>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
