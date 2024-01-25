import {
    TextField,
    Grid,
    Box,
    Paper,
    Button,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { useState, useEffect, useRef } from 'react';
import { db, firebase } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";

import { useParams, useNavigate } from 'react-router-dom';

import * as XLSX from "xlsx/xlsx.mjs";

export const CrearEspaciosFisicos = () => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileRef = useRef();

    let navigate = useNavigate()

    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth

    const [open, setOpen] = useState(false)

    const [listSedes, setListSedes] = useState([]);
    const [sede, setSede] = useState('');

    const [listCampus, setListCampus] = useState([]);
    const [campus, setCampus] = useState('');

    const [espacioFisico, setEspacioFisico] = useState('');

    const getListSedes = () => {
        let ref = db.collection("sedes").where("estado", "==", 0);

        ref.onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });
            setListSedes(data);
        });
    };

    const getListCampus = (e) => {
        let ref = db.collection("sedes").doc(e).collection('campus').where("estado", "==", 0);

        ref.onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });
            setListCampus(data);
        });
    };

    const CreateEspacioFisico = async () => {

        const agendaDB2 = await db
            .collection('sedes')
            .doc(sede)
            .collection('campus')
            .doc(campus)
            .collection("espacios_fisicos")
            .where('uid', '==', espacioFisico.toUpperCase())
            .get();

        const data2 = await agendaDB2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (data2[0] === undefined) {
            db.collection('sedes').doc(sede).collection('campus').doc(campus).collection("espacios_fisicos").doc(espacioFisico.toUpperCase()).set({
                sede: sede,
                campus: campus,
                espacio_fisico: espacioFisico.toUpperCase(),
                uid: espacioFisico.toUpperCase(),
                estado: 0,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                usuario_creador: userInfo.displayName
            })
            setOpen(false)
            Swal.fire({ icon: "success", text: `El espacio físico se guardó correctamente` });
            /* navigate(`/edificios/lista-de-edificios`) */
        } else {
            setOpen(false)
            Swal.fire({ icon: "warning", text: `Ya existe un edificio con el nombre ${espacioFisico.toUpperCase()}` });
        }
    };


    useEffect(() => {
        getListSedes();
    }, []);

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
                        .collection('espacios_fisicos')
                        .doc(obj.ESPACIO.toString().toUpperCase())
                        .set({
                            espacio_fisico: obj.ESPACIO === '' || obj.ESPACIO === undefined || obj.ESPACIO === null ? '' : obj.ESPACIO.toString().toUpperCase(),
                            created: firebase.firestore.FieldValue.serverTimestamp(),
                            campus: obj.CAMPUS === '' || obj.CAMPUS === undefined || obj.CAMPUS === null ? '' : obj.CAMPUS.toUpperCase(),
                            estado: 0,
                            sede: obj.SEDE === '' || obj.SEDE === undefined || obj.SEDE === null ? '' : obj.SEDE.toUpperCase(),
                            uid: obj.ESPACIO === '' || obj.ESPACIO === undefined || obj.ESPACIO === null ? '' : obj.ESPACIO.toString().toUpperCase(),
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
                    title: "Subiendo espacios fisicos, esto podria tardar un poco...",
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
                <DialogTitle>Subir espacios fisicos</DialogTitle>
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
                        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>CREAR NUEVO ESPACIO FISICO</strong></p>

                        <Grid container spacing={5}>

                            <Grid item xs={6}>

                                <Box mt={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>SEDE:</strong></p>
                                    <Select
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        fullWidth
                                        size="small"
                                        value={sede}
                                        onChange={(e) => {
                                            setSede(e.target.value);
                                            getListCampus(e.target.value);
                                        }}
                                    >
                                        {listSedes.map((row, key) => (
                                            <MenuItem key={key} value={row.sede}>{row.sede}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                                <Box mt={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>ESPACIO FISICO:</strong></p>
                                    <TextField
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        disabled={sede === '' || campus === ''}
                                        value={espacioFisico}
                                        onChange={(e) => setEspacioFisico(e.target.value)}
                                        name="espacioFisico"
                                        size="small"
                                        fullWidth
                                    />
                                </Box>

                            </Grid>


                            <Grid item xs={6}>

                                <Box mt={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CAMPUS:</strong></p>
                                    <Select
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        disabled={sede === ''}
                                        fullWidth
                                        size="small"
                                        value={campus}
                                        onChange={(e) => {
                                            setCampus(e.target.value);
                                        }}
                                    >
                                        {listCampus.map((row, key) => (
                                            <MenuItem key={key} value={row.campus}>{row.campus}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                            </Grid>

                        </Grid>

                        <Box mt={2}>
                            <Button
                                disabled={sede === '' || campus === '' || espacioFisico === ''}
                                onClick={() => { setOpen(true) }}
                                variant="contained"
                                color="primary"
                                size="small"
                                fullWidth
                            >
                                Crear espacio fisico
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Dialog confirmacion creacion de espacio fisico */}

            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>¿ESTA SEGURO DE CREAR EL NUEVO ESPACIO FISICO <strong>{espacioFisico.toUpperCase()}</strong>?</DialogTitle>

                <DialogContent>

                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" size="small" color="error" onClick={() => setOpen(false)}>
                        Regresar
                    </Button>
                    <Button onClick={() => {
                        CreateEspacioFisico()
                    }} variant="contained" size="small">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};