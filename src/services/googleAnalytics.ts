// Google Analytics 4 Integration Service
class GoogleAnalyticsService {
  private measurementId: string | null = null;
  private isInitialized = false;

  // Initialize Google Analytics
  initialize(measurementId: string): void {
    if (this.isInitialized) return;

    this.measurementId = measurementId;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: false, // We'll send page views manually
    });

    this.isInitialized = true;
    console.log('Google Analytics initialized with ID:', measurementId);
  }

  // Track page views
  trackPageView(pageTitle: string, pageLocation?: string): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation || window.location.href,
    });
  }

  // Track custom events
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }

  // Track social link clicks
  trackSocialLinkClick(linkData: {
    title: string;
    url: string;
    platform?: string;
  }): void {
    if (!this.isInitialized || !window.gtag) return;

    // Extract platform from URL or title
    const platform = this.extractPlatform(linkData.url, linkData.title);

    window.gtag('event', 'social_link_click', {
      event_category: 'engagement',
      event_label: linkData.title,
      social_platform: platform,
      link_url: linkData.url,
      custom_parameter_1: linkData.title,
      custom_parameter_2: platform,
    });
  }

  // Track user engagement
  trackEngagement(action: string, details?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'user_engagement', {
      engagement_action: action,
      ...details,
    });
  }

  // Track scroll depth
  trackScrollDepth(percentage: number): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage,
    });
  }

  // Track time on page
  trackTimeOnPage(duration: number, page: string): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'time_on_page', {
      event_category: 'engagement',
      event_label: page,
      value: duration,
      custom_parameter_1: page,
      custom_parameter_2: duration,
    });
  }

  // Track navigation patterns
  trackNavigation(from: string, to: string, method: string = 'click'): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'navigation', {
      event_category: 'navigation',
      event_label: `${from} → ${to}`,
      custom_parameter_1: from,
      custom_parameter_2: to,
      custom_parameter_3: method,
    });
  }

  // Track user flow completion
  trackFlowCompletion(flowName: string, step: number, totalSteps: number): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'flow_completion', {
      event_category: 'conversion',
      event_label: flowName,
      value: Math.round((step / totalSteps) * 100),
      custom_parameter_1: flowName,
      custom_parameter_2: step,
      custom_parameter_3: totalSteps,
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: string, details?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'feature_usage', {
      event_category: 'engagement',
      event_label: `${feature}_${action}`,
      custom_parameter_1: feature,
      custom_parameter_2: action,
      ...details,
    });
  }

  // Track admin actions
  trackAdminAction(action: string, target: string, details?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'admin_action', {
      event_category: 'admin',
      event_label: action,
      custom_parameter_1: action,
      custom_parameter_2: target,
      ...details,
    });
  }

  // Track link preview interactions
  trackLinkPreview(linkId: string, action: 'view' | 'edit' | 'copy' | 'share'): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'link_preview', {
      event_category: 'engagement',
      event_label: `${action}_link`,
      custom_parameter_1: linkId,
      custom_parameter_2: action,
    });
  }

  // Track theme interactions
  trackThemeInteraction(themeName: string, action: 'select' | 'preview' | 'apply' | 'customize'): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'theme_interaction', {
      event_category: 'customization',
      event_label: `${action}_theme`,
      custom_parameter_1: themeName,
      custom_parameter_2: action,
    });
  }

  // Track mobile interactions
  trackMobileInteraction(action: string, element: string, details?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'mobile_interaction', {
      event_category: 'mobile',
      event_label: action,
      custom_parameter_1: element,
      ...details,
    });
  }

  // Track search/filter usage
  trackSearch(query: string, results: number, category?: string): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'search', {
      event_category: 'engagement',
      event_label: category || 'general',
      custom_parameter_1: query,
      custom_parameter_2: results,
      value: results,
    });
  }

  // Track social sharing
  trackSocialShare(platform: string, content: string, method: string = 'button'): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'share', {
      event_category: 'social',
      event_label: platform,
      custom_parameter_1: platform,
      custom_parameter_2: content,
      custom_parameter_3: method,
    });
  }

  // Track user preferences
  trackUserPreference(setting: string, value: string | number | boolean): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'user_preference', {
      event_category: 'settings',
      event_label: setting,
      custom_parameter_1: setting,
      custom_parameter_2: String(value),
    });
  }

  // Track form interactions
  trackFormInteraction(formName: string, action: string, details?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'form_interaction', {
      event_category: 'forms',
      event_label: formName,
      form_action: action,
      ...details,
    });
  }

  // Track theme changes
  trackThemeChange(themeName: string, previousTheme?: string): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'theme_change', {
      event_category: 'customization',
      event_label: themeName,
      custom_parameter_1: themeName,
      custom_parameter_2: previousTheme || 'unknown',
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, additionalData?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'performance_metric', {
      event_category: 'performance',
      event_label: metric,
      value: value,
      custom_parameter_1: metric,
      ...additionalData,
    });
  }

  // Track errors
  trackError(errorType: string, errorMessage: string, additionalData?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      custom_parameter_1: errorType,
      ...additionalData,
    });
  }

  // Track conversions (for future use)
  trackConversion(conversionType: string, value?: number, details?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('event', 'conversion', {
      event_category: 'conversion',
      event_label: conversionType,
      value: value || 1,
      ...details,
    });
  }

  // Helper method to extract platform from URL or title
  private extractPlatform(url: string, title: string): string {
    const urlLower = url.toLowerCase();
    const titleLower = title.toLowerCase();

    if (urlLower.includes('instagram') || titleLower.includes('instagram')) return 'instagram';
    if (urlLower.includes('twitter') || urlLower.includes('x.com') || titleLower.includes('twitter')) return 'twitter';
    if (urlLower.includes('linkedin') || titleLower.includes('linkedin')) return 'linkedin';
    if (urlLower.includes('github') || titleLower.includes('github')) return 'github';
    if (urlLower.includes('youtube') || titleLower.includes('youtube')) return 'youtube';
    if (urlLower.includes('facebook') || titleLower.includes('facebook')) return 'facebook';
    if (urlLower.includes('tiktok') || titleLower.includes('tiktok')) return 'tiktok';
    if (urlLower.includes('discord') || titleLower.includes('discord')) return 'discord';
    if (urlLower.includes('twitch') || titleLower.includes('twitch')) return 'twitch';

    return 'other';
  }

  // Check if GA is initialized
  isReady(): boolean {
    return this.isInitialized && !!window.gtag;
  }

  // Get measurement ID
  getMeasurementId(): string | null {
    return this.measurementId;
  }
}

// Extend window type for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const googleAnalytics = new GoogleAnalyticsService();
