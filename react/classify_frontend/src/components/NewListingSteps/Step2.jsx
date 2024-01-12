import api from '../../api/apiConn'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import {Input} from '@mui/material';
import { useState } from 'react';
import usePrivApi from '../../utils/hooks/usePrivApi';


export default function Step2({props}) {
    const {setStep, setListing, defVals, setListingUpdate} = props
    const [uploading, setUploading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const handleError = (errors) => console.log("Errors: ", errors)

    const handleNext = async (data) => {
        if (data?.mainImage?.length > 0) {
            setUploading(true)
            const res = await uploadImages(data.mainImage)
            console.log(res.data.urls)
            setListing(listing => ({...listing, mainImage: res.data.urls[0]}))
            setUploading(false)
        }

        if (data?.otherImages?.length) {
            setUploading(true)
            const res2 = await uploadImages(data.otherImages)
            setListing(listing => ({...listing, otherImages: res2.data.urls}))
            setUploading(false)
            }
            errors ? setStep(step => step + 1) : null
        }

    const api = usePrivApi()

    const handleDelete = async (id) => {
        try {
            const res = api.delete(`/images/${id}`)
            console.log("delete res", res)
            setListingUpdate((o) => (o+1))
        }
        catch (e) {
            console.log("Could delete..", e)
        }
    }

    const uploadImages = async (data) => {
        try {
            const formData = new FormData();
            console.log(data)
            console.log("length", data.length)
            for (let file of data) {
                formData.append('images', file);
            }
            const url = api.post('/upload_listing_images/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }})
            console.log("image(s) uploaded")
            return url
        } catch (e) {
            console.log("An error occurred uploading your images: ", e)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
            Please share some pictures!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleNext, handleError)} sx={{ mt: 6, minWidth: '40vw', minHeight: '50vh'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <InputLabel>Main Image</InputLabel>

                        {defVals ? 
                        defVals.images.map(i => 
                        (i.is_main && (
                            <Box key={i.id} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <img src={i.url} style={{maxWidth: '20vw', maxHeight: '30vh'}}></img>
                                <Button size="small" onClick={() => handleDelete(i.id)} sx={{backgroundColor: 'gray', color: 'white', fontWeight: 700, my: 3}}>Delete</Button>
                            </Box>
                        ))
                        ) : ""}
                        <FormControl fullWidth>
                            <Input
                                {...register("mainImage", !defVals?.images.some(image => image.is_main) ? {
                                    required: "Main image is required",
                                } : "")}
                                type="file"
                                id="picture"
                                disabled={defVals? defVals.images.some(image => image.is_main) : false}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <InputLabel>Remaining Images</InputLabel>
                    <Grid container spacing={2} sx={{textAlign: 'center', mt: 4}}>
                    {defVals? defVals.images.map(i => 
                        (!i.is_main &&  
                            <Grid item xs={5} md={5} key={i.id} sx={{mx: 2}} > 
                                <img src={i.url} style={{width: '100%', height: '20vh', objectFit: 'contain'}}></img>
                                <Button size="small" onClick={() => handleDelete(i.id)} sx={{backgroundColor: 'gray', color: 'white', fontWeight: 700, my: 3}}>Delete</Button>

                            </Grid>
                        )) : ""}
                        </Grid>
                        <FormControl fullWidth>
                            <Input
                                {...register("otherImages", !defVals?.images.some(image => !image.is_main) ? {
                                    required: "Please add at least 1 image to remaining images"
                                } : {})}
                                inputProps={{ multiple: true }}
                                type="file"
                                id="picture"
                            />
                        </FormControl>
                    </Grid>           
                </Grid>
            <Grid container justifyContent="center" flexDirection="column" mt={2} aria-label="Validation Errors">
                {console.log(Object.keys(errors))}
                {Object.keys(errors).map((fieldName) => { 
                    return (
                        <div key={uuid()} style={{alignSelf: 'center'}}>
                            <Typography color="red" variant="p" sx={{display: 'block'}}> {errors[fieldName].message}</Typography>
                        </div>
                    )
                })}
            </Grid>
            {uploading && <Typography component="p" variant="h7" sx={{my: 0, textAlign: 'center'}}>
                  Uploading images...
            </Typography>}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 6, mb: 2 }}
            >
                Next &gt;&gt;
            </Button>

            </Box>
        </Box>
        </Container>
    );
}