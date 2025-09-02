import { googleAnalytics } from './googleAnalytics';

// Performance metrics interface
export interface PerformanceMetrics {
  // Core Web Vitals
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  ttfb?: number; // Time to First Byte

  // Additional metrics
  loadTime?: number; // Page load time
  domContentLoaded?: number; // DOM content loaded time
  firstPaint?: number; // First paint time
  domInteractive?: number; // DOM interactive time
  domComplete?: number; // DOM complete time

  // Custom metrics
  bundleSize?: number; // JavaScript bundle size
  resourceCount?: number; // Number of resources loaded
  cacheHitRate?: number; // Cache hit rate

  // User experience metrics
  timeToInteractive?: number; // Time to interactive
  firstMeaningfulPaint?: number; // First meaningful paint
  speedIndex?: number; // Speed index

  // Network information
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.isInitialized) return;

    // Initialize Core Web Vitals tracking
    this.initializeCoreWebVitals();

    // Track navigation timing
    this.trackNavigationTiming();

    // Track resource loading
    this.trackResourceTiming();

    // Track network information
    this.trackNetworkInformation();

    this.isInitialized = true;
  }

  private initializeCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime;
            this.sendMetricToAnalytics('lcp', this.metrics.lcp);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP tracking not supported:', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              this.metrics.fid = entry.processingStart - entry.startTime;
              this.sendMetricToAnalytics('fid', this.metrics.fid);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID tracking not supported:', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.sendMetricToAnalytics('cls', this.metrics.cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('CLS tracking not supported:', error);
      }
    }

    // First Contentful Paint (FCP) - using Paint Timing API
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.sendMetricToAnalytics('fcp', this.metrics.fcp);
        }
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
      });
    }
  }

  private trackNavigationTiming(): void {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;

      // Calculate key timing metrics
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      this.metrics.domInteractive = timing.domInteractive - timing.navigationStart;
      this.metrics.domComplete = timing.domComplete - timing.navigationStart;
      this.metrics.ttfb = timing.responseStart - timing.requestStart;

      // Send metrics to analytics
      Object.entries(this.metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          this.sendMetricToAnalytics(key, value);
        }
      });
    }
  }

  private trackResourceTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resourceEntries = performance.getEntriesByType('resource');
      this.metrics.resourceCount = resourceEntries.length;

      // Calculate cache hit rate (simplified)
      let cachedResources = 0;
      resourceEntries.forEach((entry: any) => {
        if (entry.transferSize === 0) {
          cachedResources++;
        }
      });

      if (resourceEntries.length > 0) {
        this.metrics.cacheHitRate = (cachedResources / resourceEntries.length) * 100;
        this.sendMetricToAnalytics('cache_hit_rate', this.metrics.cacheHitRate);
      }

      this.sendMetricToAnalytics('resource_count', this.metrics.resourceCount);
    }
  }

  private trackNetworkInformation(): void {
    if ('navigator' in window && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.metrics.connectionType = connection.effectiveType;
        this.metrics.effectiveType = connection.effectiveType;
        this.metrics.downlink = connection.downlink;
        this.metrics.rtt = connection.rtt;

        // Send network metrics to analytics
        Object.entries({
          connection_type: this.metrics.connectionType,
          effective_connection: this.metrics.effectiveType,
          downlink_speed: this.metrics.downlink,
          rtt: this.metrics.rtt
        }).forEach(([key, value]) => {
          if (value !== undefined) {
            this.sendMetricToAnalytics(key, typeof value === 'string' ? 0 : value, { network_info: value });
          }
        });
      }
    }
  }

  private sendMetricToAnalytics(metricName: string, value: number, additionalData?: Record<string, any>): void {
    // Send to Google Analytics
    googleAnalytics.trackPerformance(metricName, value, additionalData);

    // Send to custom analytics (if implemented)
    if (typeof window !== 'undefined') {
      console.log(`Performance metric: ${metricName} = ${value}`, additionalData);
    }
  }

  // Public methods for manual metric tracking
  public trackCustomMetric(name: string, value: number, category: string = 'custom'): void {
    this.sendMetricToAnalytics(`${category}_${name}`, value);
  }

  public trackUserTiming(name: string, startTime: number, endTime?: number): void {
    const duration = endTime ? endTime - startTime : performance.now() - startTime;
    this.sendMetricToAnalytics(`timing_${name}`, duration);
  }

  public trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.sendMetricToAnalytics('memory_used', memory.usedJSHeapSize);
      this.sendMetricToAnalytics('memory_total', memory.totalJSHeapSize);
      this.sendMetricToAnalytics('memory_limit', memory.jsHeapSizeLimit);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getFormattedMetrics(): Record<string, string> {
    const formatted: Record<string, string> = {};

    Object.entries(this.metrics).forEach(([key, value]) => {
      if (typeof value === 'number') {
        if (key.includes('Time') || key.includes('time') || key.includes('delay') || key.includes('paint')) {
          formatted[key] = `${value.toFixed(2)}ms`;
        } else if (key.includes('size') || key.includes('Size')) {
          formatted[key] = `${(value / 1024 / 1024).toFixed(2)}MB`;
        } else if (key.includes('rate') || key.includes('Rate')) {
          formatted[key] = `${value.toFixed(1)}%`;
        } else if (key.includes('count') || key.includes('Count')) {
          formatted[key] = value.toString();
        } else {
          formatted[key] = value.toFixed(2);
        }
      } else if (typeof value === 'string') {
        formatted[key] = value;
      }
    });

    return formatted;
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceService.cleanup();
  });
}
