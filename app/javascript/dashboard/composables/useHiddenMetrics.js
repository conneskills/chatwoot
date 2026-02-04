import { computed } from 'vue';
import { useStore } from 'dashboard/composables/store';

// Bidirectional alias mapping for consistency
const METRIC_ALIASES = {
  avg_reply_time: 'reply_time',
};

export function useHiddenMetrics() {
  const store = useStore();

  const hiddenMetrics = computed(() => {
    return (
      store.getters.getCurrentAccount?.settings?.report_hidden_metrics || []
    );
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
