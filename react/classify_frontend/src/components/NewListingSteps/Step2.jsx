import api from '../../api/apiConn'
// import { useHistory } from 'react-router-dom'
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
import { signUpOptions } from '../../utils/validations'



export default function Step2({props}) {
    const {setStep, setListing} = props
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const handleError = (errors) => console.log("Errors: ", errors)

    const handleNext = (data) => {
        uploadImages(data.mainImage).then(res => {
            console.log(res.data.urls)
            setListing(listing => ({...listing, mainImage: res.data.urls[0]}))
        })
        data.otherImages && uploadImages(data.otherImages).then(res => {
            setListing(listing => ({...listing, otherImages: res.data.urls}))
        })
        errors ? setStep(step => step + 1) : null
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
                        <FormControl fullWidth>
                            <Input
                                {...register("mainImage", {
                                    required: "Main image is required",
                                })}
                                type="file"
                                id="picture"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <InputLabel>Remaining Images</InputLabel>
                        <FormControl fullWidth>
                            <Input
                                {...register("otherImages")}
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