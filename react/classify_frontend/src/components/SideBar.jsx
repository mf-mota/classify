import { Box, Icon } from "@mui/material";
import { useState, useEffect } from "react";
import api from '../api/apiConn'
import { Link as RouterLink } from 'react-router-dom'
import {Link} from "@mui/material";
export default function SideBar() {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await api.get('/categories');
                if (res && res.data) setCategories(res.data.sort((a, b) => a.id - b.id));
                console.log(res.data)
            } catch (e) {
                console.log("An error occurred while retrieving the categories", e);
            }
        }
        getCategories()
        console.log(categories)
    }, [])
    return (
        <Box
            sx={{
                backgroundColor: '#232D3F',
                minWidth: '30px',
                width: '4vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center content vertically
                justifyContent: 'center', // Space between items
                padding: '0', // Adjust padding as needed
                zIndex: 1,
                paddingX: '0.3vw',
                boxSizing: 'border-box',
            }}>
            {categories.map(c => {
                return (
                    <Link underline='none' key={c.id} component={RouterLink} to={`/listings/cat/${c.id}/q`}  // TODO: change to Search
                    sx={{ display: 'flex', color: 'inherit', textDecoration: 'none', '&:hover': {
                      color: 'inherit', textDecoration: 'none',
                    } }}>
                    <button style={{width: '100%', padding: 0, margin: 0, backgroundColor: 'transparent'}} >
                    <img src={c.icon} style={{width: '100%'}}/>
                </button>
                </Link>
                )
            })}

        </Box>  
    )
}



