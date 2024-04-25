import axios from 'axios';
import { clearCookie } from './utils/cookie.utils';

const env = import.meta.env

const axiosInstance = axios.create({
	baseURL: env.BACKEND_API,
	withCredentials: true
})

axiosInstance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response.status === 401) {
			// redirect to login page
			clearCookie()
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export default axiosInstance