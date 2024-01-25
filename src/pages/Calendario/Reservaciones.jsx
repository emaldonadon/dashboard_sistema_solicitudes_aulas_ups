import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { FormControl, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, Box, Paper, Grid } from "@mui/material";
import { styles } from '../../assets/estiloCalendario/colors.css';
import Swal from "sweetalert2";
import { db, auth, firebase } from '../../firebase';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { format } from 'date-fns';

export const Reservaciones = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [listSedes, setListSedes] = useState([]);
  const [sede, setSede] = useState('');

  const [listCampus, setListCampus] = useState([]);
  const [campus, setCampus] = useState('');

  const [listEdificios, setListEdificios] = useState([]);
  const [edificio, setEdificio] = useState('');

  const [fecha, setFecha] = useState(null);
  const [horaInicio, setHoraInicio] = useState(null);
  const [horaSalida, setHoraSalida] = useState(null);

  const [ultimodigito, setUltimodigito] = useState('');

  const [listespaciofisico, setListespaciofisico] = useState([]);
  const [espaciofisico, setEspacioFisico] = useState('');

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(new Date(selectInfo.startStr));
    setOpenDialog(true);
  };

  const getListEspaciosFisicos = async (sedeId, campusId) => {
    try {
      const snapshot = await db
        .collection('sedes')
        .doc(sedeId)
        .collection('campus')
        .doc(campusId)
        .collection('espacios_fisicos')
        .get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListespaciofisico(data);
      console.log(listespaciofisico)
    } catch (error) {
      console.error('Error al obtener la lista de edificios:', error);
    }
  };

  const getListEdificios = async (sedeId, campusId) => {
    try {
      const snapshot = await db
        .collection('sedes')
        .doc(sedeId)
        .collection('campus')
        .doc(campusId)
        .collection('edificios')
        .get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(data);
      setListEdificios(data);
    } catch (error) {
      console.error('Error al obtener la lista de edificios:', error);
    }
  };

  const numeroMasuno = async () => {
    const collectionRef = firebase.firestore().collection('solicitudes_espacios_fisicos');
    const querySnapshot = await collectionRef
      .orderBy('created', 'desc')
      .limit(1)
      .get();
    const ultimoDato = querySnapshot.docs[0].data();
    const numero = ultimoDato.numero_solicitud;
    setUltimodigito(numero);
    console.log(numero);
    console.log(numero + 1);
    const suma = numero + 1;
    console.log(`SEF-${suma}`);
  };

  const handleCloseDialog = () => {
    setSede('');
    setFecha('');
    setCampus('');
    setEdificio('');
    setEspacioFisico('');
    setHoraInicio('');
    setHoraSalida('');
    setOpenDialog('');
  };

  const formatDate = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return formattedDate;
  }

  const getListCampus = (e) => {
    let ref = db.collection("sedes").doc(e).collection('campus').where("estado", "==", 0)
    ref.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id,
        }
      });
      setListCampus(data);
    });
  }

  const getListSedes = async () => {
    try {
      const snapshot = await firebase.firestore().collection('sedes').get();
      const data = snapshot.docs.map(doc => doc.data().sede);
      console.log(data);
      setListSedes(data);
    } catch (error) {
      console.error('Error al obtener la lista de sedes:', error);
    }
  };

  const handleSave = () => {
    setFecha('');
    setCampus('');
    setSede('');
    setEdificio('');
    setHoraInicio('');
    setHoraSalida('');
    setOpenDialog('');
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas guardar los datos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        saveData();
      }
    });
  }

  const saveData = () => {
    const estado = 0;
    const usuarioActual = auth.currentUser;
    if (usuarioActual) {
      const uidUsuario = usuarioActual.uid;
      if (uidUsuario) {
        console.log(uidUsuario);
      } else {
        console.log('No hay usuario autenticado');
      }
      const suma = ultimodigito + 1;
      const namesolicitud = `SEF-${suma}`;
      db.collection('solicitudes_espacios_fisicos').doc(`SEF-${suma}`).set({
        created: selectedDate,
        dia: selectedDate,
        id_solicitud: namesolicitud,
        uid_usuario: uidUsuario,
        espacio_reserva: espaciofisico,
        estado: estado,
        /* , 
       informacion adicional:,
       */
        sede: sede,
        campus: campus,
        numero_solicitud: suma,
        hora_desde: horaInicio,
        hora_hasta: horaSalida,
        // ...
      })
        .then(() => {
          Swal.fire('¡Guardado!', 'Puede observar su registro en calendario.', 'success');
        })
        .catch((error) => {
          Swal.fire('Error', 'Ha ocurrido un error al guardar los datos.', 'error');
        });
    }
  }

  useEffect(() => {
    getListSedes();
    getListEspaciosFisicos();
    numeroMasuno();
  }, []);

  return (
    <div>
      <FullCalendar
        locale={esLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        weekends={true}
        /* events={eventos} */
        selectMirror={true}
        dayMaxEvents={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"80vh"}
        selectable={true}
        select={handleDateSelect}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>RESERVACIONES {selectedDate ? formatDate(selectedDate) : ''}</strong></p>
          <Grid container spacing={5}></Grid>
        </DialogTitle>
        <DialogContent>
          <Box px={2} py={2}>
            <Paper elevation={3}>
              <Box py={2}>
                <p style={{ fontSize: '11px', marginBottom: '10px', marginTop: '0px' }}>
                  <strong>SEDE:</strong>
                </p>
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
                    <MenuItem key={key} value={row}>{row}</MenuItem>
                  ))}
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
                    getListEdificios(sede, e.target.value)
                  }}
                >
                  {listCampus && listCampus.map((row, key) => (
                    <MenuItem key={key} value={row.id}>{row.campus}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box pb={2}>
                <p style={{ fontSize: '11px', marginBottom: '10px', marginTop: '0px' }}>
                  <strong>EDIFICIO:</strong>
                </p>
                <Select
                  sx={{
                    '& legend': { display: 'none' },
                    '& fieldset': { top: 0 },
                  }}
                  disabled={sede === ''}
                  fullWidth
                  size="small"
                  value={edificio}
                  onChange={(e) => {
                    setEdificio(e.target.value);
                    getListEspaciosFisicos(e.target.value);
                  }}
                >
                  {listEdificios.map((row, key) => (
                    <MenuItem key={key} value={row.id}>{row.id}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box pb={2}>
                <p style={{ fontSize: '11px', marginBottom: '10px', marginTop: '0px' }}>
                  <strong>ESPACIO FISICO:</strong>
                </p>
                <Select
                  sx={{
                    '& legend': { display: 'none' },
                    '& fieldset': { top: 0 },
                  }}
                  disabled={edificio === ''}
                  fullWidth
                  size="small"
                  value={espaciofisico}
                  onChange={(e) => {
                    setEspacioFisico(e.target.value);
                    getListEspaciosFisicos(espaciofisico, e.target.value);
                  }}
                >
                  {listespaciofisico.map((row, key) => (
                    <MenuItem key={key.espaciofisico} value={row.id}>{row.id}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box pb={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <p style={{ fontSize: "11px", marginBottom: "10px" }}><strong>FECHA</strong></p>
                  <FormControl fullWidth>
                    <DatePicker
                      renderInput={(props) => <TextField {...props} size="small" />}
                      label="Seleccione"
                      value={fecha}
                      onChange={(newValue) => {
                        setFecha(newValue);
                      }}
                    />
                  </FormControl>
                </LocalizationProvider>
              </Box>

              <Box pb={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <p style={{ fontSize: "11px", marginBottom: "10px" }}><strong>HORA INICIO</strong></p>
                  <FormControl fullWidth>
                    <TimePicker
                      renderInput={(props) => <TextField {...props} size="small" />}
                      label="Seleccione"
                      value={horaInicio}
                      onChange={(newValue) => {
                        setHoraInicio(newValue);
                      }}
                    />
                  </FormControl>
                </LocalizationProvider>
              </Box>

              <Box pb={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <p style={{ fontSize: "11px", marginBottom: "10px" }}><strong>HORA SALIDA</strong></p>
                  <FormControl fullWidth>
                    <TimePicker
                      renderInput={(props) => <TextField {...props} size="small" />}
                      label="Seleccione"
                      value={horaSalida}
                      onChange={(newValue) => {
                        setHoraSalida(newValue);
                      }}
                    />
                  </FormControl>
                </LocalizationProvider>
              </Box>

            </Paper>
          </Box>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cerrar</Button>
            <Button onClick={handleSave} color="primary">Guardar</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};
