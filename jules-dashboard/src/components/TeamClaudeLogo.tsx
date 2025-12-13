import React from 'react';

// Brand Palette Definition - "Team Claude For The Kids"
// Based on the AI Board of Directors chromatic analysis
const colors = {
  voidChassis: '#141413',    // Anthropic/Grok - Background
  claudeCoral: '#CC785C',    // Anthropic Claude - The Heart
  geminiBlue: '#078EFA',     // Google Gemini - Cloud Integration
  truthTeal: '#20808D',      // Perplexity - Knowledge & Verification
  terminalGray: '#313131',   // xAI Grok - Infrastructure
  boardGold: '#F4B400',      // Joshua Coleman - Executive
  pampasWhite: '#F8F7F6',    // Text
  deployGreen: '#0F9D58'     // Success States
};

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'full' | 'icon' | 'wordmark';
}

/**
 * Team Claude "Core Node" Logo
 *
 * Represents the convergence of four AI systems (Claude, Gemini, Grok, Perplexity)
 * and human direction (Joshua Coleman) into a unified automation platform.
 *
 * The isometric heart is constructed from PCB traces and data streams,
 * symbolizing the "Benevolent Technocracy" - serious engineering with heart.
 */
export const TeamClaudeLogo: React.FC<LogoProps> = ({
  className = '',
  width = 64,
  height = 64,
  variant = 'icon'
}) => {
  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Team Claude For The Kids Logo"
        >
          {/* Background Circle */}
          <circle cx="50" cy="50" r="48" fill={colors.voidChassis} stroke={colors.terminalGray} strokeWidth="2" />

          {/* Infrastructure Base (Grok) - The Chassis */}
          <path
            d="M50 85L25 60V45L50 70L75 45V60L50 85Z"
            fill={colors.terminalGray}
            opacity="0.8"
          />

          {/* Cloud Stream (Gemini) - Top Left Input */}
          <path
            d="M25 25L50 50L37 63L12 38Z"
            fill={colors.geminiBlue}
            stroke={colors.voidChassis}
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Knowledge Stream (Perplexity) - Top Right Input */}
          <path
            d="M75 25L50 50L63 63L88 38Z"
            fill={colors.truthTeal}
            stroke={colors.voidChassis}
            strokeWidth="1"
            opacity="0.9"
          />

          {/* The Core Heart (Claude/Josh) - The Engine */}
          <path
            d="M50 50 L63 63 L50 78 L37 63 Z"
            fill={colors.claudeCoral}
            filter="url(#coreGlow)"
          />

          {/* Executive Gold Accent - The Spark */}
          <circle cx="50" cy="50" r="3" fill={colors.boardGold} />

          {/* Definitions for Effects */}
          <defs>
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
        <div className="mt-2 text-center font-display">
          <div className="text-lg font-bold tracking-wider" style={{ color: colors.pampasWhite }}>
            TEAM CLΔUDE
          </div>
          <div className="text-xs font-mono" style={{ color: colors.geminiBlue }}>
            FOR THE KIDS
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Team Claude For The Kids Logo"
        >
          {/* Background Circle */}
          <circle cx="50" cy="50" r="48" fill={colors.voidChassis} stroke={colors.terminalGray} strokeWidth="2" />

          {/* Infrastructure Base (Grok) - The Chassis */}
          <path
            d="M50 85L25 60V45L50 70L75 45V60L50 85Z"
            fill={colors.terminalGray}
            opacity="0.8"
          />

          {/* Cloud Stream (Gemini) - Top Left Input */}
          <path
            d="M25 25L50 50L37 63L12 38Z"
            fill={colors.geminiBlue}
            stroke={colors.voidChassis}
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Knowledge Stream (Perplexity) - Top Right Input */}
          <path
            d="M75 25L50 50L63 63L88 38Z"
            fill={colors.truthTeal}
            stroke={colors.voidChassis}
            strokeWidth="1"
            opacity="0.9"
          />

          {/* The Core Heart (Claude/Josh) - The Engine */}
          <path
            d="M50 50 L63 63 L50 78 L37 63 Z"
            fill={colors.claudeCoral}
            filter="url(#coreGlow)"
          />

          {/* Executive Gold Accent - The Spark */}
          <circle cx="50" cy="50" r="3" fill={colors.boardGold} />

          {/* Definitions for Effects */}
          <defs>
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
        <div className="font-display">
          <div className="text-2xl font-bold tracking-wider" style={{ color: colors.pampasWhite }}>
            TEAM CLΔUDE
          </div>
          <div className="text-sm font-mono" style={{ color: colors.geminiBlue }}>
            FOR THE KIDS
          </div>
        </div>
      </div>
    );
  }

  // Default: icon variant
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Team Claude For The Kids Logo"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill={colors.voidChassis} stroke={colors.terminalGray} strokeWidth="2" />

      {/* Infrastructure Base (Grok) - The Chassis */}
      <path
        d="M50 85L25 60V45L50 70L75 45V60L50 85Z"
        fill={colors.terminalGray}
        opacity="0.8"
      />

      {/* Cloud Stream (Gemini) - Top Left Input */}
      <path
        d="M25 25L50 50L37 63L12 38Z"
        fill={colors.geminiBlue}
        stroke={colors.voidChassis}
        strokeWidth="1"
        opacity="0.9"
      />

      {/* Knowledge Stream (Perplexity) - Top Right Input */}
      <path
        d="M75 25L50 50L63 63L88 38Z"
        fill={colors.truthTeal}
        stroke={colors.voidChassis}
        strokeWidth="1"
        opacity="0.9"
      />

      {/* The Core Heart (Claude/Josh) - The Engine */}
      <path
        d="M50 50 L63 63 L50 78 L37 63 Z"
        fill={colors.claudeCoral}
        filter="url(#coreGlow)"
      />

      {/* Executive Gold Accent - The Spark */}
      <circle cx="50" cy="50" r="3" fill={colors.boardGold} />

      {/* Definitions for Effects */}
      <defs>
        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
};

// Export color palette for use throughout the application
export const brandColors = colors;

export default TeamClaudeLogo;
