import api from '../../api/apiConn'
// import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { signUpOptions } from '../../utils/validations'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import { listingOptions } from '../../utils/listingValidations'






export default function Step1({props}) {
    const {listing, setStep, setListing} = props
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const handleError = (errors) => console.log("Errors: ", errors)

    const handleNext = (data) => {
        setListing(listing => ({...listing, ...data}))
        errors ? setStep(step => step + 1) : null
    }

    const getCatProps = () => {
        api.get('/')
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
            Please enter the details
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleNext, handleError)} sx={{ mt: 6, minWidth: '40vw', minHeight: '50vh'}}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="name"
                        {...register("name", {...listingOptions.title, 
                        })}
                    />
                    </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        type="number"
                        id="price"
                        label="Price (PLN)"
                        name="price"
                        {...register("price", {...listingOptions.price, 
                        })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="description"
                        multiline
                        rows={6}
                        label="Description"
                        name="description"
                        {...register("description", {...listingOptions.description, 
                        })}
                    />
                </Grid>
                {console.log(listing, "from step1")}
                {listing?.category ? Object.keys(listing.category.props).map((key) => {
                    if (listing.category.props[key] !== "") {
                    return (
                    <Grid key={key} item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id={listing.category.props[key]}
                            label={listing.category.props[key]}
                            name={listing.category.props[key]}
                            {...register(`props.${key}`, {...listingOptions[listing.category.props[key]], 
                            })}
                        />
                        </Grid>
                    )
                    }
                }) : null }
                
                
            </Grid>
            <Grid container justifyContent="center" flexDirection="column" mt={2} aria-label="Validation Errors">
                {console.log(Object.keys(errors))}
                {Object.keys(errors).map((fieldName) => {
                    if (fieldName === "props") {
                        return Object.keys(errors['props']).map(prop => {
                            return (
                                <div key={uuid()} style={{alignSelf: 'center'}}>
                                    <Typography color="red" variant="p" sx={{display: 'block'}}>{errors.props[prop].message}</Typography>
                                </div>
                            )
                        })
                    }
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