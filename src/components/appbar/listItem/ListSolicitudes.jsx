import React, { useState, useRef, useEffect } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EmailIcon from '@mui/icons-material/Email';

export const ListSolicitudes = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)

    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <EmailIcon fontSize='small'/>
                </ListItemIcon>
                <ListItemText primary="Solicitudes" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>

                    <ListItemButton component={RouterLink} to={`solicitudes/aulas/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Solicitudes de aulas" />
                    </ListItemButton>

                    <ListItemButton component={RouterLink} to={`solicitudes/soportes/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Solicitudes de soporte" />
                    </ListItemButton>

                </List>
            </Collapse>
        </>
    )
}