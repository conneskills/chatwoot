class BackfillStatusConversationCounters < ActiveRecord::Migration[7.1]
  def up
    Account.find_each do |account|
      # Count conversations by status for this account
      open_count = account.conversations.open.count
      resolved_count = account.conversations.resolved.count
      pending_count = account.conversations.pending.count
      snoozed_count = account.conversations.snoozed.count

      # Update the counter cache columns
      # rubocop:disable Rails/SkipsModelValidations
      account.update_columns(
        open_conversations_count: open_count,
        resolved_conversations_count: resolved_count,
        pending_conversations_count: pending_count,
        snoozed_conversations_count: snoozed_count
      )
      # rubocop:enable Rails/SkipsModelValidations
    end
  end

  def down
    # No-op
  end
end
