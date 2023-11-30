import { useParams } from "react-router-dom"
import Grid from '@mui/joy/Grid';
import ListingCarousel from './components/ListingCarousel'
import { useState, useEffect } from "react";
import api from './api/apiConn'
import ListingOwnerCard from "./components/ListingOwnerCard";
import ListingDetailPrice from './ListingDetailPrice'
import ListingDetailDesc from "./components/ListingDetailDesc";

export default function Listing() {
    const {id} = useParams()
    const [listing, setListing] = useState([])
    useEffect(() => {
        async function getListing() {
            try {
                const res = await api.get(`/listings/${id}`);
                console.log(res.data);
                if (res && res.data) {
                    setListing(res.data);
                }
            } catch (e) {
                console.log("An error occurred while retrieving the request classified ad", e);
            }
        }
        getListing()
    }, [])
    return (
        <>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
            {/* <Grid xs={12} md={8}>
                <ListingDetailPrice price={listing.price} />
            </Grid> */}
            <Grid xs={12} md={8}>
                <ListingCarousel listing={listing}/>

            </Grid>
            <Grid xs={12} md={4} sx={{display: 'flex', flexDirection: 'column', justifyContent: "center"}}>
                <ListingDetailPrice price={listing.price} />
                <ListingOwnerCard user={listing.owner} location={listing.location}/>
            </Grid>
            <Grid xs={12}>
                <ListingDetailDesc desc={listing.description} props={listing.spec_props}/>  
            </Grid>
        </Grid>
        </>
    )
}