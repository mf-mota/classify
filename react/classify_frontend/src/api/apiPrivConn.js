import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const baseURL = `${import.meta.env.VITE_API_URL}/api`

const tokens = {
    access: localStorage.getItem('access_tk') ? localStorage.getItem('access_tk') : null,
    refresh: localStorage.getItem('refresh_tk') ? localStorage.getItem('refresh_tk') : null
}

const axiosPriv = axios.create({
    baseURL: baseURL,
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
        if (localStorage.getItem('access_tk')) {
            console.log("Setting access_tk")
            tokens.access = localStorage.getItem('access_tk')
        }
        else {
            tokens.access = null;
            return request
        }
    }

    const user = jwtDecode(tokens.access)
    const isTokenExpired = (Date.now() / 1000) - user.exp > 0
    console.log('isTokenExpired: ', isTokenExpired)

    if (!isTokenExpired) return request;
    
    console.log("Hitting the refresh endpoint")
    const res = await axios.post(baseURL + "/token/refresh/", {refresh: tokens.refresh})
    console.log(res.data.access)
    if (res.data.access) {
        localStorage.setItem('access_tk', res.data.access)
        console.log("Setting new access token")
        console.log("request b4 data change", request)
        request.data['token'] = res.data.access
        console.log("request after data change", request)

        tokens.access = res.data.access
        request.headers.Authorization = "Bearer" + " " + res.data.access
    }
    return request
})

export default axiosPriv;


