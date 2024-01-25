import { Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../../firebase";
import { useParams, useNavigate } from 'react-router-dom';

export const DeleteEspacioFisico = ({ sede, campus, props }) => {

    const params = useParams()

    const [open, setOpen] = useState(null);

    const onData = () => {
        setOpen(true)
    }

    const deleteProducto = async () => {
        await db.collection("sedes").doc(sede).collection('campus').doc(campus).collection('espacios_fisicos').doc(props.id).delete().then(() => {

            Swal.fire({ icon: "success", text: "Se ha eliminado el espacio fisico con exito", });
        })
            .catch((error) => { console.error("Error adding document: ", error); });
        setOpen(false)
    }

    return (
        <>
            <Tooltip title="Eliminar">
                <Button onClick={() => onData()}>
                    <DeleteIcon color="error" />
                </Button>
            </Tooltip>
            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>
                    ESTA SEGURO DE ELIMINAR EL ESPACIO FISICO: <strong>{props.espacio_fisico}</strong>
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={() => setOpen(false)}><strong>Regresar</strong></Button>
                    <Button
                    size="small"
                     onClick={() => {
                        deleteProducto()
                        /* datosFlota() */
                    }} variant="contained"
                        color="error"
                    >
                        {" "}
                        ELIMINAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};