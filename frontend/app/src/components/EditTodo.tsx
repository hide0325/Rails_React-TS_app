import { FC, useState, useEffect, ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { isAxiosError } from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Todo, ENDPOINT } from '../App'

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

const IsCompletedButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f2a115;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const EditButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  margin: 0 10px;
  background: #0ac620;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const DeleteButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f54242;
  border: none;
  border-radius: 3px;
  cursor: pointer;
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

  const updateIsCompleted = async (currentTodo: Todo) => {
    const data = {
      id: currentTodo.id,
      name: currentTodo.name,
      completed: !currentTodo.completed,
    }

    try {
      const response = await axios.patch<Todo>(`${ENDPOINT}/todos/${currentTodo.id}`, data)
      console.log(response.data, 'OK! === updateIsCompleted ===')
      setCurrentTodo(response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message, 'ERROR! === updateIsCompleted ===')
      }
    }
  }

  const navigate = useNavigate()

  const updateTodo = async () => {
    try {
      const response = await axios.patch<Todo>(`${ENDPOINT}/todos/${currentTodo.id}`, currentTodo)
      console.log(response.data, 'OK! === updateTodo ===')
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
        const response = await axios.delete<Todo>(`${ENDPOINT}/todos/${currentTodo.id}`)
        console.log(response.data, 'OK! === deleteTodo ===')
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
        const response = await axios.get<Todo>(`${ENDPOINT}/todos/${id}`)
        if (!ignore) {
          console.log(response.data, 'OK! === fetchTodo ===')
          setCurrentTodo(response.data)
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
        {currentTodo.completed ? (
          <IsCompletedButton onClick={() => updateIsCompleted(currentTodo)}>
            Uncompleted
          </IsCompletedButton>
        ) : (
          <IsCompletedButton onClick={() => updateIsCompleted(currentTodo)}>
            Completed
          </IsCompletedButton>
        )}
        <EditButton onClick={updateTodo}>Update</EditButton>
        <DeleteButton onClick={deleteTodo}>Delete</DeleteButton>
      </div>
    </>
  )
}

export default EditTodo
