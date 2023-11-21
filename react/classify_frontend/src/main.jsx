import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Listing from './Listing.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './index.css'
import './components/layout/Navbar.jsx'
import Navbar from './components/layout/Navbar.jsx'
import { Box } from '@mui/material'
import UserDashboard from './components/UserDashboard.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Navbar />
      <Box className="main-container">
      <Routes className="sub-cont">
        <Route path="/" element={<App />} />
        <Route path="/listings/:id" element={<Listing />} />
        <Route path="/profile" element={<UserDashboard />} />
      </Routes>
      </Box>
      <Box>Here goes the footer #TODO</Box>
  </BrowserRouter>
)
