import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function ListingCard({details}) {
  return (
    <Card sx={{border: '1px solid #00000033'}}>
      <CardActionArea >
        <CardMedia
          component="img"
          height="180"
          image={details.images[0] ? details.images[0].url : "https://f005.backblazeb2.com/file/cars-dealers/Template+Images/no_photo_default.jpg" }
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {details.name}
          </Typography>
          <hr />
          <Typography variant="body3" color="text.secondary">
            PLN <strong>{details.price.toLocaleString("pl-pl")}</strong>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
}
