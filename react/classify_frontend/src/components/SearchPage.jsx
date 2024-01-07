
import Box from '@mui/system/Box';
import '../ListingCard.css'
import SeachBar from './SearchBar';
import CardListingsGrid from './CardListingsGrid'
import ListingCategoriesGrid from './ListingCategoriesGrid';
import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import JwtAuthContent from '../context/JwtAuthContext'
import FoundListingsGrid from './FoundListingsGrid';
import { useParams } from "react-router-dom"
import FilterBox from './FilterBox';
import { useState } from 'react';

export default function SearchPage() {
    const {main} = useParams()
    const [searchParams, setSearchParams] = useState({})
    console.log(main)
    return (
        <Box component="main" >
            <SeachBar />
            <hr />
            <Typography gutterBottom component="div" sx={{whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }}}>
                Filters
          </Typography>
          <hr />
            <FilterBox params={{searchParams, setSearchParams}}/>
            <hr />
            <Typography gutterBottom component="div" sx={{whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }}}>
                Results
          </Typography>
          <hr />
            {<FoundListingsGrid detailSearch={searchParams} mainCat={main}/>}
        </Box>
         /* <Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}> */
    )
}