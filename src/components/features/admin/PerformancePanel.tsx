import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getContrastColors, getGlassmorphismStyles } from '../../../utils/contrastUtils';
import { performanceService, PerformanceMetrics } from '../../../services/performanceService';

interface PerformancePanelProps {
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  status?: 'good' | 'warning' | 'poor';
  description?: string;
}

function MetricCard({ title, value, unit, status = 'good', description }: MetricCardProps) {
  const statusColors = {
    good: 'text-green-500',
    warning: 'text-yellow-500',
    poor: 'text-red-500'
  };

  const statusIcons = {
    good: <TrendingUp className="w-4 h-4" />,
    warning: <Activity className="w-4 h-4" />,
    poor: <TrendingDown className="w-4 h-4" />
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white/80">{title}</h4>
        <div className={`flex items-center ${statusColors[status]}`}>
          {statusIcons[status]}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-sm font-normal text-white/60 ml-1">{unit}</span>
      </div>
      {description && (
        <p className="text-xs text-white/50">{description}</p>
      )}
    </div>
  );
}

export function PerformancePanel({ className = '' }: PerformancePanelProps) {
  const { backgroundType } = useTheme();
  const colors = getContrastColors(backgroundType);
  const glassStyles = getGlassmorphismStyles(backgroundType);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [formattedMetrics, setFormattedMetrics] = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const updateMetrics = () => {
    const newMetrics = performanceService.getMetrics();
    const newFormattedMetrics = performanceService.getFormattedMetrics();
    setMetrics(newMetrics);
    setFormattedMetrics(newFormattedMetrics);
    setLastUpdate(new Date());
  };

  useEffect(() => {
    // Initial load
    updateMetrics();

    // Update every 30 seconds
    const interval = setInterval(updateMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusForMetric = (metric: keyof PerformanceMetrics, value?: number): 'good' | 'warning' | 'poor' => {
    if (!value) return 'good';

    switch (metric) {
      case 'lcp':
        return value < 2500 ? 'good' : value < 4000 ? 'warning' : 'poor';
      case 'fid':
        return value < 100 ? 'good' : value < 300 ? 'warning' : 'poor';
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'warning' : 'poor';
      case 'loadTime':
        return value < 2000 ? 'good' : value < 5000 ? 'warning' : 'poor';
      default:
        return 'good';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6" style={glassStyles}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-lg font-semibold ${colors.text}`}>
                Performance Monitoring
              </h3>
              <p className={`${colors.textMuted} text-sm`}>
                Real-time Core Web Vitals and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`${colors.textMuted} text-xs`}>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button
                onClick={updateMetrics}
                size="sm"
                variant="outline"
                className={`${colors.text} border-white/20 hover:bg-white/10`}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              Core Web Vitals: {metrics.lcp && metrics.fid && metrics.cls ? 'Active' : 'Partial'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Network: {metrics.effectiveType || 'Unknown'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Resources: {metrics.resourceCount || 0} loaded
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* Core Web Vitals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h4 className={`text-md font-semibold mb-4 ${colors.text}`}>
            Core Web Vitals
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Largest Contentful Paint"
              value={metrics.lcp || 0}
              unit="ms"
              status={getStatusForMetric('lcp', metrics.lcp)}
              description="< 2.5s is good"
            />
            <MetricCard
              title="First Input Delay"
              value={metrics.fid || 0}
              unit="ms"
              status={getStatusForMetric('fid', metrics.fid)}
              description="< 100ms is good"
            />
            <MetricCard
              title="Cumulative Layout Shift"
              value={metrics.cls || 0}
              unit=""
              status={getStatusForMetric('cls', metrics.cls)}
              description="< 0.1 is good"
            />
          </div>
        </Card>
      </motion.div>

      {/* Page Load Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h4 className={`text-md font-semibold mb-4 ${colors.text}`}>
            Page Load Performance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Load Time"
              value={metrics.loadTime || 0}
              unit="ms"
              status={getStatusForMetric('loadTime', metrics.loadTime)}
              description="Complete page load"
            />
            <MetricCard
              title="DOM Content Loaded"
              value={metrics.domContentLoaded || 0}
              unit="ms"
              status="good"
              description="HTML document parsed"
            />
            <MetricCard
              title="First Contentful Paint"
              value={metrics.fcp || 0}
              unit="ms"
              status="good"
              description="First content visible"
            />
            <MetricCard
              title="Time to First Byte"
              value={metrics.ttfb || 0}
              unit="ms"
              status="good"
              description="Server response time"
            />
          </div>
        </Card>
      </motion.div>

      {/* Network & Resource Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h4 className={`text-md font-semibold mb-4 ${colors.text}`}>
            Network & Resources
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard
              title="Connection Type"
              value={metrics.effectiveType || 'Unknown'}
              unit=""
              status="good"
              description="Network connection quality"
            />
            <MetricCard
              title="Resources Loaded"
              value={metrics.resourceCount || 0}
              unit=""
              status="good"
              description="Total network requests"
            />
            <MetricCard
              title="Cache Hit Rate"
              value={metrics.cacheHitRate || 0}
              unit="%"
              status={metrics.cacheHitRate && metrics.cacheHitRate > 50 ? 'good' : 'warning'}
              description="Cached resources percentage"
            />
          </div>
        </Card>
      </motion.div>

      {/* Performance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6" style={glassStyles}>
          <h4 className={`text-md font-semibold mb-4 ${colors.text}`}>
            Performance Optimization Tips
          </h4>
          <div className="space-y-3">
            {metrics.lcp && metrics.lcp > 2500 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className={`${colors.text} text-sm`}>
                  ⚠️ High LCP detected. Consider optimizing images and reducing render-blocking resources.
                </p>
              </div>
            )}
            {metrics.fid && metrics.fid > 100 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className={`${colors.text} text-sm`}>
                  ⚠️ High FID detected. Consider reducing JavaScript execution time and improving input responsiveness.
                </p>
              </div>
            )}
            {metrics.cls && metrics.cls > 0.1 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className={`${colors.text} text-sm`}>
                  ⚠️ Layout shifts detected. Reserve space for dynamic content to prevent layout shifts.
                </p>
              </div>
            )}
            {metrics.cacheHitRate && metrics.cacheHitRate < 50 && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className={`${colors.text} text-sm`}>
                  💡 Low cache hit rate. Consider implementing better caching strategies for static assets.
                </p>
              </div>
            )}
            {(!metrics.lcp || !metrics.fid || !metrics.cls) && (
              <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                <p className={`${colors.text} text-sm`}>
                  📊 Some Core Web Vitals are not available. Ensure the page has loaded content and user interactions for complete metrics.
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
