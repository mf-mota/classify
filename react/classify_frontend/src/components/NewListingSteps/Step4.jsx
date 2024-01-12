import usePrivApi from '../../utils/hooks/usePrivApi';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { useEffect, useState } from 'react';
import '../../assets/styles/ListingCreation.css'
import { Navigate } from 'react-router-dom';


export default function Step4({props}) {
    const [loading, setLoading] = useState(true)
    const {setStep, setListing, listing, defVals} = props
    const {
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const api = usePrivApi()

    useEffect(() => {
        console.log("listing beginning", listing)
        const formData = new FormData();
        const prepareForm = (formData) => {
            try {
                formData.append('category', listing.category.id)
                formData.append('location', listing.location)
                formData.append('name', listing.name)
                formData.append('price', listing.price)
                Object.keys(listing).map(k => {
                    if (k.slice(0, 4) === "cat_") {
                        formData.append(k, listing[k])
                    }
                })
                console.log("formData after appending props", formData)
                formData.append('description', listing.description)
                formData.append('is_active', listing.is_active)

                console.log("formData", formData)
            } catch (e) {
                console.log("An error occurred while sending your data: ", e)
            }
        }

        const appendImages = async (listing_id) => {
            const images = []

            if (listing.mainImage) {
                const main_image = {
                listing: defVals ? defVals.id : listing_id,
                is_main: true,
                url: listing.mainImage
                }
                images.push(JSON.stringify(main_image))
            }

            listing.otherImages?.map(i => {
                return images.push(JSON.stringify({
                    listing: defVals ? defVals.id : listing_id,
                    is_main: false,
                    url: i
                }))
            })
            console.log("images", images)
            const res2 = await api.post('/listings/images/', images);
            console.log("images res: ", res2)
        }

        const createListing = async (formData) => {
            try {
                const res = await api.post('/listings/', formData)
                const listing_id = res.data.id
                await appendImages(listing_id)
            } 
            catch (e) {
                console.log("There was an error appending images to the listings. ", e)
            }
        }

        const editListing = async (formData) => {
            try {
                console.log("edit...")
                const res = await api.patch(`/listings/${defVals.id}/`, formData)
                if (listing.otherImages || listing.mainImage) {
                    console.log("listing has other images or main image....")
                    await appendImages()
                }
            } catch (e) {
                console.log("Could not update listing....", e)
            }
        }
        prepareForm(formData);
        defVals ? editListing(formData) : createListing(formData);
        setLoading(false);
        }
    , []);

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