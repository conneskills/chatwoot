class AddConversationsCountToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :conversations_count, :integer, default: 0, null: false
  end
end
