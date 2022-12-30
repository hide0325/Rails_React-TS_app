import { FC, useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { isAxiosError } from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiSend } from 'react-icons/fi'
import { Todo, ENDPOINT } from '../App'

const InputAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`

const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
`

const Button = styled.button<{ disabled: boolean }>`
  font-size: 20px;
  border: none;
  border-radius: 3px;
  margin-left: 10px;
  padding: 2px 10px;
  background: #1e90ff;
  color: #fff;
  text-align: center;
  cursor: pointer;
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: default;
  `}
`

const Icon = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`

const AddTodo: FC = () => {
  const initialTodo = {
    id: null,
    name: '',
    completed: false,
  }

  const [todo, setTodo] = useState<Todo>(initialTodo)

  const onChangeTodo = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setTodo({ ...todo, [name]: value })
  }

  const notify = () => {
    toast.success('Todo successfully created!', {
      position: 'bottom-center',
      hideProgressBar: true,
    })
  }

  const navigate = useNavigate()

  const saveTodo = async () => {
    const data = {
      name: todo.name,
    }

    try {
      const response = await axios.post<Todo>(`${ENDPOINT}/todos`, data)
      console.log(response.data, 'OK! === saveTodo ===')
      setTodo({
        id: response.data.id,
        name: response.data.name,
        completed: response.data.completed,
      })
      notify()
      navigate('/todos')
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message, 'ERROR! === saveTodo ===')
      }
    }
  }
  return (
    <>
      <h1>New Todo</h1>
      <InputAndButton>
        <InputName type="text" required value={todo.name} name="name" onChange={onChangeTodo} />
        <Button onClick={saveTodo} disabled={!todo.name || /^\s*$/.test(todo.name)}>
          <Icon>
            <FiSend />
          </Icon>
        </Button>
      </InputAndButton>
    </>
  )
}

export default AddTodo
