import {
    Paper, ListItemText, Typography, Box, ListItemIcon, Drawer, Button,
    CardHeader, Divider, Toolbar, IconButton, Hidden, List, ListItem, CssBaseline
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import React, { useContext, useState } from 'react'
import { auth, db } from '../../firebase';
import { Avatar, ListItemButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { useSelector, useDispatch } from 'react-redux';
import { ProfileMenu } from './ProfileMenu';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { ListSolicitudes } from './listItem/ListSolicitudes';

import Logo_ups from './../../assets/Logo_ups.png'
import { ListEdificios } from './listItem/ListEdificios';
import { ListUsuarios } from './listItem/ListUsuarios';
import { ListSedes } from './listItem/ListSedes';
import { ListCalendario } from './listItem/ListCalendario';
import { ListReservarCursos } from './listItem/ListReservarCursos';
import { ListEspaciosFisicos } from './listItem/ListEspaciosFisicos';
import { ListCampus } from './listItem/ListCampus';
import { ListHorario } from './listItem/ListHorario';
import { ListProfesorHorario } from './listItem/ListProfesorHorario';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));
//   ROLES
const checkIsAdmin = async () => {
    try {
        const user = auth.currentUser;
        if (user) {
            const userDoc = await db.collection('usuarios').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                if (userData && userData.isAdmin !== undefined) {
                    return userData.isAdmin; // Retorna el valor de isAdmin (true o false)
                }
            }
        }
        return false; // Si no se encuentra el usuario o no tiene isAdmin, retorna false
    } catch (error) {
        console.error('Error al obtener el valor de isAdmin:', error);
        return false;
    }
};
const drawerWidth = 240;
export const Header = (props) => {
    const theme = useTheme();
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    React.useEffect(() => {
        const getIsAdmin = async () => {
            const adminValue = await checkIsAdmin();
            setIsAdmin(adminValue);
        };
        getIsAdmin();
    }, []);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const logoutHandler = () => {
        auth.signOut()
    }
    console.log(isAdmin)
    const drawer = (
        <>
            <Divider />
            <Toolbar style={{ justifyContent: 'center' }}>
                <img src={Logo_ups} alt="soei" width="100" />
            </Toolbar>
            <Divider />
            <List dense>
                <ListItemButton component={RouterLink} to={`/`}>
                    <ListItemIcon>
                        <HomeIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItemButton>
                {isAdmin ? (
                    <>
                        <ListSolicitudes />
                        <ListEdificios />
                        <ListUsuarios />
                        <ListSedes />
                        <ListCampus />
                        <ListCalendario />
                        <ListHorario />
                        <ListEspaciosFisicos />
                    </>
                ) : (
                    <>
                        <ListSolicitudes />
                        <ListProfesorHorario />
                    </>
                )}
            </List>
        </>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position='absolute'
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
                color='transparent'
            >

                <Toolbar /* sx={{

                    backgroundColor: 'rgba(0,0,0,.2)',
                }} */>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setMobileOpen(true)}
                        edge="start"
                        sx={{ mr: 2, ...(mobileOpen && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {/* <strong>SOEI | Sistema de Operaciones Empresarial Intercommerce</strong>  */}
                    </Typography>
                    <ProfileMenu props={userInfo} />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {props.isAuth && <Toolbar />}
                {props.children}
            </Box>
        </Box>
    )
}