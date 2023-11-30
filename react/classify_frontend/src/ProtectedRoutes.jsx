import { useContext } from "react"
import { AuthProvider } from "./context/JwtAuthContext"
import { Routes, Route, useNavigate } from "react-router-dom"
import UserDashboard from "./components/UserDashboard"
import JwtAuthContext from './context/JwtAuthContext'
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"


export default function ProtectedRoutes () {
    const {validateToken} = useContext(JwtAuthContext)
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const isAuthenticated = async () => {
            const loggedIn = await validateToken()
            setIsLoggedIn(loggedIn)
            console.log(isLoggedIn)
        }
        isAuthenticated()
    }, [validateToken, isLoggedIn])
 
    if (isLoggedIn === null) {
        return <p>Loading...</p>;
    }

    else if (!isLoggedIn) return (
        <Routes>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
    else return (
        <Routes>
            <Route path="/profile" element={<UserDashboard />} />
        </Routes>
    )

}