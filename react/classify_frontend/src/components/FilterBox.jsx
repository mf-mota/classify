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
import {groupLocations} from '../utils/getGroupedLocs'
import React from 'react'


export default function FilterBox({params}) {
    const {searchParams, setSearchParams, main} = params;
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
    const handleFilter = () => {
        setSearchParams((prevParams) => ({...prevParams, ...watchFields, 
            location: selectedLocation.value, 
            category: selectedCategory.value}))
    }
    const getCatProps = async () => {
        console.log("main", main)
        try {
            const res = await api.get(`/subcategories/${main ? "?main_cat="+main : ""}`)
            const categories_data = [{value: "", label: "All Subcategories"}]
            res.data.map(el => {
                return categories_data.push({value: el.id, label: el.name})
            })
            setCategories(categories_data)
        } catch (e) {
            console.log("An error occurred while retrieve the subcategories. ", e)
        }

    }
    const getCatSpecFilters = async () => {
        try {
            const res = await api.get(`/maincat-details${main ? "?id="+main : ""}`)
            setFilters(res.data)
            console.log("filters", res.data)
            
        } catch (e) {
            console.error("Could get category specific filter info... ", e)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
          try {
            const locs = await groupLocations();
            setLocations(locs);
            setSelectedLocation({
                label: "Location", value: "" },
                  );
            setSelectedCategory({
                label: "Subcategories", value: ""
            })
          } catch (error) {
            console.error('Error fetching locations:', error);
          }
        };
        fetchData();
        getCatProps();
        getCatSpecFilters();
    }, []);

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
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <SelectR
                            fullWidth
                            label="category"
                            id="category"
                            name="category"
                            placeholder="Subcategory"
                            options={categories}
                            value={selectedCategory}
                            onBlur={handleFilter}  // This will trigger the filter on blur

                            onChange={(selectedOption) => {
                                setSelectedCategory(selectedOption);
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
                <Grid item xs={6}>
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
                <Grid item xs={4}>
                    <TextField
                        id="title"
                        label="Title"
                        name="name"
                        sx={{zIndex: 0, width: '100%'}}
                        {...register("title",
                        )}
                        onBlur={handleFilter}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        type="number"
                        id="price"
                        label="Price from"
                        name="price"
                        {...register("min_price",  
                        )}
                        
                        sx={{zIndex: 0, width: '100%'}}
                        onBlur={handleFilter}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        type="number"
                        id="price"
                        label="Price to"
                        name="price"
                        sx={{zIndex: 0, width: '100%'}}
                        {...register("max_price",  
                        )}
                        onBlur={handleFilter}
                    />
                </Grid>
                {filters.map(obj => {
                    console.log(Object.keys(obj))
                    return Object.keys(obj).map(key => {
                        if ((key.startsWith("prop1") || key.startsWith("prop2")) && obj[key] !== "")  {
                            console.log("key", obj[key])
                            return (
                                <Grid item xs={4} key={key}>
                                    <TextField
                                        type="text"
                                        id={obj[key]}
                                        label={obj[key]}
                                        placeholder={obj[key]}
                                        name={obj[key]}
                                        sx={{zIndex: 0, width: '100%'}}
                                        {...register(`ct${key[4]}`,  
                                        )}
                                        onBlur={handleFilter}
                                />
                                </Grid>
                            )
                        }
                        else if ((key.startsWith("prop3") || key.startsWith("prop4")) && obj[key] !== "")
                        {
                            return (
                                <React.Fragment key={key}>
                                <CssBaseline />
                                <Grid item xs={4}>
                                    <TextField
                                        type="number"
                                        id={obj[key]+"_from"}
                                        label={"Min "+obj[key]}
                                        name={obj[key]+"_from"}
                                        sx={{zIndex: 0, width: '100%'}}
                                        {...register(`ct${key[4]}_min`,  
                                        )}
                                        onBlur={handleFilter}
                                    />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    type="number"
                                    id={obj[key]+"_to"}
                                    label={"Max "+obj[key]}
                                    name={obj[key]+"_to"}
                                    sx={{zIndex: 0, width: '100%'}}
                                    {...register(`ct${key[4]}_max`,  
                                    )}
                                    onBlur={handleFilter}
                                />
                            </Grid>
                            </React.Fragment>
                            )
                        }
                        else {
                            return
                        }
                    }
                )
                })}
                </Grid>
            </Box>
        </Box>
        </Container>
    );
}
