import { Container, Typography, CssBaseline, Box } from "@mui/material"

export default function Footer () {
    return (
        <Box  sx={{width: '100%', bottom: 0, backgroundColor: '#232D3F', mt: '5vh', minHeight: '5vh'}}>
            <CssBaseline />
            <Box sx={{ mt: 8, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#232D3F', width: '100%', margin: 0}}>
            <Typography
            variant="h5"
            noWrap
            component="p"
            sx={{
                fontFamily: 'roboto',
                padding: '1rem',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'white',
                '&:hover': {
                    color: 'white'
                }
            }}
          >
            &copy; CLASSIFY {new Date().getFullYear()}
          </Typography>
            </Box>
        </Box>
    )
}