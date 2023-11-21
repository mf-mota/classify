import { Card, Typography } from "@mui/material"

export default function ListingDetailDesc({desc}) {
    return (
        <Card sx={{border: '2px solid #00000055', maxHeight: '100%', borderRadius: '1rem', backgroundColor: 'white', boxShadow: '5px 5px 5px #00000052', px: '2rem', py: '1rem', mb: '1rem'}}>
            <Typography variant="h6">Details & Description</Typography>
            <Typography variant="p" color="primary">{desc}</Typography>
        </Card>
    )
}

