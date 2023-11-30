import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const tokens = {
    access: localStorage.getItem('access_tk') ? localStorage.getItem('access_tk') : null,
    refresh: localStorage.getItem('refresh_tk') ? localStorage.getItem('refresh_tk') : null
}

const axiosPriv = axios.create({
    baseURL: "http://localhost:8000/api",
    timeout: 6000,
    headers: {
        Authorization: localStorage.getItem('access_tk') ? "Bearer" + " " + localStorage.getItem('access_tk') : null,
        'Content-Type': 'application/json',
        accept: 'application/json'
    }
});

axiosPriv.interceptors.request.use(async request => {
    console.log('Interceptor ran')
    if (!tokens.access) {
        tokens.access = localStorage.getItem('access_tk') ? localStorage.getItem('access_tk') : null
    }

    const user = jwtDecode(tokens.access)
    const isTokenExpired = (Date.now() / 1000) - user.exp > 0
    console.log('isTokenExpired: ', isTokenExpired)
    if (!isTokenExpired) return request

    return request
})

export default axiosPriv;


