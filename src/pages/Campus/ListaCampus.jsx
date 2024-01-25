import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Grid,
    Select,
    MenuItem,
    Tabs,
    Tab,
    tabsClasses
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db, firebase } from "../../firebase";
import { useDispatch, useSelector } from 'react-redux';
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
import { CampusesHabilitadosTab } from "./Tabs/CampusesHabilitadosTab";
import { CampusesInhabilitadosTab } from "./Tabs/CampusesInhabilitadosTab";

export const ListaCampus = () => {

    const [listSedes, setListSedes] = useState([])
    const [sede, setSede] = useState('')

    const [listCampus, setListCampus] = useState([])
    const [campus, setCampus] = useState('')

    const getListSedes = () => {
        let ref = db.collection("sedes").where("estado", "==", 0)

        ref.onSnapshot(snapshot => {
            const data = [
                ...snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id,
                    }
                })
            ];
            setListSedes(data)
        })
    }

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
        })
    }

    const userAuth = useSelector(state => state.userAuth)
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
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
        getListSedes()
        /* LoadData() */
    }, [dispatch])
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        //LoadData()
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

    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    function tabs(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

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
                    <Box>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    return (
        <>

            <Box px={2}>
                <p style={{ marginBottom: "10px", marginTop: "0px" }}><strong>SELECCIONE LA SEDE</strong></p>
            </Box>

            <Box px={2} pb={1}>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <p style={{ fontSize: "11px", marginBottom: "8px", marginTop: "0px" }}><strong>SEDE:</strong></p>

                        <Select
                            sx={{
                                '& legend': { display: 'none' },
                                '& fieldset': { top: 0 },
                            }}
                            fullWidth
                            size="small"
                            value={sede}
                            onChange={(e) => {
                                setSede(e.target.value)
                                getListCampus(e.target.value)
                            }}
                        >
                            {listSedes && listSedes.map((row, key) => (
                                <MenuItem value={row.sede}>{row.sede}</MenuItem>
                            ))}

                        </Select>
                    </Grid>
                </Grid>

            </Box>

            <Box px={2}>
                <p style={{ marginBottom: "8px", marginTop: "8px" }}><strong>LISTA DE CAMPUS</strong></p>
            </Box>

            <Box px={2}>
                <Paper elevation={2}>
                    <Box py={1} px={1} sx={{ maxWidth: { xs: 340, sm: '100%' }, bgcolor: 'background.paper' }}>
                        <Tabs
                            value={tab}
                            variant="scrollable"
                            indicatorColor="primary"
                            allowScrollButtonsMobile
                            onChange={handleChange}
                            sx={{
                                [`& .${tabsClasses.scrollButtons}`]: {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                            }}
                            aria-label="solicitud de servicio">
                            <Tab label="HABILITADOS" {...tabs(0)} />
                            <Tab label="INHABILITADOS" {...tabs(1)} />
                        </Tabs>
                    </Box>
                </Paper>
            </Box>

            <TabPanel value={tab} index={0}>

                <CampusesHabilitadosTab sede={sede} />

            </TabPanel>

            <TabPanel value={tab} index={1}>

                <CampusesInhabilitadosTab sede={sede} />

            </TabPanel>

        </>
    );
};