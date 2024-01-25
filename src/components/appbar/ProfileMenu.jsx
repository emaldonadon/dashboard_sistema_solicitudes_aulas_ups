import React, { useState } from 'react'
import { Box, Menu, MenuItem, IconButton, Avatar, ListItemIcon, Typography } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { auth } from '../../firebase'

function stringAvatar(name) {
    if (name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}`,
            /* ${name.split(' ')[1][0] */
        };
    }

}
function stringToColor(string) {
    if (string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

}
export const ProfileMenu = ({ props }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const logoutHandler = () => {
        auth.signOut()
    }
    return (
        <>
            <IconButton
                onClick={handleClick}
                id="basic-button"
            >
                <Avatar {...stringAvatar(props.displayName)}  />
            </IconButton>
            <Menu
                id="basic-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                elevation={1}
            >
                <MenuItem>
                    <ListItemIcon>
                        <Avatar {...stringAvatar(props.displayName)}  />
                    </ListItemIcon>
                    <Box pl={2}>
                        <Typography>{props.displayName}</Typography>
                        <Typography style={{ width: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}> {props.email}</Typography>

                    </Box>
                </MenuItem>
                <MenuItem onClick={logoutHandler}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    Salir
                </MenuItem>
            </Menu>
        </>
    )
}