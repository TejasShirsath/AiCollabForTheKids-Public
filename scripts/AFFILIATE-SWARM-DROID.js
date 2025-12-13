/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AFFILIATE SWARM DROID - Compound Growth Track
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GOSPEL V1.2 COMPLIANT - Zero-Cost User Acquisition System
 * Uses Gemini 2.0 Flash for Gospel-compliant content generation
 *
 * Platform: FOR THE KIDS
 * Track: COMPOUND GROWTH
 * Author: Claude Opus 4.5 (The Architect)
 *
 * GOSPEL RULE #3: BRAND IDENTITY (Benevolent Technocracy)
 * - Color: #CC785C (Charity)
 * - Color: #078EFA (Technology)
 * - Tone: Technical efficiency, not charity plea
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ═══════════════════════════════════════════════════════════════════════════════
// GOSPEL BRAND CONFIGURATION (RULE #3: LOCKED)
// ═══════════════════════════════════════════════════════════════════════════════

const GOSPEL_BRAND = {
    name: 'FOR THE KIDS',
    tone: 'Benevolent Technocracy',
    colors: {
        charity: '#CC785C',      // Warm terracotta - represents kids
        technology: '#078EFA',   // Electric blue - represents AI efficiency
        accent: '#20808D',       // Teal - represents trust
        background: '#141413'    // Dark void - represents infinite potential
    },
    split: {
        charity: 50,
        infrastructure: 30,
        founder: 20
    },
    messaging: {
        core: '50% of NET profits automatically allocated to verified pediatric charities',
        differentiator: 'Not asking for donations - building efficient systems that generate charity as a byproduct',
        cta: 'Join the autonomous philanthropy revolution'
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

const PLATFORM_SPECS = {
    'TikTok Script': {
        maxLength: 150,
        style: 'punchy, hook-first, trend-aware',
        format: 'Hook (3s) → Problem (5s) → Solution (7s) → CTA (3s)',
        hashtags: ['#AI', '#charity', '#tech', '#forthekids', '#automation']
    },
    'LinkedIn Post': {
        maxLength: 1300,
        style: 'professional, thought-leadership, data-driven',
        format: 'Opening hook → Context → Key insight → Data point → CTA',
        hashtags: ['#AIforGood', '#SocialImpact', '#TechInnovation', '#Philanthropy']
    },
    'Twitter Thread': {
        maxLength: 280,
        style: 'concise, provocative, thread-friendly',
        format: '1/ Hook → 2-5/ Key points → Final/ CTA with link',
        hashtags: ['#AI', '#Web3', '#CharityTech']
    },
    'Instagram Caption': {
        maxLength: 2200,
        style: 'storytelling, emotional, visual-first',
        format: 'Emotional hook → Story → Impact stats → CTA',
        hashtags: ['#forthekids', '#AIwithpurpose', '#techforgood', '#charityautomation']
    },
    'YouTube Description': {
        maxLength: 5000,
        style: 'SEO-optimized, comprehensive, link-rich',
        format: 'Summary → Timestamps → Links → About section',
        hashtags: ['AI', 'charity', 'automation', 'philanthropy']
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// AFFILIATE SWARM DROID CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class AffiliateSwarmDroid {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        this.brand = GOSPEL_BRAND;
    }

    /**
     * Generate Gospel-compliant recruitment content for a specific platform
     * @param {string} platform - Target platform (e.g., 'TikTok Script', 'LinkedIn Post')
     * @param {string} theme - Content theme (e.g., 'efficiency', 'impact', 'technology')
     * @returns {Promise<string[]>} Array of 5 unique posts
     */
    async GenerateRecruitmentContent(platform, theme = 'efficiency') {
        const specs = PLATFORM_SPECS[platform];

        if (!specs) {
            throw new Error(`Unknown platform: ${platform}. Valid: ${Object.keys(PLATFORM_SPECS).join(', ')}`);
        }

        const systemPrompt = this._buildSystemPrompt();
        const contentPrompt = this._buildContentPrompt(platform, theme, specs);

        try {
            const result = await this.model.generateContent([
                { text: systemPrompt },
                { text: contentPrompt }
            ]);

            const response = result.response.text();
            return this._parseGeneratedContent(response);
        } catch (error) {
            console.error('Content generation failed:', error);
            throw error;
        }
    }

    /**
     * Build the system prompt enforcing Gospel brand rules
     */
    _buildSystemPrompt() {
        return `
You are a content creator for the FOR THE KIDS platform - an autonomous philanthropy engine.

BRAND IDENTITY (GOSPEL RULE #3 - IMMUTABLE):
- Brand Name: ${this.brand.name}
- Tone: ${this.brand.tone}
- Primary Color (Charity): ${this.brand.colors.charity}
- Secondary Color (Tech): ${this.brand.colors.technology}

REVENUE SPLIT (GOSPEL RULE #2 - IMMUTABLE):
- 50% → Verified Pediatric Charities
- 30% → Infrastructure
- 20% → Founder

CRITICAL MESSAGING RULES:
1. NEVER frame as "donations" or "charity pleas"
2. ALWAYS emphasize EFFICIENCY and AUTOMATION
3. The 50% split is a TECHNICAL DIVIDEND of efficient systems, not generosity
4. Focus on the TECHNOLOGY that makes automatic giving possible
5. Target audience: Tech-savvy individuals who value innovation
6. Avoid emotional manipulation - use data and logic

CORE MESSAGE: "${this.brand.messaging.core}"
DIFFERENTIATOR: "${this.brand.messaging.differentiator}"

DO NOT:
- Use guilt-based messaging
- Overuse emojis (max 2-3 per post)
- Make unverified claims about children helped
- Reference specific charities without "Verified Pediatric Charities"
- Sound like traditional charity marketing
`;
    }

    /**
     * Build the content generation prompt
     */
    _buildContentPrompt(platform, theme, specs) {
        const themes = {
            efficiency: 'Focus on how AI automation makes 50% charity allocation effortless',
            impact: 'Focus on the compounding effect of consistent automated giving',
            technology: 'Focus on the technical architecture enabling trustless philanthropy',
            community: 'Focus on joining a movement of builders who code for good',
            transparency: 'Focus on public ledger and Gospel-locked immutable rules'
        };

        return `
Generate exactly 5 unique ${platform} posts for the FOR THE KIDS platform.

PLATFORM SPECIFICATIONS:
- Max Length: ${specs.maxLength} characters
- Style: ${specs.style}
- Format: ${specs.format}
- Suggested Hashtags: ${specs.hashtags.join(' ')}

THEME FOR THIS BATCH: ${themes[theme] || themes.efficiency}

OUTPUT FORMAT:
Return exactly 5 posts, each separated by "---POST---"
Each post should be complete and ready to publish.
Include appropriate hashtags for the platform.

Generate the 5 posts now:
`;
    }

    /**
     * Parse the generated content into an array of posts
     */
    _parseGeneratedContent(response) {
        const posts = response
            .split('---POST---')
            .map(post => post.trim())
            .filter(post => post.length > 0);

        // Ensure we have exactly 5 posts
        if (posts.length < 5) {
            console.warn(`Only generated ${posts.length} posts, expected 5`);
        }

        return posts.slice(0, 5);
    }

    /**
     * Generate content for all platforms
     */
    async GenerateFullSwarm(theme = 'efficiency') {
        const results = {};

        for (const platform of Object.keys(PLATFORM_SPECS)) {
            console.log(`Generating ${platform} content...`);
            try {
                results[platform] = await this.GenerateRecruitmentContent(platform, theme);
            } catch (error) {
                console.error(`Failed to generate ${platform}:`, error.message);
                results[platform] = [];
            }
        }

        return results;
    }

    /**
     * Validate content against Gospel rules
     */
    ValidateGospelCompliance(content) {
        const violations = [];

        // Check for forbidden terms
        const forbiddenTerms = ['donate', 'donation', 'give now', 'help us', 'please help'];
        for (const term of forbiddenTerms) {
            if (content.toLowerCase().includes(term)) {
                violations.push(`Contains forbidden term: "${term}"`);
            }
        }

        // Check split accuracy
        if (content.includes('%') && !content.includes('50%')) {
            if (content.includes('30%') || content.includes('20%')) {
                // Only flag if other percentages mentioned without 50%
                violations.push('Mentions split percentages without emphasizing 50% charity');
            }
        }

        return {
            compliant: violations.length === 0,
            violations
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT & CLI
// ═══════════════════════════════════════════════════════════════════════════════

export { AffiliateSwarmDroid, GOSPEL_BRAND, PLATFORM_SPECS };

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('AFFILIATE-SWARM-DROID.js')) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('ERROR: GEMINI_API_KEY environment variable not set');
        console.log('Set it from api/.env: GEMINI_API_KEY=AIzaSy...');
        process.exit(1);
    }

    const droid = new AffiliateSwarmDroid(apiKey);
    const platform = process.argv[2] || 'LinkedIn Post';
    const theme = process.argv[3] || 'efficiency';

    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║              AFFILIATE SWARM DROID - COMPOUND GROWTH TRACK                     ║
║                    FOR THE KIDS - GOSPEL V1.2                                  ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Generating ${platform} content with "${theme}" theme...
`);

    droid.GenerateRecruitmentContent(platform, theme)
        .then(posts => {
            console.log(`\n✅ Generated ${posts.length} posts:\n`);
            posts.forEach((post, i) => {
                console.log(`\n--- POST ${i + 1} ---\n${post}`);
            });
        })
        .catch(err => {
            console.error('Generation failed:', err.message);
            process.exit(1);
        });
}
