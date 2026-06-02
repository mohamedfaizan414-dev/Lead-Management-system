import axios from 'axios'

const api = axios.create({
    baseURL: 'https://lead-management-system-ivh5.onrender.com/api',
    withCredentials: true
})

export default api