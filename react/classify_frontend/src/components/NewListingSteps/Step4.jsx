import usePrivApi from '../../utils/hooks/usePrivApi';
// import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import '../../assets/styles/ListingCreation.css'
import { Navigate } from 'react-router-dom';

export default function Step4({props}) {
    const [loading, setLoading] = useState(true)
    const {setStep, setListing, listing} = props
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const api = usePrivApi()

    useEffect(() => {
        try {
            const formData = new FormData();
            formData.append('category', listing.category.id)
            formData.append('location', listing.location)
            formData.append('name', listing.name)
            formData.append('price', listing.price)
            formData.append('cat_spec_properties', listing.props)
            formData.append('description', listing.description)
            formData.append('is_active', listing.is_active)
    
            api.post('/listings/', formData).then(res => {
                const listing_id = res.data.id
                const images = []
                
                const main_image = {
                    listing: listing_id,
                    is_main: true,
                    url: listing.mainImage
                }
                images.push(JSON.stringify(main_image))
                listing.otherImages?.map(i => {
                    return images.push(JSON.stringify({
                        listing: listing_id,
                        is_main: false,
                        url: i
                    }))
                })
                api.post('/listings/images/', images).then(res => {
                    console.log("images res: ", res)
                })
                setLoading(false)

                
            })
            console.log("success")
        } catch (e) {
            console.log("An error occurred while sending your data: ", e)
        }

    })

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '50vh'
            }}
        >
            {loading ? (
            <Typography component="h1" variant="h5" textAlign="center" className="pulse" >
            Creating your listing ...
            </Typography>
            ) : 
            <Navigate to="/profile/"/>
            }
        </Box>
        </Container>
    );
}