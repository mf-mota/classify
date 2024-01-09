import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import {Box} from '@mui/material';
import { useState } from 'react';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  marginBottom: '2rem',
  height: '4rem',
  '&:hover': {
    backgroundColor: alpha('#000000', 0.05),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: '0 1rem',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: 0,
    height: '4rem',
    // vertical padding + font size from searchIcon
    paddingLeft: '3.2rem',
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '1.2rem',
    color: '#232D3F',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function SearchBar({props}) {
  const {setSearchParams, setPage} = props;
  const [term, setTerm] = useState("");
  const handleSearch = () => {
    setSearchParams((oldParams) => ({...oldParams, q: term }))
    setPage(1)
  }
  return (
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{color: "#232D3F"}}/>
            </SearchIconWrapper>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                sx={{display: 'inline-block', width: '100%'}}
                onChange={(e) => setTerm(e.target.value)}
                />
                
                <Button onClick={handleSearch}sx={{backgroundColor: '#232D3F', color: 'white', mr: '1rem', my: 'auto', '&:hover': {backgroundColor: 'white', color: "#232D3F", alignSelf: 'right'}}}>Search</Button>
            </Box>
          </Search>
  );
}
