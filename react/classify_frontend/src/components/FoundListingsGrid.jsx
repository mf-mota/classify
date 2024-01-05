import api from '../api/apiConn'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import ListingCard from './ListingCard'

export default function FoundListingsGrid () {
    const [listings, setListings] = useState([])
    useEffect(() => {
        const getListings = async () => {
            try {
                console.log("Headers")
                const res = await api.get('/listings');
                console.log(res)
                if (res && res.data) setListings(res.data);
                console.log(res.data)
            } catch (e) {
                console.log("An error occurred while retrieving the data", e);
            }
        }
        getListings()
    }, [])
    return (
    <Box component="main" display="flex"
            sx={{justifyContent: "space-around", flexWrap: "wrap"}}>
        {listings.map(l => {
            return <ListingCard key={l.id} details={l} sx={{ maxWidth: 345 }}/>
        })}
    </Box>)
}