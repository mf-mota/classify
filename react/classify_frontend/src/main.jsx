import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Listing from './Listing.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './index.css'
import './components/layout/Navbar.jsx'
import Navbar from './components/layout/Navbar.jsx'
import { Box } from '@mui/material'
import UserDashboard from './components/UserDashboard.jsx'
import SignUp from './components/SignUp.jsx'
import SignIn from './components/SignIn.jsx'
import { AuthProvider } from './context/JwtAuthContext.jsx'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import ListingFormPage from './components/ListingFormPage.jsx'
import SearchPage from './components/SearchPage.jsx'
import Footer from './components/layout/Footer.jsx'
import ErrorPage from './ErrorPage.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
        <Navbar />   
      <Box className="main-container" sx={{minHeight: '80vh'}}>
        <Routes className="sub-cont">
          <Route path="/" element={<App />} />
          <Route path="/listings/cat/:main/q" element={<SearchPage />}/>
          <Route path="/listings/:id" element={<Listing />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="*" element={<ProtectedRoutes />} />
        </Routes>
        </Box>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
)
