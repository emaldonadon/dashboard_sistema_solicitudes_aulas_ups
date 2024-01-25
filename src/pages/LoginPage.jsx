import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import edificio_f from './../assets/edificio_f.jpg'
import Logo_ups from './../assets/Logo_ups.png'
import { login } from '../redux/actions/account/authActions'

import InputValidation from '../components/utils/InputValidation';

const theme = createTheme();

export const LoginPage = () => {

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { error, loading } = userLogin
    const [email, setEmail] = useState({ campo: '', valido: true })
    const [password, setPassword] = useState({ campo: '', valido: null })

    const submitHandler = (e) => {
        e.preventDefault()
        if (email.valido === true && password.valido === true) {
            dispatch(login({
                'email': email.campo,
                'password': password.campo
            }))
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />

                {/* FORM */}

                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box pb={2}>
                            <img width={250} src={Logo_ups} alt="" />
                        </Box>
                        <Paper elevation={3}>
                            <Box px={2} pb={2} pt={2}>
                                {/* <TextField
                                    margin="normal"
                                    fullWidth
                                    id="correo"
                                    label="Correo"
                                    name="correo"
                                    size='small'
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    size='small'
                                /> */}
                                <InputValidation
                                    estado={email}
                                    cambiarEstado={setEmail}
                                    type="email"
                                    label="Correo electrónico"
                                    name="email"
                                />

                                <InputValidation
                                    estado={password}
                                    cambiarEstado={setPassword}
                                    type="password"
                                    label="Contraseña"
                                    name="password"
                                    helperText="Minimo 8 caracteres"
                                    patterns={/^.{8,30}$/}
                                />
                                <Box pb={2}>
                                    <Button
                                        disabled={!password.campo || !email.campo || !email.valido || !password.valido}
                                        onClick={submitHandler}
                                        fullWidth
                                        variant="contained"
                                        size='small'
                                    >
                                        Iniciar sesion
                                    </Button>
                                </Box>
                                {/* <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </Grid>
                                </Grid> */}
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
                {/* BACKGROUND IMAGE */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${edificio_f})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
        </ThemeProvider>
    );
}