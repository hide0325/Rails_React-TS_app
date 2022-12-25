import { FC, useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import axios, { isAxiosError } from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'
import { Todo, ENDPOINT } from '../App'

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

const RemoveAllButton = styled.button`
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
        const response = await axios.get(`${ENDPOINT}/todos`)
        if (!ignore) {
          console.log(response.data, 'OK!')
          setTodos(response.data)
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.message, 'ERROR!')
        }
      }
    }

    fetchTodos()

    return () => {
      ignore = true
    }
  }, [])

  const removeAllTodos = async () => {
    const sure = confirm('Are you sure?')
    if (sure) {
      try {
        const response = await axios.delete(`${ENDPOINT}/todos/destroy_all`)
        console.log(response.data, 'OK!')
        setTodos([])
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.message, 'ERROR!')
        }
      }
    }
  }

  const updateIsCompleted = async (index: number, todo: Todo) => {
    const data = {
      id: todo.id,
      name: todo.name,
      completed: !todo.completed,
    }

    try {
      const response = await axios.patch(`${ENDPOINT}/todos/${todo.id}`, data)
      console.log(response.data, 'OK!')
      const newTodos: Todo[] = [...todos]
      newTodos[index].completed = response.data.completed
      setTodos(newTodos)
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message, 'ERROR!')
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
        <RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
      </SearchAndButton>
      <div>
        {filteredTodos(todos).map((todo, key) => {
          return (
            <Row key={key}>
              {todo.completed ? (
                <CheckedBox>
                  <ImCheckboxChecked onClick={() => updateIsCompleted(key, todo)} />
                </CheckedBox>
              ) : (
                <UncheckedBox>
                  <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, todo)} />
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
