import { FC, useEffect } from 'react'
import axios from 'axios'

const App: FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/todos`
        )
        console.log(response, '200 OK')
      } catch (error) {
        console.log(error, '404 error')
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <header>
        <p>ほげ</p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </>
  )
}

export default App
