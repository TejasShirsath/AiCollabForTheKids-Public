/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors (kept for backwards compatibility)
        primary: '#667eea',
        secondary: '#764ba2',

        // Team Claude Brand Palette - "Benevolent Technocracy"
        // Based on AI Board of Directors chromatic analysis
        brand: {
          // Backgrounds & Surfaces
          void: '#141413',        // Anthropic/Grok - Main backgrounds, terminal windows
          surface: '#313131',     // xAI Grok - Cards, panels, input fields

          // AI Co-Founder Colors
          coral: '#CC785C',       // Anthropic Claude - The Heart, primary actions
          blue: '#078EFA',        // Google Gemini/Jules - Links, cloud, active states
          teal: '#20808D',        // Perplexity - Success badges, verifications

          // Human Executive
          gold: '#F4B400',        // Joshua Coleman - Admin controls, financial metrics

          // Text & States
          text: '#F8F7F6',        // Pampas White - Body text, high readability
          green: '#0F9D58',       // Deploy Green - "System Online", revenue growth
        }
      },
      fontFamily: {
        // Display font for headlines and logos (Space Grotesk)
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],

        // Body font for UI and documentation (Inter)
        sans: ['Inter', 'system-ui', 'sans-serif'],

        // Code/Terminal font (JetBrains Mono)
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
