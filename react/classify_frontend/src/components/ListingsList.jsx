import api from '../api/listings'
import { useState, useEffect } from 'react'
import ListingCard from './ListingCard'
import Box from '@mui/system/Box';
import '../ListingCard.css'


export default function ListingsList() {
    const [listings, setListings] = useState([])
    useEffect(() => {
        const getListings = async () => {
            try {
                const res = await api.get('/listings');
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
         
        </Box>
         /* <Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}> */
    )
}