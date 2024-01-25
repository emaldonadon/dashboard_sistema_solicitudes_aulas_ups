import {
    Container,
    TextField,
    Button,
    TableContainer,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Box,
    Paper,
    Chip,
    Grid
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../../../firebase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import RoomIcon from "@mui/icons-material/Room";
import { Link as RouterLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

export const UpdateEdificio = ({ props }) => {

    const [open, setOpen] = useState(false)

    const [direccion, setDireccion] = useState(props.direccion)

    const [edificio, setEdificio] = useState(props.edificio)


    const handleSubmit = () => {
        db.collection("edificios")
            .doc(props.id)
            .update({
                direccion: direccion,
                edificio: edificio.toUpperCase(),
            })
            .then((docRef) => {
                setOpen(false)
                Swal.fire({
                    icon: "success",
                    title: "Se ha actualizado el plan exitosamente.",
                });
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    return (
        <>
            <Tooltip title="Editar">
                <Button onClick={() => setOpen(true)}>
                    <EditIcon />
                </Button>
            </Tooltip>


            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="md">
                <DialogTitle>EDICION DE: {props.edificio}</DialogTitle>

                <DialogContent>
                    <Box px={2} py={2}>
                        <Paper elevation={3}>
                            <Box px={2} py={2}>
                                <Grid container spacing={5}>

                                    <Grid item xs={6}>
                                        <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>EDIFICIO:</strong></p>

                                        <TextField
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& fieldset': { top: 0 },
                                            }}
                                            disabled
                                            value={edificio}
                                            onChange={(e) => setEdificio(e.target.value)}
                                            name="edificio"
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>


                                    <Grid item xs={6}>
                                        <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>DIRECCION:</strong></p>
                                        <TextField
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& fieldset': { top: 0 },
                                            }}
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                            name="cedula"
                                            size="small"
                                            fullWidth
                                        />


                                    </Grid>


                                </Grid>

                              

                            </Box>
                        </Paper>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="warning" size="small" onClick={() => setOpen(false)}>Regresar</Button>
                    <Button disabled={edificio === ''} onClick={() => handleSubmit()} variant="contained" color="primary" size="small" fullWidth>Crear</Button>
                </DialogActions>
            </Dialog>



        </>
    );
};
