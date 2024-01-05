import api from '../api/apiConn'
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
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import SelectR from 'react-select';


export default function FilterBox() {
    const [locations, setLocations] = useState([])
    const [filters, setFilters] = useState([])
    const [selectedLocation, setSelectedLocation] = useState(null);
    const {
        register,
        handleSubmit,
        watch,
    } = useForm({ mode: "onChange" });
    const watchFields = watch();
    const handleError = (errors) => console.log("Errors: ", errors)
    const getLocations = async () => {
        try {
            const res = await api.get('/locations')
            console.log(res.data)
            return res
        } catch (e) {
            console.log("An error occurred retrieving the locations: ", e)
        }
    }
    const handleFilter = () => {
        console.log()
        console.log(watchFields, selectedLocation)
        // setFilters(filters => ({...filters, ...data}))
        // console.log(...filters, ...data)
    }
    const getCatProps = () => {
        api.get('/')
    }
    const groupLocations = async () => {
        try {
            const locs = await getLocations();
            const locArray = locs.data;
    
            // Sort locations by state and city
            locArray.sort((a, b) => {
                const compareState = a.state.localeCompare(b.state);
                if (compareState !== 0) return compareState;
                return a.city.localeCompare(b.city);
            });
    
            // Group locations by state
            const groupedLocs = locArray.reduce((acc, location) => {
                const existingGroup = acc.find((group) => group.label === location.state);
    
                if (existingGroup) {
                    existingGroup.options.push({
                        label: `${location.district ? location.district + ', ' : ''}${location.city}`,
                        value: location.id,
                    });
                } else {
                    acc.push({
                        label: location.state,
                        options: [
                            {
                                label: `${location.district ? location.district + ', ' : ''}${location.city}`,
                                value: location.id,
                            },
                        ],
                    });
                }
    
                return acc;
            }, []);
    
            setLocations(groupedLocs);
            return groupedLocs;
        } catch (e) {
            console.log("An error occurred while grouping the locations: ", e);
        }
    };
    

    useEffect(() => {
        groupLocations().then(l => setLocations(l))
    }, [])

    useEffect(() => {
        handleSubmit(handleFilter)
    }, [watchFields])

    return (
        <Container component="main" sx={{width: '100%'}}>
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Box component="form" noValidate sx={{ mt: 6, minWidth: '40vw', minHeight: '50vh'}}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth {...register("location")}>
                        <SelectR
                            fullWidth
                            label="location"
                            id="location"
                            name="location"
                            placeholder="Location"
                            options={locations}
                            value={selectedLocation}
                            onBlur={handleFilter}  // This will trigger the filter on blur

                            onChange={(selectedOption) => setSelectedLocation(selectedOption)}
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: '#00000000',
                                    height: '100%',
                                    width: '100%',

                                }),
                            }}


                        >   

                        </SelectR>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        id="title"
                        label="Title"
                        name="name"
                        sx={{zIndex: 0}}
                        {...register("title",
                        )}
                        onChange={handleFilter}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        type="number"
                        id="price"
                        label="Price from"
                        name="price"
                        {...register("price-from",  
                        )}
                        
                        sx={{zIndex: 0}}
                        onChange={handleFilter}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        type="number"
                        id="price"
                        label="Price to"
                        name="price"
                        sx={{zIndex: 0}}
                        {...register("price-to",  
                        )}
                        onChange={handleFilter}
                    />
                </Grid>
                </Grid>
            </Box>
        </Box>
        </Container>
    
    );
}
