import React, { useState } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const ListReservarCursos = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)
    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <AccessTimeIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="Reservaciones" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>

                <List component="div" disablePadding dense>

                    <ListItemButton component={RouterLink} to={'reservaciones/espacios-fisicos'}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Espacios fisicos" />
                    </ListItemButton>

                </List>

            </Collapse>

        </>
    )
}