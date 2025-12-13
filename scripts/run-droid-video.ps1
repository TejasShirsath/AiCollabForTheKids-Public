$body = '{"category": "technology"}'
$result = Invoke-WebRequest -Uri http://localhost:3000/api/droid/generate-full-video -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 300
$result.Content
