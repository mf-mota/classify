import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom";
import apiPriv from '../api/apiPrivConn'
import api from '../api/apiConn'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    const [tokens, setTokens] = useState({access: localStorage.getItem('access_tk') ? localStorage.getItem('access_tk') : null,
                                            refresh: localStorage.getItem('refresh_tk') ? localStorage.getItem('refresh_tk') : null})
    const [user, setUser] = useState(localStorage.getItem('access_tk') ? jwtDecode(localStorage.getItem('access_tk')) : null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(()=> {

        if(tokens.access){
            console.log(tokens.access)
            setUser(jwtDecode(tokens.access))
            setLoading(false)
        }
        else {
            console.log("No tokens")
            setLoading(false)
        }
        console.log("use effect ran")



    }, [tokens, loading, navigate])

    const login = async (data, setServerErrors) => {
        await api.post('token/', data)
        .then((res) => {
            if (res.status === 200) {
                localStorage.setItem('access_tk', res.data.access)
                localStorage.setItem('refresh_tk', res.data.refresh)
                console.log("login, setting tokens to", res.data)
                setTokens(res.data)
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
                            return e.response.data[key].toString()
                        })
                        console.log("e", foundErrors)
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

    const validateCall = async () => {
        return apiPriv.post('/token/validate/', {
            token: tokens.access
        })
    }

    const validateToken = async () => {
        try {
            const res = await validateCall()
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

    const logout = () => {
        try {
            setLoading(true)
            console.log("deleting local storage")
            localStorage.removeItem('access_tk', null)
            localStorage.removeItem('refresh_tk', null)
            setTokens({access: null, refresh: null})
            setUser(null)
            console.log("navifating to /")
            navigate('/')
        }
        catch (e) {
            console.log("An error occurred while logging you out!", e)
        }
    }
    

    const contextData = {
        user: user,
        tokens: tokens,
        setTokens: setTokens,
        setUser: setUser,
        login: login,
        logout: logout,
        validateToken: validateToken,
    }



    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}

