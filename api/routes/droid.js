/**
 * 🤖 CLAUDE DROID NEWS GENERATOR - FOR THE KIDS
 *
 * Generates 59-second YouTube Shorts from news headlines
 * Uses: News API → AI Script → Edge TTS → FFmpeg render
 * Revenue: 50% to charity Children's Hospitals
 */

import express from 'express';
import axios from 'axios';
import { generateSpeech, generateSpeechBuffer, generateNewsAudio, getVoices } from '../services/tts.js';
import { renderVideo, renderVideoWithText, checkFFmpeg, getVideoConfig } from '../services/video.js';
import { checkYouTubeConfig, getAuthUrl, exchangeCode, uploadVideo, getChannelInfo, getRecentUploads } from '../services/youtube.js';

const router = express.Router();

// News API configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// Categories supported
const CATEGORIES = ['general', 'sports', 'business', 'technology', 'entertainment'];

// Target: 59 seconds at 2.5 words/second = ~147 words
const TARGET_WORDS = 147;

/**
 * POST /api/droid/generate
 * Generates a news video script
 */
router.post('/generate', async (req, res) => {
  const { category = 'general' } = req.body;

  // Validate category
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category',
      valid: CATEGORIES
    });
  }

  console.log(`[DROID] Generating ${category} news video...`);

  try {
    // Step 1: Fetch top headlines
    let headlines = [];

    try {
      const newsResponse = await axios.get(NEWS_API_URL, {
        params: {
          country: 'us',
          category: category,
          pageSize: 5,
          apiKey: NEWS_API_KEY
        },
        timeout: 10000
      });

      headlines = newsResponse.data.articles || [];
    } catch (newsError) {
      console.log('[DROID] News API unavailable, using mock data');
      // Mock headlines for demo/development
      headlines = getMockHeadlines(category);
    }

    if (headlines.length === 0) {
      headlines = getMockHeadlines(category);
    }

    // Step 2: Generate script from headlines
    const script = generateScript(headlines, category);

    // Step 3: Generate metadata
    const videoData = {
      id: `droid-${Date.now()}`,
      title: `${getCategoryEmoji(category)} ${category.toUpperCase()} News - ${new Date().toLocaleDateString()}`,
      description: `Today's top ${category} stories in 59 seconds! 50% of ad revenue goes to charity Children's Hospitals. #ForTheKids`,
      script: script,
      duration: 59,
      wordCount: script.split(/\s+/).length,
      category: category,
      tags: ['news', category, 'shorts', 'ForTheKids', 'charity', 'VerifiedPediatricCharities'],
      headlines: headlines.slice(0, 5).map(h => ({
        title: h.title,
        source: h.source?.name || 'News'
      })),
      status: 'script_ready',
      mission: '50% to charity Children\'s Hospitals',
      createdAt: new Date().toISOString()
    };

    console.log(`[DROID] Script generated: ${videoData.wordCount} words`);

    res.json(videoData);

  } catch (error) {
    console.error('[DROID] Generation error:', error.message);
    res.status(500).json({
      error: 'Video generation failed',
      message: error.message,
      retry: true
    });
  }
});

/**
 * GET /api/droid/categories
 * Returns available news categories
 */
router.get('/categories', (req, res) => {
  res.json({
    categories: CATEGORIES.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      emoji: getCategoryEmoji(cat)
    })),
    mission: 'FOR THE KIDS!'
  });
});

/**
 * GET /api/droid/status
 * Returns droid service status
 */
router.get('/status', (req, res) => {
  res.json({
    service: 'Claude Droid News Generator',
    status: 'operational',
    capabilities: [
      'News fetching (News API)',
      'Script generation',
      'Edge TTS voiceover',
      'FFmpeg video rendering'
    ],
    revenue_split: {
      charity: '50%',
      infrastructure: '30%',
      founder: '20%'
    },
    mission: 'FOR THE KIDS!'
  });
});

/**
 * GET /api/droid/voices
 * Returns available TTS voices
 */
