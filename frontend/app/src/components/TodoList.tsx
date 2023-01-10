import { FC, useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import styled from 'styled-components'
import ReactPaginate from 'react-paginate'
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
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const TitleWrapper = styled.div`
  display: flex;
`

const DeleteAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: auto;
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

const Paginate = styled(ReactPaginate).attrs({
  containerClassName: 'pagination',
  previousClassName: 'previous',
  nextClassName: 'next',
  activeClassName: 'active',
  disabledClassName: 'disabled',
})`
  margin: 27px 81px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style-type: none;
  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    border: gray 1px solid;
    cursor: pointer;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #0366d6;
    border-color: transparent;
    color: white;
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`

const TodoList: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchName, setSearchName] = useState('')
  const [offset, setOffset] = useState(0)
  const perPage = 10

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
      newTodos[index + offset].completed = data.completed
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

  const handlePageChange = (data: { selected: number }) => {
    const pageNumber = data['selected']
    setOffset(pageNumber * perPage)
  }

  return (
    <>
      <TitleWrapper>
        <h1>Todo List</h1>
        <DeleteAllButton onClick={deleteAllTodos}>Delete All</DeleteAllButton>
      </TitleWrapper>
      <SearchAndButton>
        <SearchForm
          type="text"
          placeholder="Search todo..."
          onChange={(event) => onChangeTodos(event)}
        />
      </SearchAndButton>
      <div>
        {filteredTodos(todos.slice(offset, offset + perPage)).map((todo, key) => {
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
      <Paginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(todos.length / perPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default TodoList
