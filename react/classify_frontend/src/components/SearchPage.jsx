
import Box from '@mui/system/Box';
import '../assets/styles/ListingCard.css';
import SeachBar from './SearchBar';
import { CssBaseline, Icon, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import FoundListingsGrid from './grids/FoundListingsGrid';
import { useParams } from "react-router-dom"
import FilterBox from './filters/FilterBox';
import { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import {Stack} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SideBar from './layout/SideBar';

import { Button } from '@mui/material';


export default function SearchPage() {
    const {main} = useParams()
    const [searchParams, setSearchParams] = useState({})
    const [resNumber, setResNumber] = useState(0)
    const [prevUrl, setPrevUrl] = useState(null)
    const [nextUrl, setNextUrl] = useState(null)
    const [page, setPage] = useState(1)
    const [showFilters, setShowFilters] = useState(true)
    const showNextPage = (e, pageNo) => {
        setPage(parseInt(pageNo))
    }
    const page_size = 9 // set in django pagination file
    console.log(main)
    useEffect(() => {
      setSearchParams({})
      setPage(1)
  }, [main]);

    return (
        <Box component="main" >
            <SideBar />
            <SeachBar props={{setSearchParams, setPage}}/>
            <hr />
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 0, mt: 0, pb: 0, pt: 0, alignItems: 'center'}}> 
            <Typography gutterBottom component="div" sx={{mb: 0, whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }}}>
                Filters
          </Typography>
          <Button size="small" sx={{color: '#232D3F'}} onClick={() => {
            setShowFilters((prev) => (!prev))
          }} >
            <CssBaseline />
            {showFilters ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}

          </Button>

            </Box>


          <hr />
            <FilterBox params={{searchParams, setSearchParams, main, showFilters}}/>
            <hr />
            <Typography gutterBottom component="div" sx={{whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }}}>
                Results
          </Typography>
          <hr />
            {<FoundListingsGrid detailSearch={searchParams} mainCat={main} setResNumber={setResNumber} setPrev={setPrevUrl} setNext={setNextUrl} page={page}/>}
            {console.log("pages", resNumber)}
            <Stack alignItems="center">
            <Pagination count={Math.floor(resNumber / page_size) + (resNumber % page_size !== 0 ? 1 : 0)  } page={parseInt(page)} onChange={showNextPage} sx={{my: 4}}/>
            </Stack>
        </Box>
    )
}