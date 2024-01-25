import { Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../../firebase";
import { useParams, useNavigate } from 'react-router-dom';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

export const InactivarAula = ({ props }) => {

    const params = useParams()

    const [open, setOpen] = useState(null);

    const [motivoInactivacion, setMotivoInactivacion] = useState('');

    const onData = () => {
        setOpen(true)
    }

    const inactivarAula = async () => {
        await db
            .collection("sedes")
            .doc(params.sede)
            .collection('campus')
            .doc(params.campus).collection("edificios").doc(props.edificio).collection('aulas').doc(props.id).update({
                estado: 1,
                motivo_inactivacion: motivoInactivacion.toUpperCase()
            })
        Swal.fire({ icon: "success", text: "Se ha inhabilitado el aula con exito", });
    }

    return (
        <>
            <Tooltip title="Inactivar">
                <Button onClick={() => onData()}>
                    <ToggleOffIcon color="warning" />
                </Button>
            </Tooltip>
            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>
                    <strong>INHABILITAR AULA: {props.aula}</strong>
                </DialogTitle>
                <DialogContent>
                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>MOTIVO DE INHABILITACION:</strong></p>

                    <TextField
                        sx={{
                            '& legend': { display: 'none' },
                            '& fieldset': { top: 0 },
                        }}
                        value={motivoInactivacion}
                        onChange={(e) => setMotivoInactivacion(e.target.value)}
                        name="motivoInactivacion"
                        size="small"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" size="small" onClick={() => setOpen(false)}><strong>REGRESAR</strong></Button>
                    <Button onClick={() => {
                        inactivarAula()
                        /* datosFlota() */
                    }}
                        disabled={motivoInactivacion === ''}
                        variant="contained"
                        size="small"
                    >
                        {" "}
                        INHABILITAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};