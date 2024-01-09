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


export default function ListingCard({details}) {
  return (
    <Card sx={{border: '2px solid #00000055', width: '20%', maxWidth: '320px', minWidth: '300px', my: 3, boxShadow: '5px 5px 5px #00000052'}}>
    <Link underline='none' component={RouterLink} to={`/listings/${details.id}`} 
    sx={{ color: 'inherit', textDecoration: 'none', '&:hover': {
      color: 'inherit', textDecoration: 'none',
    } }}>
      <CardActionArea >
        <CardMedia
          component="img"
          image={details.images[0] ? details.images[0].url : "https://f005.backblazeb2.com/file/cars-dealers/Template+Images/no_photo_default.jpg" }
          alt={details.name + ' image'}
          sx={{ objectFit: 'contain', height: '200px' }}
        />
        <CardContent>
          
          <Typography gutterBottom component="div" sx={{whiteSpace: 'nowrap', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }}}>
            {details.name}
          </Typography>
          <hr />
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
          </Box>
        </CardContent>
      </CardActionArea>
      </Link>
      <CardActions sx={{display: 'flex', justifyContent: 'space-evenly'}}>
        <Button size="small" color="primary">
          <ShareIcon />
        </Button>
        <Button size="small" color="primary">
          <FavoriteBorderIcon />
        </Button>
        <Button size="small" color="primary">
          <FlagIcon />
        </Button>
      </CardActions>
    </Card>
  );
}
