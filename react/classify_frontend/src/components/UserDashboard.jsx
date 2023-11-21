import { Grid, Box, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import api from '../api/listings'
import ListingCard from "./ListingCard"

export default function UserDashboard () {
    const [userListings, setUserListings] = useState([])
    useEffect(() => {
        const getListings = async () => {
            try {
                const res = await api.get('/users/1/');
                if (res && res.data) setUserListings(res.data);
                console.log(res.data)
            } catch (e) {
                console.log("An error occurred while retrieving the data", e);
            }
        }
        getListings()
    }, [])
    return (
        <Grid container spacing={2} sx={{backgroundColor: 'white', pb: 10, borderRadius: '2rem'}}>
            <Grid item xs={12}>
                <Box sx={{px: 3, py:3, backgroundColor: 'white', mb: 5}}>
                    <Typography variant="h4" element="h1" sx={{fontFamily: 'roboto', fontWeight: 'bold'}}>
                        User Dashboard
                    </Typography>
                </Box>
                <Box component="main" display="flex" sx={{justifyContent: "space-around", flexWrap: "wrap"}}>
                    {userListings.map(l => {
                        console.log(l)
                        return (
                        <Box key={l.id} sx={{backgroundColor: '#00000044', p: 3, borderRadius: '1rem'}}>
                            <Typography color="primary" sx={{fontWeight: 'bold'}}>Status: {l.is_active == "active" ? "Active" : "Draft"}</Typography>
                            <ListingCard key={l.id} details={l} sx={{ maxWidth: 345 }}/>
                            <Typography color="primary" sx={{fontWeight: 'bold'}}>Clicks: {l.is_active == "active" ? "Active" : "Draft"}</Typography>

                        </Box>
                        )
                    })}
                    
                </Box>
                    </Grid>
                </Grid>
        )
}
