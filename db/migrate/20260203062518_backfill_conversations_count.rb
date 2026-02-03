class BackfillConversationsCount < ActiveRecord::Migration[7.1]
  def up
    Account.find_each do |account|
      Account.reset_counters(account.id, :conversations)
    end
  end

  def down
    # No-op
  end
end
