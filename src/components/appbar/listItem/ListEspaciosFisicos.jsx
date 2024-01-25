import React, { useState, useRef, useEffect } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RegistrationIcon from '@mui/icons-material/AppRegistration';

export const ListEspaciosFisicos = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)
    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <RegistrationIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="Espacios fisicos" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>

                <List component="div" disablePadding dense>
                    <ListItemButton component={RouterLink} to={`Espaciosfisicos/crear-espacios-fisicos`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Crear espacios fisicos" />
                    </ListItemButton>
                </List>

                <List component="div" disablePadding dense>
                    <ListItemButton component={RouterLink} to={`Espaciosfisicos/lista-de-espacios-fisicos`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Lista espacios fisicos" />
                    </ListItemButton>
                </List>

            </Collapse>

        </>
    )
}

/* lista-de-espacios-fisicos */