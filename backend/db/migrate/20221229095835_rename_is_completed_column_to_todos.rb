class RenameIsCompletedColumnToTodos < ActiveRecord::Migration[7.0]
  def change
    rename_column :todos, :is_completed, :completed
  end
end
