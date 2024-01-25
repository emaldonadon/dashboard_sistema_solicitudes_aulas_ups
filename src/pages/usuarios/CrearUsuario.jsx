import { TextField, Grid, Box, Paper, Button, Select, MenuItem, Divider } from "@mui/material"
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth, firebase } from '../../firebase';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

export const CrearUsuario = () => {

    let navigate = useNavigate()

    const userAuth = useSelector(state => state.userAuth)

    const { userInfo } = userAuth

    const [displayName, setDisplayName] = useState('')
    const [cedula, setCedula] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cargo, setCargo] = useState('')

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

    const registerUserWithEmailAndPassword = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email, password)
                .then((res) => {

                    auth.currentUser.updateProfile({
                        displayName: displayName.toUpperCase()
                    });

                    console.log(res.user.uid);
                    console.log(userInfo)
                    console.log(userInfo.displayName)
                    console.log(userInfo.name)
                    db.collection('usuarios').doc(res.user.uid).set({
                        email: email,
                        name: displayName.toUpperCase(),
                        displayName: displayName.toUpperCase(),
                        cargo: cargo,
                        photo: '',
                        uid: res.user.uid,
                        password: password,
                        created: firebase.firestore.FieldValue.serverTimestamp(),
                        user_created: userInfo.displayName,
                        sede: sede,
                        campus: campus,
                    })
                    Swal.fire({ icon: "success", text: "Se ha creado el nuevo usuario con exito", });
                    setDisplayName('')
                    setCedula('')
                    setEmail('')
                    setPassword('')
                    setCargo('')
                    navigate(`/usuarios/lista-de-usuarios`)
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });

        } catch (error) {
            console.log(error)
        }
    }

    const dispatch = useDispatch();
    useEffect(() => {
        getListSedes()
    }, [dispatch])

    return (
        <>
            <Box px={2} py={2}>
                <Paper elevation={3}>
                    <Box px={2} py={2}>
                        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>CREAR NUEVO USUARIO</strong></p>
                        <Grid container spacing={5}>

                            <Grid item xs={6}>
                                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>NOMBRE:</strong></p>

                                <TextField
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    name="name"
                                    size="small"
                                    fullWidth
                                />

                                <Box py={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CARGO:</strong></p>
                                    <Select
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        label="MOTIVO DEL RECHAZO"
                                        size="small"
                                        fullWidth
                                        value={cargo}
                                        onChange={(e) => setCargo(e.target.value)}
                                    >
                                        <MenuItem value="PROFESOR">PROFESOR</MenuItem>
                                        <MenuItem value="MANTENIMIENTO">MANTENIMIENTO</MenuItem>
                                    </Select>
                                </Box>

                                <Box pb={2}>
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
                                </Box>

                                {/* <Box py={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CEDULA:</strong></p>

                                    <TextField
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        value={cedula}
                                        onChange={(e) => setCedula(e.target.value)}
                                        name="cedula"
                                        size="small"
                                        fullWidth
                                    />
                                </Box> */}

                                {/* <Box py={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CONTRASEÑA:</strong></p>

                                    <TextField
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        name="password"
                                        size="small"
                                        fullWidth
                                    />
                                </Box> */}
                            </Grid>

                            <Grid item xs={6}>

                                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CEDULA:</strong></p>
                                <TextField
                                    sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                    value={cedula}
                                    onChange={(e) => setCedula(e.target.value)}
                                    name="cedula"
                                    size="small"
                                    fullWidth
                                />

                                <Box py={2}>
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
                                </Box>

                                {/* <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CORREO INSTITUCIONAL:</strong></p>

                                <TextField sx={{
                                    '& legend': { display: 'none' },
                                    '& fieldset': { top: 0 },
                                }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                    size="small"
                                    fullWidth
                                /> */}

                            </Grid>

                        </Grid>

                        <Divider />

                        <Grid container spacing={5}>

                            <Grid item xs={6}>

                                <Box py={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CORREO INSTITUCIONAL:</strong></p>
                                    <TextField sx={{
                                        '& legend': { display: 'none' },
                                        '& fieldset': { top: 0 },
                                    }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                        size="small"
                                        fullWidth
                                    />
                                </Box>

                            </Grid>

                            <Grid item xs={6}>

                                <Box py={2}>
                                    <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CONTRASEÑA:</strong></p>

                                    <TextField
                                        sx={{
                                            '& legend': { display: 'none' },
                                            '& fieldset': { top: 0 },
                                        }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        name="password"
                                        size="small"
                                        fullWidth
                                    />
                                </Box>


                            </Grid>

                        </Grid>

                        <Button disabled={
                            displayName === ''
                            || cargo === ''
                            || email === ''
                            || password === ''
                            || sede === ''
                            || campus === ''
                        } onClick={() => registerUserWithEmailAndPassword()} variant="contained" color="primary" size="small" fullWidth>Crear usuario</Button>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}