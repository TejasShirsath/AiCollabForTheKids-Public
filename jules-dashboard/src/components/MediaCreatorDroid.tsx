import React, { useState } from 'react';
import { Video, Youtube, Zap, Clock, Heart } from './IconComponents';

const API_BASE = import.meta.env.VITE_API_URL || 'https://theoretical-bras-difference-kirk.trycloudflare.com';

const MediaCreatorDroid: React.FC = () => {
  const [category, setCategory] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastVideo, setLastVideo] = useState<any>(null);

  const categories = [
    { id: 'general', name: 'Top Stories', icon: '📰' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'technology', name: 'Tech', icon: '💻' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' }
  ];

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      // Call backend API to trigger Claude Droid
      const response = await fetch(`${API_BASE}/api/droid/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      });
      const data = await response.json();
      setLastVideo(data);
    } catch (error) {
      console.error('Droid generation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <header className="glass-card p-6 mb-8 border-l-4 border-brand-coral">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-text flex items-center gap-3">
              <Video className="w-8 h-8 text-brand-blue" />
              🤖 Claude Droid News
            </h1>
            <p className="text-slate-400 mt-1">
              Automated 59-second YouTube Shorts | Daily News | 60% to charity
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-mono">Mission</div>
            <div className="flex items-center gap-2 text-brand-coral font-bold font-mono">
              <Heart className="w-4 h-4" />
              FOR THE KIDS
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-gold" />
              Generate Video
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-surface border border-white/10 rounded-lg p-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-gradient-to-r from-brand-coral to-brand-blue hover:from-brand-coral/80 hover:to-brand-blue/80 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Video className="w-5 h-5" />
                    Generate 59-Sec Short
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-brand-text mb-4">Channel Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Videos Created</span>
                <span className="text-brand-text font-bold font-mono">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Views</span>
                <span className="text-brand-text font-bold font-mono">45.2K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Subscribers</span>
                <span className="text-brand-text font-bold font-mono">892</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Revenue to Kids</span>
                <span className="text-brand-green font-bold font-mono">$234</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Video Preview */}
          {lastVideo && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                Latest Generated Video
              </h2>
              <div className="bg-black/50 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Video Preview</p>
                    <p className="text-sm mt-2">{lastVideo.title}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/50">
                  <p className="text-white font-medium">{lastVideo.title}</p>
                  <p className="text-slate-400 text-sm mt-1">{lastVideo.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {lastVideo.tags?.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-brand-text mb-4">🔧 How Claude Droid Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-bold font-mono">
                  1
                </div>
                <div>
                  <h3 className="text-brand-text font-medium">Fetch News</h3>
                  <p className="text-slate-400 text-sm">
                    Pulls yesterday's top headlines from News API (5 stories)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-coral/20 flex items-center justify-center text-brand-coral font-bold font-mono">
                  2
                </div>
                <div>
                  <h3 className="text-brand-text font-medium">Generate Script</h3>
                  <p className="text-slate-400 text-sm">
                    Creates 59-second voiceover script (147 words @ 2.5 words/sec)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold font-mono">
                  3
                </div>
                <div>
                  <h3 className="text-brand-text font-medium">Create Voiceover</h3>
                  <p className="text-slate-400 text-sm">
                    Microsoft Edge TTS (Christopher Neural voice - FREE!)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold font-mono">
                  4
                </div>
                <div>
                  <h3 className="text-brand-text font-medium">Render Video</h3>
                  <p className="text-slate-400 text-sm">
                    FFmpeg with CUDA acceleration (1080x1920 vertical)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold font-mono">
                  5
                </div>
                <div>
                  <h3 className="text-brand-text font-medium">Upload to YouTube</h3>
                  <p className="text-slate-400 text-sm">
                    Automated upload with metadata and #charity tags
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">⚙️ Tech Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Hardware</h3>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• T5500: Dual Xeon X5690</li>
                  <li>• 72GB RAM</li>
                  <li>• NVIDIA CUDA GPU</li>
                  <li>• 24 CPU threads</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Software</h3>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Python 3.11</li>
                  <li>• FFmpeg (CUDA)</li>
                  <li>• Edge TTS</li>
                  <li>• YouTube Data API</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MediaCreatorDroid;
