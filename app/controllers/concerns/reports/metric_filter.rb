module Reports::MetricFilter
  extend ActiveSupport::Concern

  HIDEABLE_METRICS = %w[outgoing_messages_count incoming_messages_count reply_time].freeze

  # Alias mapping (canonical form)
  METRIC_ALIASES = {
    'avg_reply_time' => 'reply_time'
  }.freeze

  private

  def filter_hidden_metrics_from_hash(data)
    return data if hidden_metrics.blank?

    data.reject { |key, _| metric_key_hidden?(key) }
  end

  def filter_hidden_metrics_from_array(data)
    return data if hidden_metrics.blank?

    data.map { |item| item.reject { |key, _| metric_key_hidden?(key) } }
  end

  # Filter summary data including nested 'previous' key (handles both symbol and string keys)
  def filter_summary_with_previous(data)
    return data if hidden_metrics.blank?

    filtered = filter_hidden_metrics_from_hash(data)
    previous_data = filtered[:previous] || filtered['previous']
    if previous_data.present?
      filtered_previous = filter_hidden_metrics_from_hash(previous_data)
      # Preserve the original key type
      if filtered.key?(:previous)
        filtered[:previous] = filtered_previous
      else
        filtered['previous'] = filtered_previous
      end
    end
    filtered
  end

  def hidden_metrics
    @hidden_metrics ||= (Current.account.report_hidden_metrics || []) & HIDEABLE_METRICS
  end

  def metric_hidden?(metric_name)
    # Normalize to canonical form (e.g., avg_reply_time -> reply_time)
    normalized = METRIC_ALIASES[metric_name.to_s] || metric_name.to_s
    hidden_metrics.include?(normalized)
  end

  # Check if a hash key should be hidden (handles both symbol and string keys, plus aliases)
  def metric_key_hidden?(key)
    key_str = key.to_s
    normalized = METRIC_ALIASES[key_str] || key_str
    hidden_metrics.include?(normalized)
  end
end
