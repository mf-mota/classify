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



export default function NewListingStep0({props}) {
    const {locations, setLocations, categories, setCategories, setStep, setListing} = props
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const getLocations = async () => {
        try {
            const res = await api.get('/locations')
            return res
        } catch (e) {
            console.log("An error occurred retrieving the locations: ", e)
        }
    }
    const getCategories = async () => {
        try {
            const res = await api.get('/subcategories')
            console.log("cat: ", res)
            return res
        } catch (e) {
            console.log("An error occurred retrieving the categories: ", e)
        }
    }


    const handleError = (errors) => console.log("Errors: ", errors)

    const handleNext = (data) => {
        setListing(listing => ({...listing, ...data}))
        errors ? setStep(step => step + 1) : null
    }

    useEffect(() => {
        getLocations().then((locations) => {
            const locArray = locations.data
            locArray.sort((a, b) => {
                const compareState = a.state.localeCompare(b.state)
                if (compareState !== 0) return compareState
                return a.city.localeCompare(b.city);
            })
            setLocations(locArray)
            console.log(locArray)
        })
        getCategories().then((categories) => {
            console.log(categories.data)
            const catArr = categories.data
            catArr.sort((a, b) => {
                const compareMain = a.main.name.localeCompare(b.main.name)
                if (compareMain !== 0) return compareMain
                return a.name.localeCompare(b.name)
            })
            setCategories(catArr)
            console.log(catArr)
        })
    }, [])

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
            Let&apos;s create a new Listing!
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleNext, handleError)} sx={{ mt: 6, minWidth: '100%', minHeight: '50vh'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth {...register("location", {required: {value: true, message: "Location required"}})}>
                    <InputLabel>Location</InputLabel>
                        <Select
                            fullWidth
                            label="location"
                            id="location"
                            name="location"

                        >   
                            {locations.map(l => {
                                return (
                                <MenuItem key={l.id} value={l.id}>
                                    {l.district && l.district + ", "} {l.city}, {l.state}
                                </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth {...register("category", {required: {value: true, message: "Category required"}})}>
                    <InputLabel>Category</InputLabel>
                        <Select
                            fullWidth
                            label="category"
                            id="category"
                            name="category"
                        >   
                            {categories.map(c => {
                                return (
                                <MenuItem key={c.id} value={{id: c.id, props: {
                                    prop1: c.main.prop1_name,
                                    prop2: c.main.prop2_name,
                                    prop3: c.main.prop3_name,
                                    prop4: c.main.prop4_name,
                                }
                                }}>
                                    {c.main.name} &gt; {c.name}
                                </MenuItem>
                                )
                            })}
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