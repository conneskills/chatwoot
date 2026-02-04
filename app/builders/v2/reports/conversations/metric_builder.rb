class V2::Reports::Conversations::MetricBuilder < V2::Reports::Conversations::BaseReportBuilder
  # Mapping from metric keys to canonical hidden metric names
  METRIC_TO_HIDDEN_KEY = {
    'incoming_messages_count' => 'incoming_messages_count',
    'outgoing_messages_count' => 'outgoing_messages_count',
    'reply_time' => 'reply_time'
  }.freeze

  def summary
    {
      conversations_count: count('conversations_count'),
      incoming_messages_count: count_unless_hidden('incoming_messages_count'),
      outgoing_messages_count: count_unless_hidden('outgoing_messages_count'),
      avg_first_response_time: count('avg_first_response_time'),
      avg_resolution_time: count('avg_resolution_time'),
      resolutions_count: count('resolutions_count'),
      reply_time: count_unless_hidden('reply_time')
    }.compact
  end

  def bot_summary
    {
      bot_resolutions_count: count('bot_resolutions_count'),
      bot_handoffs_count: count('bot_handoffs_count')
    }
  end

  private

  def count(metric)
    builder_class(metric).new(account, builder_params(metric)).aggregate_value
  end

  def count_unless_hidden(metric)
    return nil if metric_hidden?(metric)

    count(metric)
  end

  def metric_hidden?(metric)
    hidden_metrics = params[:hidden_metrics] || []
    canonical_key = METRIC_TO_HIDDEN_KEY[metric]
    canonical_key && hidden_metrics.include?(canonical_key)
  end

  def builder_params(metric)
    params.merge({ metric: metric })
  end
end
