import {
    Box, Typography, Button, TableHead, Paper, Chip, IconButton, Collapse, Hidden, Stack
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db, firebase } from "../../firebase";
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx/xlsx.mjs";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarContainerProps,
    GridToolbarExportContainer,
    GridCsvExportMenuItem,
    GridCsvExportOptions,
    GridExportMenuItemProps,
    useGridApiContext,
    gridFilteredSortedRowIdsSelector,
    gridVisibleColumnFieldsSelector,
    GridApi,
    GridToolbar,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    esES,
    CustomExportButton
} from '@mui/x-data-grid';

export const ListaUsuarios = () => {
    const userAuth = useSelector(state => state.userAuth)
    const { loading, userInfo } = userAuth
    function Estado(estado) {
        const d = estado.estado
        let name;
        let color;
        //Controlamos el estado de la factiblidad
        if (d.estado === 0) {
            name = 'POR INSTALAR'
            color = 'warning'
        }
        if (d.cambio_domicilio === true) {
            name = 'CAMBIO DOMICILIO'
            color = 'info'
        }
        return (
            <Chip label={name} size="small" variant="outlined" color={color} />
        )
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

        let ref = db.collection("usuarios");

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
    };

    function CustomFooterTotalComponent(props) {
        console.log(props)
        return <Box sx={{ padding: "10px", display: "flex" }}>Total :{total} </Box>
    }

    const columns = [
        { field: 'name', headerName: 'NOMBRE', width: 220 },
        { field: 'email', headerName: 'CORREO', width: 180 },
        { field: 'cargo', headerName: 'CARGO', width: 150 },
        {
            field: 'created', headerName: 'FECHA DE CREACION', type: 'dateTime', width: 180,
            valueGetter: ({ value }) => value && moment(new Date(value.seconds * 1000).toISOString()).format('DD/MM/YYYY'),
        },
        { field: 'user_created', headerName: 'CREADO POR', width: 500 },
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

                    CODIGO_PRODUCTO: doc.codigo_producto,

                    DESCRIPCION: doc.descripcion_producto,

                    CATEGORIA: doc.categoria_producto,

                    SUBCATEGORIA: doc.subcategoria_producto,

                    PRESENTACION: doc.presentacion_producto,

                    MARCA: doc.marca_producto,

                    MODELO: doc.modelo_producto,

                    UNIDAD_MEDIDA: doc.unidad_Medida_Producto,

                    COSTO_ESTANDAR: doc.costo_estandar_producto,

                    PRECIO_COMPRA: doc.precio_compra_producto,

                    PRECIO_VENTA: doc.precio_venta_producto,

                    CANTIDAD: doc.cantidad_producto,

                    ESTADO_PRODUCTO: doc.estado_producto === 0 ? 'ACTIVO' : 'INACTIVO',

                    STOCK_MINIMO: doc.stock_minimo_producto,

                    STOCK_SEGURIDAD: doc.stock_seguridad_producto,

                    STOCK_MAXIMO: doc.stock_maximo_producto,

                    BODEGA: doc.bodega,

                }
            })
        ]
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(reData);
        XLSX.utils.book_append_sheet(wb, ws, "productos");
        XLSX.writeFile(wb, `PRODUCTOS_${date1}.xlsx`)
    }

    const onChange2 = () => {
        LoadData();
    };

    return (
        <>
        <Box px={2}>
        <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>LISTA DE USUARIO</strong></p>
        </Box>
            <Box px={2}>
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