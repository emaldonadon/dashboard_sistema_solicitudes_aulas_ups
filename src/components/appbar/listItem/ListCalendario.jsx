import React, { useState, useRef, useEffect } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CalendarIcon from '@mui/icons-material/CalendarToday';;
export const ListCalendario = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)
    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <CalendarIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="Calendario" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>

                <List component="div" disablePadding dense>
                    <ListItemButton component={RouterLink} to={`Calendario/calendar`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Calendario" />
                    </ListItemButton>
                </List>
            </Collapse>

        </>
    )
}