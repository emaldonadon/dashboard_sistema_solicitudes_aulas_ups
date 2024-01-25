import React, { useState, useEffect } from 'react'
import { Tabs, Box, Tab, tabsClasses, Typography, Paper, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { CrearCampus } from './CrearCampus';
import { ListaCampus } from './ListaCampus';
import { ListaCampusInactivas } from './ListaCampusInactivas';

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
function tabs(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export const VerSedePage = () => {
  const params = useParams()
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState('');
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  useEffect(() => {
  }, []);
  return (
    <>
      <Box py={0} px={2}>
        <Box pb={1}>
          <Typography variant="h5" >{params.sede}</Typography>
        </Box>
        <Paper elevation={3}>
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
              <Tab label="CAMPUS" {...tabs(0)} />
              <Tab label="CAMPUS INHABILITADAS" {...tabs(1)} />
              <Tab label="CREAR NUEVO CAMPUS" {...tabs(2)} />
            </Tabs>
          </Box>
        </Paper>
      </Box>
      <TabPanel value={tab} index={0}>
        <ListaCampus />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ListaCampusInactivas />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CrearCampus />
      </TabPanel>
    </>
  )
}