import usePrivApi from '../utils/hooks/usePrivApi'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import ListingCard from './ListingCard'

export default function CardListingsGrid ({details}) {
    const [listings, setListings] = useState([])
    const api = usePrivApi()
    useEffect(() => {
        const getListings = async () => {
            try {
                if (!details) {
                    console.log("Headers")
                    const res = await api.get('/listings');
                    console.log(res)
                    if (res && res.data) setListings(res.data);
                    console.log(res.data)
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