router.get('/voices', (req, res) => {
  res.json({
    voices: getVoices(),
    recommended: {
      news: 'en-US-GuyNeural',
      female_news: 'en-US-JennyNeural'
    },
    mission: 'FOR THE KIDS!'
  });
});

/**
 * POST /api/droid/tts
 * Generate speech from text
 */
router.post('/tts', async (req, res) => {
  const { text, voice, returnFile = false } = req.body;

  if (!text) {
    return res.status(400).json({
      error: 'Text is required',
      example: { text: 'Hello, this is Claude Droid!' }
    });
  }

  if (text.length > 5000) {
    return res.status(400).json({
      error: 'Text too long',
      maxLength: 5000,
      provided: text.length
    });
  }

  console.log(`[DROID-TTS] Generating speech: ${text.substring(0, 50)}...`);

  try {
    if (returnFile) {
      // Save to file and return file info
      const result = await generateSpeech(text, { voice });
      if (result.success) {
        res.json({
          success: true,
          ...result,
          mission: 'FOR THE KIDS!'
        });
      } else {
        res.status(500).json(result);
      }
    } else {
      // Return audio buffer directly
      const result = await generateSpeechBuffer(text, { voice });
      if (result.success) {
        res.set({
          'Content-Type': 'audio/mpeg',
          'Content-Length': result.size,
          'X-Voice': result.voice,
          'X-Mission': 'FOR-THE-KIDS'
        });
        res.send(result.buffer);
      } else {
        res.status(500).json(result);
      }
    }
  } catch (error) {
    console.error('[DROID-TTS] Error:', error.message);
    res.status(500).json({
      error: 'TTS generation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/droid/generate-with-audio
 * Generate news script AND audio in one call
 */
router.post('/generate-with-audio', async (req, res) => {
  const { category = 'general' } = req.body;

  // Validate category
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category',
      valid: CATEGORIES
    });
  }

  console.log(`[DROID] Generating ${category} news with audio...`);

  try {
    // Step 1: Fetch headlines
    let headlines = [];

    try {
      const newsResponse = await axios.get(NEWS_API_URL, {
        params: {
          country: 'us',
          category: category,
          pageSize: 5,
          apiKey: NEWS_API_KEY
        },
        timeout: 10000
      });

      headlines = newsResponse.data.articles || [];
    } catch (newsError) {
      console.log('[DROID] News API unavailable, using mock data');
      headlines = getMockHeadlines(category);
    }

    if (headlines.length === 0) {
      headlines = getMockHeadlines(category);
    }

    // Step 2: Generate script
    const script = generateScript(headlines, category);

    // Step 3: Generate audio
    console.log('[DROID] Generating TTS audio...');
    const audioResult = await generateNewsAudio(script, category);

    // Step 4: Build response
    const videoData = {
      id: `droid-${Date.now()}`,
      title: `${getCategoryEmoji(category)} ${category.toUpperCase()} News - ${new Date().toLocaleDateString()}`,
      description: `Today's top ${category} stories in 59 seconds! 50% of ad revenue goes to charity Children's Hospitals. #ForTheKids`,
      script: script,
      duration: 59,
      wordCount: script.split(/\\s+/).length,
      category: category,
      tags: ['news', category, 'shorts', 'ForTheKids', 'charity', 'VerifiedPediatricCharities'],
      headlines: headlines.slice(0, 5).map(h => ({
        title: h.title,
        source: h.source?.name || 'News'
      })),
      audio: audioResult.success ? {
        status: 'ready',
        filePath: audioResult.filePath,
        filename: audioResult.filename,
        duration: audioResult.duration,
        size: audioResult.size,
        voice: audioResult.voice
      } : {
        status: 'failed',
        error: audioResult.error
      },
      status: audioResult.success ? 'audio_ready' : 'script_only',
      mission: '50% to charity Children\'s Hospitals',
      createdAt: new Date().toISOString()
    };

    console.log(`[DROID] Script + Audio generated: ${videoData.wordCount} words, audio: ${audioResult.success ? 'OK' : 'FAILED'}`);

    res.json(videoData);

  } catch (error) {
    console.error('[DROID] Generation error:', error.message);
    res.status(500).json({
      error: 'Video generation failed',
      message: error.message,
      retry: true
    });
  }
});

/**
 * GET /api/droid/ffmpeg
 * Check FFmpeg availability
 */
router.get('/ffmpeg', async (req, res) => {
  const status = await checkFFmpeg();
  res.json({
    ...status,
    config: getVideoConfig(),
    mission: 'FOR THE KIDS!'
  });
});

/**
 * POST /api/droid/render-video
 * Render video from audio file + background image
 */
router.post('/render-video', async (req, res) => {
  const { audioPath, imagePath, category = 'news' } = req.body;

  if (!audioPath) {
    return res.status(400).json({
      error: 'audioPath is required',
      example: {
        audioPath: '/path/to/audio.mp3',
        imagePath: '/path/to/background.png',
        category: 'technology'
      }
    });
  }

  console.log(`[DROID-VIDEO] Rendering video: ${audioPath}`);

  try {
    const result = await renderVideo({
      audioPath,
      imagePath,
      category
    });

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('[DROID-VIDEO] Error:', error.message);
    res.status(500).json({
      error: 'Video rendering failed',
      message: error.message
    });
  }
});

/**
 * POST /api/droid/render-video-with-text
 * Render video with text overlay
 */
router.post('/render-video-with-text', async (req, res) => {
  const { audioPath, text, category = 'news', backgroundColor, textColor, fontSize } = req.body;

  if (!audioPath) {
    return res.status(400).json({
      error: 'audioPath is required',
      example: {
        audioPath: '/path/to/audio.mp3',
        text: 'Breaking News Headlines',
        category: 'news'
      }
    });
  }

  console.log(`[DROID-VIDEO] Rendering video with text: ${text?.substring(0, 30)}...`);

  try {
    const result = await renderVideoWithText({
      audioPath,
      text,
      category,
      backgroundColor,
      textColor,
      fontSize
    });

    if (result.success) {
      res.json({
        success: true,
        ...result
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('[DROID-VIDEO] Error:', error.message);
    res.status(500).json({
      error: 'Video rendering failed',
      message: error.message
    });
  }
});

/**
 * POST /api/droid/generate-full-video
 * Complete pipeline: News → Script → Audio → Video
 */
router.post('/generate-full-video', async (req, res) => {
  const { category = 'general' } = req.body;

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category',
      valid: CATEGORIES
    });
  }

  console.log(`[DROID] Full pipeline: ${category} news video...`);

  try {
    // Step 1: Fetch headlines
    let headlines = [];
    try {
      const newsResponse = await axios.get(NEWS_API_URL, {
        params: {
          country: 'us',
          category: category,
          pageSize: 5,
          apiKey: NEWS_API_KEY
        },
        timeout: 10000
      });
      headlines = newsResponse.data.articles || [];
    } catch (newsError) {
      console.log('[DROID] News API unavailable, using mock data');
      headlines = getMockHeadlines(category);
    }

    if (headlines.length === 0) {
      headlines = getMockHeadlines(category);
    }

    // Step 2: Generate script
    const script = generateScript(headlines, category);
    console.log(`[DROID] Script: ${script.split(/\s+/).length} words`);

    // Step 3: Generate audio
    console.log('[DROID] Generating TTS audio...');
    const audioResult = await generateNewsAudio(script, category);

    if (!audioResult.success) {
      return res.status(500).json({
        error: 'TTS generation failed',
        details: audioResult.error,
        stage: 'audio'
      });
    }

    // Step 4: Render video
    console.log('[DROID] Rendering video...');
    const videoResult = await renderVideo({
      audioPath: audioResult.filePath,
      category
    });

    // Build response
    const fullVideo = {
      id: `droid-full-${Date.now()}`,
      title: `${getCategoryEmoji(category)} ${category.toUpperCase()} News - ${new Date().toLocaleDateString()}`,
      description: `Today's top ${category} stories in 59 seconds! 50% of ad revenue goes to charity Children's Hospitals. #ForTheKids`,
      script: script,
      wordCount: script.split(/\s+/).length,
      category: category,
      tags: ['news', category, 'shorts', 'ForTheKids', 'charity', 'VerifiedPediatricCharities'],
      headlines: headlines.slice(0, 5).map(h => ({
        title: h.title,
        source: h.source?.name || 'News'
      })),
      audio: {
        status: 'ready',
        filePath: audioResult.filePath,
        filename: audioResult.filename,
        voice: audioResult.voice
      },
      video: videoResult.success ? {
        status: 'ready',
        filePath: videoResult.filePath,
        filename: videoResult.filename,
        size: videoResult.size,
        sizeMB: videoResult.sizeMB,
        resolution: videoResult.resolution
      } : {
        status: 'failed',
        error: videoResult.error
      },
      status: videoResult.success ? 'video_ready' : 'audio_only',
      mission: '50% to charity Children\'s Hospitals',
      createdAt: new Date().toISOString()
    };

    console.log(`[DROID] Full pipeline complete: ${fullVideo.status}`);
    res.json(fullVideo);

  } catch (error) {
    console.error('[DROID] Pipeline error:', error.message);
    res.status(500).json({
      error: 'Full video generation failed',
      message: error.message,
      retry: true
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// YOUTUBE ENDPOINTS - Final Pipeline Stage
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/droid/youtube-status
 * Check YouTube API configuration
 */
router.get('/youtube-status', (req, res) => {
  const status = checkYouTubeConfig();
  res.json({
    ...status,
    mission: 'FOR THE KIDS!'
  });
});

/**
 * GET /api/droid/youtube-auth
 * Get OAuth2 authorization URL
 */
router.get('/youtube-auth', (req, res) => {
  const result = getAuthUrl();
  res.json(result);
});

/**
 * POST /api/droid/youtube-callback
 * Exchange OAuth2 code for tokens
 */
router.post('/youtube-callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Authorization code is required',
      instructions: 'Get code from OAuth callback URL after authorization'
    });
  }

  const result = await exchangeCode(code);
  res.json(result);
});

/**
 * GET /api/droid/youtube-channel
 * Get authenticated channel info
 */
router.get('/youtube-channel', async (req, res) => {
  const result = await getChannelInfo();

  if (result.success) {
    res.json({
      ...result,
      mission: 'FOR THE KIDS!'
    });
  } else {
    res.status(result.error.includes('not authenticated') ? 401 : 500).json(result);
  }
});

/**
 * GET /api/droid/youtube-uploads
 * Get recent uploads from channel
 */
router.get('/youtube-uploads', async (req, res) => {
  const maxResults = parseInt(req.query.limit) || 10;
  const result = await getRecentUploads(maxResults);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

/**
 * POST /api/droid/upload-youtube
 * Upload video to YouTube
 */
router.post('/upload-youtube', async (req, res) => {
  const { filePath, title, description, tags, privacy = 'private' } = req.body;

  if (!filePath) {
    return res.status(400).json({
      error: 'filePath is required',
      example: {
        filePath: '/path/to/video.mp4',
        title: 'Tech News Update - Dec 8, 2025',
        description: '59-second news update. 50% of ad revenue goes to charity Children\'s Hospitals.',
        tags: ['news', 'technology', 'ForTheKids'],
        privacy: 'private'
      }
    });
  }

  console.log(`[DROID-YOUTUBE] Upload request: ${filePath}`);

  try {
    const result = await uploadVideo({
      filePath,
      title,
      description,
      tags: tags || [],
      privacy
    });

    if (result.success) {
      res.json(result);
    } else {
      const status = result.error.includes('not authenticated') ? 401 : 500;
      res.status(status).json(result);
    }
  } catch (error) {
    console.error('[DROID-YOUTUBE] Error:', error.message);
    res.status(500).json({
      error: 'YouTube upload failed',
      message: error.message
    });
  }
});

/**
 * POST /api/droid/generate-and-upload
 * Complete pipeline: News → Script → Audio → Video → YouTube
 */
router.post('/generate-and-upload', async (req, res) => {
  const { category = 'general', privacy = 'private' } = req.body;

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category',
      valid: CATEGORIES
    });
  }

  console.log(`[DROID] FULL PIPELINE: ${category} → YouTube (${privacy})`);

  try {
    // Step 1: Fetch headlines
    let headlines = [];
    try {
      const newsResponse = await axios.get(NEWS_API_URL, {
        params: {
          country: 'us',
          category: category,
          pageSize: 5,
          apiKey: NEWS_API_KEY
        },
        timeout: 10000
      });
      headlines = newsResponse.data.articles || [];
    } catch (newsError) {
      console.log('[DROID] News API unavailable, using mock data');
      headlines = getMockHeadlines(category);
    }

    if (headlines.length === 0) {
      headlines = getMockHeadlines(category);
    }

    // Step 2: Generate script
    const script = generateScript(headlines, category);
    console.log(`[DROID] Script: ${script.split(/\s+/).length} words`);

    // Step 3: Generate audio
    console.log('[DROID] Stage 3/5: Generating TTS audio...');
    const audioResult = await generateNewsAudio(script, category);

    if (!audioResult.success) {
      return res.status(500).json({
        error: 'TTS generation failed',
        details: audioResult.error,
        stage: 'audio'
      });
    }

    // Step 4: Render video
    console.log('[DROID] Stage 4/5: Rendering video...');
    const videoResult = await renderVideo({
      audioPath: audioResult.filePath,
      category
    });

    if (!videoResult.success) {
      return res.status(500).json({
        error: 'Video rendering failed',
        details: videoResult.error,
        stage: 'video',
        audio: audioResult.filePath
      });
    }

    // Step 5: Upload to YouTube
    console.log('[DROID] Stage 5/5: Uploading to YouTube...');
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const title = `${getCategoryEmoji(category)} ${category.charAt(0).toUpperCase() + category.slice(1)} News - ${dateStr} #Shorts`;
    const description = `Today's top ${category} stories in 59 seconds!\n\n50% of ALL ad revenue from this video goes directly to charity Children's Hospitals.\n\n#ForTheKids #VerifiedPediatricCharities #${category}News #Shorts #ClaudeDroid`;

    const uploadResult = await uploadVideo({
      filePath: videoResult.filePath,
      title,
      description,
      tags: ['news', category, 'shorts', 'ForTheKids', 'charity', 'VerifiedPediatricCharities', 'ClaudeDroid'],
      privacy
    });

    // Build final response
    const result = {
      id: `droid-full-${Date.now()}`,
      pipeline: 'news → script → audio → video → youtube',
      category,
      script: script,
      wordCount: script.split(/\s+/).length,
      headlines: headlines.slice(0, 5).map(h => ({
        title: h.title,
        source: h.source?.name || 'News'
      })),
      audio: {
        status: 'ready',
        filePath: audioResult.filePath
      },
      video: {
        status: 'ready',
        filePath: videoResult.filePath,
        sizeMB: videoResult.sizeMB
      },
      youtube: uploadResult.success ? {
        status: 'uploaded',
        videoId: uploadResult.videoId,
        videoUrl: uploadResult.videoUrl,
        shortsUrl: uploadResult.shortsUrl,
        privacy: uploadResult.status
      } : {
        status: 'failed',
        error: uploadResult.error,
        setup: uploadResult.setup
      },
      status: uploadResult.success ? 'published' : 'video_ready',
      mission: '50% to charity Children\'s Hospitals',
      createdAt: new Date().toISOString()
    };

    console.log(`[DROID] Pipeline complete: ${result.status}`);
    res.json(result);

  } catch (error) {
    console.error('[DROID] Full pipeline error:', error.message);
    res.status(500).json({
      error: 'Full pipeline failed',
      message: error.message,
      retry: true
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Helper: Generate script from headlines
function generateScript(headlines, category) {
  const intro = getIntro(category);
  const outro = getOutro();

  let script = intro + ' ';
  let wordCount = intro.split(/\s+/).length;

  // Add headlines until we hit target
  for (const article of headlines) {
    if (!article.title) continue;

    // Clean and format headline
    const headline = article.title
      .replace(/\s*[-–—]\s*.+$/, '') // Remove source suffix
      .replace(/['"]/g, '')
      .trim();

    const headlineWords = headline.split(/\s+/).length;

    if (wordCount + headlineWords + outro.split(/\s+/).length < TARGET_WORDS) {
      script += headline + '. ';
      wordCount += headlineWords + 1;
    }
  }

  script += outro;

  return script.trim();
}

// Helper: Get category-specific intro
function getIntro(category) {
  const intros = {
    general: "Here's your 59-second news update. Let's dive into today's top stories.",
    sports: "Sports fans, here's your quick update on what's happening in the world of sports.",
    business: "Market watch time. Here are the business headlines you need to know.",
    technology: "Tech news in under a minute. Here's what's happening in the digital world.",
    entertainment: "Entertainment buzz in 59 seconds. Here's what's trending in Hollywood."
  };
  return intros[category] || intros.general;
}

// Helper: Get outro
function getOutro() {
  return "That's your news update. Remember, 50% of our revenue goes to charity Children's Hospitals. Subscribe for more news that helps kids. This is Claude Droid, signing off.";
}

// Helper: Get category emoji
function getCategoryEmoji(category) {
  const emojis = {
    general: '📰',
    sports: '⚽',
    business: '💼',
    technology: '💻',
    entertainment: '🎬'
  };
  return emojis[category] || '📰';
}

// Helper: Mock headlines for demo/development
function getMockHeadlines(category) {
  const mockData = {
    general: [
      { title: 'Major climate summit reaches historic agreement', source: { name: 'Reuters' } },
      { title: 'New breakthrough in renewable energy storage announced', source: { name: 'AP' } },
      { title: 'Global leaders meet to discuss economic cooperation', source: { name: 'BBC' } },
      { title: 'Space agency reveals plans for lunar base by 2030', source: { name: 'NASA' } },
      { title: 'International aid reaches disaster-affected regions', source: { name: 'UN News' } }
    ],
    sports: [
      { title: 'Championship finals set new viewership records', source: { name: 'ESPN' } },
      { title: 'Star athlete announces comeback after injury recovery', source: { name: 'Sports Illustrated' } },
      { title: 'Historic trade deal shakes up league standings', source: { name: 'Bleacher Report' } },
      { title: 'Youth sports program receives major funding boost', source: { name: 'NBC Sports' } },
      { title: 'International tournament draws record attendance', source: { name: 'Fox Sports' } }
    ],
    business: [
      { title: 'Tech giants report strong quarterly earnings', source: { name: 'Bloomberg' } },
      { title: 'Federal Reserve signals policy shift ahead', source: { name: 'CNBC' } },
      { title: 'Electric vehicle sales surge to new highs', source: { name: 'Reuters' } },
      { title: 'Startup ecosystem sees record investment levels', source: { name: 'TechCrunch' } },
      { title: 'Global supply chains show signs of recovery', source: { name: 'Financial Times' } }
    ],
    technology: [
      { title: 'AI breakthrough promises faster drug discovery', source: { name: 'Wired' } },
      { title: 'New smartphone features revolutionary battery tech', source: { name: 'The Verge' } },
      { title: 'Quantum computing milestone achieved by researchers', source: { name: 'MIT Tech Review' } },
      { title: 'Social media platform launches privacy-focused features', source: { name: 'TechCrunch' } },
      { title: 'Cybersecurity experts warn of emerging threats', source: { name: 'Ars Technica' } }
    ],
    entertainment: [
      { title: 'Blockbuster film breaks opening weekend records', source: { name: 'Variety' } },
      { title: 'Music awards ceremony celebrates diverse talents', source: { name: 'Billboard' } },
      { title: 'Streaming platform announces major content deal', source: { name: 'Hollywood Reporter' } },
      { title: 'Celebrity couple confirms engagement news', source: { name: 'People' } },
      { title: 'Beloved TV series announces surprise renewal', source: { name: 'Entertainment Weekly' } }
    ]
  };

  return mockData[category] || mockData.general;
}

export default router;
