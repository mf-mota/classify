import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom";
import apiPriv from '../api/apiPrivConn'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    const [tokens, setTokens] = useState({access: localStorage.getItem('access_tk') ? localStorage.getItem('access_tk') : null,
                                            refresh: localStorage.getItem('refresh_tk') ? localStorage.getItem('refresh_tk') : null})
    const [user, setUser] = useState(localStorage.getItem('access_tk') ? jwtDecode(localStorage.getItem('access_tk')) : null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const login = async (data, setServerErrors) => {
        await apiPriv.post('token/', data)
        .then((res) => {
            if (res.status === 200) {
                localStorage.setItem('access_tk', res.data.access)
                localStorage.setItem('refresh_tk', res.data.refresh)
                setTokens(data)
                setUser(jwtDecode(res.data.access))
                navigate('/')
            // call tokens here!
            }
            else {
                console.log(res)
                setServerErrors(["An error occurred, please contact Support"])
            }
        })
        .catch((e) => {
            console.log(e)
            if (e.response.status === 401 || e.response.status == 400) {
                if (e.response && e.response.data) {
                    const keys = Object.keys(e.response.data)
                    if (keys.length > 0) {
                        const foundErrors = keys.map((key) => {
                            return ((key === "password" || key === "username") && key.charAt(0).toUpperCase() + key.slice(1) + ": " +e.response.data[key].toString())
                        })
                        console.log(foundErrors)
                        setServerErrors(foundErrors)
                    }
                }
                else {
                    setServerErrors("An unexpected error occured")
                }
            }

            else {
                const connError = ["Sorry, a server error occurred",  "Please try again later!"]
                setServerErrors(connError)
            }
        }  
        )
    }

    const validateToken = async () => {
        try {
            const res = await apiPriv.post('/token/validate/', {
                token: tokens.access
            })
            if (res.status === 200) {
                return true
            } else {
                return false
            }
        } catch {
            console.log("Token could not be validated.")
            return false
        }
    }

    const contextData = {
        user: user,
        tokens: tokens,
        setTokens: setTokens,
        setUser: setUser,
        login: login,
        validateToken: validateToken,
    }

    useEffect(()=> {

        if(tokens){
            // setUser(jwtDecode(tokens.access))
        }
        setLoading(false)


    }, [tokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

