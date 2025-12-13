# YouTube API Setup Guide - Claude Droid

This guide explains how to set up YouTube Data API v3 for Claude Droid video uploads.

## Prerequisites

1. Google account that owns the YouTube channel
2. Google Cloud Console access
3. YouTube channel with upload permissions

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Claude Droid News"
3. Note the Project ID

## Step 2: Enable YouTube Data API v3

1. In Cloud Console, go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click "Enable"

## Step 3: Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Claude Droid"
5. Authorized redirect URIs:
   - `http://localhost:3000/api/youtube/callback`
   - `https://your-domain.com/api/youtube/callback`
6. Click "Create"
7. Download the JSON or copy:
   - Client ID
   - Client Secret

## Step 4: Configure OAuth Consent Screen

1. Go to "OAuth consent screen"
2. User type: "External" (for testing) or "Internal" (for Workspace)
3. Fill in:
   - App name: "Claude Droid News"
   - User support email
   - Developer contact email
4. Scopes: Add `youtube.upload` and `youtube`
5. Test users: Add your YouTube channel email

## Step 5: Add Credentials to .env

```env
# YouTube API (OAuth2)
YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube/callback
YOUTUBE_REFRESH_TOKEN=  # Will be filled after authorization
```

## Step 6: Authorize the Application

1. Start your API server
2. Call `GET /api/droid/youtube-auth`
3. Visit the returned `authUrl` in a browser
4. Sign in with the YouTube channel account
5. Authorize the application
6. Copy the `code` from the redirect URL
7. Call `POST /api/droid/youtube-callback` with `{ "code": "your_code" }`
8. Save the returned `refreshToken` to `.env` as `YOUTUBE_REFRESH_TOKEN`

## Step 7: Verify Setup

```bash
# Check configuration
curl http://localhost:3000/api/droid/youtube-status

# Get channel info
curl http://localhost:3000/api/droid/youtube-channel

# Test upload (private video)
curl -X POST http://localhost:3000/api/droid/upload-youtube \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/video.mp4",
    "title": "Test Video",
    "privacy": "private"
  }'
```

## API Quotas

YouTube Data API has daily quotas:
- Default: 10,000 units/day
- Video upload: ~1,600 units each
- Max uploads: ~6 videos/day with default quota

To request more quota:
1. Go to "Quotas" in Cloud Console
2. Click "Edit Quotas"
3. Fill in the request form

## Monetization Note

For ad revenue to count toward charity donation:
1. Channel must be in YouTube Partner Program
2. Videos must be original content
3. Content must comply with advertiser guidelines

## Troubleshooting

### "YouTube not authenticated"
- Refresh token expired or missing
- Re-run the authorization flow

### "API quota exceeded"
- Wait until next day (quotas reset at midnight Pacific)
- Request quota increase

### "Access denied"
- Check OAuth consent screen status
- Verify test users if in testing mode
- Ensure YouTube channel has upload permissions

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_CLIENT_ID` | Yes | OAuth2 Client ID |
| `YOUTUBE_CLIENT_SECRET` | Yes | OAuth2 Client Secret |
| `YOUTUBE_REDIRECT_URI` | No | OAuth callback URL (default: localhost) |
| `YOUTUBE_REFRESH_TOKEN` | Yes* | Long-lived refresh token (*after auth) |
| `YOUTUBE_API_KEY` | No | API key (read-only operations) |

---

**FOR THE KIDS - 50% to charity Children's Hospitals**
