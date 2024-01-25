import React, { useState } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduleIcon from '@mui/icons-material/Schedule';

export const ListProfesorHorario = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)
    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <ScheduleIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="HorarioProfesor" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>

                <List component="div" disablePadding dense>
                    <ListItemButton component={RouterLink} to={`HorarioProfesor/horarioProfesor`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Horario de Profesores de la sede: Centenario" />
                    </ListItemButton>
                </List>

            </Collapse>

        </>
    )
}