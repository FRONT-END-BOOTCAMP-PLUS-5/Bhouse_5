import axios from 'axios'

// https://axios-http.com/docs/instance
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
