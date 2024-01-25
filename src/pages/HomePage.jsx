import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Card
} from "@mui/material";
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import { db } from '../../src/firebase';

import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';

import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';

import PendingIcon from '@mui/icons-material/Pending';

import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

import CancelIcon from '@mui/icons-material/Cancel';

export const HomePage = () => {
  const [solicitudesAulas, setSolicitudesAulas] = useState(0);
  const [solicitudesEspacios, setSolicitudesEspacios] = useState(0);
  const [solicitudesSoporte, setSolicitudesSoporte] = useState(0);

  useEffect(() => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    const solicitudesRef = db.collection("solicitudes_aulas");
    const aulas = solicitudesRef.where("fecha_creacion", ">=", fechaActual).where("fecha_creacion", "<=", new Date());

    const unsubscribeAulas = aulas.onSnapshot((snapshot) => {
      setSolicitudesAulas(snapshot.size);
    });

    const solicitudesEspaciosRef = db.collection("solicitudes_espacios_fisicos");
    const espaciosfisicos = solicitudesEspaciosRef.where("dia", ">=", fechaActual).where("dia", "<=", new Date());

    const unsubscribeEspacios = espaciosfisicos.onSnapshot((snapshot) => {
      setSolicitudesEspacios(snapshot.size);
    });

    const solicitudesSoporteRef = db.collection("solicitudes_soporte");
    const soporte = solicitudesSoporteRef.where("fecha_creacion", ">=", fechaActual).where("fecha_creacion", "<=", new Date());

    const unsubscribeSoporte = soporte.onSnapshot((snapshot) => {
      setSolicitudesSoporte(snapshot.size);
    });

    return () => {
      unsubscribeAulas();
      unsubscribeEspacios();
      unsubscribeSoporte();
    };
  }, []);

  return (
    <>
      <Box px={2} pb={2}>
        <p style={{ marginBottom: "4px" }}><strong>SOLICITUDES DE AULAS</strong></p>
        <Grid container spacing={3}>

          {/* DIA DE PAGO */}

          <Grid item xs={4}>
            <Card elevation={1} sx={{ borderRadius: "8px" }}>
              <Box py={2} px={2} sx={{ bgcolor: '#ff6f00' }}>

                <ScheduleSendIcon sx={{ color: "white" }} fontSize="small" />
                <p style={{ fontSize: "40px", marginBottom: "4px", marginTop: '0px', color: "white", fontWeight: 'bold' }}>{solicitudesAulas}</p>
                <p style={{ fontSize: "12px", marginBottom: "0px", marginTop: '0px', color: "white" }}>Solicitudes en espera</p>
              </Box>
            </Card>
          </Grid>

          {/* DEUDA ACTUAL */}

          <Grid item xs={4}>
            <Card elevation={1} sx={{ borderRadius: "8px" }}>
              <Box py={2} px={2} sx={{ bgcolor: '#00bfa5', borderRadius: "8px" }}>
                <MarkEmailReadIcon sx={{ color: "white" }} fontSize="small" />
                <p style={{ fontSize: "40px", marginBottom: "4px", marginTop: '0px', color: "white", fontWeight: 'bold' }}>{solicitudesEspacios}</p>
                <p style={{ fontSize: "12px", marginBottom: "0px", marginTop: '0px', color: "white" }}>Solicitudes aprobadas</p>
              </Box>
            </Card>
          </Grid>

          {/* PROXIMO CORTE DE SERVICIOS */}

          <Grid item xs={4}>
            <Card elevation={1} sx={{ borderRadius: "8px" }}>
              <Box py={2} px={2} sx={{ bgcolor: '#e53935', borderRadius: "8px" }}>

                <UnsubscribeIcon sx={{ color: "white" }} fontSize="small" />
                <p style={{ fontSize: "40px", marginBottom: "4px", marginTop: '0px', color: "white", fontWeight: 'bold' }}>{solicitudesSoporte}</p>
                <p style={{ fontSize: "12px", marginBottom: "0px", marginTop: '0px', color: "white" }}>Solicitudes rechazadas</p>

              </Box>
            </Card>
          </Grid>
        </Grid>

      </Box>

      {/* <Box px={2}>
        <p style={{ marginBottom: "4px" }}><strong>SOLICITUDES DE SOPORTE</strong></p>
        <Grid container spacing={3}>

          DIA DE PAGO

          <Grid item xs={4}>
            <Card elevation={1} sx={{ borderRadius: "8px" }}>
              <Box py={2} px={2} sx={{ bgcolor: '#ff6f00' }}>

                <PendingIcon sx={{ color: "white" }} fontSize="small" />
                <p style={{ fontSize: "40px", marginBottom: "4px", marginTop: '0px', color: "white", fontWeight: 'bold' }}>{solicitudesAulas}</p>
                <p style={{ fontSize: "12px", marginBottom: "0px", marginTop: '0px', color: "white" }}>Solicitudes en espera</p>

              </Box>
            </Card>
          </Grid>

          DEUDA ACTUAL

          <Grid item xs={4}>
            <Card elevation={1} sx={{ borderRadius: "8px" }}>
              <Box py={2} px={2} sx={{ bgcolor: '#0d47a1', borderRadius: "8px" }}>
                <PrecisionManufacturingIcon sx={{ color: "white" }} fontSize="small" />
                <p style={{ fontSize: "40px", marginBottom: "4px", marginTop: '0px', color: "white", fontWeight: 'bold' }}>{solicitudesEspacios}</p>
                <p style={{ fontSize: "12px", marginBottom: "0px", marginTop: '0px', color: "white" }}>En proceso de reparacion</p>
              </Box>
            </Card>
          </Grid>

          PROXIMO CORTE DE SERVICIOS

          <Grid item xs={4}>
            <Card elevation={1} sx={{ borderRadius: "8px" }}>
              <Box py={2} px={2} sx={{ bgcolor: '#e53935', borderRadius: "8px" }}>

                <CancelIcon sx={{ color: "white" }} fontSize="small" />
                <p style={{ fontSize: "40px", marginBottom: "4px", marginTop: '0px', color: "white", fontWeight: 'bold' }}>{solicitudesSoporte}</p>
                <p style={{ fontSize: "12px", marginBottom: "0px", marginTop: '0px', color: "white" }}>Solicitudes rechazadas</p>

              </Box>
            </Card>
          </Grid>
        </Grid>

      </Box> */}
    </>
  )
}