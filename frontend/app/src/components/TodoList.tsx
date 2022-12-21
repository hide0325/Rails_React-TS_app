import { FC, useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'

interface Todo {
  id: string
  name: string
  is_completed: boolean
}

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

const TodoName = styled.span<{ is_completed: boolean }>`
  font-size: 27px;
  ${({ is_completed }) => is_completed && `opacity: 0.4;`}
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

const ENDPOINT = process.env.REACT_APP_ENDPOINT

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
        if (axios.isAxiosError(error)) {
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
        if (axios.isAxiosError(error)) {
          console.log(error.message, 'ERROR!')
        }
      }
    }
  }

  const updateIsCompleted = async (index: number, todo: Todo) => {
    const data = {
      id: todo.id,
      name: todo.name,
      is_completed: !todo.is_completed,
    }

    try {
      const response = await axios.patch(`${ENDPOINT}/todos/${todo.id}`, data)
      console.log(response.data, 'OK!')
      const newTodos: Todo[] = [...todos]
      newTodos[index].is_completed = response.data.is_completed
      setTodos(newTodos)
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
              {todo.is_completed ? (
                <CheckedBox>
                  <ImCheckboxChecked onClick={() => updateIsCompleted(key, todo)} />
                </CheckedBox>
              ) : (
                <UncheckedBox>
                  <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, todo)} />
                </UncheckedBox>
              )}
              <TodoName is_completed={todo.is_completed}>{todo.name}</TodoName>
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
