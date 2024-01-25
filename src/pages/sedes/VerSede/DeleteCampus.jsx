import { Button, Tooltip, Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../../../firebase";
import { useParams, useNavigate } from 'react-router-dom';

export const DeleteCampus = ({ props }) => {

    const params = useParams()

    const [open, setOpen] = useState(null);

    const onData = () => {
        setOpen(true)
    }

    const deleteProducto = async () => {
        await db.collection("sedes").doc(props.sede).collection('campus').doc(props.id).delete().then(() => {

            Swal.fire({ icon: "success", text: "Se ha eliminado el campus con exito", });
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
                    <strong>ESTA SEGURO DE ELIMINAR EL CAMPUS: {props.campus}</strong>
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}><strong>Cancelar</strong></Button>
                    <Button onClick={() => {
                        deleteProducto()
                        /* datosFlota() */
                    }} variant="contained"
                        color="error"
                    >
                        ELIMINAR
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};