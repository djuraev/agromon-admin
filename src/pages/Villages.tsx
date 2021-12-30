import React, {Component} from 'react';
import {
    Button, ButtonGroup, Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField
} from '@mui/material';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import TenantDto from '../data-model/TenantDto';
import RegionDto from '../data-model/RegionDto';
import DistrictDto from '../data-model/DistrictDto';
import {districts, mainServer, regions, tenant, villages} from '../config/mainConfig';
import axios from 'axios';
import VillageDto from '../data-model/VillageDto';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VillaIcon from '@mui/icons-material/Villa';
import CSVReader from 'react-csv-reader';

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
}

const handleForce = (data: any, fileInfo: any) => console.log(data, fileInfo);

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_")
};
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
        }
    }

    componentDidMount() {
        this.getTenants();
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
        this.setState({selectedTenant: selectedValue});
        this.getTenantRegions(event.target.value, false);
    }

    private handleRegionSelectChange(event: SelectChangeEvent) {
        const selectedValue = event.target.value;
        this.setState({selectedRegion: selectedValue});
        this.getRegionDistricts(selectedValue, false);
    }

    private handleDistrictSelectChange(event: SelectChangeEvent) {
        const selectedValue = event.target.value;
        this.setState({selectedDistrict: selectedValue});
        this.getDistrictVillages(selectedValue, false);
    }

    render() {
        const {tenants, regions, districts, villages, selectedTenant, selectedRegion, selectedDistrict} = this.state;
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
                                <Button variant="outlined" >
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
                                            <TableCell align="center">{selectedTenant}</TableCell>
                                            <TableCell align="center">{selectedRegion}</TableCell>
                                            <TableCell align="center">{selectedDistrict}</TableCell>
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
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <ButtonGroup style={{marginLeft: 10}}>
                                <Button
                                    variant="contained"
                                    component="label">
                                    <input
                                        type="file"
                                        hidden
                                    />
                                    <DriveFolderUploadIcon/>
                                    &nbsp;&nbsp;Browse
                                </Button>
                                <Button
                                    variant="outlined">
                                    <CloudUploadIcon/>
                                    &nbsp;&nbsp;Upload
                                </Button>
                                </ButtonGroup>

                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={3}>
                                <Button
                                    variant="outlined">
                                    <VillaIcon/>
                                    &nbsp;&nbsp;Add New Village
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
        );
    }
}

export default Villages;
