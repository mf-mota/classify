import Avatar from '@mui/material/Avatar';
import api from '../../api/apiConn'
// import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'
import { v4 as uuid } from 'uuid'
import { signUpOptions } from '../../utils/validations'
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import JwtAuthContext from '../../context/JwtAuthContext'


export default function SignIn() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });      
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState([])
    const {login} = useContext(JwtAuthContext)
    const handleRegistration = async (data) => {
        login(data, setServerErrors)
    };

    const resetErrors = () => {
        serverErrors.length > 0 && setServerErrors([])
    }

    const handleError = (errors) => console.log("Errors: ", errors)

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: '#232D3F' }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleRegistration, handleError)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    {...register("username", { required: true,
                        onChange: () => resetErrors()
                    })}
                /> 
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    {...register("password", {required: true, 
                        onChange: () => {resetErrors()}
                    })}
                />
                </Grid>
            </Grid>
            <Grid container justifyContent="center" flexDirection="column" mt={2} aria-label="Validation Errors">
                {serverErrors.map((error) => {
                    return (
                    <div key={uuid()} style={{alignSelf: 'center'}}>
                        <Typography color="red" variant="p" sx={{display: 'block'}}> {error}</Typography>
                    </div>
                    )
                })}

            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            </Box>
        </Box>
        </Container>
    );
}