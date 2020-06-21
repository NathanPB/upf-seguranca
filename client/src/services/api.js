import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const baseURL =  'http://localhost:8080'

export const auth = (email, hashedPassword) => axios.post(`${baseURL}/auth`, undefined, {
  headers: {
    Authorization: `${email} ${hashedPassword}`
  }
})

export const create = (token, options) => {

  const { onTokenInvalid } = options || {}

  const api = axios.create({
    baseURL,
    transformResponse: (data) => {
      if (data === 'Forbidden') {
        onTokenInvalid({ token })
      }

      return data;
    },
    headers: {
      Authorization: token
    }
  })

  const me = () => api.get('/user/me')

  const isTokenValid = () => new Promise(resolve => void me()
    .then(() => resolve(true))
    .catch(() => resolve(false))
  )

  const users = () => api.get('/user')

  const addUser = (userData) => api.post('/user', { headers: userData })

  const removeUser = (id) => api.delete(`/user/${id}`)

  const editUser = (id, userData) => api.put(`/user/${id}`, { headers: userData })

  const getUser = (id) => api.get(`/user/${id}`)

  return { api, me, isTokenValid, users, addUser, removeUser, editUser, getUser, token };
}
