import React, {Component} from 'react';
import {
    Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow, TextField,
} from '@mui/material';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import TenantDto from '../../data-model/TenantDto';
import RegionDto from '../../data-model/RegionDto';
import DistrictDto from '../../data-model/DistrictDto';
import VillageDto from '../../data-model/VillageDto';
import {districts, mainServer, regions, tenant, villageMetrics, villages} from '../../config/mainConfig';
import axios from 'axios';
import VillageMetricDto from '../../data-model/VillageMetricDto';
import CSVReader, {IFileInfo} from 'react-csv-reader';
import PreviewIcon from '@mui/icons-material/Preview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DistrictMetricDto from '../../data-model/DistrictMetricDto';

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_")
};

interface Props {

}

interface State {
    tenants: TenantDto[];
    selectedTenant: string,
    regions: RegionDto[],
    selectedRegionId: string;
    districts: DistrictDto[];
    selectedDistrictId: string;
    villages: VillageDto[];
    selectedVillageId: string;
    villageMetrics: VillageMetricDto[];
    csvFilePath: string;
    isPreviewOpen: boolean;
    postMetrics: VillageMetricDto[];
}
class VillageMetrics extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            tenants: [],
            selectedTenant: '',
            regions: [],
            selectedRegionId: '',
            districts: [],
            selectedDistrictId: '',
            villages: [],
            selectedVillageId: '',
            villageMetrics: [],
            csvFilePath: '',
            isPreviewOpen: false,
            postMetrics: [],
        }
    }

    componentDidMount() {
        this.getTenants();
    }

    getTenantRegions(tenantCode: string) {
        const url = mainServer + regions+"/"+tenantCode;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({regions: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getRegionDistricts(regionId: string | number) {
        const url = mainServer + districts+"/"+regionId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({districts: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getDistrictVillages(districtId: string | number) {
        const url = mainServer + villages+"/" + districtId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({villages: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getTenants() {
        const url = mainServer + tenant + "/tenants";
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({tenants: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getVillageMetrics(villageId: string) {
        const url = mainServer + villageMetrics + "/" + villageId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({villageMetrics: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    handleTenantSelectChange(event: SelectChangeEvent) {
        this.setState({selectedTenant: event.target.value, selectedRegionId: '', selectedDistrictId: '',
            selectedVillageId: '', districts: [], villages: []});
        this.getTenantRegions(event.target.value);
    }

    handleRegionSelectChange(event: SelectChangeEvent) {
        const regionId = event.target.value;
        this.setState({selectedRegionId: regionId});
        this.getRegionDistricts(regionId);
    }

    handleDistrictSelectChange(event: SelectChangeEvent) {
        const districtId = event.target.value;
        this.setState({selectedDistrictId: districtId});
        this.getDistrictVillages(districtId);
    }

    handleVillageSelectChange(event: SelectChangeEvent) {
        const villageId = event.target.value;
        this.setState({selectedVillageId: villageId});
        this.getVillageMetrics(villageId);
    }

    handleForce (data: any[], fileInfo: IFileInfo) {
        this.setState({csvFilePath: fileInfo.name});
        let villages: any[] = [];
        for (let i=0; i<data.length; i++) {
            const village = {
                'tenantId' : data[i].tenantid,
                'districtSequence': data[i].districtid,
                'name' : data[i].villagename,
                'coordinates': data[i].latlong,
                'names': []
            };
            villages.push(village);
        }
        //this.setState({postVillages: villages});
    }

    handlePreviewButtonClick() {
        this.setState({isPreviewOpen: true});
    }

    render() {
        const {tenants, selectedTenant, regions, selectedRegionId, districts, selectedDistrictId, villages, selectedVillageId,
               villageMetrics, csvFilePath, isPreviewOpen, postMetrics} = this.state;
        return (
            <Grid container component={Paper} style={{margin: 20, padding: 20, width: '97%'}}>
                <Grid item xs={12}>
                    <Grid container component={Paper} spacing={1} style={{paddingBottom: 20, marginLeft: 0}}>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="countrySelectLabel">Country</InputLabel>
                                <Select
                                    labelId="countrySelectLabel"
                                    id="countrySelect"
                                    value={selectedTenant}
                                    label="Country"
                                    onChange={(event) => {this.handleTenantSelectChange(event)}}
                                >
                                    {tenants.map((tenant) => (
                                        <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="regionSelectLabel">Region</InputLabel>
                                <Select
                                    labelId="regionSelectLabel"
                                    id="regionSelect"
                                    label="Region"
                                    value={selectedRegionId}
                                    onChange={(e) => {this.handleRegionSelectChange(e)}}
                                >
                                    {
                                        regions ?
                                            regions.map((region) => (
                                                <MenuItem value={region.sequence.toLocaleString()}>{region.name}</MenuItem>
                                            ))
                                            :
                                            <MenuItem>No Regions</MenuItem>
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}/>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="districtSelectLabel">District</InputLabel>
                                <Select
                                    labelId="districtSelectLabel"
                                    id="districtSelect"
                                    label="District"
                                    value={selectedDistrictId}
                                    onChange={(e) => {this.handleDistrictSelectChange(e)}}
                                >
                                    {districts.map((district) => (
                                        <MenuItem value={district.sequence.toLocaleString()}>{district.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="villageSelectLabel">Village</InputLabel>
                                <Select
                                    labelId="villageSelectLabel"
                                    id="villageSelect"
                                    label="Village"
                                    value={selectedVillageId}
                                    onChange={(e) => {this.handleVillageSelectChange(e)}}
                                >
                                    {villages.map((village) => (
                                        <MenuItem value={village.sequence.toLocaleString()}>{village.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                            <Button variant="outlined">
                                <LocationSearchingSharpIcon/>
                                &nbsp;&nbsp;Search
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table aria-label="custom pagination table">
                            <TableHead style={{backgroundColor: 'whitesmoke'}}>
                                <TableRow>
                                    <TableCell align="center">Crop </TableCell>
                                    <TableCell align="center">Metric</TableCell>
                                    <TableCell align="center">Year</TableCell>
                                    <TableCell align="center">Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {villageMetrics.map((vm) => (
                                    <TableRow
                                        key={vm.sequence}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">{vm.cropName}</TableCell>
                                        <TableCell align="center">{vm.metricName}</TableCell>
                                        <TableCell align="center">{vm.year}</TableCell>
                                        <TableCell align="center">{vm.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} style={{marginTop: 50}}>
                    <Divider/>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <Grid container style={{marginTop: 20, padding: 5, margin: 5}}>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Please, select file"
                                    value={csvFilePath}
                                />
                            </Grid>
                            <Grid item xs={2} style={{padding: 6}}>
                                <CSVReader
                                    cssClass="react-csv-input"
                                    onFileLoaded={(data, fileInfo) => {this.handleForce(data, fileInfo)}}
                                    parserOptions={papaparseOptions}
                                />
                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={5}>
                                <ButtonGroup>
                                    <Button
                                        variant="outlined"
                                        onClick={(event) => {this.handlePreviewButtonClick()}}
                                    >
                                        <PreviewIcon/>
                                        &nbsp;&nbsp;Preview Data
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        /*onClick={(event) => {this.uploadVillages()}}>*/
                                    >
                                        <CloudUploadIcon/>
                                        &nbsp;&nbsp;Upload
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        /*onClick={(event) => {this.uploadVillages()}}>*/
                                    >
                                        <FormatListBulletedIcon/>
                                        &nbsp;&nbsp;Generate Template
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Dialog open={isPreviewOpen}>
                    <DialogTitle>Parsed Villages</DialogTitle>
                    <DialogContent>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead style={{backgroundColor: 'whitesmoke'}}>
                                    <TableRow>
                                        <TableCell align="center">Crop Id</TableCell>
                                        <TableCell align="center">Crop Name</TableCell>
                                        <TableCell align="center">Metric Id</TableCell>
                                        <TableCell align="center">Metric Name</TableCell>
                                        <TableCell align="center">Village Id</TableCell>
                                        <TableCell align="center">Year</TableCell>
                                        <TableCell align="center">Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {postMetrics.map((metric) => (
                                        <TableRow
                                            key={metric.value}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{metric.cropId}</TableCell>
                                            <TableCell align="center">{metric.cropName}</TableCell>
                                            <TableCell align="center">{metric.metricId}</TableCell>
                                            <TableCell align="center">{metric.metricName}</TableCell>
                                            <TableCell align="center">{metric.villageId}</TableCell>
                                            <TableCell align="center">{metric.year}</TableCell>
                                            <TableCell align="center">{metric.value}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={()=>{this.setState({isPreviewOpen: false})}}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default VillageMetrics;
