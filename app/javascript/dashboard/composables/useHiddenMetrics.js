import { computed } from 'vue';
import { useAccount } from './useAccount';

// Alias mapping for consistency (canonical form is reply_time)
const METRIC_ALIASES = {
  avg_reply_time: 'reply_time',
};

export function useHiddenMetrics() {
  const { currentAccount } = useAccount();

  const hiddenMetrics = computed(() => {
    return currentAccount.value?.settings?.report_hidden_metrics || [];
  });

  const isMetricHidden = metricKey => {
    const normalized = METRIC_ALIASES[metricKey] || metricKey;
    return hiddenMetrics.value.includes(normalized);
  };

  const filterVisibleReportKeys = reportKeys => {
    // Filter out hidden metrics from reportKeys object
    return Object.fromEntries(
      Object.entries(reportKeys).filter(([, value]) => !isMetricHidden(value))
    );
  };

  return { hiddenMetrics, isMetricHidden, filterVisibleReportKeys };
}
