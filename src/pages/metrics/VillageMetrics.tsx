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
    TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import TenantDto from '../../data-model/TenantDto';
import RegionDto from '../../data-model/RegionDto';
import DistrictDto from '../../data-model/DistrictDto';
import VillageDto from '../../data-model/VillageDto';
import {
    crops,
    districtMetrics2,
    districts,
    mainServer, metrics,
    regions,
    tenant, villageMetricDynamic,
    villageMetrics, villageMetrics2,
    villages
} from '../../config/mainConfig';
import axios from 'axios';
import VillageMetricDto from '../../data-model/VillageMetricDto';
import CSVReader, {IFileInfo} from 'react-csv-reader';
import PreviewIcon from '@mui/icons-material/Preview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountDto from '../../data-model/AccountDto';
import LocalStorageHelper from '../../helper/LocalStorageHelper';
import MetricDto from '../../data-model/MetricDto';
import CropDto from '../../data-model/CropDto';
import UserDto from '../../data-model/UserDto';
import {CSVLink} from 'react-csv';

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
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
    metrics: MetricDto[];
    crops: CropDto[];
    selectedMetric: string;
    selectedCrop: string;
    isGenerateTemplate: boolean;
    csvDataContent: [];
    selectedCropName: string;
    selectedMetricName: string;
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
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
            metrics: [],
            crops: [],
            selectedMetric: '',
            selectedCrop: '',
            isGenerateTemplate: false,
            csvDataContent: [],
            selectedCropName: '',
            selectedMetricName: '',
        }
    }

    componentDidMount() {
        const user = LocalStorageHelper.getItem("currentUser");
        const currentUser = JSON.parse(user);
        this.setState({currentUser: currentUser});
        this.getTenants();
        if (currentUser.adminType === "SUPER") {

        }
        else {
            this.setState({selectedTenant: currentUser.tenantId});
            this.setState({isTenantSelectDisabled: true})
            this.getTenantRegions(currentUser.tenantId);
        }
        this.getAllCrops();
        this.getAllMetrics();
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

    getVillageMetrics() {
        const url = mainServer + villageMetricDynamic;
        const { selectedVillageId, selectedCrop, selectedMetric} = this.state;
        const metricExample = {
            "villageId": selectedVillageId,
            "cropId": selectedCrop,
            "metricId": selectedMetric
        };

        axios.post(url, metricExample)
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed)
                {
                    let metrics: VillageMetricDto[] = response.data.entities[0];
                    this.setState({villageMetrics: metrics});
                }
                else {
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
    }

    handleForce (data: any[], fileInfo: IFileInfo) {
        this.setState({csvFilePath: fileInfo.name});
        let metrics: any[] = [];
        for (let i=0; i<data.length; i++) {
            const metric = {
                'cropId' : data[i].cropid,
                'cropName': data[i].cropname,
                'villageId' : data[i].villageid,
                'metricId': data[i].metricid,
                'metricName': data[i].metricname,
                'year': data[i].year,
                'value': data[i].value
            };
            metrics.push(metric);
        }
        this.setState({postMetrics: metrics});
        //this.setState({postVillages: villages});
    }

    getAllMetrics() {
        const url = mainServer + metrics;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({metrics: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getAllCrops() {
        const url = mainServer + crops;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({crops: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    handlePreviewButtonClick() {
        this.setState({isPreviewOpen: true});
    }

    handleMetricSelectChange(event: SelectChangeEvent) {
        const metricID = event.target.value;
        this.setState({selectedMetric: metricID});
    }

    handleCropSelectChange(event: SelectChangeEvent) {
        const cropId = event.target.value;
        this.setState({selectedCrop: cropId});
    }

    handSearchButtonClick() {
        this.getVillageMetrics();
    }

    generateTemplateClick() {
        const {metrics, selectedTenant, selectedRegionId, selectedDistrictId, selectedMetric, crops, selectedCrop, selectedVillageId} = this.state;
        if (selectedTenant === '' || selectedTenant.length === 0) {
            alert("Please, select the Country.");
            return;
        }
        if (selectedRegionId === '' || selectedRegionId.length === 0) {
            alert("Please, select the Region.");
            return;
        }
        if (selectedDistrictId === '' || selectedDistrictId.length === 0) {
            alert("Please, select the District.");
            return;
        }
        if (selectedVillageId === '' || selectedVillageId.length === 0) {
            alert("Please, select the Village.");
            return;
        }
        if (selectedMetric === '' || selectedMetric.length === 0) {
            alert("Please, select the Metric.");
            return;
        }
        if (selectedCrop === '' || selectedCrop.length === 0) {
            alert("Please, select the Crop.");
            return;
        }
        // @ts-ignore
        let cropName = crops.find(crop => crop.sequence === parseInt(selectedCrop)).name;
        // @ts-ignore
        let metricName = metrics.find(metric => metric.sequence === parseInt(selectedMetric)).name;

        const csvData = [
            ["tenantid", "cropid", "cropname", "metricid", "metricname", "villageid", "year", "value"],
            [selectedTenant, selectedCrop, cropName, selectedMetric, metricName, selectedVillageId, "Year here", "Value here"]
        ];
        // @ts-ignore
        this.setState({isGenerateTemplate: true, selectedMetricName: metricName, selectedCropName: cropName, csvDataContent: csvData});
    }

    render() {
        const {tenants, selectedTenant, regions, selectedRegionId, districts, selectedDistrictId, villages, selectedVillageId,
               villageMetrics, csvFilePath, isPreviewOpen, postMetrics, isTenantSelectDisabled, metrics, crops, selectedMetric,
               selectedCrop, isGenerateTemplate, csvDataContent, selectedCropName, selectedMetricName} = this.state;

        return (
            <Grid container component={Paper} style={{margin: 20, padding: 20, width: '97%'}}>
                <Grid item xs={12}>
                    <Grid container component={Paper} spacing={1} style={{paddingBottom: 20, marginLeft: 0}}>
                        <Grid item xs={1}/>
                        <Grid item xs={3}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="countrySelectLabel">Country</InputLabel>
                                <Select
                                    labelId="countrySelectLabel"
                                    id="countrySelect"
                                    value={selectedTenant}
                                    disabled={isTenantSelectDisabled}
                                    label="Country"
                                    onChange={(event) => {this.handleTenantSelectChange(event)}}
                                >
                                    {tenants.map((tenant) => (
                                        <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
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
                        <Grid item xs={2}/>
                        <Grid item xs={1}/>
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="metricSelectLabel">Metric</InputLabel>
                                <Select
                                    labelId="metricSelectLabel"
                                    id="metricSelect"
                                    label="Metric"
                                    value={selectedMetric}
                                    onChange={(e) => {this.handleMetricSelectChange(e)}}
                                >
                                    {metrics.map((metric) => (
                                        <MenuItem value={metric.sequence.toLocaleString()}>{metric.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="cropSelectLabel">Crop</InputLabel>
                                <Select
                                    labelId="cropSelectLabel"
                                    id="cropSelect"
                                    label="Crop"
                                    value={selectedCrop}
                                    onChange={(e) => {this.handleCropSelectChange(e)}}
                                >
                                    {crops.map((crop) => (
                                        <MenuItem value={crop.sequence.toLocaleString()}>{crop.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                            <Button
                                variant="outlined"
                                onClick={() => {this.handSearchButtonClick()}}
                            >
                                <LocationSearchingSharpIcon/>
                                &nbsp;&nbsp;Search
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper} style={{marginTop: 20}} sx={{ maxHeight: 500}}>
                        <Table aria-label="custom pagination table" stickyHeader>
                            <TableHead>
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
                                        onClick={(event) => {this.uploadVillages()}}>
                                        <CloudUploadIcon/>
                                        &nbsp;&nbsp;Upload
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={(event) => {this.generateTemplateClick()}}
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
                    <DialogTitle>Parsed Metrics</DialogTitle>
                    <DialogContent>
                        <TableContainer>
                            <Table aria-label="simple table" stickyHeader>
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

                <Dialog open={isGenerateTemplate}>
                    <DialogTitle>Template for Upload</DialogTitle>
                    <DialogContent>
                        <TableContainer>
                            <Table aria-label="custom pagination table" stickyHeader>
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
                                    <TableRow>
                                        <TableCell align="center">{selectedCrop}</TableCell>
                                        <TableCell align="center">{selectedCropName}</TableCell>
                                        <TableCell align="center">{selectedMetric}</TableCell>
                                        <TableCell align="center">{selectedMetricName}</TableCell>
                                        <TableCell align="center">{selectedVillageId}</TableCell>
                                        <TableCell align="center">Year here</TableCell>
                                        <TableCell align="center">Value here</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained">
                            <CSVLink data={csvDataContent}>Download</CSVLink>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {this.onCloseGenerateTemplate()}}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }

    onCloseGenerateTemplate() {
        this.setState({isGenerateTemplate: false});
    }

    private uploadVillages() {
        const {postMetrics} = this.state;
        if (postMetrics.length === 0) {
            alert("No Village Metrics. Please, select .csv file which contains metrics.");
            return;
        }

        const url = mainServer + villageMetrics2;
        axios.post(url, postMetrics)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage);
                }
                else {
                    alert("District Metrics successfully saved.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
    }
}

export default VillageMetrics;
