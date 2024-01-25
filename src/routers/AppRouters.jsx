import React, { useState, useEffect } from 'react'
import { Box, CssBaseline } from '@mui/material';
import {
    BrowserRouter,
    Routes,
    Route,
    HashRouter
} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Header } from '../components/appbar/Header';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { auth } from '../firebase'
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { authState } from '../redux/actions/account/authActions';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SolicitudesSoportePage } from '../pages/solicitudes/SolicitudesSoportes/SolicitudesSoportePage';
import { CrearUsuario } from '../pages/usuarios/CrearUsuario';
import { ListaUsuarios } from '../pages/usuarios/ListaUsuarios';
import { CrearEdificio } from '../pages/Edificios/CrearEdificio';
import { ListaEdificios } from '../pages/Edificios/ListaEdificios';
import { VerEdificioPage } from '../pages/Edificios/VerEdificio/VerEdificioPage';
import { SolicitudesAulas } from '../pages/solicitudes/SolicitudesAulas/SolicitudesAulas';
import { CrearSede } from '../pages/sedes/CrearSede';
import { ListaSedes } from '../pages/sedes/ListaSedes';
import { VerSedePage } from '../pages/sedes/VerSede/VerSedePage';
import { Imagen } from '../pages/Imagen';
import { CalendarPage } from '../pages/Calendario/CalendarPage';
import { Reservaciones } from '../pages/Calendario/Reservaciones';
import { CrearEspaciosFisicos, EspaciosFisicos } from '../pages/EspaciosFisicos/CrearEspaciosFisicos';
import { ListaEspaciosFisicos } from '../pages/EspaciosFisicos/ListaEspaciosFisicos';
import { CrearCampus } from '../pages/Campus/CrearCampus';
import { ListaCampus } from '../pages/Campus/ListaCampus';
import { HorarioPage } from '../pages/Horario/HorarioPage';
import { RegistroHorarioPage } from '../pages/Horario/RegistroHorarioPage';
import { RegistrosHorarioPage } from '../pages/HorarioProfesores/RegistrosHorarioPage';

export const AppRouters = () => {
    let theme = createTheme({
        typography: {
            fontFamily: 'Raleway, Arial',
        },
        palette: {
            primary: {
                main: '#2896eb',
            },
            background: {
                default: "#F4F6F6",
            },
        },
    });
    theme = responsiveFontSizes(theme);
    const dispatch = useDispatch();
    const [checking, setChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        auth.onAuthStateChanged(userAuth => {
            if (userAuth) {

                const authUser = auth.currentUser;


                console.log(userAuth, 'auth')
                userAuth.getIdTokenResult().then(getIdTokenResult => {
                    var rol = getIdTokenResult.claims.rol
                    var departamento = getIdTokenResult.claims.departamento
                    var cargo = getIdTokenResult.claims.cargo
                    console.log(userAuth.displayName)
                    dispatch(authState({
                        uid: userAuth.uid,
                        displayName: userAuth.displayName,
                        email: userAuth.email,
                        photoURL: userAuth.photoURL,
                        rol: rol,
                        departamento: departamento,
                        cargo: cargo
                    }))
                })
                setIsAuth(true)

            } else {
                setIsAuth(false)
            }
            setChecking(false);
        });
    }, [setIsAuth, setChecking])
    if (checking) {
        return ('')
    }
    return (
        <HashRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex' }}>
                    {isAuth && <Header />}
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, p: 0, width: isAuth ? { sm: `calc(100% - ${300}px)` } : '100%' }}
                    >
                        <Toolbar />
                        <Routes>
                            <Route path='/' element={
                                <PrivateRoute isAuth={isAuth}>
                                    <HomePage />
                                </PrivateRoute>
                            } />

                            <Route path='/account/login/' element={
                                <PublicRoute isAuth={isAuth}>
                                    <LoginPage />
                                </PublicRoute>
                            } />

                            <Route path="solicitudes">

                                <Route path='aulas' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <SolicitudesAulas />
                                    </PrivateRoute>
                                } />

                                <Route path='soportes' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <SolicitudesSoportePage />
                                    </PrivateRoute>
                                } />
                            </Route>

                            <Route path="edificios">
                                <Route path='crear-edificio' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <CrearEdificio />
                                        {/* <Imagen /> */}
                                    </PrivateRoute>
                                } />

                                <Route path='lista-de-edificios' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <ListaEdificios />
                                    </PrivateRoute>
                                } />

                                {/* <Route path='ver/:edificio' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <VerEdificioPage />
                                    </PrivateRoute>
                                } /> */}

                                <Route path='ver/:sede/:campus/:edificio' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <VerEdificioPage />
                                    </PrivateRoute>
                                } />

                            </Route>

                            <Route path="usuarios">
                                <Route path='crear-usuario' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <CrearUsuario />
                                    </PrivateRoute>
                                } />

                                <Route path='lista-de-usuarios' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <ListaUsuarios />
                                    </PrivateRoute>
                                } />

                            </Route>

                            <Route path="sedes">

                                <Route path='crear-sede' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <CrearSede />
                                    </PrivateRoute>
                                } />

                                <Route path='lista-de-sedes' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <ListaSedes />
                                    </PrivateRoute>
                                } />

                                <Route path='ver/:sede' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <VerSedePage />
                                    </PrivateRoute>
                                } />

                            </Route>

                            <Route path="campus">

                                <Route path='crear-campus' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <CrearCampus />
                                    </PrivateRoute>
                                } />

                                <Route path='lista-de-campus' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <ListaCampus />
                                    </PrivateRoute>
                                } />

                            </Route>

                            <Route path="Calendario">

                                <Route path='calendar' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <CalendarPage />
                                    </PrivateRoute>
                                } />

                            </Route>

                            <Route path="Reservaciones">

                                <Route path='espacios-fisicos' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <Reservaciones />
                                    </PrivateRoute>
                                } />
                            </Route>

                            <Route path="Espaciosfisicos">

                                <Route path='crear-espacios-fisicos' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <CrearEspaciosFisicos />
                                    </PrivateRoute>
                                } />

                                <Route path='lista-de-espacios-fisicos' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <ListaEspaciosFisicos />
                                    </PrivateRoute>
                                } />

                            </Route>
                            <Route path="Horario">

                                <Route path='horario' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <HorarioPage />
                                    </PrivateRoute>
                                } />

                                <Route path='Registro-Horario' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        <RegistroHorarioPage />
                                    </PrivateRoute>
                                } />
                            </Route>

                            <Route path="HorarioProfesor">

                                <Route path='horarioProfesor' element={
                                    <PrivateRoute isAuth={isAuth}>
                                        < RegistrosHorarioPage/>
                                    </PrivateRoute>
                                } />
                            </Route>
                        </Routes>
                    </Box>
                </Box>
            </ThemeProvider>
        </HashRouter>
    )
}