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
import './assets/styles/ListingDetail.css'


export default function ListingDetailPrice({price}) {

  return (
    <Card className="price-card">
        <Typography variant="h6">Price</Typography>
        <Box sx={{width: '100%'}}>
            <hr />
        </Box>
        <Typography variant="h5" color="primary">{price ? <strong>{price.toLocaleString("pl-pl")} <span>PLN</span></strong> : "Price"}</Typography>
    </Card>
  );
}
