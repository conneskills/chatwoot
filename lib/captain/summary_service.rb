class Captain::SummaryService < Captain::BaseTaskService
  pattr_initialize [:account!, :conversation_display_id!, { force_regenerate: false }]

  def perform
    return cached_response if use_cache?

    generate_and_cache_summary
  end

  private

  def event_name
    'summarize'
  end

  def use_cache?
    return false if force_regenerate
    return false if conversation.cached_summary.blank?
    return false if conversation.cached_summary_at.blank?

    conversation.cached_summary_at >= conversation.last_activity_at
  end

  def cached_response
    { message: conversation.cached_summary }
  end

  def generate_and_cache_summary
    result = make_api_call(
      model: GPT_MODEL,
      messages: [
        { role: 'system', content: prompt_from_file('summary') },
        { role: 'user', content: conversation.to_llm_text(include_contact_details: false) }
      ]
    )

    cache_summary(result[:message]) if result[:message].present? && result[:error].blank?

    result
  end

  def cache_summary(summary)
    conversation.update(
      cached_summary: summary,
      cached_summary_at: Time.current
    )
  end
end
