# Google Analytics 4 Setup Guide

**FOR THE KIDS - 50% to charity Children's Hospitals**

---

## Current Status

GA4 tracking code has been added to:
- ✅ `ai-solutions-store/index.html`
- ✅ `youandinotai-landing/index.html`

**Placeholder ID:** `G-XXXXXXXXXX` (needs to be replaced)

---

## Joshua's Setup Steps

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon)
3. Click **Create Property**
4. Fill in:
   - Property name: `FOR THE KIDS Platform`
   - Reporting time zone: Eastern
   - Currency: USD
5. Click **Next** → Select **Web**

### 2. Set Up Data Stream

1. Enter website URL: `ai-solutions.store`
2. Stream name: `AI Solutions Store`
3. Click **Create Stream**
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Create Second Stream (Optional)

For youandinotai.com:
1. Go to **Admin** → **Data Streams** → **Add Stream**
2. URL: `youandinotai.com`
3. Stream name: `YouAndINotAI`
4. Get second Measurement ID

### 4. Replace Placeholder in Code

Search for `G-XXXXXXXXXX` in both files and replace with your Measurement ID:

**ai-solutions-store/index.html** (2 places):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOURCODE"></script>
...
gtag('config', 'G-YOURCODE');
```

**youandinotai-landing/index.html** (2 places):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOURCODE"></script>
...
gtag('config', 'G-YOURCODE');
```

### 5. Commit & Deploy

```bash
git add ai-solutions-store/index.html youandinotai-landing/index.html
git commit -m "Add GA4 Measurement ID"
git push origin master
```

Cloudflare Pages will auto-deploy.

---

## Events Being Tracked

| Event | Trigger | Properties |
|-------|---------|------------|
| `page_view` | Auto on load | URL, title |
| `begin_checkout` | Checkout button click | tier, price |
| `checkout_click` | Checkout button click | tier, price, source |
| `generate_lead` | Email signup | source |
| `email_signup` | Email signup | source |

---

## Viewing Data

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. **Reports** → **Realtime** for live data
4. **Reports** → **Engagement** → **Events** for historical

---

## Important Notes

- Data takes 24-48 hours to fully populate
- Realtime shows data immediately
- Use same Measurement ID for both sites OR create separate streams
- Both sites use the same tracking functions

---

**Track what works → Optimize → More donations**

*FOR THE KIDS. ALWAYS.*
