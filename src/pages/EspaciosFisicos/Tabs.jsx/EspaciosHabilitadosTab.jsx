import {
    Box,
    Paper,
    Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db, firebase } from "../../../firebase";
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExportContainer,
    GridCsvExportMenuItem,
    GridToolbarFilterButton,
    esES,
} from '@mui/x-data-grid';
import { InactivarEspacioButton } from "../ButtonsActions/InactivarEspacioButton";
import { DeleteEspacioFisico } from "../ButtonsActions/DeleteEspacioFisico";

export const EspaciosHabilitadosTab = ({ sede, campus }) => {

    const userAuth = useSelector(state => state.userAuth)
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    //
    var current = new Date();
    //
    const dispatch = useDispatch();
    useEffect(() => {
        DataEspaciosHabilitados()
        /* LoadData() */
    }, [dispatch])

    const DataEspaciosHabilitados = async () => {

        /* let ref = db.collection("edificios"); */

        let ref = await db.collection("sedes").doc(sede).collection('campus').doc(campus).collection('espacios_fisicos').where('estado', '==', 0);

        //Si tiene algun doc anterior se agrega acontinuacion
        ref.onSnapshot(snapshot => {
            /* const totalCount = snapshot.size */
            const data = [
                ...snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id,
                    }
                })
            ];
            setData(data)
            /* setQueryDocqueryDoc(snapshot.docs[totalCount - 1])
            setIsLastPage(totalCount < 1) */
        })
    };

    function CustomFooterTotalComponent(props) {
        console.log(props)
        return <Box sx={{ padding: "10px", display: "flex" }}>Total :{total} </Box>
    }

    function Estado(estado) {
        const d = estado.estado
        let name;
        let color;
        //Controlamos el estado de la factiblidad
        if (estado === 0) {
            name = 'HABILITADO'
            color = 'warning'
        }
        return (
            <Chip label={name} size="small" variant="outlined" color={color} />
        )
    }

    const columns = [
        /* {
            field: 'estado', headerName: 'ESTADO', width: 120,
            renderCell: (params) => {
                return <Estado estado={params.estado} />
            }
        }, */
        {
            field: '1', headerName: 'ESPACIO FISICO', width: 165,
            renderCell: (params) => {
                {/* <RouterLink style={{ textDecoration: 'none' }} to={`/espacio_fisico/ver/${sede}/${campus}/${params.row.espacio_fisico}`}>{params.row.espacio_fisico}</RouterLink> */ }
                return params.row.espacio_fisico
            }
        },
        /* { field: 'edificio', headerName: 'EDIFICIOS', width: 165 }, */
        { field: 'sede', headerName: 'SEDE', width: 110 },
        { field: 'campus', headerName: 'CAMPUS', width: 200 },
        /* { field: 'usuario_creador', headerName: 'CREADO POR', width: 200 }, */
        /* { field: 'direccion', headerName: 'DIRECCION ', width: 200 }, */
        {
            field: 'created', headerName: 'FECHA DE CREACION', type: 'dateTime', width: 180,
            valueGetter: ({ value }) => value && moment(new Date(value.seconds * 1000).toISOString()).format('DD/MM/YYYY'),
        },
        {
            field: '2', headerName: 'INHABILITAR', width: 120,
            renderCell: (params) => {
                return <InactivarEspacioButton props={params.row} />
            }
        },
        {
            field: '3', headerName: 'ELIMINAR', width: 120,
            renderCell: (params) => {
                return <DeleteEspacioFisico sede={sede} campus={campus} props={params.row} />
            }
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
            <CustomExportButton />
            {/* <GridToolbarQuickFilter /> */}

        </GridToolbarContainer>
    );

    return (
        <>
            <Box px={2} pt={1}>
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