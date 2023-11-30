
import Box from '@mui/system/Box';
import '../ListingCard.css'
import SeachBar from './SearchBar';
import CardListingsGrid from './CardListingsGrid'
import ListingCategoriesGrid from './ListingCategoriesGrid';
import { Typography } from '@mui/material';

export default function HomePage() {

    return (
        <Box component="main" >
            <SeachBar />
            <ListingCategoriesGrid />
            <hr />
            <Typography variant="h4" component="h2">Just in</Typography>
            <hr />
            <CardListingsGrid />
        </Box>
         /* <Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}> */
    )
}