# Claude Droid Daily Scheduler

**FOR THE KIDS - 50% to charity Children's Hospitals**

---

## Overview

The Claude Droid scheduler automatically generates YouTube Shorts videos daily at 8 AM EST. Each video is a 59-second news roundup with text-to-speech narration.

## Configuration

| Setting | Value |
|---------|-------|
| **Schedule** | Daily at 8:00 AM EST |
| **Check Interval** | Every 15 minutes |
| **PM2 Process** | `droid-scheduler` |
| **Log File** | `output/droid-schedule.log` |
| **State File** | `output/droid-last-run.json` |

## PM2 Management

```powershell
# View status
pm2 status droid-scheduler

# View logs
pm2 logs droid-scheduler --lines 50

# Restart scheduler
pm2 restart droid-scheduler

# Stop scheduler
pm2 stop droid-scheduler

# Start scheduler (if stopped)
pm2 start droid-scheduler
```

## How It Works

1. **Startup**: Scheduler starts and logs initialization
2. **15-Minute Check**: Every 15 minutes, checks if it's 8 AM EST
3. **Daily Trigger**: At 8 AM EST, calls the video generation API
4. **Deduplication**: Uses `droid-last-run.json` to ensure only one video per day
5. **Logging**: All activity logged to `droid-schedule.log`

## Categories

Videos are generated from these categories (weighted towards tech/business):

- technology (2x weight)
- business (2x weight)
- science
- health
- entertainment
- general

## Manual Trigger

To generate a video manually at any time:

```powershell
# Via PowerShell
$body = '{"category": "technology"}'
Invoke-WebRequest -Uri http://localhost:3000/api/droid/generate-full-video -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing

# Via curl
curl -X POST http://localhost:3000/api/droid/generate-full-video \
  -H "Content-Type: application/json" \
  -d '{"category": "technology"}'
```

## Output Locations

| Type | Directory |
|------|-----------|
| Video | `C:\AiCollabForTheKids\output\video\` |
| Audio | `C:\AiCollabForTheKids\output\audio\` |
| Logs | `C:\AiCollabForTheKids\output\droid-schedule.log` |

## Video Specifications

- **Format**: MP4 (H.264)
- **Resolution**: 1080x1920 (YouTube Shorts vertical)
- **Audio**: MP3 (24kHz, 96kbps)
- **Duration**: ~59 seconds
- **Voice**: en-US-GuyNeural (Microsoft Edge TTS)

## Log Format

```
[2025-12-08T13:00:00.000Z] ═══════════════════════════════════════════════════════════════
[2025-12-08T13:00:00.001Z] CLAUDE DROID - GENERATING DAILY VIDEO
[2025-12-08T13:00:00.002Z] Category: technology
[2025-12-08T13:00:00.003Z] Mission: FOR THE KIDS - 50% to charity Children's Hospitals
[2025-12-08T13:00:00.004Z] ═══════════════════════════════════════════════════════════════
[2025-12-08T13:00:15.000Z] SUCCESS! Video generated:
[2025-12-08T13:00:15.001Z]   Status: video_ready
[2025-12-08T13:00:15.002Z]   Video: droid_technology_2025-12-08T13-00-00.mp4
[2025-12-08T13:00:15.003Z]   Audio: droid_technology_2025-12-08T13-00-00.mp3
[2025-12-08T13:00:15.004Z]   Size: 0.51 MB
[2025-12-08T13:00:15.005Z]   Words: 69
[2025-12-08T13:00:15.006Z]   Duration: 15.0s
```

## Troubleshooting

### Scheduler Not Running
```powershell
# Check if process exists
pm2 list | findstr droid-scheduler

# Start if missing
pm2 start C:\AiCollabForTheKids\scripts\droid-daily-scheduler.cjs --name droid-scheduler
pm2 save
```

### Video Not Generated
1. Check if jules-api is running: `pm2 status jules-api`
2. Check scheduler logs: `pm2 logs droid-scheduler`
3. Check API logs: `pm2 logs jules-api`

### Manual Generation Fails
1. Verify API health: `curl http://localhost:3000/health`
2. Check TTS service: `curl http://localhost:3000/api/droid/voices`
3. Verify FFmpeg: Check `api/services/video.js` uses ffmpeg-static

## Files

| File | Purpose |
|------|---------|
| `scripts/droid-daily-scheduler.cjs` | Main scheduler script |
| `api/routes/droid.js` | Video generation API |
| `api/services/tts.js` | Text-to-speech service |
| `api/services/video.js` | FFmpeg video rendering |
| `api/services/youtube.js` | YouTube upload (pending creds) |

## Next Steps

1. **YouTube API Setup**: Configure OAuth2 credentials for auto-upload
2. **News API Key**: Add real news headlines (currently using mock data)
3. **Multiple Daily Slots**: Consider 8 AM and 6 PM generation

---

**Mission: FOR THE KIDS - 50% to charity Children's Hospitals**
