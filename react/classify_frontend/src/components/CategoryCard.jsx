import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FlagIcon from '@mui/icons-material/Flag';
import { Link as RouterLink } from 'react-router-dom'
import {Link} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Box} from '@mui/material';


export default function CategoryCard({category}) {
  return (
    <Card sx={{ maxWidth: {xs: '50%', md: '33%', lg: '25%'}, maxHeight: {xs: '50px', md: '150px'}, border: '3px solid white', boxSizing: 'border-box', mt: '-2.7px'}}>
    <Link underline='none' component={RouterLink} to={`/listings/`}  // TODO: change to Search
    sx={{ display: 'flex', color: 'inherit', textDecoration: 'none', '&:hover': {
      color: 'inherit', textDecoration: 'none',
    } }}>
        <CardContent sx={{display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box', py: '0px !important', backgroundColor: '#232D3F', color: 'white', maxHeight: {xs: '50px', md: '150px'}}}>
        <CardMedia
          component="img"
          image={category.icon}
          alt="Category image"
          sx={{ objectFit: 'contain', height: '100% !important', maxHeight: '100%', maxWidth: '33%' }}
        />
        <Box sx={{textAlign: 'center', width: '100%', alignSelf: 'center'}}>
          <Typography component="div" sx={{whiteSpace: 'wrap', fontSize: { xs: '1rem', sm: '1rem', md: '1.2rem' }}}>
            {category.name}
          </Typography>
        </Box>
          {/* <hr />
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="body3" color="text.secondary">
            PLN <strong>{details.price.toLocaleString("pl-pl")}</strong>
          </Typography>
          <Box sx={{display: 'flex'}}>
          <LocationOnIcon color="primary" sx={{maxHeight: '100%', justifySelf: "flex-end"}} />
          <Typography variant="body4" color="text.secondary" sx={{justifySelf: "flex-end"}}>
            {details.location.city}
          </Typography>
          </Box>
          </Box> */}
        </CardContent>
        </Link>
    </Card>
  );
}
