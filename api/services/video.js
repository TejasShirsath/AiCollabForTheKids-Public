/**
 * Video Service - FFmpeg video rendering for Claude Droid
 * FOR THE KIDS - 50% to charity Children's Hospitals
 *
 * Combines TTS audio + background images into YouTube Shorts
 */

import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT SANITIZATION (Task #064 - Dec 8, 2025)
// Prevents command injection in FFmpeg calls
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Sanitize text input for FFmpeg filters
 * Removes shell metacharacters and limits length
 */
function sanitizeText(input) {
    if (!input || typeof input !== 'string') return '';
    return input
        .replace(/[;&|`$(){}[\]<>\\'"]/g, '')
        .substring(0, 500);
}

/**
 * Sanitize file paths for FFmpeg
 * Prevents directory traversal and removes dangerous characters
 */
function sanitizePath(input) {
    if (!input || typeof input !== 'string') return '';
    return input
        .replace(/\.\./g, '')
        .replace(/[<>:"|?*]/g, '')
        .replace(/\\/g, '/');
}

// Set FFmpeg path to use the npm-installed binary
ffmpeg.setFfmpegPath(ffmpegStatic);
const FFMPEG_PATH = ffmpegStatic;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directories
const OUTPUT_DIR = path.join(__dirname, '../../output/video');
const ASSETS_DIR = path.join(__dirname, '../../assets');

// Video settings for YouTube Shorts (9:16 vertical)
const VIDEO_CONFIG = {
    width: 1080,
    height: 1920,
    fps: 30,
    audioBitrate: '192k',
    videoBitrate: '4000k',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac'
};

// Ensure directories exist
function ensureDirectories() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }
}

/**
 * Create a solid color background image if none provided
 * @param {string} color - Hex color (e.g., '#1a1a2e')
 * @param {string} outputPath - Path to save image
 */
async function createBackgroundImage(color = '#1a1a2e', outputPath) {
    return new Promise((resolve, reject) => {
        // Sanitize color input (hex color format)
        const sanitizedColor = sanitizeText(color).replace(/[^0-9a-fA-F#]/g, '');
        const sanitizedOutputPath = sanitizePath(outputPath);

        // Use FFmpeg to create a solid color image
        const args = [
            '-f', 'lavfi',
            '-i', `color=c=${sanitizedColor.replace('#', '0x')}:s=${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height}:d=1`,
            '-frames:v', '1',
            '-y',
            sanitizedOutputPath
        ];

        const proc = spawn(FFMPEG_PATH, args);
        let stderr = '';

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve(outputPath);
            } else {
                reject(new Error(`Failed to create background: ${stderr}`));
            }
        });

        proc.on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Render video from audio + background image
 * @param {Object} options - Render options
 * @param {string} options.audioPath - Path to audio file (MP3)
 * @param {string} options.imagePath - Path to background image (optional)
 * @param {string} options.outputFilename - Output filename (optional)
 * @param {string} options.category - News category for filename
 * @param {number} options.duration - Video duration in seconds (default: auto from audio)
 * @returns {Promise<Object>} Result with file info
 */
export async function renderVideo(options = {}) {
    ensureDirectories();

    const {
        audioPath,
        imagePath,
        outputFilename,
        category = 'news',
        duration
    } = options;

    // Sanitize inputs (Task #064)
    const sanitizedAudioPath = sanitizePath(audioPath);
    const sanitizedImagePath = imagePath ? sanitizePath(imagePath) : null;

    // Validate audio file
    if (!sanitizedAudioPath || !fs.existsSync(sanitizedAudioPath)) {
        return {
            success: false,
            error: 'Audio file not found',
            audioPath: sanitizedAudioPath
        };
    }

    // Generate output filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = outputFilename || `droid_${category}_${timestamp}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Use provided image or create default background
    let bgImagePath = sanitizedImagePath;
    if (!bgImagePath || !fs.existsSync(bgImagePath)) {
        // Create a default dark background
        bgImagePath = path.join(ASSETS_DIR, 'default_bg.png');
        if (!fs.existsSync(bgImagePath)) {
            try {
                await createBackgroundImage('#1a1a2e', bgImagePath);
            } catch (err) {
                console.error('[VIDEO] Failed to create background:', err.message);
                return {
                    success: false,
                    error: 'Failed to create background image',
                    details: err.message
                };
            }
        }
    }

    console.log(`[VIDEO] Rendering: ${sanitizedAudioPath} + ${bgImagePath} → ${filename}`);

    return new Promise((resolve, reject) => {
        // Build FFmpeg command (using sanitized paths - Task #064)
        // -loop 1: loop image
        // -i image: input image
        // -i audio: input audio
        // -c:v libx264: video codec
        // -tune stillimage: optimize for still image
        // -c:a aac: audio codec
        // -shortest: stop when shortest input ends (audio)
        // -pix_fmt yuv420p: pixel format for compatibility

        const command = ffmpeg()
            .input(bgImagePath)
            .inputOptions(['-loop', '1'])
            .input(sanitizedAudioPath)
            .outputOptions([
                '-c:v', VIDEO_CONFIG.codec,
                '-tune', 'stillimage',
                '-c:a', VIDEO_CONFIG.audioCodec,
                '-b:a', VIDEO_CONFIG.audioBitrate,
                '-b:v', VIDEO_CONFIG.videoBitrate,
                '-pix_fmt', 'yuv420p',
                '-shortest',
                '-movflags', '+faststart'
            ])
            .size(`${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height}`)
            .fps(VIDEO_CONFIG.fps)
            .output(outputPath);

        // Add duration if specified
        if (duration) {
            command.duration(duration);
        }

        command
            .on('start', (cmd) => {
                console.log('[VIDEO] FFmpeg started:', cmd);
            })
            .on('progress', (progress) => {
                if (progress.percent) {
                    console.log(`[VIDEO] Progress: ${progress.percent.toFixed(1)}%`);
                }
            })
            .on('end', () => {
                // Get file stats
                const stats = fs.statSync(outputPath);

                console.log(`[VIDEO] Render complete: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

                resolve({
                    success: true,
                    filePath: outputPath,
                    filename,
                    size: stats.size,
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    format: VIDEO_CONFIG.format,
                    resolution: `${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height}`,
                    mission: 'FOR THE KIDS!'
                });
            })
            .on('error', (err, stdout, stderr) => {
                console.error('[VIDEO] FFmpeg error:', err.message);
                console.error('[VIDEO] stderr:', stderr);

                resolve({
                    success: false,
                    error: err.message,
                    stderr
                });
            })
            .run();
    });
}

/**
 * Render video with text overlay
 * @param {Object} options - Render options
 * @param {string} options.audioPath - Path to audio file
 * @param {string} options.text - Text to overlay (e.g., headline)
 * @param {string} options.category - News category
 * @returns {Promise<Object>} Result with file info
 */
export async function renderVideoWithText(options = {}) {
    ensureDirectories();

    const {
        audioPath,
        text = '',
        category = 'news',
        backgroundColor = '#1a1a2e',
        textColor = 'white',
        fontSize = 48
    } = options;

    // Sanitize inputs (Task #064)
    const sanitizedAudioPath = sanitizePath(audioPath);

    // Validate audio file
    if (!sanitizedAudioPath || !fs.existsSync(sanitizedAudioPath)) {
        return {
            success: false,
            error: 'Audio file not found',
            audioPath: sanitizedAudioPath
        };
    }

    // Generate output filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `droid_${category}_text_${timestamp}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    // Sanitize and escape text for FFmpeg filter (Task #064 - prevents injection)
    const sanitizedText = sanitizeText(text);
    const escapedText = sanitizedText
        .replace(/'/g, "'\\''")
        .replace(/:/g, '\\:')
        .substring(0, 200); // Limit text length

    console.log(`[VIDEO] Rendering with text overlay: ${filename}`);

    return new Promise((resolve, reject) => {
        // Sanitize backgroundColor (Task #064)
        const sanitizedBgColor = sanitizeText(backgroundColor).replace(/[^0-9a-fA-F#]/g, '');
        const sanitizedTextColor = sanitizeText(textColor).replace(/[^a-zA-Z0-9#]/g, '');

        // Complex filter: create background + add text + AI disclosure
        // AI disclosure added for FTC/CA SB 1001/EU AI Act compliance
        const filterComplex = [
            `color=c=${sanitizedBgColor.replace('#', '0x')}:s=${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height}`,
            `drawtext=text='${escapedText}':fontcolor=${sanitizedTextColor}:fontsize=${fontSize}:x=(w-text_w)/2:y=(h-text_h)/2:font=Arial`,
            `drawtext=text='AI-Generated Content':fontcolor=white:fontsize=24:x=20:y=20:font=Arial:box=1:boxcolor=black@0.5:boxborderw=5`
        ].join(',');

        const args = [
            '-f', 'lavfi',
            '-i', filterComplex,
            '-i', sanitizedAudioPath,
            '-c:v', VIDEO_CONFIG.codec,
            '-c:a', VIDEO_CONFIG.audioCodec,
            '-b:a', VIDEO_CONFIG.audioBitrate,
            '-b:v', VIDEO_CONFIG.videoBitrate,
            '-pix_fmt', 'yuv420p',
            '-shortest',
            '-movflags', '+faststart',
            '-y',
            outputPath
        ];

        const proc = spawn(FFMPEG_PATH, args);
        let stderr = '';

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
            // Log progress
            const match = data.toString().match(/time=(\d{2}:\d{2}:\d{2})/);
            if (match) {
                console.log(`[VIDEO] Progress: ${match[1]}`);
            }
        });

        proc.on('close', (code) => {
            if (code === 0 && fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                console.log(`[VIDEO] Render complete: ${filename}`);

                resolve({
                    success: true,
                    filePath: outputPath,
                    filename,
                    size: stats.size,
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    format: VIDEO_CONFIG.format,
                    resolution: `${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height}`,
                    hasText: true,
                    mission: 'FOR THE KIDS!'
                });
            } else {
                resolve({
                    success: false,
                    error: `FFmpeg exited with code ${code}`,
                    stderr
                });
            }
        });

        proc.on('error', (err) => {
            resolve({
                success: false,
                error: err.message
            });
        });
    });
}

/**
 * Check if FFmpeg is available
 * @returns {Promise<Object>} FFmpeg status
 */
export async function checkFFmpeg() {
    return new Promise((resolve) => {
        const proc = spawn('ffmpeg', ['-version']);
        let stdout = '';

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        proc.on('close', (code) => {
            if (code === 0) {
                // Extract version from first line
                const versionMatch = stdout.match(/ffmpeg version ([^\s]+)/);
                resolve({
                    available: true,
                    version: versionMatch ? versionMatch[1] : 'unknown',
                    message: 'FFmpeg is available'
                });
            } else {
                resolve({
                    available: false,
                    error: 'FFmpeg not found in PATH',
                    install: 'Download from https://ffmpeg.org/download.html'
                });
            }
        });

        proc.on('error', () => {
            resolve({
                available: false,
                error: 'FFmpeg not installed',
                install: 'Download from https://ffmpeg.org/download.html'
            });
        });
    });
}

/**
 * Get video configuration
 * @returns {Object} Video settings
 */
export function getVideoConfig() {
    return {
        ...VIDEO_CONFIG,
        outputDir: OUTPUT_DIR,
        assetsDir: ASSETS_DIR
    };
}

// Export for ES modules
export default {
    renderVideo,
    renderVideoWithText,
    checkFFmpeg,
    getVideoConfig,
    VIDEO_CONFIG,
    OUTPUT_DIR
};
