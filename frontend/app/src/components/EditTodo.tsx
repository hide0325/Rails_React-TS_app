import { FC, useState, useEffect, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import styled, { css } from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TodoRepository from 'repositories/TodoRepository'

interface Button {
  variant: string
  onClick: () => void
}

const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
  margin: 12px 0;
`

const CurrentStatus = styled.div`
  font-size: 19px;
  margin: 8px 0 12px 0;
  font-weight: bold;
`

const Button = styled.button<Button>`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  margin-right: 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  ${({ variant }) => {
    switch (variant) {
      case 'completed':
        return css`
          background: #f2a115;
        `
      case 'edit':
        return css`
          background: #0ac620;
        `
      case 'delete':
        return css`
          background: #f54242;
        `
      default:
        break
    }
  }}
`

const EditTodo: FC = () => {
  const initialTodo = {
    id: null,
    name: '',
    completed: false,
  }

  const [currentTodo, setCurrentTodo] = useState<Todo>(initialTodo)

  const onChangeTodo = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCurrentTodo({ ...currentTodo, [name]: value })
  }

  const notify = () => {
    toast.success('Todo successfully updated!', {
      position: 'bottom-center',
      hideProgressBar: true,
    })
  }

  const updateCompleted = async (currentTodo: Todo) => {
    const todo = {
      id: currentTodo.id,
      name: currentTodo.name,
      completed: !currentTodo.completed,
    }

    try {
      const { data } = await TodoRepository.updateTodo(todo)
      console.log(data, 'OK! === updateCompleted ===')
      setCurrentTodo(data)
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message, 'ERROR! === updateCompleted ===')
      }
    }
  }

  const navigate = useNavigate()

  const updateTodo = async () => {
    try {
      const { data } = await TodoRepository.updateTodo(currentTodo)
      console.log(data, 'OK! === updateTodo ===')
      notify()
      navigate('/todos')
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message, 'ERROR! === updateTodo ===')
      }
    }
  }

  const deleteTodo = async () => {
    const sure = confirm('Are you sure?')
    if (sure) {
      try {
        const { data } = await TodoRepository.deleteTodo(currentTodo.id)
        console.log(data, 'OK! === deleteTodo ===')
        navigate('/todos')
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.message, 'ERROR! === deleteTodo ===')
        }
      }
    }
  }

  const params = useParams()

  useEffect(() => {
    let ignore = false

    const fetchTodo = async (id: string) => {
      try {
        const { data } = await TodoRepository.getTodo(id)
        if (!ignore) {
          console.log(data, 'OK! === fetchTodo ===')
          setCurrentTodo(data)
        }
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error.message, 'ERROR! === fetchTodo ===')
        }
      }
    }

    params.id && fetchTodo(params.id)

    return () => {
      ignore = true
    }
  }, [params.id])

  return (
    <>
      <h1>Editng Todo</h1>
      <div>
        <div>
          <label htmlFor="name">Current Name</label>
          <InputName type="text" name="name" value={currentTodo.name} onChange={onChangeTodo} />
          <div>
            <span>Current Status</span>
            <br />
            <CurrentStatus>{currentTodo.completed ? 'Completed' : 'Uncompleted'}</CurrentStatus>
          </div>
        </div>
        <div>
          {currentTodo.completed ? (
            <Button variant="completed" onClick={() => updateCompleted(currentTodo)}>
              Uncompleted
            </Button>
          ) : (
            <Button variant="completed" onClick={() => updateCompleted(currentTodo)}>
              Completed
            </Button>
          )}
          <Button variant="edit" onClick={updateTodo}>
            Update
          </Button>
          <Button variant="delete" onClick={deleteTodo}>
            Delete
          </Button>
        </div>
      </div>
    </>
  )
}

export default EditTodo
