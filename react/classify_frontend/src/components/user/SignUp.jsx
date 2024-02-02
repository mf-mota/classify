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
import { useState } from 'react';


export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });
    const navigate = useNavigate();
    const [serverErrors, setServerErrors] = useState([])
    const handleRegistration = async (data) => {
        await api.post('user-account/register/', data)
            .then(() => navigate('/'))
            .catch((e) => {
                if (e.response && e.response.data) {
                    const keys = Object.keys(e.response.data)
                    if (keys.length > 0) {
                        const foundErrors = keys.map((key) => {
                            return e.response.data[key].toString()
                        })
                        setServerErrors(foundErrors)
                    }
                }
                else {
                    const connError = ["Sorry, a server error occurred",  "Please try again later!"]
                    setServerErrors(connError)
                }
            }  
            )
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
            Sign up at Classify! 
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleRegistration, handleError)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    autoComplete="given-name"
                    name="first_name"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    {...register("first_name", {...signUpOptions.firstName, 
                        onChange: () => resetErrors()
                    })}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="last_name"
                    {...register("last_name", {...signUpOptions.lastName, 
                        onChange: () => resetErrors()
                    })}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    {...register("email", {...signUpOptions.email, 
                        onChange: () => resetErrors()
                    })}
                /> 
                </Grid>
                <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    {...register("username", {...signUpOptions.username, 
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
                    {...register("password", {...signUpOptions.password, 
                        onChange: () => {resetErrors()}
                    })}
                />
                </Grid>
                <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="Sign up for newsletters"
                />
                </Grid>
            </Grid>
            <Grid container justifyContent="center" flexDirection="column" mt={2} aria-label="Validation Errors">
                {Object.keys(errors).map((fieldName) => { 
                    return (
                        <div key={uuid()} style={{alignSelf: 'center'}}>
                            <Typography color="red" variant="p" sx={{display: 'block'}}> {errors[fieldName].message}</Typography>
                        </div>
                    )
                })}
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
                Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                <Link href="#" variant="body2">
                    Already have an account? Sign in
                </Link>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </Container>
    );
}