import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { db } from '../../firebase';
import '../../assets/estiloCalendario/colors.css';
import { Dialog, DialogContent, DialogActions, Button, Box, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { Snackbar, Alert } from "@mui/material";

export const CalendarPage = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoss, setEventoss] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSede, setSelectedSede] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [listCampus, setListCampus] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [listEdificios, setListEdificios] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState("");
  const [listAulas, setListAulas] = useState([]);
  const [selectedAulas, setSelectedAulas] = useState("");

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
      setSelectedCampus("")
    })
  }

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
      setSelectedEdificio("");
    } catch (error) {
      console.error('Error al obtener la lista de edificios:', error);
    }
  };

  const getListAulas = async (sedeId, campusId, edificioId) => {
    try {
      const snapshot = await db
        .collection('sedes')
        .doc(sedeId)
        .collection('campus')
        .doc(campusId)
        .collection('edificios')
        .doc(edificioId)
        .collection('aulas')
        .get();
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(data);
      setListAulas(data);
      setSelectedAulas("");
    } catch (error) {
      console.error('Error al obtener la lista de aulas:', error);
    }
  };

  const getEventos = () => {
    let ref = db.collection("solicitudes_aulas");
    if (selectedSede !== "TODAS") {
      ref = ref.where("sede", "==", selectedSede);
    }    if (selectedAulas) {
      ref = ref.where("aula", "==", selectedAulas);
    }
    ref.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const eventData = doc.data();
        const { bloque, usuario_que_abrio_ticket, fecha_creacion, aula, campus, sede } = eventData;
        const title = `${bloque} - ${usuario_que_abrio_ticket} - ${aula}- ${campus} - ${sede}`;
        const start = fecha_creacion?.toDate();
        const id = doc.id;
        return {
          ...eventData,
          id: id || uuidv4(),
          title: title,
          start: start || null
        };
      });
      setEventos(data);
      showNewRequestAlert(data, eventoss);
    });
  };

  const getEventoss = () => {
    let ref = db.collection("solicitudes_espacios_fisicos");
    if (selectedSede !== "TODAS") {
      ref = ref.where("sede", "==", selectedSede);
    }
    if (selectedEdificio) {
      ref = ref.where("edificios", "==", selectedEdificio);
    }
    if (selectedAulas) {
      ref = ref.where("aula", "==", selectedAulas);
    }
    ref.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const eventData = doc.data();
        const { campus, espacio_reserva, display_name_usuario_reserva, hora_desde, hora_hasta, sede } = eventData;
        const title = `${espacio_reserva} - ${display_name_usuario_reserva} - ${campus} - ${sede}`;
        const start = hora_desde?.toDate();
        const end = hora_hasta?.toDate();
        const id = doc.id;
        const bloque = eventData.bloque;
        const aula= eventData.aula;
        return {
          ...eventData,
          id: id || uuidv4(),
          title: title,
          start: start || null,
          end: end || null,
          bloque: bloque,
          aula: aula
        };
      });
      setEventoss(data);
      showNewRequestAlert(eventos, data);
    });
  };
  const getCalendar = () => {
    const eventosRef = db.collection("solicitudes_aulas");
    const eventossRef = db.collection("solicitudes_espacios_fisicos");

    const unsubscribeEventos = eventosRef.onSnapshot(() => {
      showNewRequestAlert();
    });

    const unsubscribeEventoss = eventossRef.onSnapshot(() => {
      showNewRequestAlert();
    });
    return () => {
      unsubscribeEventos();
      unsubscribeEventoss();
    };
  }

  useEffect(() => {
    getEventos();
    getEventoss();
    getCalendar();
  }, [selectedCampus, selectedSede, selectedEdificio, selectedAulas]);

  const handleRejectEvent = (event) => {
    const isAulaEvent = eventos.some((e) => e.id === event.id);
    const collectionRef = isAulaEvent
      ? db.collection("solicitudes_aulas")
      : db.collection("solicitudes_espacios_fisicos");

    if (!event.id) {
      console.error("El evento seleccionado no tiene un ID válido.");
      return;
    }

    const docRef = collectionRef.doc(event.id);
    docRef
      .update({ estado: 5 })
      .then(() => {
        console.log("Evento rechazado y estado actualizado en Firebase Firestore:", event);
        Swal.fire({
          title: 'Éxito',
          text: 'SE RECHAZÓ LA RESERVACION',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setAlertMessage("Estado: Rechazado");
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Error al rechazar el evento:", error);
        Swal.fire({
          title: 'Error',
          text: 'NO SE PUDO RECHAZAR LA RESERVACION',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      });
  };

  const handleAcceptEvent = (event) => {
    const isAulaEvent = eventos.some((e) => e.id === event.id);
    const collectionRef = isAulaEvent
      ? db.collection("solicitudes_aulas")
      : db.collection("solicitudes_espacios_fisicos");

    if (!event.id) {
      console.error("El evento seleccionado no tiene un ID válido.");
      return;
    }

    const docRef = collectionRef.doc(event.id);
    docRef
      .update({ estado: 1 })
      .then(() => {
        console.log("Evento aceptado y estado actualizado en Firebase Firestore:", event);
        Swal.fire({
          title: 'Éxito',
          text: 'SE ACEPTÓ LA RESERVACION',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setAlertMessage("Estado: ACEPTADO");
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Error al aceptar el evento:", error);
        Swal.fire({
          title: 'Error',
          text: 'NO SE PUDO ACEPTAR LA RESERVACION',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      });
    showNewRequestAlert();
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const showNewRequestAlert = () => {
    const eventosAnteriores = eventos;
    const eventosActuales = [...eventos, ...eventoss];
    const hayNuevaSolicitud = eventosAnteriores.length < eventosActuales.length;

    if (hayNuevaSolicitud) {
      setAlertSeverity("info");
      setAlertMessage("¡Nuevo evento agregado!");
      setShowAlert(true);
    }
  };

  const filteredEventos = eventos.filter((evento) => (
    (!selectedSede || selectedSede === "TODAS" || evento.sede === selectedSede) &&
    (!selectedCampus || evento.campus === selectedCampus)
  ));

  const filteredEventoss = eventoss.filter((evento) => (
    (!selectedSede || selectedSede === "TODAS" || evento.sede === selectedSede) &&
    (!selectedCampus || evento.campus === selectedCampus) &&
    (!selectedEdificio || evento.bloque === selectedEdificio) &&
    (!selectedAulas || evento.aula === selectedAulas)
  ));

  return (
    <div >
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <FormControl variant="outlined" style={{ marginRight: 20, minWidth: 150 }}>
          <InputLabel className="input-sede">SEDE</InputLabel>
          <Select
            id="input-sede"
            value={selectedSede}
            onChange={(e) => {
              setSelectedSede(e.target.value)
              getListCampus(e.target.value)
            }}
            label="INGRESE LA SEDE"
          >
            <MenuItem value={"TODAS"}>TODAS</MenuItem>
            <MenuItem value={"CUENCA"}>CUENCA</MenuItem>
            <MenuItem value={"GUAYAQUIL"}>GUAYAQUIL</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ marginRight: 20, minWidth: 150 }}>
          <InputLabel>CAMPUS</InputLabel>
          <Select
            disabled={selectedSede === ''}
            value={selectedCampus}
            onChange={(e) => {
              setSelectedCampus(e.target.value);
              getListEdificios(selectedSede, e.target.value);
            }}
            label="INGRESE EL CAMPUS"
          >
            {listCampus && listCampus.map((row, key) => (
              <MenuItem key={key} value={row.id}>{row.campus}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ marginRight: 20, minWidth: 150 }}>
          <InputLabel>EDIFICIOS</InputLabel>
          <Select
            disabled={selectedCampus === ''}
            value={selectedEdificio}
            onChange={(e) => {
              setSelectedEdificio(e.target.value);
              getListAulas(selectedSede, selectedCampus, e.target.value)
            }}
            label="INGRESE EL EDIFICIO"
          >
            {listEdificios && listEdificios.map((row, key) => (
              <MenuItem key={key} value={row.id}>{row.edificio}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" style={{ minWidth: 150 }}>
          <InputLabel>AULAS</InputLabel>
          <Select
            disabled={selectedEdificio === ''}
            value={selectedAulas}
            onChange={(e) => {
              setSelectedAulas(e.target.value);
            }}
            label="INGRESE LA AULA"
          >
            {listAulas && listAulas.map((row, key) => (
              <MenuItem key={key} value={row.id}>{row.aula}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <FullCalendar
        locale={esLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={[...filteredEventos, ...filteredEventoss]}
        selectMirror={true}
        dayMaxEvents={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"80vh"}
        eventClick={handleEventClick}
        eventContent={(arg) => (
          <div>
            <strong>{arg.timeText}</strong>
            <br />
            <strong>{arg.event.title}</strong>
            <br />
            {arg.event.extendedProps.estado === 0 && <span style={{ color: "gray" }}>En espera de aprobación</span>}
            {arg.event.extendedProps.estado === 1 && <span style={{ color: "green" }}>Aprobado / En espera de uso</span>}
            {arg.event.extendedProps.estado === 2 && <span style={{ color: "blue" }}>Espacio en uso</span>}
            {arg.event.extendedProps.estado === 3 && <span style={{ color: "purple" }}>Completado</span>}
            {arg.event.extendedProps.estado === 4 && <span style={{ color: "orange" }}>Reserva cancelada</span>}
            {arg.event.extendedProps.estado === 5 && <span style={{ color: "red" }}>Rechazado</span>}
            {arg.event.extendedProps.estado === 6 && <span style={{ color: "purple" }}>Completado</span>}
          </div>
        )}
      />
      <Snackbar open={showAlert} autoHideDuration={5000} onClose={() => setShowAlert(false)}>
        <Alert severity={alertSeverity} onClose={() => setShowAlert(false)} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      {selectedEvent && (
        <Dialog open={true} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <div className="dialog">
            <DialogContent>
              <Box px={2} py={2}>
                <Paper elevation={3}>
                  <Box py={2}>
                    <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>Lugar: {selectedEvent.extendedProps.aula || selectedEvent.extendedProps.espacio_reserva}</strong></p>
                    <h2>{selectedEvent.title}</h2>
                    <p></p>
                    <p>Fecha: {selectedEvent.start.toLocaleString()}</p>
                  </Box>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleRejectEvent(selectedEvent)} color="primary">RECHAZAR</Button>
              <Button onClick={() => handleAcceptEvent(selectedEvent)} color="primary">ACEPTAR</Button>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
            </DialogActions>
          </div>

        </Dialog>
      )}
    </div>
  );
};