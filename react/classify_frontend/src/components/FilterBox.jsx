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
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import SelectR from 'react-select';


export default function FilterBox({params}) {
    const {searchParams, setSearchParams} = params;
    const [locations, setLocations] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([])
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
        setSearchParams({...watchFields, location: selectedLocation.value})
        console.log("params", searchParams)
        console.log(watchFields, selectedLocation.value)
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
      
          // Add a group on top with "All" and an empty string value
          groupedLocs.unshift({
            label: "All",
            options: [{ label: "Any (Poland)", value: "" }],
          });
      
          return groupedLocs;
        } catch (error) {
          console.error("Error while grouping locations:", error);
          return [];
        }
      };

    useEffect(() => {
        groupLocations().then(l => setLocations(l))
        setSelectedLocation({
        label: "Location", value: "" },
          );
    }, [])

    useEffect(() => {
        handleSubmit(handleFilter)
    }, [watchFields])

    return (
        <Container component="main" sx={{width: '100%', mt: 0}}>
        <CssBaseline />
        <Box
            sx={{
            marginTop: 0,
            marginBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Box component="form" noValidate sx={{ mt: 3, mb: 3, minWidth: '40vw'}}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <SelectR
                            fullWidth
                            label="location"
                            id="location"
                            name="location"
                            placeholder="Location"
                            options={locations}
                            value={selectedLocation}
                            onBlur={handleFilter}  // This will trigger the filter on blur

                            onChange={(selectedOption) => {
                                setSelectedLocation(selectedOption);
                                handleFilter();
                            }
                            }
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
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <SelectR
                            fullWidth
                            label="category"
                            id="category"
                            name="category"
                            placeholder="Category"
                            options={locations}
                            value={selectedLocation}
                            onBlur={handleFilter}  // This will trigger the filter on blur

                            onChange={(selectedOption) => {
                                setSelectedLocation(selectedOption);
                                handleFilter();
                            }
                            }
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
                        onBlur={handleFilter}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        type="number"
                        id="price"
                        label="Price from"
                        name="price"
                        {...register("min_price",  
                        )}
                        
                        sx={{zIndex: 0}}
                        onBlur={handleFilter}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        type="number"
                        id="price"
                        label="Price to"
                        name="price"
                        sx={{zIndex: 0}}
                        {...register("max_price",  
                        )}
                        onBlur={handleFilter}
                    />
                </Grid>
                </Grid>
            </Box>
        </Box>
        </Container>
    
    );
}
