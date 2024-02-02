import { useContext } from "react"
import { AuthProvider } from "./context/JwtAuthContext"
import { Routes, Route, useNavigate } from "react-router-dom"
import UserDashboard from "./components/user/UserDashboard"
import JwtAuthContext from './context/JwtAuthContext'
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import ListingFormPage from "./components/Listing/ListingFormPage"
import ErrorPage from "./ErrorPage"


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

    else if (isLoggedIn) return (
        <Routes>
            <Route path="/profile" element={<UserDashboard />} />
            <Route path="/new-listing" element={<ListingFormPage mode="new"/>}/>
            <Route path="/edit-listing/:listingId" element={<ListingFormPage mode="edit"/>}/>
            <Route path="*" element={<ErrorPage message={"404. Ooops... This page does not exist."}/>} />
        </Routes>
    )
    // in case the user is not logged in, show an error page
    else return (
        <Routes>
        <Route path="*" element={<ErrorPage message={"404. Ooops... This page does not exist. If trying to access a page reserved for registered users, make sure you're logged in first..."}/>} />
        </Routes>
    )
}