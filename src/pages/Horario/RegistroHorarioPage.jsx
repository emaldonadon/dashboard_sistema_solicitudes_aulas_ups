import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, Grid, Box, Paper, Button, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import Swal from "sweetalert2";
import { db, firebase } from '../../firebase';
import { LocalizationProvider, } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from "@mui/x-date-pickers";
import * as XLSX from "xlsx/xlsx.mjs";

export const RegistroHorarioPage = () => {
  const [materia, setMateria] = useState('');
  const [grupo, setGrupo] = useState('');
  const [profesor, setProfesor] = useState('');
  const [carrera, setCarrera] = useState('');
  const [dia, setDia] = useState('');
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaTerminar, setHoraTerminar] = useState(null);
  const [listProfesores, setListProfesores] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef(null);
  const [camposLimpios, setCamposLimpios] = useState(false);
  const [listEdificios, setListEdificios] = useState([]);
  const [edificios, setEdificios] = useState('');
  const [listAulas, setListAulas] = useState([]);
  const [aulas, setAulas] = useState('');


  const limpiarCampos = () => {
    setMateria('');
    setGrupo('');
    setProfesor('');
    setCarrera('');
    setHoraInicio(null);
    setHoraTerminar(null);
    setDia('');
    setCamposLimpios(true);
    setAulas('');
    setEdificios('');
  };

  const handleUploadFile = async () => {
    try {
      if (file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        jsonData.forEach((obj) => {
          db.collection("carrera")
            .doc(obj.CARRERA.toUpperCase())
            .collection('dia')
            .doc(obj.DIA.toUpperCase())
            .collection('grupo')
            .doc(obj.GRUPO.toUpperCase())
            .collection('materia')
            .doc(obj.MATERIA.toUpperCase())
            .collection('profesor')
            .doc(obj.PROFESOR.toUpperCase())
            .collection('horaInicio')
            .doc(obj.HORAINICIO.toUpperCase())
            .collection('horaTerminar')
            .doc(obj.HORATERMINAR.toUpperCase())
            .collection('edificio')
            .doc(obj.EDIFICIO.toUpperCase())
            .collection('aula')
            .doc(obj.AULA.toUpperCase())
            .set({
              carrera: obj.CARRERA === '' || obj.CARRERA === undefined || obj.CARRERA === null ? '' : obj.CARRERA.toUpperCase(),
              /* created: firebase.firestore.FieldValue.serverTimestamp(), */
              dia: obj.DIA === '' || obj.DIA === undefined || obj.DIA === null ? '' : obj.DIA.toUpperCase(),
              grupo: obj.GRUPO === '' || obj.GRUPO === undefined || obj.GRUPO === null ? '' : obj.GRUPO.toUpperCase(),
              horaInicio: obj.HORAINICIO === '' || obj.HORAINICIO === undefined || obj.HORAINICIO === null ? '' : obj.HORAINICIO,
              horaTerminar: obj.HORATERMINAR === '' || obj.HORATERMINAR === undefined || obj.HORATERMINAR === null ? '' : obj.HORATERMINAR,
              materia: obj.MATERIA === '' || obj.MATERIA === undefined || obj.MATERIA === null ? '' : obj.MATERIA.toUpperCase(),
              profesor: obj.PROFESOR === '' || obj.PROFESOR === undefined || obj.PROFESOR === null ? '' : obj.PROFESOR.toUpperCase(),
              edificios: obj.EDIFICIO === '' || obj.EDIFICIO === undefined || obj.EDIFICIO === null ? '' : obj.EDIFICIO.toUpperCase(),
              aulas: obj.AULA === '' || obj.AULA === undefined || obj.AULA === null ? '' : obj.AULA.toUpperCase(),
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        });
        Swal.fire({
          icon: "success",
          title: "Subiendo horario, esto podria tardar un poco...",
        });
        setOpenUpload(false);
        limpiarCampos();
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
  const getLisEdificios = async () => {
    try {
      const snapshot = await firebase.firestore().collection('sedes').doc("GUAYAQUIL").collection('campus').
        doc('CENTENARIO').collection('edificios').get();
      const data = snapshot.docs.map(doc => doc.data().edificio);
      setListEdificios(data);
    } catch (error) {
      console.error('Error al obtener la lista de sedes:', error);
    }
  };

  const getLisAulas = async (selectedEdificio) => {
    try {
      const snapshot = await firebase.firestore().collection('sedes').doc("GUAYAQUIL").collection('campus').
        doc('CENTENARIO').collection('edificios').doc(selectedEdificio).collection('aulas').get();
      const data = snapshot.docs.map(doc => doc.data().aula);
      setListAulas(data);
      console.log(data);
    } catch (error) {
      console.error('Error al obtener la lista de sedes:', error);
    }
  };


  const getProfesores = async () => {
    try {
      const snapshot = await db.collection("usuarios").get();
      const data = snapshot.docs.map((doc) => doc.data().displayName);
      setListProfesores(data);
    } catch (error) {
      console.error('Error al obtener los nombres de los profesores:', error);
    }
  };

  const guardarHorario = async () => {
    try {
      await db.collection("horarios").add({
        materia: materia.toUpperCase(),
        grupo: grupo.toUpperCase(),
        profesor: profesor.toUpperCase(),
        carrera: carrera.toUpperCase(),
        horaInicio,
        horaTerminar,
        dia: dia.toUpperCase(),
        edificios: edificios.toUpperCase(),
        aula: aulas.toUpperCase(),
      });
      Swal.fire({
        icon: 'success',
        text: 'Se ha creado con éxito',
      });
      limpiarCampos();
    } catch (error) {
      console.error('Error al guardar el horario:', error);
      Swal.fire({
        icon: 'error',
        text: 'Hubo un error al guardar el horario',
      });
    }
  };

  useEffect(() => {
    getLisEdificios();
    getProfesores();
  }, []);

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
        <DialogTitle>Subir horario</DialogTitle>
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
                    onClick={() => handleRemove()}
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
            <p style={{ marginBottom: "10px", marginTop: "0px" }}>
              <strong>ASIGNAR HORARIO SEDE CENTENARIO</strong>
            </p>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}>
                  <strong>MATERIA:</strong>
                </p>
                <TextField
                  sx={{
                    '& legend': { display: 'none' },
                    '& fieldset': { top: 0 },
                  }}
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  name="name"
                  size="small"
                  fullWidth
                />
                <Box py={2}>
                  <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}>
                    <strong>GRUPO:</strong>
                  </p>
                  <Select
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    disabled={carrera === ''}
                    label="GRUPO"
                    size="small"
                    fullWidth
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                  >
                    <MenuItem value="GRUPO 1">GRUPO 1</MenuItem>
                    <MenuItem value="GRUPO 2">GRUPO 2</MenuItem>
                    <MenuItem value="GRUPO 3">GRUPO 3</MenuItem>
                    <MenuItem value="GRUPO 4">GRUPO 4</MenuItem>
                  </Select>
                </Box>
                <Box pb={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <p style={{ fontSize: "11px", marginBottom: "10px" }}><strong>HORA DE INICIO:</strong></p>
                    <FormControl fullWidth>
                      <TimePicker
                        renderInput={(props) => <TextField {...props} size="small" />}
                        disabled={profesor === ''}
                        label="seleccione la hora"
                        value={horaInicio}
                        onChange={(newValue) => {
                          setHoraInicio(newValue);
                        }}
                      />
                    </FormControl>
                  </LocalizationProvider>
                </Box>

                <Box pb={2}>
                  <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}>
                    <strong>DIA:</strong>
                  </p>
                  <Select
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    disabled={horaTerminar === ''}
                    label="DIA"
                    size="small"
                    fullWidth
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                  >
                    <MenuItem value="LUNES">LUNES</MenuItem>
                    <MenuItem value="MARTES">MARTES</MenuItem>
                    <MenuItem value="MIERCOLES">MIERCOLES</MenuItem>
                    <MenuItem value="JUEVES">JUEVES</MenuItem>
                    <MenuItem value="VIERNES">VIERNES</MenuItem>
                    <MenuItem value="SABADO">SABADO</MenuItem>
                    <MenuItem value="DOMINGO">DOMINGO</MenuItem>
                  </Select>
                </Box>

                <Box pb={2}>
                  <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>Aulas:</strong></p>
                  <Select
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    disabled={edificios === ''}
                    fullWidth
                    size="small"
                    value={aulas}
                    onChange={
                      (e) => {
                        setAulas(e.target.value);
                      }}
                  >
                    {listAulas.map((row, key) => (
                      <MenuItem key={key} value={row}>{row}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>CARRERA:</strong>
                </p>
                <TextField
                  sx={{
                    '& legend': { display: 'none' },
                    '& fieldset': { top: 0 },
                  }}
                  disabled={materia === ''}
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  name="cedula"
                  size="small"
                  fullWidth
                />
                <Box py={2}>
                  <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>PROFESOR:</strong>
                  </p>
                  <Select
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    disabled={grupo === ''}
                    fullWidth
                    size="small"
                    value={profesor}
                    onChange={(e) => {
                      setProfesor(e.target.value);
                    }}
                  >
                    {listProfesores &&
                      listProfesores.map((row, key) => (
                        <MenuItem key={key} value={row}>
                          {row}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
                <Box pb={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <p style={{ fontSize: "11px", marginBottom: "10px" }}><strong>HORA DE FINALIZAR:</strong></p>
                    <FormControl fullWidth>
                      <TimePicker
                        renderInput={(props) => <TextField {...props} size="small" />}
                        disabled={profesor === ''}
                        label="seleccione la hora"
                        value={horaTerminar}
                        onChange={(newValue) => {
                          setHoraTerminar(newValue);
                        }}
                      />
                    </FormControl>
                  </LocalizationProvider>
                </Box>
                <Box pb={2}>
                  <p style={{ fontSize: "11px", marginBottom: "10px", marginTop: "0px" }}><strong>EDIFICIO:</strong>
                  </p>
                  <Select
                    sx={{
                      '& legend': { display: 'none' },
                      '& fieldset': { top: 0 },
                    }}
                    fullWidth
                    size="small"
                    value={edificios}
                    onChange={(e) => {
                      setEdificios(e.target.value);
                      getLisAulas(e.target.value);
                 
                    }}
                  >
                    {listEdificios.map((row, key) => (
                      <MenuItem key={key} value={row}>{row}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>
            </Grid>
            <Button
              disabled={
                materia === '' || grupo === '' || profesor === '' || carrera === '' || horaInicio === null || horaTerminar === null || dia === '' || edificios === ''|| aulas === ''
              }
              onClick={() => guardarHorario()}
              variant="contained"
              color="primary"
              size="small"
              fullWidth
            >
              Crear Horario
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
