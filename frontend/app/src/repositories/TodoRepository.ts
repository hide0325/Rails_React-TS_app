import Repository from '.'

const resource = 'todos'

export default {
  getTodos() {
    return Repository.get<Todo[]>(`${resource}`)
  },

  getTodo(todoId: string) {
    return Repository.get<Todo>(`${resource}/${todoId}`)
  },

  createTodo(newTodo: { name: string }) {
    return Repository.post<Todo>(`${resource}`, newTodo)
  },

  updateTodo(todo: Todo) {
    return Repository.patch<Todo>(`${resource}/${todo.id}`, todo)
  },

  deleteTodo(todoId: string | null) {
    return Repository.delete<Todo>(`${resource}/${todoId}`)
  },

  deleteAllTodos() {
    return Repository.delete<Todo[]>(`${resource}/destroy_all`)
  },
}
