import { Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { db } from "../../../firebase";

export const ActivarEspacioButton = ({ props }) => {

    const params = useParams()

    const [open, setOpen] = useState(null);

    const [motivoInactivacion, setMotivoInactivacion] = useState('');

    const onData = () => {
        setOpen(true)
    }

    const inactivarAula = async () => {
        await db
            .collection("sedes")
            .doc(props.sede)
            .collection('campus')
            .doc(props.campus).collection("espacios_fisicos").doc(props.espacio_fisico).update({
                estado: 0,
                motivo_inactivacion: ''
            })
        Swal.fire({ icon: "success", text: "SE HA HABILITADO EL ESPACIO CON EXITO", });
    }

    return (
        <>
            <Tooltip title="Inactivar">
                <Button onClick={() => onData()}>
                    <ToggleOffIcon color="success" />
                </Button>
            </Tooltip>
            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>
                    <strong>HABILITAR ESPACIO: {props.espacio_fisico}</strong>
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" size="small" onClick={() => setOpen(false)}><strong>REGRESAR</strong></Button>
                    <Button onClick={() => {
                        inactivarAula()
                        /* datosFlota() */
                    }}
                        variant="contained"
                        size="small"
                    >
                        {" "}
                        HABILITAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};