import React, {Component, PointerEventHandler} from 'react';
import {
    Button, Dialog, DialogActions, DialogTitle, Divider, FormControl,
    Grid, InputLabel, MenuItem,
    Paper,
    Select, SelectChangeEvent,
    Table,
    TableBody, TableCell,
    TableContainer,
    TableFooter, TableHead,
    TablePagination,
    TableRow, TextField
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import DialogContent from '@mui/material/DialogContent';
import {districts, mainServer, regions, tenant, villages} from '../config/mainConfig';
import axios from 'axios';
import TenantDto from '../data-model/TenantDto';
import RegionDto from '../data-model/RegionDto';
import DistrictDto from '../data-model/DistrictDto';
import VillageDto from '../data-model/VillageDto';

interface Props {

}

interface State {
    rowsPerPage: number;
    page: number;
    isAddUserDialogOpen: boolean;
    //
    tenants: TenantDto[];
    selectedTenant: string,
    regions: RegionDto[],
    selectedRegionId: string;
    districts: DistrictDto[];
    selectedDistrictId: string;
    villages: VillageDto[];
    selectedVillageId: string;
    //for add
    tenantsModal: TenantDto[];
    selectedTenantModal: string;
    regionsModal: RegionDto[];
    selectedRegionIdModal: string;
    districtsModal: DistrictDto[];
    selectedDistrictModal: string;
    villagesModal: VillageDto[];
    selectedVillageIdModal: string;
    //
    surname: string;
    name: string;
    insuNumber: string;
    email: string;
    password: string;
}

class Users extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            rowsPerPage: 10,
            page: 0,
            isAddUserDialogOpen: false,
            tenants: [],
            selectedTenant: '',
            regions: [],
            selectedRegionId: '',
            districts: [],
            selectedDistrictId: '',
            villages: [],
            selectedVillageId: '',
            tenantsModal: [],
            selectedTenantModal: '',
            regionsModal: [],
            selectedRegionIdModal: '',
            districtsModal: [],
            selectedDistrictModal: '',
            villagesModal: [],
            selectedVillageIdModal: '',
            surname: '',
            name: '',
            insuNumber: '',
            email: '',
            password: '',
        };
    }

    componentDidMount() {
        this.getTenants();
    }

    setAddUserDialog(isOpen: boolean) {
        this.setState({isAddUserDialogOpen: isOpen});
    }

    onAddNewUserClick() {
        //this.getTenants();
        this.setAddUserDialog(true);
    }

    onClickAddUserDialogSave() {
        this.setAddUserDialog(false);
    }

    onClickAddUserDialogCancel() {
        this.setAddUserDialog(false);
    }

    handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        this.setState({page: newPage});
    }

    handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const perPage = parseInt(event.target.value, 10);
        this.setState({rowsPerPage: perPage, page: 0});
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
                    if (isModal)
                        this.setState({regionsModal: response.data.entities[0]});
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
                        this.setState({districtsModal: response.data.entities[0]});
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

    getDistrictVillages(districtId: string | number, isModal: boolean) {
        const url = mainServer + villages+"/" + districtId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    if (isModal) {
                        this.setState({villagesModal: response.data.entities[0]});
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
                    this.setState({tenantsModal: response.data.entities[0]});
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
        this.getTenantRegions(event.target.value, false);
    }

    handleRegionSelectChange(event: SelectChangeEvent) {
        const regionId = event.target.value;
        this.setState({selectedRegionId: regionId});
        this.getRegionDistricts(regionId, false);
    }

    handleDistrictSelectChange(event: SelectChangeEvent) {
        const districtId = event.target.value;
        this.setState({selectedDistrictId: districtId});
        this.getDistrictVillages(districtId, false);
    }

    handleVillageSelectChange(event: SelectChangeEvent) {
        const villageId = event.target.value;
        this.setState({selectedVillageId: villageId});
    }

    handleTenantSelectChangeModal(event: SelectChangeEvent) {
        this.setState({selectedTenantModal: event.target.value, selectedRegionIdModal: '', selectedVillageIdModal: '',
                             selectedVillageId: '', districtsModal: [], villagesModal: []});
        this.getTenantRegions(event.target.value, true);
    }

    handleDistrictSelectChangeModal(event: SelectChangeEvent) {
        const districtId = event.target.value;
        this.setState({selectedDistrictModal: districtId});
        this.getDistrictVillages(districtId, true);
    }

    handleVillageSelectChangeModal(event: SelectChangeEvent) {
        const villageId = event.target.value;
        this.setState({selectedVillageIdModal: villageId});
    }

    handleRegionSelectChangeModal(event: SelectChangeEvent) {
        const regionId = event.target.value;
        this.setState({selectedRegionId: regionId});
        this.getRegionDistricts(regionId, true);
    }

    onSurnamePointerLeave(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
       const surname = event.target.value;
       this.setState({surname: surname});
       alert(surname);
    }

    render() {
        const { rowsPerPage, page, tenants, selectedTenant, regions, selectedRegionId,
                districts, selectedDistrictId, villages, selectedVillageId,
                tenantsModal, regionsModal, districtsModal, villagesModal,
                selectedDistrictModal, selectedRegionIdModal, selectedTenantModal, selectedVillageIdModal } = this.state;

        const {surname, name, email, insuNumber, password} = this.state;
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
                                        <MenuItem value={tenant.code}>{tenant.country}</MenuItem>
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
                            <Button variant="outlined" >
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
                                    <TableCell align="center">Surname</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Insurance Number</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Operations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody></TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 20, 25, { label: 'All', value: -1 }]}
                                        colSpan={3}
                                        count={100}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                            },
                                            native: true,
                                        }}
                                        onPageChange={(e, p) => {
                                            this.handleChangePage(e, p)}}
                                        onRowsPerPageChange={(event) =>this.handleChangeRowsPerPage(event)}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container style={{marginTop: 20}}>
                        <Grid xs={5}/>
                        <Grid xs={2} >
                            <Button
                                variant="outlined"
                                fullWidth={true}
                                onClick={() => {this.onAddNewUserClick()}}
                            >+ Add New User</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog open={this.state.isAddUserDialogOpen} maxWidth="md">
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} style={{marginTop: 5}}>
                            <Grid item xs={6}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelectModal"
                                        value={selectedTenantModal}
                                        label="Country"
                                        onChange={(event) => {this.handleTenantSelectChangeModal(event)}}
                                    >
                                        {tenantsModal.map((tenant) => (
                                            <MenuItem value={tenant.code}>{tenant.country}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="regionSelectLabel">Region</InputLabel>
                                    <Select
                                        labelId="regionSelectLabel"
                                        id="regionSelectModal"
                                        label="Region"
                                        value={selectedRegionIdModal}
                                        onChange={(e) => {this.handleRegionSelectChangeModal(e)}}
                                    >
                                        {
                                            regionsModal ?
                                                regionsModal.map((region) => (
                                                    <MenuItem value={region.sequence.toLocaleString()}>{region.name}</MenuItem>
                                                ))
                                                :
                                                <MenuItem>No Regions</MenuItem>
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="districtSelectLabel">District</InputLabel>
                                    <Select
                                        labelId="districtSelectLabel"
                                        id="districtSelectModal"
                                        label="District"
                                        value={selectedDistrictModal}
                                        onChange={(e) => {this.handleDistrictSelectChangeModal(e)}}
                                    >
                                        {districtsModal.map((district) => (
                                            <MenuItem value={district.sequence.toLocaleString()}>{district.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="districtSelectLabel">Village</InputLabel>
                                    <Select
                                        labelId="villageSelectLabel"
                                        id="villageSelectModal"
                                        label="Village"
                                        value={selectedVillageIdModal}
                                        onChange={(e) => {this.handleVillageSelectChangeModal(e)}}
                                    >
                                        {villagesModal.map((village) => (
                                            <MenuItem value={village.sequence.toLocaleString()}>{village.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Surname"
                                    fullWidth
                                    variant="standard"
                                    value={this.state.surname}
                                    onChange={(e) => {this.onSurnamePointerLeave(e)}}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Insurance Number"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Password"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Retype Password"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.onClickAddUserDialogSave()}>Save</Button>
                        <Button onClick={() => this.onClickAddUserDialogCancel()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default Users;
