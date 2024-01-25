import { TextField, Grid, Box, Paper, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth, firebase } from '../../../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

import * as XLSX from "xlsx/xlsx.mjs";


export const CrearAula = () => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileRef = useRef();

    let navigate = useNavigate()

    const userAuth = useSelector(state => state.userAuth)

    const params = useParams()

    const { userInfo } = userAuth

    const [piso, setPiso] = useState('')
    const [aula, setAula] = useState('')
    const [open, setOpen] = useState(false)

    const createEdificio = async () => {

        console.log(params.edificio)

        const agendaDB2 = await db
            .collection("sedes")
            .doc(params.sede)
            .collection('campus')
            .doc(params.campus)
            .collection("edificios")
            .doc(params.edificio)
            .collection('aulas')
            .where('aula', '==', aula.toUpperCase())
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
                .doc(params.campus)
                .collection("edificios")
                .doc(params.edificio)
                .collection('aulas')
                .doc(aula.toUpperCase())
                .set({
                    piso: piso.toUpperCase(),
                    aula: aula.toUpperCase(),
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                    edificio: params.edificio,
                    estado: 0
                })
            setOpen(false)
            Swal.fire({ icon: "success", text: `Se ha creado el aula ${aula} con exito` });
            setPiso('')
            setAula('')
        } else {
            console.log('existe')
            setOpen(false)
            Swal.fire({ icon: "warning", text: `Ya existe un aula con el nombre ${aula}` });
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
                        .collection('campus')
                        .doc(obj.CAMPUS.toUpperCase())
                        .collection('edificios')
                        .doc(obj.EDIFICIO.toUpperCase())
                        .collection('aulas')
                        .doc(obj.AULA.toString().toUpperCase())
                        .set({
                            aula: obj.AULA === '' || obj.AULA === undefined || obj.AULA === null ? '' : obj.AULA.toString().toUpperCase(),
                            created: firebase.firestore.FieldValue.serverTimestamp(),
                            edificio: obj.EDIFICIO === '' || obj.EDIFICIO === undefined || obj.EDIFICIO === null ? '' : obj.EDIFICIO.toUpperCase(),
                            campus: obj.CAMPUS === '' || obj.CAMPUS === undefined || obj.CAMPUS === null ? '' : obj.CAMPUS.toUpperCase(),
                            estado: 0,
                            sede: obj.SEDE === '' || obj.SEDE === undefined || obj.SEDE === null ? '' : obj.SEDE.toUpperCase(),
                            uid: obj.AULA === '' || obj.AULA === undefined || obj.AULA === null ? '' : obj.AULA.toString().toUpperCase(),
                            piso: obj.PISO === '' || obj.PISO === undefined || obj.PISO === null ? '' : obj.PISO.toString().toUpperCase(),
                        })
                        .then((docRef) => {
                            console.log("SEDE: ", docRef);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });
                });
                /* navigate(`/edificios/lista-de-edificios/`) */
                Swal.fire({
                    icon: "success",
                    title: "Subiendo aulas, esto podria tardar un poco...",
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

            <Box px={2} pt={2}>
                <Button color="success" variant="contained" size="small" onClick={() => setOpenUpload(true)}>Subir excel</Button>
            </Box>

            <Dialog
                open={openUpload}
                onClose={() => setOpenUpload(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Subir edificios</DialogTitle>
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
                        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>CREAR NUEVA AULA</strong></p>
                        <Grid container spacing={5}>

                            <Grid item xs={6}>
                                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>PISO:</strong></p>

                                <TextField
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={piso}
                                    onChange={(e) => setPiso(e.target.value)}
                                    name="edificio"
                                    size="small"
                                    fullWidth
                                />


                            </Grid>


                            <Grid item xs={6}>
                                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>AULA:</strong></p>
                                <TextField
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={aula}
                                    onChange={(e) => setAula(e.target.value)}
                                    name="cedula"
                                    size="small"
                                    fullWidth
                                />


                            </Grid>


                        </Grid>

                        <Box pt={2}>
                            <Button disabled={aula === ''} onClick={() => setOpen(true)} variant="contained" color="primary" size="small" fullWidth>Crear</Button>
                        </Box>

                    </Box>
                </Paper>
            </Box>

            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>¿Esta seguro de crear la aula <strong>{aula}</strong>?</DialogTitle>

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