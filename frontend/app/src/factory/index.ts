import TodoRepository from '../repositories/TodoRepository'

interface Repository {
  [name: string]: any
}

const repositories: Repository = {
  todos: TodoRepository,
}

export const Factory = {
  get: (name: string) => repositories[name],
}
