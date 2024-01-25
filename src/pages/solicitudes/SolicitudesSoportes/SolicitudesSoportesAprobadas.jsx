import {
    Box, Paper, Chip, Typography, Button, Collapse
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db, firebase } from "../../../firebase";
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExportContainer,
    GridCsvExportMenuItem,
    GridToolbarFilterButton,
    esES
} from '@mui/x-data-grid';

import * as XLSX from "xlsx/xlsx.mjs";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export const SolicitudesSoportesAprobadas = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    function Estado({ estado }) {
        let name;
        let color;
        //Controlamos el estado de la factiblidad
        if (estado === 0) {
            name = 'EN ESPERA';
            color = "warning";
        } else if (estado === 2) {
            name = "COMPLETADA";
            color = "success";
        } else if (estado === 3) {
            name = "CANCELADA";
            color = "secondary";
        } else if (estado === 4) {
            name = "RECHAZADA";
            color = "error";
        }
        return <Chip label={name} color={color} size="small" />;
    }
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    var totalInstalaciones;
    const [nombreZona, setNombreZona] = useState();
    const [codigoZona, setCodigoZona] = useState("");
    const [data, setData] = useState();
    const [data2, setData2] = useState();
    const [isLastPage, setIsLastPage] = useState(0);
    const [queryDoc, setQueryDocqueryDoc] = useState([])
    const [isLastPage2, setIsLastPage2] = useState(0);
    const [queryDoc2, setQueryDocqueryDoc2] = useState([])
    const [search, setSearch] = useState('')
    const [total, setTotal] = useState(0);
    //
    var current = new Date();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(
        new Date(current.getTime() + 86400000)
    );
    //
    const dispatch = useDispatch();
    useEffect(() => {
        LoadData()

    }, [dispatch])
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        //LoadData()
    }

    const LoadData = (startAfterDoc, persistMessages = []) => {

        if (auth.currentUser.cargo === 'ADMINISTRADOR') {
            let ref = db.collection("solicitudes_soporte").where('estado', '==', 2);

            startDate.setHours(0, 0, 0, 0)
            endDate.setHours(23, 59, 0, 0)
            var startfulldate = firebase.firestore.Timestamp.fromDate(startDate);
            var endfulldate = firebase.firestore.Timestamp.fromDate(endDate);
            ref = ref.where('fecha_creacion', '>=', startfulldate)
            ref = ref.where('fecha_creacion', '<=', endfulldate)

            //Si tiene algun doc anterior se agrega acontinuacion
            if (startAfterDoc) ref = ref.startAfter(startAfterDoc)
            ref.onSnapshot(snapshot => {
                const totalCount = snapshot.size
                const data = [
                    ...persistMessages,
                    ...snapshot.docs.map(doc => {
                        return {
                            ...doc.data(),
                            id: doc.id,
                        }
                    })
                ];
                setData(data)
                setQueryDocqueryDoc(snapshot.docs[totalCount - 1])
                setIsLastPage(totalCount < 1)
            })
        } else {
            let ref = db.collection("solicitudes_soporte").where('estado', '==', 2);

            startDate.setHours(0, 0, 0, 0)
            endDate.setHours(23, 59, 0, 0)
            var startfulldate = firebase.firestore.Timestamp.fromDate(startDate);
            var endfulldate = firebase.firestore.Timestamp.fromDate(endDate);
            ref = ref.where('fecha_creacion', '>=', startfulldate)
            ref = ref.where('fecha_creacion', '<=', endfulldate)

            //Si tiene algun doc anterior se agrega acontinuacion
            if (startAfterDoc) ref = ref.startAfter(startAfterDoc)
            ref.onSnapshot(snapshot => {
                const totalCount = snapshot.size
                const data = [
                    ...persistMessages,
                    ...snapshot.docs.map(doc => {
                        return {
                            ...doc.data(),
                            id: doc.id,
                        }
                    })
                ];
                setData(data)
                setQueryDocqueryDoc(snapshot.docs[totalCount - 1])
                setIsLastPage(totalCount < 1)
            })
        }
    };

    function CustomFooterTotalComponent(props) {
        console.log(props)
        return <Box sx={{ padding: "10px", display: "flex" }}>Total :{total} </Box>
    }

    const columns = [
        {
            field: '1', headerName: 'ID SOLICITUD', width: 120,
            renderCell: (params) => {
                const respuesta = params.row.id;
                return `${respuesta}`
            }
        },
        {
            field: 'estado', headerName: 'ESTADO', width: 150,
            renderCell: (params) => {
                return <Estado estado={params.row.estado} />
            }
        },
        { field: 'sede', headerName: 'SEDE', width: 165 },
        { field: 'campus', headerName: 'CAMPUS', width: 165 },
        { field: 'bloque', headerName: 'BLOQUE', width: 165 },
        { field: 'aula', headerName: 'AULA', width: 150 },
        {
            field: 'tipo_ticket', headerName: 'TIPO SOLICITUD', width: 200,
            renderCell: (params) => {
                const respuesta = params.row.tipo_ticket === 'soporte' ? 'SOPORTE TECNICO' : 'SOPORTE TECNICO';
                return `${respuesta}`
            }
        },
        { field: 'tipo_problema', headerName: 'TIPO DE PROBLEMA', width: 300 },
        { field: 'detalle', headerName: 'DETALLE ADICIONAL', width: 300 },
        { field: 'usuario_que_abrio_ticket', headerName: 'SOLICITADO POR', width: 250 },
        { field: 'email_usuario', headerName: 'CORREO DE USUARIO SOLICITANTE', width: 270 },
        {
            field: 'fecha_creacion', headerName: 'FECHA DE CREACION', type: 'dateTime', width: 180,
            valueGetter: ({ value }) => value && moment(new Date(value.seconds * 1000).toISOString()).format('DD/MM/YYYY'),
        },
    ];

    const csvOptions = { delimiter: ';' };
    const CustomExportButton = (props) => (
        <GridToolbarExportContainer {...props}>
            <GridCsvExportMenuItem options={csvOptions} />
        </GridToolbarExportContainer>
    );
    const CustomToolbar = (props) => (
        <GridToolbarContainer {...props}>
            <GridToolbarFilterButton />
            {/* <GridToolbarQuickFilter /> */}

        </GridToolbarContainer>
    );

    const esVerdadero = 0;

    const handleExport = () => {
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        var date1
        if (month < 10) {
            date1 = `${day}-0${month}-${year}_${hours}_${minutes}_${seconds}`
        } else {
            date1 = `${day}-${month}-${year}_${hours}_${minutes}_${seconds}`
        }
        //
        const reData = [
            ...data.map(doc => {
                return {
                    ID_SOLICITUD: doc.id,
                    ESTADO: 'COMPLETADA',
                    SEDE: doc.sede,
                    CAMPUS: doc.campus,
                    BLOQUE: doc.bloque,
                    AULA: doc.aula,
                    TIPO_SOLICITUD: doc.tipo_ticket === 'soporte' ? 'SOPORTE TECNICO' : 'SOPORTE TECNICO',
                    TIPO_DE_PROBLEMA: doc.tipo_problema,
                    DETALLE_ADICIONAL: doc.detalle,
                    USUARIO_QUE_ABRIO_SOLICITUD: doc.usuario_que_abrio_ticket,
                    CORREO_DE_USUARIO_SOLICITANTE: doc.email_usuario,
                    FECHA_DE_CREACION_SOLICITUD: doc.fecha_creacion.toDate(),
                }
            })
        ]
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(reData);
        XLSX.utils.book_append_sheet(wb, ws, "tickets");
        XLSX.writeFile(wb, `Solicitudes_Soporte_Tecnico_Completadas ${date1}.xlsx`)
    }

    const onChange2 = () => {
        LoadData();
    };

    return (
        <>

            <Box pl={1}>
                <p style={{ marginBottom: "0px", marginTop: "0px", fontSize: "14px" }}>
                    SOLICITUDES COMPLETADAS (<strong>{data && data.length}</strong>)
                </p>

                <Box display="flex" style={{ textTransform: "uppercase" }} >
                    <Typography variant="button">
                        <strong>Desde</strong>{" "}
                        {startDate &&
                            moment(startDate.toString()).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                    <Typography variant="button" style={{ paddingLeft: 10 }}>
                        <strong>Hasta</strong>{" "}
                        {endDate &&
                            moment(endDate.toString()).format("MMMM Do YYYY, h:mm:ss a")}
                    </Typography>
                </Box>
            </Box>
            <Box pl={1} sx={{ flexGrow: 1 }}>
                <Box sx={{ flexGrow: 1 }} display="flex" alignItems="center">
                    <Box display="flex" alignItems="center" pb={1}>
                        <Button
                            style={{ fontSize: "11px", marginRight: "5px" }}
                            disableElevation
                            color="primary"
                            variant="contained"
                            size="small"
                            endIcon={open === true ? <ArrowCircleUpIcon fontSize="small" /> : <ArrowCircleDownIcon fontSize="small" />
                            } onClick={() => setOpen(!open)}>
                            Filtrar fecha
                        </Button>
                        <Button
                            style={{ fontSize: "11px" }}
                            disableElevation
                            color="success"
                            variant="outlined"
                            size="small"
                            endIcon={<CloudDownloadIcon fontSize="small" />}
                            onClick={() => handleExport()}
                        >
                            Descargar reporte
                        </Button>
                    </Box>
                </Box>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <DatePicker
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                    />
                    <Box pb={1}>
                        <Button
                            style={{ fontSize: "11px" }}
                            disableElevation
                            color="primary"
                            variant="outlined" size="small"
                            onClick={() => LoadData()}
                        >
                            Buscar
                        </Button>
                    </Box>
                </Collapse>
            </Box>

            <Box px={1}>
                <Paper>
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            density="compact"
                            rows={data ? data : []}
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            // disableColumnFilter
                            // disableColumnSelector
                            // disableDensitySelector
                            //hideFooterPagination
                            columns={columns}
                            components={{
                                Toolbar: CustomToolbar,
                                Footer: CustomFooterTotalComponent,

                            }}

                            onStateChange={(state) => {
                                console.log(state.pagination.rowCount);
                                setTotal(state.pagination.rowCount)
                            }}
                        />
                    </Box>
                </Paper>
            </Box>

        </>
    );
};