import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Listing from './Listing.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import './index.css'
import './components/layout/Navbar.jsx'
import Navbar from './components/layout/Navbar.jsx'
import { Box } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Navbar />
      <Box className="main-container">
      <Routes className="sub-cont">
        <Route path="/" element={<App />} />
        <Route path="/listing/:id" element={<Listing />} />
      </Routes>
      </Box>
  </BrowserRouter>
)
