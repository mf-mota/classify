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


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
        <Navbar />
        <Box className="main-container">
        <Routes className="sub-cont">
          <Route path="/" element={<App />} />
          <Route path="/listings/:id" element={<Listing />} />
          {/* <Route path="/profile" element={<UserDashboard />} /> */}
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="*" element={<ProtectedRoutes />} />
          <Route path="new-listing" element={<ListingFormPage />}/>
        </Routes>
        </Box>
        <Box>Here goes the footer #TODO</Box>
      </AuthProvider>
    </BrowserRouter>
)
