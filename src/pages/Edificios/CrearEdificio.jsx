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
} from "@mui/material"
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth, firebase } from '../../firebase';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

import * as XLSX from "xlsx/xlsx.mjs";

export const CrearEdificio = () => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);

    const fileRef = useRef();

    let navigate = useNavigate()

    const userAuth = useSelector(state => state.userAuth)

    const { userInfo } = userAuth

    const [edificio, setEdificio] = useState('')
    const [direccion, setDireccion] = useState('')
    const [open, setOpen] = useState(false)

    const [listSedes, setListSedes] = useState([])
    const [sede, setSede] = useState('')

    const [listCampus, setListCampus] = useState([])
    const [campus, setCampus] = useState('')

    const getListSedes = () => {
        let ref = db.collection("sedes").where("estado", "==", 0)

        ref.onSnapshot(snapshot => {
            const data = [
                ...snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id,
                    }
                })
            ];
            setListSedes(data)
        })
    }

    const getListCampus = (e) => {
        let ref = db.collection("sedes").doc(e).collection('campus').where("estado", "==", 0)

        ref.onSnapshot(snapshot => {
            const data = [
                ...snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id,
                    }
                })
            ];
            setListCampus(data)
        })
    }

    const createEdificioInsideCollectionSedes = async () => {

        const agendaDB2 = await db
            .collection('sedes')
            .doc(sede)
            .collection('campus')
            .doc(campus)
            .collection("edificios")
            .where('uid', '==', edificio.toUpperCase())
            .get();

        const data2 = await agendaDB2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (data2[0] === undefined) {
            console.log('no existe')
            db.collection('sedes').doc(sede).collection('campus').doc(campus).collection("edificios").doc(edificio.toUpperCase()).set({
                uid: edificio.toUpperCase(),
                edificio: edificio.toUpperCase(),
                direccion: direccion === '' ? '' : direccion,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                sede: sede,
                campus: campus,
                photo: ''
            })
            setOpen(false)
            Swal.fire({ icon: "success", text: `Se ha creado el edificio ${edificio.toUpperCase()} con exito` });
            navigate(`/edificios/lista-de-edificios`)
        } else {
            console.log('existe')
            setOpen(false)
            Swal.fire({ icon: "warning", text: `Ya existe un edificio con el nombre ${edificio.toUpperCase()}` });
        }
    }

    const createEdificio = async () => {

        const agendaDB2 = await db
            .collection("edificios")
            .where('uid', '==', edificio.toUpperCase())
            .get();

        const data2 = await agendaDB2.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (data2[0] === undefined) {
            console.log('no existe')
            db.collection('edificios').doc(edificio.toUpperCase()).set({
                uid: edificio.toUpperCase(),
                edificio: edificio.toUpperCase(),
                direccion: direccion === '' ? '' : direccion,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                sede: sede,
                campus: campus,
                photo: ''
            })
            setOpen(false)
            Swal.fire({ icon: "success", text: `Se ha creado el edificio ${edificio.toUpperCase()} con exito` });
            navigate(`/edificios/lista-de-edificios`)
        } else {
            console.log('existe')
            setOpen(false)
            Swal.fire({ icon: "warning", text: `Ya existe un edificio con el nombre ${edificio.toUpperCase()}` });
        }
    }

    const dispatch = useDispatch();
    useEffect(() => {
        getListSedes()
    }, [dispatch])

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
                        .set({
                            campus: obj.CAMPUS === '' || obj.CAMPUS === undefined || obj.CAMPUS === null ? '' : obj.CAMPUS.toUpperCase(),
                            created: firebase.firestore.FieldValue.serverTimestamp(),
                            direccion: obj.DIRECCION === '' || obj.DIRECCION === undefined || obj.DIRECCION === null ? '' : obj.DIRECCION.toUpperCase(),
                            edificio: obj.EDIFICIO === '' || obj.EDIFICIO === undefined || obj.EDIFICIO === null ? '' : obj.EDIFICIO.toUpperCase(),
                            estado: 0,
                            sede: obj.SEDE === '' || obj.SEDE === undefined || obj.SEDE === null ? '' : obj.SEDE.toUpperCase(),
                            uid: obj.EDIFICIO === '' || obj.EDIFICIO === undefined || obj.EDIFICIO === null ? '' : obj.EDIFICIO.toUpperCase(),
                        })
                        .then((docRef) => {
                            console.log("SEDE: ", docRef);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });
                });
                navigate(`/edificios/lista-de-edificios/`)
                Swal.fire({
                    icon: "success",
                    title: "Subiendo edificios, esto podria tardar un poco...",
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
                        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>CREAR NUEVO EDIFICIO</strong></p>
                        <Grid container spacing={5}>

                            <Grid item xs={6}>

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
                                        setSede(e.target.value)
                                        getListCampus(e.target.value)
                                    }}
                                >
                                    {listSedes && listSedes.map((row, key) => (
                                        <MenuItem value={row.sede}>{row.sede}</MenuItem>
                                    ))}

                                </Select>

                                <Box pt={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>EDIFICIO:</strong></p>

                                    <TextField
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        disabled={campus === ''}
                                        value={edificio}
                                        onChange={(e) => setEdificio(e.target.value)}
                                        name="edificio"
                                        size="small"
                                        fullWidth
                                    />
                                </Box>


                            </Grid>


                            <Grid item xs={6}>

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
                                        setCampus(e.target.value)
                                    }}
                                >
                                    {listCampus && listCampus.map((row, key) => (
                                        <MenuItem value={row.campus}>{row.campus}</MenuItem>
                                    ))}

                                </Select>

                                <Box pt={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>DIRECCION:</strong></p>
                                    <TextField
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        disabled={campus === ''}
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        name="cedula"
                                        size="small"
                                        fullWidth
                                    />
                                </Box>


                            </Grid>


                        </Grid>

                        <Box pt={2}>
                            <Button disabled={edificio === '' || sede === '' || campus === ''} onClick={() => setOpen(true)} variant="contained" color="primary" size="small" fullWidth>Crear</Button>
                        </Box>

                    </Box>
                </Paper>
            </Box>

            <Dialog open={open} fullWidth onClose={() => setOpen(false)} maxWidth="xs">
                <DialogTitle>¿Esta seguro de crear el nuevo edificio <strong>{edificio.toUpperCase()}</strong>?</DialogTitle>

                <DialogContent>

                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" size="small" color="error" onClick={() => setOpen(false)}>
                        Regresar
                    </Button>
                    <Button onClick={() => {
                        createEdificio()
                        createEdificioInsideCollectionSedes()
                    }} variant="contained" size="small">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}