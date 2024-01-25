import React, { useState, useRef, useEffect } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StadiumIcon from '@mui/icons-material/Stadium';

export const ListCampus = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)

    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <StadiumIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="Campus" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>

                    <ListItemButton component={RouterLink} to={`campus/crear-campus/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Crear nuevo campus" />
                    </ListItemButton>

                    <ListItemButton component={RouterLink} to={`campus/lista-de-campus/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Lista de campus" />
                    </ListItemButton>

                </List>
            </Collapse>
        </>
    )
}