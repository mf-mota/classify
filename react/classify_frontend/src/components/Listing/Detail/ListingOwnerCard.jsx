import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FlagIcon from '@mui/icons-material/Flag';
import { Link as RouterLink } from 'react-router-dom';
import {Link} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Box} from '@mui/material';
import {Avatar} from '@mui/material';
import '../../../assets/styles/ListingDetail.css'


export default function ListingOwnerCard({user, location}) {
    let owner_location = String()
    if (location) {
        owner_location = `${location.district ? location.district + ", " : ""} ${location.city}, ${location.state}`
    }
    console.log("user", user)
  return (
    <Card className="owner-card" sx={{ml: {md: '3rem'}}}>
        <Avatar alt={user ? user.first_name : " "} src="/static/images/avatar/userphoto.jpg" sx={{width: '8rem', height: '8rem', fontSize: '4rem' }}/>
      <CardActionArea >
        <CardContent>
          <Typography gutterBottom component="div" sx={{textAlign: 'center', whiteSpace: 'nowrap', fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' }}}>
            {user &&  user.first_name} {user && user.last_name}
          </Typography>
          <hr />
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <LocationOnIcon color="primary" sx={{height: '100%'}} />
          <Typography variant="body4" color="text.secondary">
            {location ? owner_location : "Loading Seller's location..."}
          </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{display: 'flex', justifyContent: 'space-evenly'}}>
        <Button size="small" color="primary">Contact Seller
        </Button>
      </CardActions>
    </Card>
  );
}
