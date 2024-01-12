import { Typography, Box } from "@mui/material";


export default function ErrorPage ({message}) {
    return (
        <Box sx={{display: "flex", alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '80vh', border: '2px solid black'}}>
                      <Typography
            variant="h4"
            noWrap
            component="h1"
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'roboto',
              fontWeight: 700,
              mb: 3,
              letterSpacing: '.2rem',
              color: '#232D3F',
              '&:hover': {
                color: '#232D3F'
              }
            }}
          >
            CLASSIFY 
          </Typography>
            <Typography component="h1" variant="h5" textAlign="center" sx={{mb: 6, alignSelf: 'center', fontFamily: 'roboto',}} >
        {message}
        </Typography> 
        </Box>

    )
}