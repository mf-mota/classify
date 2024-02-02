import { Typography } from "@mui/material"
import { Box } from "@mui/material"
import React from "react";
import { TableContainer, Table, Paper, TableBody, TableCell, TableRow } from "@mui/material";
import {v4 as uuid} from 'uuid'
export default function ListingDetailKeyProps({props, vals}) {
    if (!props) return "Loading"
    let rows = []
    props.map(p => rows.push({name: p, value: "value"}))

    return (
        <Box sx={{ ml: {md: '5rem'}, boxSizing: 'border-box', }}>
            <Typography variant="h6"sx={{textAlign: 'center', fontFamily: 'roboto', fontWeight: 700, color: '#232D3F'}}>Key Facts</Typography>
            <Box borderTop={'2px solid #232D3F'} key={uuid()}>
            {props?
            props.map((p, ix) => {
                {if (typeof(p) === "undefined") return}
                return (
                    <React.Fragment key={uuid()}>
                    <Box sx={{display: 'inline-block', width: '50%', fontWeight: 'bold'}} key={`${ix}-01`}>
                        <div style={{fontFamily: 'roboto', textAlign: 'center', color: "#2196f3"}}>{p}</div>
                    </Box>
                    <Box sx={{display: 'inline-block', width: '50%'}} key={`${ix}-2`}>
                        <div style={{fontFamily: 'roboto', textAlign: 'center'}}>{vals[ix]}</div>
                    </Box>
                    </React.Fragment>

                )}) : ""}
            </Box>
        </Box>
    )
}










