import axios from 'axios'

const baseDomain = `${process.env.REACT_APP_ENDPOINT}`
const baseURL = `${baseDomain}/api/v1`

export default axios.create({
  baseURL,
})
