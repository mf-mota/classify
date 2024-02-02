import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import JwtAuthContext from '../../context/JwtAuthContext'
import { useNavigate } from 'react-router-dom';
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import apiConn from '../../api/apiConn';



export default function Navbar() {
  const navigate = useNavigate()
  const pages = [{name: 'New Classified Ad', url: '/new-listing'}];
  const {logout, user} = useContext(JwtAuthContext)
  const settings = [{type: 'page', setting: 'Profile', url: '/profile'}, 
    {type: 'action', setting: 'Logout', onClick: logout}
  ];


  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [firstName, setFirstName] = useState(" ");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    if (anchorElNav) {
      setAnchorElNav(null);
    }
  
    if (anchorElUser) {
      setAnchorElUser(null);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
         if (user?.user_id) {
          const res = await apiConn.get(`users/data/${user.user_id}/`)
          const first_name = res.data.first_name
          setFirstName(first_name)
         }
        }
      catch (e) {
        setFirstName(" ")
      }
      }
      fetchUsername()
    }, [user])



  return (
    <AppBar position="relative" sx={{
        width: '100%',
        backgroundColor: '#232D3F',
        marginBottom: '5vh',
        zIndex: 1000,
        minHeight: '5vh'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/" sx={{}}>
          <Typography
            variant="h4"
            noWrap
            component="h1"
            sx={{
              mr: 3,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'roboto',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            CLASSIFY 
          </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            > 
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link component={RouterLink} to={page.url}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h4"
            noWrap
            component="h1"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'roboto',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            <Link to="/" style={{color: 'white', '&:hover': {
              color: 'white', textDecoration: 'none'
            }}}><span>CLASSIFY</span></Link>

          </Typography>
          {user ? ( <React.Fragment>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end', mr:6}}>
            {pages.map((page) => {
              return (<Button 
                component={RouterLink} 
                to={page.url}
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ border: '1px solid white', '&:hover': {backgroundColor: '#00BF0088', border: '1px solid white'}, my: 2, mx: 1, color: 'white', display: 'block', alignSelf: 'end' }}
              >
                {page.name}
              </Button>)
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={firstName} src="/static/images/avatar/userphoto.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((s, ix) => (
                <MenuItem key={ix} onClick={handleCloseUserMenu}>
                  {s.type === "page" ? (<Link component={RouterLink} to={s.url}>
                  <Typography textAlign="center" color="black">{s.setting}</Typography>
                  </Link>) : 
                  <Box onClick={() => { s.onClick(); handleCloseUserMenu(); }}>
                    {s.setting}
                  </Box>}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          </React.Fragment>)
          : (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end'}}>
              <Button onClick={() => navigate('/register')}
                sx={{ border: '1px solid white', '&:hover': {backgroundColor: '#FFFFFF44', border: '1px solid white'}, my: 2, mx: 1, color: 'white', display: 'block', alignSelf: 'end' }}
              >Register
              </Button>
              <Button onClick={() => navigate('/login')}
                sx={{ border: '1px solid white', '&:hover': {backgroundColor: '#FFFFFF44', border: '1px solid white'}, my: 2, mx: 1, color: 'white', display: 'block', alignSelf: 'end' }}
              >Login
              </Button>

          </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

