import {
    Box,
    Paper,
    Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
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
import { ActivarCampusButton } from "../ButtonsActions/ActivarCampusButton";
import { DeleteCampus } from "../DeleteCampus";

export const CampusesInhabilitadosTab = ({ sede }) => {

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

        let ref = await db.collection("sedes").doc(sede).collection('campus').where('estado', '==', 1);

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
        { field: 'sede', headerName: 'SEDE', width: 110 },
        { field: 'campus', headerName: 'CAMPUS', width: 200 },
        { field: 'direccion', headerName: 'DIRECCION', width: 400 },
        {
            field: '2', headerName: 'INHABILITAR', width: 120,
            renderCell: (params) => {
                return <ActivarCampusButton props={params.row} />
            }
        },
        {
            field: '', headerName: 'ELIMINAR', width: 120,
            renderCell: (params) => {
                return <DeleteCampus props={params.row} />
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