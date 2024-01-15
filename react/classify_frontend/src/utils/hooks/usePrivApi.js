import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useContext } from 'react'
import AuthContext from '../../context/JwtAuthContext'

const baseURL = `${import.meta.env.VITE_API_URL}/api`

export default function usePrivApi () {
    const navigate = useNavigate();
    const {tokens, setTokens, setUser, isLoggingIn} = useContext(AuthContext)

    const axiosPriv = axios.create({
        baseURL: baseURL,
        timeout: 6000,
        headers: {
            Authorization: tokens?.access ? "Bearer" + " " + tokens.access : null,
            'Content-Type': 'application/json',
            accept: 'application/json'
        }
    });

    axiosPriv.interceptors.request.use(async request => {
        console.log('Interceptor ran')
        console.log(isLoggingIn)
        if (isLoggingIn) {
            return request
        }
        if (!tokens.access) {
            if (localStorage.getItem('access_tk')) {
                console.log("Setting access_tk")
                setTokens(tokens => ({...tokens, access: localStorage.getItem('access_tk')}))
                console.log("Bearer" + " " + String(localStorage.getItem('access_tk')))
                // request.headers.Authorization = "Bearer" + " " + String(localStorage.getItem('access_tk'))
            }
            else {
                return request
            }
        }
    
        const user = jwtDecode(tokens.access)
        console.log(user.exp)
        console.log((Date.now() / 1000))
        const isTokenExpired = (Date.now() / 1000) - user.exp > 0
        console.log('isTokenExpired: ', isTokenExpired)
        if (!isTokenExpired) return request;
        
        if (((Date.now() / 1000) - tokens.refresh > 0)) {
            console.log("refresh is expired")
            navigate('/login')
            localStorage.removeItem('access_tk', null)
            localStorage.removeItem('refresh_tk', null)
            setTokens({access: null, refresh: null})
        }
        else {
            try {
                console.log("Hitting the refresh endpoint")
                const res = await axios.post(baseURL + "/token/refresh/", {refresh: tokens.refresh})
                if (res.data.access) {
                    console.log("Setting new access token")
                    console.log("new data:", res.data)
                    setTokens(tokens => ({...tokens, access: res.data.access}))
                    localStorage.setItem('access_tk', res.data.access)
                    console.log({...tokens, access: res.data.access})
                    setUser(jwtDecode(res.data.access))
                    request.headers.Authorization = "Bearer" + " " + res.data.access
                }
                return request
            } catch (e) {
                console.log("Could not refresh token through API, Please try again later")
            }

        }

    })
    return axiosPriv
}
