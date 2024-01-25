import React, { useState, useEffect } from 'react'
import { Tabs, Typography, Box, Tab, Card, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { SolicitudesAulasEspera } from './SolicitudesAulasEspera';
import { SolicitudesAulasAprobadas } from './SolicitudesAulasAprobadas';
import { SolicitudesAulasCanceladas } from './SolicitudesAulasCanceladas';
import { SolicitudesAulasRechazadas } from './SolicitudesAulasRechazadas';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box pt={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}
function tabs(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export const SolicitudesAulas = () => {
    const params = useParams()
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const handleChange = (event, newValue) => {
        setTab(newValue);
        console.log(newValue)
    };
    useEffect(() => {
        if (params.id) {
            console.log(typeof params.id)
            //Se crear una nueva solicitud y retorna a solicitudes de espera por URL
            setTab(parseInt(params.id));
        }
    }, [params.id]);
    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Box pl={1} pb={0} pt={1}>
                        <Typography variant="h5" component="h1"><strong>SOLICITUDES DE AULAS / LABORATORIOS</strong></Typography>
                    </Box>
                    <Tabs value={tab} onChange={handleChange} aria-label="solicitud de servicio">
                        <Tab label="EN ESPERA" {...tabs(0)} />
                        <Tab label="APROBADAS" {...tabs(1)} />
                        <Tab label="CANCELADAS" {...tabs(2)} />
                        <Tab label="RECHAZADAS" {...tabs(3)} />
                        {/* <Tab label="Crear Usuario" {...tabs(1)} /> */}
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <SolicitudesAulasEspera />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <SolicitudesAulasAprobadas />
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <SolicitudesAulasCanceladas />
                    </TabPanel>
                    <TabPanel value={tab} index={3}>
                        <SolicitudesAulasRechazadas />
                    </TabPanel>
                </CardContent>
            </Card>
        </>
    )
}