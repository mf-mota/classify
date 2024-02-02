import api from '../../api/apiConn'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import ListingCard from '../Listing/ListingCard'
import { useParams } from 'react-router-dom'

export default function FoundListingsGrid ({detailSearch, mainCat, setResNumber, setPrev, setNext, page}) {
    // const {detailSearch, curUrlCat} = props;
    const [listings, setListings] = useState([])
    // const {detail, data} = detailSearch
    useEffect(() => {
        const getListings = async () => {
                try {
                if (!detailSearch) {
                    console.log("Headers")
                    const res = await api.get('/listings'+ page !== 1 ? "/?page="+page : "");
                    console.log(res)
                    if (res && res.data) setListings(res.data.results);
                    setResNumber(res.data.count)
                    console.log("res.data", res.data)
                }
                else {
                    // http://localhost:8000/api/listings/?max_price=300000
                    const searchParamsKeys = Object.keys(detailSearch);
                    var query = String()
                    if (page !== 1) query += `page=${page}&`
                    const mappedKeys = searchParamsKeys.map((k) => {
                        if (detailSearch[k] !== "") {
                            const res = `${k}=${detailSearch[k]}&`;
                            query += res;
                            return res
                        }
                        return
                    }).filter(p => p !== undefined)
                    console.log("Mapped keys: ", mappedKeys)
                    const res = await api.get(`/listings/?${mainCat !== "undefined" ? "main_cat=" + mainCat + "&": ""}${query}`);
                    console.log("query", query, "page", page)
                    console.log("res", res)
                    if (res && res.data) {
                        setListings(res.data.results);
                        setResNumber(res.data.count);
                        setPrev(res.data.previous);
                        setNext(res.data.next);
                    }
                }

            } catch (e) {
                console.log("An error occurred while retrieving the data", e);
            }
        }
        getListings()
    }, [detailSearch, page, mainCat])
    return (
    <Box component="main" display="flex"
            sx={{justifyContent: "space-around", flexWrap: "wrap"}}>
        {listings.map(l => {
            return <ListingCard key={l.id} details={l} sx={{ maxWidth: 345 }}/>
        })}
    </Box>)
}