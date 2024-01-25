import React, { useState, useRef, useEffect } from 'react';
import { ListItemIcon, ListItemButton, Collapse, ListItemText, List } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';

export const ListUsuarios = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    const [openVent, setOpenVent] = useState(false)
    const [openCargo, setOpenCargo] = useState(false);

    return (
        <>
            <ListItemButton onClick={() => setOpenVent(!openVent)}>
                <ListItemIcon>
                    <PersonIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
                {openVent ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openVent} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>

                    <ListItemButton component={RouterLink} to={`usuarios/crear-usuario/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Crear usuario" />
                    </ListItemButton>

                    <ListItemButton component={RouterLink} to={`usuarios/lista-de-usuarios/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Lista de usuarios" />
                    </ListItemButton>

                    {/* <ListItemButton onClick={() => setOpenCargo(!openCargo)}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Parametros" />
                        {openCargo ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openCargo} timeout="auto" unmountOnExit>

                        <List component="div" disablePadding dense>
                            {['Cargos'].map((text, index) => (
                                <ListItemButton
                                    key={text}
                                    component={RouterLink} to={`/usuarios/cargo/`}
                                >
                                    <ListItemIcon
                                        style={{ marginLeft: 25 }}
                                    >
                                    </ListItemIcon>
                                    <ListItemText style={{ textTransform: 'capitalize' }} primary={text} />
                                </ListItemButton>
                            ))}
                        </List>

                    </Collapse> */}

                    {/* <ListItemButton component={RouterLink} to={`usuarios/cargo/`}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Lista de usuarios" />
                    </ListItemButton> */}

                </List>
            </Collapse>
        </>
    )
}