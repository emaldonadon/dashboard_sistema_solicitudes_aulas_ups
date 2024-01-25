import { TextField, Grid, Box, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth, firebase } from '../../../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

export const CrearCampus = () => {

    const userAuth = useSelector(state => state.userAuth)

    const params = useParams()

    const { userInfo } = userAuth

    const [campus, setCampus] = useState('')
    const [direccion, setDireccion] = useState('')
    const [open, setOpen] = useState(false)

    const createEdificio = async () => {

        console.log(params.sede)

        const agendaDB2 = await db
            .collection("sedes")
            .doc(params.sede)
            .collection('campus')
            .where('campus', '==', campus.toUpperCase())
            .get()

        const data2 = await agendaDB2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (data2[0] === undefined) {
            console.log('no existe')
            const agendaDB2 = await db
            .collection("sedes")
            .doc(params.sede)
            .collection('campus')
            .doc(campus.toUpperCase())
            .set({
                campus: campus.toUpperCase(),
                direccion: direccion.toUpperCase(),
                created: firebase.firestore.FieldValue.serverTimestamp(),
                sede: params.sede,
                estado: 0
            })
            setOpen(false)
            Swal.fire({ icon: "success", text: `Se ha creado el campus ${campus.toUpperCase()} con exito` });
            setCampus('')
            setDireccion('')
        } else {
            console.log('existe')
            setOpen(false)
            Swal.fire({ icon: "warning", text: `Ya existe un campus con el nombre ${campus.toUpperCase()}` });
        }
    }

    return (
        <>
            <Box px={2} py={2}>
                <Paper elevation={3}>
                    <Box px={2} py={2}>
                        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>CREAR NUEVO CAMPUS</strong></p>
                        <Grid container spacing={5}>

                            <Grid item xs={6}>
                                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CAMPUS:</strong></p>

                                <TextField
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                    name="campus"
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
                                    name="direccion"
                                    size="small"
                                    fullWidth
                                />


                            </Grid>


                        </Grid>

                        <Box pt={2}>
                            <Button disabled={campus === '' } onClick={() => setOpen(true)} variant="contained" color="primary" size="small" fullWidth>Crear</Button>
                        </Box>

                    </Box>
                </Paper>
            </Box>

            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>¿Esta seguro de crear el campus <strong>{campus.toUpperCase()}</strong>?</DialogTitle>

                <DialogContent>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" size="small" color="error" onClick={() => setOpen(false)}>
                        Regresar
                    </Button>
                    <Button onClick={() => createEdificio()} variant="contained" size="small">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}