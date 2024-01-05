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

    const listings_props = listing.main_category ? Object.keys(listing.main_category)
        .filter(value => value.startsWith("prop")).map(v => {
            if (listing.main_category[v] !== "") {
                return listing.main_category[v]
            }
        }

        ) : [];
    
    const listing_prop_vals = [listing.cat_text_prop_1, listing.cat_text_prop_2, listing.cat_num_prop_3, listing.cat_num_prop_4]
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
        {console.log(listings_props)}

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
                <ListingDetailDesc desc={listing.description} props={listings_props} vals={listing_prop_vals}/>  
            </Grid>
        </Grid>
        </>
    )
}