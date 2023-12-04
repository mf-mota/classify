import api from '../api/apiConn'
import { useState, useEffect } from 'react'
import CategoryCard from './CategoryCard'
import { Box } from '@mui/material'
import { useContext } from 'react'
import JwtAuthContent from '../context/JwtAuthContext'

export default function ListingCategoriesGrid () {
    const {loading, tokens} = useContext(JwtAuthContent)
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const getListings = async () => {
            try {
                const res = await api.get('/categories');
                if (res && res.data) setCategories(res.data);
                console.log(res.data)
            } catch (e) {
                console.log("An error occurred while retrieving the categories", e);
            }
        }
        getListings()
    }, [loading, tokens])
    if (!loading) return (
    <Box component="main" display="flex"
sx={{justifyContent: "space-around", flexWrap: "wrap", mb: 2, py: 2, boxSizing: 'border-box'}}>
    {categories.map(c => {
        return <CategoryCard key={c.id} category={c} sx={{ maxWidth: 345 }}/>
    })}
 </Box>
    )
}