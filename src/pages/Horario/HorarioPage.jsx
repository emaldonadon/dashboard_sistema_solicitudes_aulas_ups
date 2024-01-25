import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { db, firebase } from '../../firebase';
import { PDFExport } from '@progress/kendo-react-pdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const HorarioPage = () => {
  const [scheduleData, setScheduleData] = useState(Array(7).fill(null).map(() => Array(17).fill('')));
  const [celdaEnfocada, setCeldaEnfocada] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pdfExportComponent = useRef(null);

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    overflowX: 'auto',
  };

  const thStyle = {
    border: '1px solid #000000',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  };

  const tdStyle = {
    border: '1px solid #000000',
    padding: '8px',
    textAlign: 'center',
  };

  const infoBoxStyle = {
    position: 'absolute',
    background: '#f2f2f2',
    padding: '10px',
    border: '1px solid #000',
  };

  const eliminarHorario = async () => {
    try {
      const horariosCollection = firebase.firestore().collection('horarios');
      const snapshot = await horariosCollection.get();
      const deletePromises = [];
  
      snapshot.forEach((doc) => {
        const deletePromise = horariosCollection.doc(doc.id).delete();
        deletePromises.push(deletePromise);
      });
      await Promise.all(deletePromises);
      toast.success('Horario eliminado');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error al obtener los horarios', error);
    }
  };
  
  const fetchScheduleData = async () => {
    try {
      const snapshot = await db.collection('horarios').get();

      const newData = Array(7).fill(null).map(() => Array(17).fill(''));

      snapshot.forEach((doc) => {
        const data = doc.data();
        const dia = data.dia.toUpperCase();
        const horaInicio = data.horaInicio.toDate();
        const horaTerminar = data.horaTerminar.toDate();

        if (
          horaInicio instanceof Date &&
          !isNaN(horaInicio) &&
          horaTerminar instanceof Date &&
          !isNaN(horaTerminar)
        ) {
          const dayIndex = [
            'LUNES',
            'MARTES',
            'MIERCOLES',
            'JUEVES',
            'VIERNES',
            'SABADO',
            'DOMINGO',
          ].indexOf(dia);

          if (dayIndex !== -1) {
            /* Recorrer todas las horas entre la hora de inicio y la hora de terminar */
            for (let hour = horaInicio.getHours() - 7; hour < horaTerminar.getHours() - 7; hour++) {
              newData[dayIndex][hour] = {
                materia: data.materia.toUpperCase(),
                profesor: data.profesor.toUpperCase(),
                grupo: data.grupo.toUpperCase(),
                carrera: data.carrera.toUpperCase(),
                aula: data.aula.toUpperCase(),
              };
            }
          }
        }
      });

      setScheduleData(newData);
    } catch (error) {
      console.error('Error al obtener los datos del horario:', error);
    }
  };

  const downloadPDF = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  const getPastelColor = (profesor) => {
    const colors = ['#FFD1DC', '#FFB6C1', '#FF69B4', '#FFC0CB', '#FFA07A', '#FF7F50', '#F08080', '#fdcae1',
      '#b0c2f2', '#b2e2f2', '#ffda9e', '#E6E6FA', '#F0D8D9', '#B0E0E6', '#98f6a9'];

    const hash = profesor.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const index = hash % colors.length;
    return colors[index];
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    fetchScheduleData();
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div>
     <Box display="flex" alignItems="center">
      <Box px={2}>
        <Button color="success" variant="contained" size="small" onClick={downloadPDF}>
          DESCARGAR HORARIO
        </Button>
      </Box>
      <Box px={2}>
        <Button color="error" variant="contained" size="small" onClick={eliminarHorario}>
          ELIMINAR HORARIO
        </Button>
      </Box>
    </Box>
      <PDFExport ref={pdfExportComponent} paperSize="A2">
        <p style={{ fontWeight: 'bold', fontSize: '30px', fontFamily: 'Arial', textAlign: 'center' }}>
          HORARIO DE LABORATORIOS
        </p>
        <table id="pdf-content" style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>HORA</th>
              <th style={thStyle}>LUNES</th>
              <th style={thStyle}>MARTES</th>
              <th style={thStyle}>MIERCOLES</th>
              <th style={thStyle}>JUEVES</th>
              <th style={thStyle}>VIERNES</th>
              <th style={thStyle}>SABADO</th>
              <th style={thStyle}>DOMINGO</th>
            </tr>
          </thead>
          <tbody>
            {Array(17).fill(null).map((_, hour) => (
              <tr key={hour}>
                <td style={tdStyle}>
                  {`${(hour + 7).toString().padStart(2, '0')}:00 - ${(hour + 8).toString().padStart(2, '0')}:00`}
                </td>
                {Array(7).fill(null).map((_, day) => (
                  <td
                    key={day}
                    style={{
                      ...tdStyle,
                      backgroundColor: celdaEnfocada === scheduleData[day][hour] ? '#FFFFFF' :
                        scheduleData[day][hour] ? getPastelColor(scheduleData[day][hour].profesor) : 'transparent',
                    }}
                    onMouseEnter={() => setCeldaEnfocada(scheduleData[day][hour])}
                    onMouseLeave={() => setCeldaEnfocada(null)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {scheduleData[day][hour] && (
                      <div>
                        {scheduleData[day][hour].materia}
                        <br />
                        {scheduleData[day][hour].grupo}
                        <br />
                        {scheduleData[day][hour].profesor}
                        <br />
                        {scheduleData[day][hour].carrera}
                        <br />
                        {scheduleData[day][hour].aula}
                        <br />
                      </div>
                    )}
                  </td>

                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PDFExport>
      {/* Mostrar la información de la celda enfocada */}
      {celdaEnfocada && (
        <div style={{ ...infoBoxStyle, top: mousePosition.y, left: mousePosition.x }}>
          <p>Materia: {celdaEnfocada.materia}</p>
          <p>Grupo: {celdaEnfocada.grupo}</p>
          <p>Profesor: {celdaEnfocada.profesor}</p>
          <p>Carrera: {celdaEnfocada.carrera}</p>
          <p>Aula: {celdaEnfocada.aula}</p>
        </div>
      )}
    </div>
  );
};