import { Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../../firebase";
import { useParams, useNavigate } from 'react-router-dom';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

export const ActivarCampus = ({ props }) => {

    const params = useParams()

    const [open, setOpen] = useState(null);

    const [motivoInactivacion, setMotivoInactivacion] = useState('');

    const onData = () => {
        setOpen(true)
    }

    const activarAula = async () => {
        await db.collection("sedes").doc(props.sede).collection('campus').doc(props.id).update({
            estado: 0,
        })
        Swal.fire({ icon: "success", text: "Se ha habilitado el campus con exito", });
    }

    return (
        <>
            <Tooltip title="Inactivar">
                <Button onClick={() => onData()}>
                    <ToggleOnIcon color="success" />
                </Button>
            </Tooltip>
            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>
                    ¿DESEA HABILITAR EL CAMPUS: <strong>{props.campus}</strong>?
                </DialogTitle>

                <DialogContent>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" size="small" onClick={() => setOpen(false)}><strong>REGRESAR</strong></Button>
                    <Button onClick={() => {
                        activarAula()
                        /* datosFlota() */
                    }}
                    variant="contained"
                        size="small"
                    >
                        {" "}
                        ACTIVAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};