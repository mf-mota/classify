import ReactDOM from 'react-dom/client'
import Listing from './components/Listing/Listing.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './index.css'
import './components/layout/Navbar.jsx'
import Navbar from './components/layout/Navbar.jsx'
import { Box } from '@mui/material'
import SignUp from './components/user/SignUp.jsx'
import SignIn from './components/user/SignIn.jsx'
import { AuthProvider } from './context/JwtAuthContext.jsx'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import ListingFormPage from './components/Listing/ListingFormPage.jsx'
import Footer from './components/layout/Footer.jsx'
import ErrorPage from './ErrorPage.jsx'
import HomePage from './components/HomePage.jsx'
import './assets/styles/App.css'
import SearchPage from './components/SearchPage.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
        <Navbar />   
      <Box className="main-container" sx={{minHeight: '80vh'}}>
        <Routes className="sub-cont">
          <Route path="/" element={<HomePage />} />
          <Route path="/listings/cat/:main/q" element={<SearchPage />}/>
          <Route path="/listings/:id" element={<Listing />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} /> 
          /* If no match is found, render the protected routes */
          <Route path="*" element={<ProtectedRoutes />} />
        </Routes>
        </Box>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
)
