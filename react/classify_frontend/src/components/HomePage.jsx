
import Box from '@mui/system/Box';
import '../assets/styles/ListingCard.css'
import CardListingsGrid from './grids/CardListingsGrid';
import ListingCategoriesGrid from './grids/ListingCategoriesGrid';
import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import JwtAuthContent from '../context/JwtAuthContext'

export default function HomePage() {
    // const {loading, tokens, user} = useContext(JwtAuthContent)
    // useEffect(() => {
    //     console.log(tokens)
    // }, [user])
    return (
        <Box component="main" >
            {/* <SeachBar /> */}
            <ListingCategoriesGrid />
            <hr />
            <Typography variant="h4" component="h2">Just in</Typography>
            <hr />
            {/* {!loading && user && <CardListingsGrid />} */}
            <CardListingsGrid />
        </Box>
         /* <Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}> */
    )
}