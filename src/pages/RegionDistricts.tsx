import React, {Component} from 'react';
import {
    Button, Dialog, DialogActions,
    DialogTitle,
    Divider,
    FormControl,
    Grid, InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import TenantDto from '../data-model/TenantDto';
import {districts, mainServer, newDistrict, newRegion, regions, tenant} from '../config/mainConfig';
import axios from 'axios';
import RegionDto from '../data-model/RegionDto';
import DistrictDto from '../data-model/DistrictDto';
import LocalStorageHelper from '../helper/LocalStorageHelper';
import AccountDto from '../data-model/AccountDto';

interface Props {

}

interface State {
    regions: RegionDto[];
    countries: TenantDto[];
    districts: DistrictDto[];
    selectedCountry: string;
    selectedRegion: string;
    tenantsModal1: TenantDto[];
    selectedTenantModal1: string;
    selectedTenantModal2: string;
    isAddNewRegionOpen: boolean;
    isAddNewDistrictOpen: boolean;
    selectedRegionIdModal1: string;
    selectedRegionIdModal2: string;
    regionsModal1: RegionDto[];
    regionsModal2: RegionDto[];
    regionNameModal1: string;
    addNewDistrictText: string;
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
}
class RegionDistricts extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            tenantsModal1: [],
            selectedTenantModal1: '',
            selectedTenantModal2: '',
            isAddNewRegionOpen: false,
            isAddNewDistrictOpen: false,
            selectedRegionIdModal1: '',
            selectedRegionIdModal2: '',
            regionsModal1: [],
            regionsModal2: [],
            regions: [],
            countries: [],
            selectedRegion: '',
            selectedCountry: '',
            districts: [],
            regionNameModal1: '',
            addNewDistrictText: '',
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
        };
    }

    componentDidMount() {
        //
        const user = LocalStorageHelper.getItem("currentUser");
        const currentUser = JSON.parse(user);
        this.setState({currentUser: currentUser});
        this.getTenants();
        if (currentUser.adminType === "SUPER") {

        }
        else {
            this.setState({selectedCountry: currentUser.tenantId});
            this.setState({isTenantSelectDisabled: true})
            this.getTenantRegions(currentUser.tenantId, 'false');
        }
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
                    this.setState({tenantsModal1: response.data.entities[0], countries: response.data.entities[0]});

                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getTenantRegions(tenantCode: string, isModal: string) {
        const url = mainServer + regions+"/"+tenantCode;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    if (isModal === "modal1")
                        this.setState({regionsModal1: response.data.entities[0]});
                    else if (isModal === "modal2")
                        this.setState({regionsModal2: response.data.entities[0]});
                    else
                        this.setState({regions: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    handleTenantSelectChangeModal(event: SelectChangeEvent) {
        this.setState({selectedTenantModal1: event.target.value});
    }


    handleTenantSelectChangeModal2(event: SelectChangeEvent) {
        const tenantId = event.target.value;
        this.setState({selectedTenantModal2: tenantId});
        this.getTenantRegions(tenantId, "modal2");
    }

    handleRegionSelectChangeModal(event: SelectChangeEvent) {
        this.setState({selectedRegionIdModal2: event.target.value});
    }

    handleTenantSelectChange(event: SelectChangeEvent) {
        this.setState({selectedCountry: event.target.value, selectedRegion: ''});
        this.getTenantRegions(event.target.value, "main");
    }

    handleRegionSelectChange(event: SelectChangeEvent) {
        const regionId = event.target.value;
        this.setState({selectedRegion: regionId});
        this.getRegionDistricts(regionId, false);
    }

    getRegionDistricts(regionId: string | number, isModal: boolean) {
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

    addNewRegion() {
        const {selectedTenantModal1, regionNameModal1 } = this.state;
        const region = {
            "tenantId": selectedTenantModal1,
            "name": regionNameModal1,
            "names": [],
        };
        let url = mainServer + newRegion;
        axios.post(url, region)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage.exceptionMessage);
                }
                else {
                    alert("Region successfully registered.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
        this.setState({isAddNewRegionOpen: false});
    }

    onChangeNewRegionTextBox(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({regionNameModal1: event.target.value});
    }

    onChangeNewDistrictTextBox(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({addNewDistrictText: event.target.value});
    }

    addNewDistrict() {
        const {selectedTenantModal2, selectedRegionIdModal2, addNewDistrictText} = this.state;
        const district = {
            "tenantId": selectedTenantModal2,
            "regionSequence": selectedRegionIdModal2,
            "name": addNewDistrictText,
            "names": []
        };
        let url = mainServer + newDistrict;
        axios.post(url, district)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage.exceptionMessage);
                }
                else {
                    alert("District successfully registered.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
        this.setState({isAddNewDistrictOpen: false});
    }

    render() {
        const {selectedTenantModal1, tenantsModal1, selectedTenantModal2, isTenantSelectDisabled, countries, regions, selectedRegion, selectedCountry,
                districts, regionsModal2} = this.state;
        return (
            <Grid container spacing={1} style={{padding: 10}}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <Paper style={{paddingTop: 10, paddingBottom: 10}}>
                        <Grid container spacing={2} style={{}}>
                            <Grid item xs={1}/>
                            <Grid item xs={5}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelect"
                                        label="Country"
                                        disabled={isTenantSelectDisabled}
                                        value={selectedCountry}
                                        onChange={(event) => {this.handleTenantSelectChange(event)}}
                                    >
                                    {
                                        countries.map((tenant) => (
                                            <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                        ))
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="regionSelectLabel">Region</InputLabel>
                                    <Select
                                        labelId="regionSelectLabel"
                                        id="regionSelect"
                                        label="Region"
                                        value={selectedRegion}
                                        onChange={(e) => {this.handleRegionSelectChange(e)}}
                                    >
                                        {
                                            regions.map((region) => (
                                                <MenuItem value={region.sequence.toLocaleString()}>{region.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
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
                                        <TableCell align="center">District Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {districts.map((district) => (
                                        <TableRow
                                            key={district.sequence}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{district.country}</TableCell>
                                            <TableCell align="center">{district.regionName}</TableCell>
                                            <TableCell align="center">{district.name} [{district.sequence}]</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}/>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={10} >
                        <Grid container style={{paddingTop: 15}}>
                            <Grid item xs={3} style={{alignContent: 'center'}}>
                                <Button style={{width: 200}}
                                        variant="outlined"
                                        disabled={isTenantSelectDisabled}
                                        onClick={() => {this.setState({isAddNewRegionOpen: true})}}>+ Add Region</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200}}
                                        variant="outlined"
                                        disabled={isTenantSelectDisabled}
                                >+ Add Region Name</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200}}
                                        variant="outlined"
                                        disabled={isTenantSelectDisabled}
                                        onClick={() => {this.setState({isAddNewDistrictOpen: true})}}>+ Add District</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    style={{width: 200, paddingLeft: 20}}
                                    variant="outlined"
                                    disabled={isTenantSelectDisabled}
                                >
                                    + Add District Name
                                </Button>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs={1}/>
                <Dialog open={this.state.isAddNewRegionOpen} maxWidth="xs">
                    <DialogTitle>Add New Region</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControl fullWidth size={'small'} style={{marginTop: 10}}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelectModal"
                                        value={selectedTenantModal1}
                                        label="Country"
                                        onChange={(event) => {this.handleTenantSelectChangeModal(event)}}
                                    >
                                        {tenantsModal1.map((tenant) => (
                                            <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Region Name"
                                    fullWidth
                                    variant="standard"
                                    onChange={(event) => {this.onChangeNewRegionTextBox(event)}}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.addNewRegion()}}>Save</Button>
                        <Button onClick={() => {this.setState({isAddNewRegionOpen: false})}}>Cancel</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.isAddNewDistrictOpen} maxWidth="xs">
                    <DialogTitle>Add New District</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControl fullWidth size={'small'} style={{marginTop: 10}}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelectModal"
                                        value={selectedTenantModal2}
                                        label="Country"
                                        onChange={(event) => {this.handleTenantSelectChangeModal2(event)}}
                                    >
                                        {tenantsModal1.map((tenant) => (
                                            <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="regionSelectLabel2">Region</InputLabel>
                                    <Select
                                        labelId="regionSelectLabel2"
                                        id="regionSelectModal2"
                                        label="Region"
                                        value={this.state.selectedRegionIdModal2}
                                        onChange={(e) => {this.handleRegionSelectChangeModal(e)}}
                                    >
                                        {
                                            regionsModal2.map((region) => (
                                                <MenuItem value={region.sequence}>{region.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="District Name"
                                    fullWidth
                                    variant="standard"
                                    onChange={(event) => {this.onChangeNewDistrictTextBox(event)}}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.addNewDistrict()}}>Save</Button>
                        <Button onClick={() => {this.setState({isAddNewDistrictOpen: false})}}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default RegionDistricts;
