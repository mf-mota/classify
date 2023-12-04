import { Grid, Box, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import api from '../api/apiConn'
import ListingCard from "./ListingCard"
import { useContext } from "react"
import JwtAuthContext from "../context/JwtAuthContext"
import { Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import usePrivApi from '../utils/hooks/usePrivApi'

export default function UserDashboard () {
    const {user} = useContext(JwtAuthContext)
    const [userListings, setUserListings] = useState([])
    const api = usePrivApi()
    const handleDelete = async (id) => {
        await api.delete(`/listings/${id}/`)
        console.log("tryna delete")
    }
    useEffect(() => {
        const getListings = async () => {
            try {
                const res = await api.get(`/users/${user.user_id}/`);
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
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "space-between",}}>
                                <Typography color="primary" sx={{fontWeight: 'bold'}}>Status: {l.is_active == "active" ? "Active" : "Draft"}</Typography>
                                <div>
                                    <Button size="small" sx={{mr: 1}}><EditIcon /></Button>
                                    <Button onClick={() => handleDelete(l.id)} size="small" sx={{color: 'white', border: '1px solid white', '&:hover': {backgroundColor: '#FF0000AA', border: '1px solid white'}}}>DELETE</Button>

                                </div>
                            </Box>
                            <ListingCard key={l.id} details={l} sx={{ maxWidth: 345 }}/>
                            <Typography color="primary" sx={{fontWeight: 'bold'}}>Clicks: {l.view_count}</Typography>

                        </Box>
                        )
                    })}
                    
                </Box>
                    </Grid>
                </Grid>
        )
}
