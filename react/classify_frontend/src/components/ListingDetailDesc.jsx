import { Card, Typography } from "@mui/material"
import { Grid } from "@mui/material"
import ListingDetailKeyProps from './ListingDetailKeyProps'

export default function ListingDetailDesc({desc, props}) {
    return (
        <Card sx={{border: '2px solid #00000055', maxHeight: '100%', borderRadius: '1rem', backgroundColor: 'white', boxShadow: '5px 5px 5px #00000052', px: '2rem', py: '1rem', mb: '1rem'}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6">Details & Description</Typography>
                    <Typography variant="p" color="primary">{desc}</Typography>
                </Grid>
                <Grid item xs={12} md={4} >
                    <ListingDetailKeyProps props={props} />
                </Grid>
            </Grid>
        </Card>
    )
}

