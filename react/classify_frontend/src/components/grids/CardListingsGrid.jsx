import usePrivApi from '../../utils/hooks/usePrivApi'
import api from '../../api/apiConn'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import ListingCard from '../Listing/ListingCard'

export default function CardListingsGrid ({details}) {
    const [listings, setListings] = useState([])
    useEffect(() => {
        const getListings = async () => {
            try {
                if (!details) {
                    const res = await api.get('/listings');
                    if (res && res.data) setListings(res.data.results);
                } else {
                    const query = [...details]
                    console.log(query)
                }
                

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