import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Typography } from '@mui/material'
import '../assets/styles/ListingCarousel.css'
import {Box} from '@mui/material'
import { useState, useEffect } from 'react'

export default function ListingCarousel({listing})
{
    const [isFullscreen, setIsFullscreen] = useState(false);
    if (!listing || !listing.id) {
        return <div>Loading...</div>
    }
    if (!listing.images[0]) {
        listing.images.push({url: "https://f005.backblazeb2.com/file/cars-dealers/Template+Images/no_photo_default.jpg"})
    }
    const toggleFullscreen = (e) => {
        e.stopPropagation();
        if (e.target.tagName.toUpperCase() !== "IMG") return;
        setIsFullscreen(isFullscreen => !isFullscreen);
        }

    return (
        <div style={{border: '2px solid #00000055', borderRadius: '1rem', backgroundColor: 'white', boxShadow: '5px 5px 5px #00000052'}}>
        <Typography variant="h4" element="h1" sx={{p: 2, fontFamily: 'roboto', fontWeight: 700}}>{listing ? listing.name: "Loading..."}</Typography>
        <Carousel navButtonsAlwaysInvisible={isFullscreen ? true : false} navButtonsAlwaysVisible={!isFullscreen ? true : false} className="img-carousel" autoPlay={false} >
            {
                listing.images.map( (image, i) => <Item key={i} item={image}  isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen}/> )
            }
        </Carousel>
        </div>
    )
}

function Item(props)
{   
    return (
        <Paper className="img-paper" sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
            <Box className={`image-container ${props.isFullscreen ? 'fullscreen-container' : ''}`} sx={{display: 'flex', justifyContent: 'center'}} onClick={(e) => props.toggleFullscreen(e)}>
            <img className={`carousel-img${props.isFullscreen ? 'fullscreen-img' : ''}`} src={props.item.url} onClick={props.toggleFullscreen} ></img>
            </Box>
            <p>{props.item.description}</p>
        </Paper>
    )
}
