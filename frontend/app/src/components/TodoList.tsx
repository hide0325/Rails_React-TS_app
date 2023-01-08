import { FC, useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'
import TodoRepository from 'repositories/TodoRepository'

const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const DeleteAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

const TodoName = styled.span<{ completed: boolean }>`
  font-size: 27px;
  ${({ completed }) => completed && `opacity: 0.4;`}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`

const TodoList: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    let ignore = false

    const fetchTodos = async () => {
      try {
        const { data } = await TodoRepository.getTodos()
        if (!ignore) {
          console.log(data, 'OK! === fetchTodos ===')
          setTodos(data)
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.message, 'ERROR! === fetchTodos ===')
        }
      }
    }

    fetchTodos()

    return () => {
      ignore = true
    }
  }, [])

  const deleteAllTodos = async () => {
    const sure = confirm('Are you sure?')
    if (sure) {
      try {
        const { data } = await TodoRepository.deleteAllTodos()
        console.log(data, 'OK! === deleteAllTodos ===')
        setTodos([])
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.message, 'ERROR! === deleteAllTodos ===')
        }
      }
    }
  }

  const updateCompleted = async (index: number, currentTodo: Todo) => {
    const todo = {
      id: currentTodo.id,
      name: currentTodo.name,
      completed: !currentTodo.completed,
    }

    try {
      const { data } = await TodoRepository.updateTodo(todo)
      console.log(data, 'OK! === updateCompleted ===')
      const newTodos: Todo[] = [...todos]
      newTodos[index].completed = data.completed
      setTodos(newTodos)
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message, 'ERROR! === updateCompleted ===')
      }
    }
  }

  const onChangeTodos = (event: ChangeEvent<HTMLInputElement>) => setSearchName(event.target.value)

  const filteredTodos = (todos: Todo[]) => {
    return todos.filter((todo) => {
      if (searchName === '') {
        return todo
      } else if (todo.name.toLowerCase().includes(searchName.toLowerCase())) {
        return todo
      }
    })
  }

  return (
    <>
      <h1>Todo List</h1>
      <SearchAndButton>
        <SearchForm
          type="text"
          placeholder="Search todo..."
          onChange={(event) => onChangeTodos(event)}
        />
        <DeleteAllButton onClick={deleteAllTodos}>Delete All</DeleteAllButton>
      </SearchAndButton>
      <div>
        {filteredTodos(todos).map((todo, key) => {
          return (
            <Row key={key}>
              {todo.completed ? (
                <CheckedBox>
                  <ImCheckboxChecked onClick={() => updateCompleted(key, todo)} />
                </CheckedBox>
              ) : (
                <UncheckedBox>
                  <ImCheckboxUnchecked onClick={() => updateCompleted(key, todo)} />
                </UncheckedBox>
              )}
              <TodoName completed={todo.completed}>{todo.name}</TodoName>
              <Link to={`/todos/${todo.id}/edit`}>
                <EditButton>
                  <AiFillEdit />
                </EditButton>
              </Link>
            </Row>
          )
        })}
      </div>
    </>
  )
}

export default TodoList
