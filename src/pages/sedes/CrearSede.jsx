import { TextField, Grid, Box, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db, firebase } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

import * as XLSX from "xlsx/xlsx.mjs";

export const CrearSede = () => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileRef = useRef();

    const navigate = useNavigate();

    const userAuth = useSelector(state => state.userAuth)

    const { userInfo } = userAuth

    const [sede, setSede] = useState('')
    const [direccion, setDireccion] = useState('')
    const [open, setOpen] = useState(false)

    const createSede = async () => {

        const agendaDB2 = await db
            .collection("sedes")
            .where('uid', '==', sede.toUpperCase())
            .get();

        const data2 = await agendaDB2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (data2[0] === undefined) {
            console.log('no existe')
            db.collection('sedes').doc(sede.toUpperCase()).set({
                uid: sede.toUpperCase(),
                sede: sede.toUpperCase(),
                direccion: direccion === '' ? '' : direccion.toUpperCase(),
                created: firebase.firestore.FieldValue.serverTimestamp(),
                photo: '',
                estado: 0
            })
            setOpen(false)
            navigate('/sedes/lista-de-sedes/')
            Swal.fire({ icon: "success", text: `Se ha creado la sede ${sede} con exito` });
        } else {
            console.log('existe')
            setOpen(false)
            Swal.fire({ icon: "warning", text: `Ya existe una sede con el nombre ${sede}` });
        }
    }

    const [openUpload, setOpenUpload] = useState(false);

    const handleUploadFile = async () => {
        try {
            if (file) {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                jsonData.forEach((obj) => {
                    db.collection("sedes")
                        .doc(obj.SEDE.toUpperCase())
                        .set({
                            created: firebase.firestore.FieldValue.serverTimestamp(),
                            direccion: obj.DIRECCION === '' || obj.DIRECCION === undefined || obj.DIRECCION === null ? '' : obj.DIRECCION.toUpperCase(),
                            estado: 0,
                            sede: obj.SEDE === '' || obj.SEDE === undefined || obj.SEDE === null ? '' : obj.SEDE.toUpperCase(),
                            uid: obj.SEDE === '' || obj.SEDE === undefined || obj.SEDE === null ? '' : obj.SEDE.toUpperCase(),
                        })
                        .then((docRef) => {
                            console.log("SEDE: ", docRef);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });
                });
                navigate(`/sedes/lista-de-sedes/`)
                Swal.fire({
                    icon: "success",
                    title: "Subiendo sedes, esto podria tardar un poco...",
                });
                setOpenUpload(false);
            } else {
                console.log("No se cargado ningun archivo");
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleRemove = () => {
        setFileName(null);
        setFile(null);
        fileRef.current.value = "";
    };

    const handleUploadFileLocal = async (e) => {
        const file = e.target.files[0];
        setFileName(file.name);
        setFile(file);
    };

    return (
        <>

            <Box px={2}>
                <Button color="success" variant="contained" size="small" onClick={() => setOpenUpload(true)}>Subir excel</Button>
            </Box>

            <Dialog
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Subir sedes</DialogTitle>
                <DialogContent>
                    <Box pb={2}>
                        {fileName
                            ? `Nombre el archivo cargado:  ${fileName}`
                            : "Por favor, cargar el archivo..."}
                    </Box>
                    {!file ? (
                        <>
                            <input
                                style={{ display: "none" }}
                                onChange={(e) => handleUploadFileLocal(e)}
                                multiple
                                id="buttonFile"
                                type="file"
                                ref={fileRef}
                            />
                            <label htmlFor="buttonFile">
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    disableElevation
                                    component="span"
                                >
                                    Cargar archivo
                                </Button>
                            </label>
                        </>
                    ) : (
                        <Box>
                            <Box display="flex">
                                <Box pr={3}>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        size="small"
                                        onClick={(e) => handleRemove()}
                                    >
                                        Borrar archivo
                                    </Button>
                                </Box>
                                <Box>
                                    <Button
                                        onClick={handleUploadFile}
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                    >
                                        Subir archivo
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Box px={2} py={2}>
                <Paper elevation={3}>
                    <Box px={2} py={2}>
                        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>CREAR NUEVA SEDE</strong></p>
                        <Grid container spacing={5}>

                            <Grid item xs={6}>
                                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>SEDE:</strong></p>

                                <TextField
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={sede}
                                    onChange={(e) => setSede(e.target.value)}
                                    name="sede"
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

                        <Box pt={2}>
                            <Button disabled={sede === '' || direccion === ''} onClick={() => setOpen(true)} variant="contained" color="primary" size="small" fullWidth>Crear</Button>
                        </Box>

                    </Box>
                </Paper>
            </Box>

            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>¿Esta seguro de crear la nueva sede <strong>{sede.toUpperCase()}</strong>?</DialogTitle>

                <DialogContent>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" size="small" color="error" onClick={() => setOpen(false)}>
                        Regresar
                    </Button>
                    <Button onClick={() => createSede()} variant="contained" size="small">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}