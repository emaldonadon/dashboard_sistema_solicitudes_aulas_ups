import React, { useState, useRef, useEffect } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const ListSedes = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)

    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <AccountBalanceIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="Sedes" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>

                    <ListItemButton component={RouterLink} to={`sedes/crear-sede/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Crear nueva sede" />
                    </ListItemButton>

                    <ListItemButton component={RouterLink} to={`sedes/lista-de-sedes/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Lista de sedes" />
                    </ListItemButton>

                </List>
            </Collapse>
        </>
    )
}