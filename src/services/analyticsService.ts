import { projectId, publicAnonKey } from '../utils/supabase/info';
import { googleAnalytics } from './googleAnalytics';

export interface ClickEvent {
  id?: string;
  linkId: string;
  linkTitle: string;
  linkUrl: string;
  timestamp: string;
  userAgent: string;
  referrer?: string;
  sessionId: string;
  ipAddress?: string;
  userId?: string;
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{
    linkId: string;
    title: string;
    clicks: number;
    lastClicked: string;
  }>;
  clicksByDate: Array<{
    date: string;
    clicks: number;
  }>;
  recentClicks: ClickEvent[];
}

class AnalyticsService {
  private sessionId: string;

  constructor() {
    // Generate a session ID for this user session
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    const stored = localStorage.getItem('social-link-session-id');
    if (stored) {
      return stored;
    }

    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('social-link-session-id', newSessionId);
    return newSessionId;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const API_BASE = `https://${projectId}.supabase.co/functions/v1/analytics`;
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Analytics API Error (${response.status}): ${await response.text()}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics service error:', error);
      // Don't throw error to avoid breaking user experience
      return null;
    }
  }

  async trackClick(linkData: { id: string; title: string; url: string }): Promise<void> {
    const clickEvent: Omit<ClickEvent, 'id'> = {
      linkId: linkData.id,
      linkTitle: linkData.title,
      linkUrl: linkData.url,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      sessionId: this.sessionId,
    };

    // Send to analytics endpoint (fire and forget)
    this.makeRequest('/track-click', {
      method: 'POST',
      body: JSON.stringify(clickEvent),
    }).catch(error => {
      console.warn('Failed to track click:', error);
    });

    // Send to Google Analytics
    googleAnalytics.trackSocialLinkClick({
      title: linkData.title,
      url: linkData.url,
    });
  }

  async getAnalytics(): Promise<AnalyticsData | null> {
    return this.makeRequest('/analytics');
  }

  async getLinkAnalytics(linkId: string): Promise<ClickEvent[] | null> {
    return this.makeRequest(`/analytics/links/${linkId}`);
  }

  // Track page views
  async trackPageView(page: string): Promise<void> {
    const pageViewEvent = {
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      referrer: document.referrer || undefined,
    };

    this.makeRequest('/track-pageview', {
      method: 'POST',
      body: JSON.stringify(pageViewEvent),
    }).catch(error => {
      console.warn('Failed to track page view:', error);
    });

    // Send to Google Analytics
    googleAnalytics.trackPageView(page);
  }

  // Track user engagement
  async trackEngagement(action: string, details?: Record<string, any>): Promise<void> {
    const engagementEvent = {
      action,
      details: details || {},
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    this.makeRequest('/track-engagement', {
      method: 'POST',
      body: JSON.stringify(engagementEvent),
    }).catch(error => {
      console.warn('Failed to track engagement:', error);
    });

    // Send to Google Analytics
    googleAnalytics.trackEngagement(action, details);
  }

  // Track navigation patterns
  async trackNavigation(from: string, to: string, method: string = 'click'): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('navigation', { from, to, method });

    // Send to Google Analytics
    googleAnalytics.trackNavigation(from, to, method);
  }

  // Track admin actions
  async trackAdminAction(action: string, target: string, details?: Record<string, any>): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('admin_action', { action, target, ...details });

    // Send to Google Analytics
    googleAnalytics.trackAdminAction(action, target, details);
  }

  // Track feature usage
  async trackFeatureUsage(feature: string, action: string, details?: Record<string, any>): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('feature_usage', { feature, action, ...details });

    // Send to Google Analytics
    googleAnalytics.trackFeatureUsage(feature, action, details);
  }

  // Track theme interactions
  async trackThemeInteraction(themeName: string, action: 'select' | 'preview' | 'apply' | 'customize'): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('theme_interaction', { themeName, action });

    // Send to Google Analytics
    googleAnalytics.trackThemeInteraction(themeName, action);
  }

  // Track link preview interactions
  async trackLinkPreview(linkId: string, action: 'view' | 'edit' | 'copy' | 'share'): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('link_preview', { linkId, action });

    // Send to Google Analytics
    googleAnalytics.trackLinkPreview(linkId, action);
  }

  // Track mobile interactions
  async trackMobileInteraction(action: string, element: string, details?: Record<string, any>): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('mobile_interaction', { action, element, ...details });

    // Send to Google Analytics
    googleAnalytics.trackMobileInteraction(action, element, details);
  }

  // Track user preferences
  async trackUserPreference(setting: string, value: string | number | boolean): Promise<void> {
    // Track in custom analytics
    await this.trackEngagement('user_preference', { setting, value });

    // Send to Google Analytics
    googleAnalytics.trackUserPreference(setting, value);
  }
}

export const analyticsService = new AnalyticsService();

// Extend window type for Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}
