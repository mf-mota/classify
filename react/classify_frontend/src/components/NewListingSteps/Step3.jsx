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
import { useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';





export default function Step3({props}) {
    const {setStep, setListing} = props
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
            <Typography component="h1" variant="h5" textAlign="center">
            One last thing! 
            </Typography>
            <Typography component="h1" variant="h6" textAlign="center">
            Would you like to set your listing to active?
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleNext, handleError)} sx={{ mt: 6, minWidth: '100%', minHeight: '50vh'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth {...register("is_active", {required: {value: true, message: "Status required"}})}>
                    <InputLabel>Status</InputLabel>
                        <Select
                            fullWidth
                            label="Status"
                            id="is_active"
                            name="is_active"

                        >   
                            <MenuItem value="active">
                                Active
                            </MenuItem>
                            <MenuItem value="draft">
                                Draft
                            </MenuItem>

                        </Select>
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