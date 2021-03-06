import React, {Component} from 'react';
import {
    Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import TenantDto from '../data-model/TenantDto';
import RegionDto from '../data-model/RegionDto';
import DistrictDto from '../data-model/DistrictDto';
import {districts, mainServer, regions, tenant, villages, villages2} from '../config/mainConfig';
import axios from 'axios';
import VillageDto from '../data-model/VillageDto';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import PreviewIcon from '@mui/icons-material/Preview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CSVReader, {IFileInfo} from 'react-csv-reader';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountDto from '../data-model/AccountDto';
import LocalStorageHelper from '../helper/LocalStorageHelper';
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
    regions: RegionDto[];
    districts: DistrictDto[];
    villages: VillageDto[];
    selectedTenant: string;
    selectedRegion: string;
    selectedDistrict: string;
    csvFilePath: string;
    postVillages: any[];
    isVillagesPreviewOpen: boolean;
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
    isTemplateDialogOpen: boolean;
    selectedCountryName: string;
    selectedRegionName: string;
    selectedDistrictName: string;
    csvDataContent: [];
}

class Villages extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            tenants: [],
            regions: [],
            districts: [],
            villages: [],
            selectedTenant: '',
            selectedRegion: '',
            selectedDistrict: '',
            csvFilePath: '',
            postVillages: [],
            isVillagesPreviewOpen: false,
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
            isTemplateDialogOpen: false,
            selectedCountryName: '',
            selectedRegionName: '',
            selectedDistrictName: '',
            csvDataContent: [],
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
            this.setState({selectedTenant: currentUser.tenantId.toString()});
            this.setState({isTenantSelectDisabled: true})
            this.getTenantRegions(currentUser.tenantId, false);
        }
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
        this.setState({postVillages: villages});
    }

    handlePreviewButtonClick() {
        this.setState({isVillagesPreviewOpen: true});
    }

    handleGetTemplateButtonClick() {
        const {  selectedTenant, selectedDistrict} = this.state;
        const csvData = [
            ["tenantid", "districtid", "villagename", "latlong"],
            [selectedTenant, selectedDistrict, "Name here", "Coordinates here"],
        ];
        // @ts-ignore
        this.setState({isTemplateDialogOpen: true, csvDataContent: csvData});
    }

    uploadVillages() {
        const {postVillages} = this.state;
        if (postVillages.length === 0) {
            alert("No villages selected. Please, select .csv file which contains villages.");
            return;
        }
        const url = mainServer + villages2;
        axios.post(url, postVillages)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage);
                }
                else {
                    alert("Villages successfully registered.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
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

    getTenantRegions(tenantCode: string, isModal: boolean) {
        const url = mainServer + regions+"/"+tenantCode;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    if (isModal) {
                    }
                    else {
                        this.setState({regions: response.data.entities[0]});
                    }
                }
                else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getRegionDistricts(regionId: string, isModal: boolean) {
        const url = mainServer + districts+"/"+regionId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    if (isModal) {
                        this.setState({districts: response.data.entities[0]});
                    }
                    else {
                        this.setState({districts: response.data.entities[0]});
                    }
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getDistrictVillages(districtId: string, isModal: boolean) {
        const url = mainServer + villages+"/" + districtId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    if (isModal) {
                       // this.setState({villagesModal: response.data.entities[0]});
                    }
                    else {
                        this.setState({villages: response.data.entities[0]});
                    }
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    private handleTenantSelectChange(event: SelectChangeEvent) {
        const selectedValue = event.target.value;
        const id = parseInt(selectedValue);
        const {tenants} = this.state;
        const tenant = tenants.find(e => e.id === id)
        // @ts-ignore
        this.setState({selectedCountryName: tenant.country});
        this.setState({selectedTenant: selectedValue});
        this.getTenantRegions(event.target.value, false);
    }

    private handleRegionSelectChange(event: SelectChangeEvent) {
        const selectedValue = event.target.value;
        const id = parseInt(selectedValue);
        const {regions} = this.state;
        const region = regions.find(e => e.sequence === id)
        // @ts-ignore
        this.setState({selectedRegion: selectedValue, selectedRegionName: region.name});
        this.getRegionDistricts(selectedValue, false);
    }

    private handleDistrictSelectChange(event: SelectChangeEvent) {
        const selectedValue = event.target.value;
        const id = parseInt(selectedValue);
        const {districts} = this.state;
        const district = districts.find(e => e.sequence === id);
        // @ts-ignore
        this.setState({selectedDistrict: selectedValue, selectedDistrictName: district.name});
        this.getDistrictVillages(selectedValue, false);
    }

    onSearchButtonClick() {
        const {selectedDistrict} = this.state;
        this.getDistrictVillages(selectedDistrict, false);
    }

    render() {
        const {tenants, regions, districts, villages, selectedTenant, selectedRegion, selectedDistrict, postVillages,
                isTenantSelectDisabled, isTemplateDialogOpen, csvDataContent} = this.state;
        return (
            <Grid container spacing={1} style={{padding: 10}}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <Paper style={{paddingTop: 10, paddingBottom: 10}}>
                        <Grid container spacing={2} style={{}}>
                            <Grid item xs={1}/>
                            <Grid item xs={3}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelect"
                                        label="Country"
                                        disabled={isTenantSelectDisabled}
                                        value={selectedTenant}
                                        onChange={(event) => {this.handleTenantSelectChange(event)}}
                                        >
                                        {tenants.map((tenant) => (
                                            <MenuItem value={tenant.id.toLocaleString()}>{tenant.country}</MenuItem>
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
                                        value={selectedRegion}
                                        onChange={(event) => {this.handleRegionSelectChange(event)}}
                                    >
                                        {regions.map((region) => (
                                            <MenuItem value={region.sequence.toLocaleString()}>{region.name}</MenuItem>
                                        ))}
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
                                        value={selectedDistrict}
                                        onChange={(event) => {this.handleDistrictSelectChange(event)}}
                                    >
                                        {districts.map((district) => (
                                            <MenuItem value={district.sequence.toLocaleString()}>{district.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <Button variant="outlined"
                                    onClick={() => {this.onSearchButtonClick()}}>
                                    <LocationSearchingSharpIcon/>
                                    &nbsp;&nbsp;Search
                                </Button>
                            </Grid>
                            <Grid item xs={1}/>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}/>
                <Grid item xs={10} style={{height: '60vh'}}>
                    <Paper style={{paddingTop: 10, height: '59vh'}}>
                        <TableContainer sx={{ maxHeight: 500}} aria-label="simple table">
                            <Table stickyHeader>
                                <TableHead style={{backgroundColor: 'whitesmoke'}}>
                                    <TableRow>
                                        <TableCell align="center">Country</TableCell>
                                        <TableCell align="center">Region</TableCell>
                                        <TableCell align="center">District</TableCell>
                                        <TableCell align="center">Village</TableCell>
                                        <TableCell align="center">Location</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {villages.map((village) => (
                                        <TableRow
                                            key={village.sequence}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{village.country}</TableCell>
                                            <TableCell align="center">{village.regionName}</TableCell>
                                            <TableCell align="center">{village.districtName}</TableCell>
                                            <TableCell align="center">{village.name}</TableCell>
                                            <TableCell align="center"><Button><AssistantDirectionIcon/></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <Paper>
                        <Grid container style={{marginTop: 20, padding: 5, margin: 5}}>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={this.state.csvFilePath}
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
                                    onClick={(event) => {this.handlePreviewButtonClick()}}>
                                    <PreviewIcon/>
                                    &nbsp;&nbsp;Preview
                                </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={(event) => {this.uploadVillages()}}>
                                        <CloudUploadIcon/>
                                        &nbsp;&nbsp;Upload
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={(event) => {this.handleGetTemplateButtonClick()}}>
                                        <FormatListBulletedIcon/>
                                        &nbsp;&nbsp;Get Template
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={1}/>
                <Dialog open={this.state.isVillagesPreviewOpen}>
                    <DialogTitle>Parsed Villages</DialogTitle>
                    <DialogContent>
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableHead style={{backgroundColor: 'whitesmoke'}}>
                                    <TableRow>
                                        <TableCell align="center">Country Id</TableCell>
                                        <TableCell align="center">District Id</TableCell>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Coordinates</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { postVillages.map((village) => (
                                        <TableRow
                                            key={village.tenantId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{village.tenantId}</TableCell>
                                            <TableCell align="center">{village.districtSequence}</TableCell>
                                            <TableCell align="center">{village.name}</TableCell>
                                            <TableCell align="center">{village.coordinates}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={()=>{this.setState({isVillagesPreviewOpen: false})}}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isTemplateDialogOpen}>
                    <DialogTitle>Generating Template</DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={4}>Country</Grid>
                            <Grid item xs={6}><Typography>{this.state.selectedCountryName}</Typography></Grid>
                            <Grid item xs={2}><Typography>{this.state.selectedTenant}</Typography></Grid>
                            <Grid item xs={4}>Region</Grid>
                            <Grid item xs={6}><Typography>{this.state.selectedRegionName}</Typography></Grid>
                            <Grid item xs={2}><Typography>{this.state.selectedRegion}</Typography></Grid>
                            <Grid item xs={4}>District</Grid>
                            <Grid item xs={6}><Typography>{this.state.selectedDistrictName}</Typography></Grid>
                            <Grid item xs={2}><Typography>{this.state.selectedDistrict}</Typography></Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button>
                            <CSVLink
                                data={csvDataContent}
                                filename={"villagesTemplate.csv"}>Download</CSVLink>
                        </Button>
                        <Button
                        onClick={() => {this.setState({isTemplateDialogOpen: false})}}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default Villages;
