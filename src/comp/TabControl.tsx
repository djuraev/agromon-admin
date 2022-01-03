import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import {
    Button,
    ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from '@mui/material';
import MetricDto from '../data-model/MetricDto';
import CropDto from '../data-model/CropDto';
import axios from 'axios';
import {crop, mainServer, metric} from '../config/mainConfig';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
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
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs(props: { metrics: MetricDto[]; crops: CropDto[]; }) {
    const [value, setValue] = React.useState(0);
    const [isCropDialogOpen, setIsCropDialogOpen] = React.useState(false);
    const [isMetricDialogOpen, setIsMetricDialogOpen] = React.useState(false);
    const [cropName, setCropName] = React.useState("");
    const [cropCode, setCropCode] = React.useState("");
    const [cropExtraInfo, setCropExtraInfo] = React.useState("");
    const [metricName, setMetricName] = React.useState("");
    const [metricCode, setMetricCode] = React.useState("");
    const [metricExtraInfo, setMetricExtraInfo] = React.useState("");


    const {metrics, crops} = props;
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const closeCropDialogOpen = () => {
        setIsCropDialogOpen(false);
    }

    const openCropDialogOpen = () => {
        setIsCropDialogOpen(true);
    }

    const closeMetricDialogOpen = () => {
        setIsMetricDialogOpen(false);
    }

    const openMetricDialogOpen = () => {
        setIsMetricDialogOpen(true);
    }

    const handleChangeCropName = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCropName(event.target.value);
    }

    const handleChangeCropCode = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCropCode(event.target.value);
    }

    const handleChangeCropInfo = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCropExtraInfo(event.target.value);
    }

    const handleChangeMetricName = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMetricName(event.target.value);
    }

    const handleChangeMetricCode = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMetricCode(event.target.value);
    }

    const handleChangeMetricInfo = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMetricExtraInfo(event.target.value);
    }

    const saveNewCrop = () => {
        if (cropName.length === 0 || cropCode.length === 0 || cropExtraInfo.length === 0) {
            alert("Please, fill in all fields.");
            return;
        }
        const cropInfo = CropDto.of();
        cropInfo.name = cropName;
        cropInfo.code = cropCode;
        cropInfo.extraInfo = cropExtraInfo;
        const url = mainServer+crop;

        saveData(url, true, cropInfo)
    }

    const saveNewMetric = () => {
        if (metricName.length === 0 || metricCode.length === 0 || metricExtraInfo.length === 0) {
            alert("Please, fill in all fields.");
            return;
        }
        const metricInfo = new MetricDto();
        metricInfo.name = metricName;
        metricInfo.code = metricCode;
        metricInfo.extraInfo = metricExtraInfo;

        const url = mainServer+metric;
        saveData(url, false, metricInfo);
    }

    const saveData = (url: string, isCrop: boolean, data: MetricDto | CropDto) => {
        axios.post(url, data)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage);
                }
                else {
                    alert("Successfully registered.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));

        if (isCrop) {
            closeCropDialogOpen();
        }
        else {
            closeMetricDialogOpen();
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Crops" {...a11yProps(0)} />
                    <Tab label="Metrics" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Grid container>
                    <Grid item xs={12}>
                        <TableContainer sx={{ maxHeight: 500}} aria-label="simple table">
                            <Table stickyHeader>
                                <TableHead style={{fontWeight: 'bold'}}>
                                    <TableRow>
                                        <TableCell align="center" width="0%" style={{fontWeight: 'bold'}}>ID</TableCell>
                                        <TableCell align="center" width="20%" style={{fontWeight: 'bold'}}>Code</TableCell>
                                        <TableCell align="center" width="20%" style={{fontWeight: 'bold'}}>Name</TableCell>
                                        <TableCell align="center" width="50%" style={{fontWeight: 'bold'}}>Extra Info</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {crops.map((crop) => (
                                        <TableRow
                                            key={crop.sequence}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" width="20%">{crop.sequence}</TableCell>
                                            <TableCell align="center" width="20%">{crop.code}</TableCell>
                                            <TableCell align="center" width="20%">{crop.name}</TableCell>
                                            <TableCell align="center" width="60%">{crop.extraInfo}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} style={{margin: 20}}>
                        <ButtonGroup>
                            <Button
                                variant="outlined"
                                onClick={openCropDialogOpen}>
                                <LocalFloristIcon/>
                                &nbsp;&nbsp;Add new Crop
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container>
                    <Grid item xs={12}>
                        <TableContainer sx={{ maxHeight: 500}} aria-label="simple table">
                            <Table stickyHeader>
                                <TableHead style={{backgroundColor: 'whitesmoke'}}>
                                    <TableRow>
                                        <TableCell align="center" width="10%" style={{fontWeight: 'bold'}}>ID</TableCell>
                                        <TableCell align="center" width="20%" style={{fontWeight: 'bold'}}>Code</TableCell>
                                        <TableCell align="center" width="20%" style={{fontWeight: 'bold'}}>Name</TableCell>
                                        <TableCell align="center" width="50%" style={{fontWeight: 'bold'}}>Extra Info</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {metrics.map((metric) => (
                                        <TableRow
                                            key={metric.sequence}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" width="20%">{metric.sequence}</TableCell>
                                            <TableCell align="center" width="20%">{metric.code}</TableCell>
                                            <TableCell align="center" width="20%">{metric.name}</TableCell>
                                            <TableCell align="center" width="60%">{metric.extraInfo}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} style={{margin: 20}}>
                        <ButtonGroup>
                            <Button
                                variant="outlined"
                                onClick={openMetricDialogOpen}>
                                <AutoGraphIcon/>
                                &nbsp;&nbsp;Add new Metric
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </TabPanel>
            <Dialog open={isCropDialogOpen} maxWidth="xs">
                <DialogTitle>Add New Crop</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <TextField
                                placeholder="Crop Name"
                                fullWidth
                                size="small"
                                onChange={handleChangeCropName}
                            />
                        </Grid>
                        <Grid item xs={1}/>

                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <TextField
                                placeholder="Crop Code"
                                fullWidth
                                size="small"
                                onChange={handleChangeCropCode}
                            />
                        </Grid>
                        <Grid item xs={1}/>

                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <TextField
                                placeholder="Crop Extra Info"
                                fullWidth
                                size="small"
                                onChange={handleChangeCropInfo}
                            />
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={saveNewCrop}>Save</Button>
                    <Button
                        onClick={closeCropDialogOpen}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isMetricDialogOpen} maxWidth="xs">
                <DialogTitle>Add New Metric</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <TextField
                                placeholder="Metric Name"
                                fullWidth
                                size="small"
                                onChange={handleChangeMetricName}
                            />
                        </Grid>
                        <Grid item xs={1}/>

                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <TextField
                                placeholder="Metric Code"
                                fullWidth
                                size="small"
                                onChange={handleChangeMetricCode}
                            />
                        </Grid>
                        <Grid item xs={1}/>

                        <Grid item xs={1}/>
                        <Grid item xs={10}>
                            <TextField
                                placeholder="Metric Extra Info"
                                fullWidth
                                size="small"
                                onChange={handleChangeMetricInfo}
                            />
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={saveNewMetric}>Save</Button>
                    <Button
                        onClick={closeMetricDialogOpen}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
