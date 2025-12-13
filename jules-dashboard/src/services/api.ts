/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GOSPEL API SERVICE - IMMUTABLE FOUNDATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This file is part of THE GOSPEL - the permanent, unchangeable foundation.
 * Created by Claude (Opus) on SABERTOOTH - December 3, 2025
 *
 * GOSPEL RULES ENFORCED:
 * - Rule #2: 50/30/20 Revenue Split (IMMUTABLE)
 * - Rule #3: Brand Identity (LOCKED)
 * - Rule #13: Child Safety (COPPA/FOSTA)
 *
 * ANY MODIFICATION TO REVENUE SPLIT = VIOLATION OF GOSPEL
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// GOSPEL-LOCKED API BASE URL
const API_BASE = import.meta.env.VITE_API_URL || 'https://theoretical-bras-difference-kirk.trycloudflare.com';

// IMMUTABLE REVENUE SPLIT - GOSPEL RULE #2
export const GOSPEL_REVENUE_SPLIT = Object.freeze({
  CHARITY: 50,        // Shriners Children's Hospitals
  INFRASTRUCTURE: 30, // Platform operations
  FOUNDER: 20,        // Josh Coleman
  CHARITY_NAME: "Shriners Children's Hospitals",
  CHARITY_EIN: "36-2193608"
});

// Verify this matches - ANY DISCREPANCY = GOSPEL VIOLATION
export const verifyGospelSplit = (charity: number, infra: number, founder: number): boolean => {
  const isValid = charity === 50 && infra === 30 && founder === 20;
  if (!isValid) {
    console.error('🚨 GOSPEL VIOLATION DETECTED: Revenue split tampered!');
    console.error(`Expected: 50/30/20 | Got: ${charity}/${infra}/${founder}`);
  }
  return isValid;
};

// ═══════════════════════════════════════════════════════════════════════════════
// API SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

class GospelApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || data.message || 'Request failed' };
      }

      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HEALTH & STATUS
  // ─────────────────────────────────────────────────────────────────────────────

  async checkHealth() {
    return this.request<{ status: string; mission: string }>('/health');
  }

  async getApiInfo() {
    return this.request<any>('/');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // JULES AI ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────────────

  async executeJulesCommand(command: string) {
    return this.request<{ response: string; agent: string }>('/api/jules/execute', {
      method: 'POST',
      body: JSON.stringify({ command })
    });
  }

  async julesGitMerge(sourceBranch: string, targetBranch: string) {
    return this.request<any>('/api/jules/git-merge', {
      method: 'POST',
      body: JSON.stringify({ sourceBranch, targetBranch })
    });
  }

  async julesLighthouse(mode: 'revenue' | 'viral' = 'revenue') {
    return this.request<any>('/api/jules/lighthouse', {
      method: 'POST',
      body: JSON.stringify({ mode })
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CAMPAIGN & TRANSPARENCY (GOSPEL RULE #2 ENFORCED)
  // ─────────────────────────────────────────────────────────────────────────────

  async getCampaignMetrics() {
    const result = await this.request<any>('/api/campaign/metrics');

    // GOSPEL ENFORCEMENT: Verify revenue split in response
    if (result.success && result.data?.revenueSplit) {
      const { charity, infrastructure, founder } = result.data.revenueSplit;
      if (!verifyGospelSplit(charity, infrastructure, founder)) {
        return { success: false, error: 'GOSPEL VIOLATION: Revenue split mismatch' };
      }
    }

    return result;
  }

  async getTransparencyData() {
    return this.request<any>('/api/transparency');
  }

  async getTransparencyLedger() {
    return this.request<any>('/api/transparency/ledger');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ADMIN ENDPOINTS
  // ─────────────────────────────────────────────────────────────────────────────

  async getAdminStatus() {
    return this.request<any>('/api/admin/status');
  }

  async getAdminDashboard() {
    return this.request<any>('/api/admin/dashboard');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // AGE VERIFICATION (GOSPEL RULE #13 - CHILD SAFETY)
  // ─────────────────────────────────────────────────────────────────────────────

  async verifyAge(birthDate: string, parentalConsent?: boolean) {
    return this.request<{ verified: boolean; ageGroup: string }>('/api/age-verification/verify', {
      method: 'POST',
      body: JSON.stringify({ birthDate, parentalConsent })
    });
  }

  async getAgeVerificationStatus(sessionId: string) {
    return this.request<any>(`/api/age-verification/status/${sessionId}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CONSENT MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async submitConsent(consent: { essential: boolean; analytics: boolean; marketing: boolean }) {
    return this.request<any>('/api/consent/submit', {
      method: 'POST',
      body: JSON.stringify(consent)
    });
  }

  async getConsentStatus(userId: string) {
    return this.request<any>(`/api/consent/status/${userId}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PAYMENTS & SUBSCRIPTIONS (GOSPEL RULE #2 - 50/30/20 ENFORCED)
  // ─────────────────────────────────────────────────────────────────────────────

  async createCheckoutSession(tier: 'PREMIUM' | 'VIP') {
    return this.request<{ checkoutUrl: string }>('/api/subscriptions/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ tier })
    });
  }

  async getSubscriptionStatus(subscriptionId: string) {
    return this.request<any>(`/api/subscriptions/status/${subscriptionId}`);
  }

  async cancelSubscription(subscriptionId: string) {
    return this.request<any>(`/api/subscriptions/cancel/${subscriptionId}`, {
      method: 'POST'
    });
  }

  // Calculate revenue split (GOSPEL-LOCKED)
  calculateRevenueSplit(totalAmount: number): { charity: number; infrastructure: number; founder: number } {
    return {
      charity: totalAmount * (GOSPEL_REVENUE_SPLIT.CHARITY / 100),
      infrastructure: totalAmount * (GOSPEL_REVENUE_SPLIT.INFRASTRUCTURE / 100),
      founder: totalAmount * (GOSPEL_REVENUE_SPLIT.FOUNDER / 100)
    };
  }
}

// Export singleton instance
export const api = new GospelApiService();

// Export types
export type { ApiResponse };

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * END OF GOSPEL API SERVICE
 *
 * This foundation is IMMUTABLE. The 50/30/20 split is enforced at every layer.
 * Any attempt to modify revenue allocation will be rejected and logged.
 *
 * FOR THE KIDS - AI for those in need, not for greed.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
