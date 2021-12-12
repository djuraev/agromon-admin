import React, {Component, PointerEventHandler} from 'react';
import {
    Button, Dialog, DialogActions, DialogTitle, Divider, FormControl,
    Grid, InputLabel, MenuItem,
    Paper,
    Select, SelectChangeEvent, Stack,
    Table,
    TableBody, TableCell,
    TableContainer,
    TableFooter, TableHead,
    TablePagination,
    TableRow, TextField
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import AddCardIcon from '@mui/icons-material/AddCard';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import axios from 'axios';
import DialogContent from '@mui/material/DialogContent';
import {districts, mainServer, regions, tenant, user, users, villages} from '../config/mainConfig';
import TenantDto from '../data-model/TenantDto';
import RegionDto from '../data-model/RegionDto';
import DistrictDto from '../data-model/DistrictDto';
import VillageDto from '../data-model/VillageDto';
import UserDto from '../data-model/UserDto';

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
    rePassword: string;
    //
    users: UserDto[];
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
            rePassword: '',
            users: [],
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

    async onClickAddUserDialogSave() {
        const {surname, name, email, insuNumber, password, rePassword} = this.state;
        const { selectedTenantModal, selectedRegionIdModal, selectedDistrictModal, selectedVillageIdModal } = this.state;

        const userInfo = {
            'tenantId': selectedTenantModal,
            'regionSequence': parseInt(selectedRegionIdModal),
            'districtSequence': parseInt(selectedDistrictModal),
            'villageSequence': parseInt(selectedVillageIdModal),
            'insuranceNumber': parseInt(insuNumber),
            'surname': surname,
            'name': name,
            'email': email,
            'password': password,
            'roles': ['USER']
        };
        if (password !== rePassword) {
            alert('Password do not match. Please, check password.');
            return;
        }
        const url = mainServer + user;
        axios.post(url, userInfo)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage);
                }
                else {
                    alert("User successfully registered.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
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

    getUsers() {
        const url = mainServer + users;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({users: response.data.entities[0]});
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
        this.setState({selectedRegionIdModal: regionId});
        this.getRegionDistricts(regionId, true);
    }

    onChangeSurname(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
       this.setState({surname: event.target.value});
    }

    onClickSearchButton() {
        this.getUsers();
    }

    onChangeName(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({name: event.target.value});
    }

    onChangeEmail(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({email: event.target.value});
    }

    onChangeInsuNumber(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({insuNumber: event.target.value});
    }

    onChangePassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    onChangeRePassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({rePassword: event.target.value});
    }

    render() {
        const { rowsPerPage, page, tenants, selectedTenant, regions, selectedRegionId,
                districts, selectedDistrictId, villages, selectedVillageId,
                tenantsModal, regionsModal, districtsModal, villagesModal,
                selectedDistrictModal, selectedRegionIdModal, selectedTenantModal, selectedVillageIdModal } = this.state;

        const {surname, name, email, insuNumber, password, rePassword, users} = this.state;
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
                            <Button variant="outlined" onClick={() => {this.onClickSearchButton()}} >
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
                                    <TableCell align="center">N</TableCell>
                                    <TableCell align="center">Surname</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Insurance Number</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Country</TableCell>
                                    <TableCell align="center">Operations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((usr, idx) => (

                                    <TableRow
                                        key={usr.sequence}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center" width="30">
                                            {idx+1}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            {usr.surname}
                                        </TableCell>
                                        <TableCell align="center">{usr.name}</TableCell>
                                        <TableCell align="center">{usr.insuranceNumber}</TableCell>
                                        <TableCell align="center">{usr.email}</TableCell>
                                        <TableCell align="center">{usr.tenantId}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Button value={usr.sequence}><InfoIcon/></Button>
                                                <Button value={usr.sequence}><SatelliteAltIcon/></Button>
                                                <Button value={usr.sequence}><AddCardIcon/></Button>
                                                <Button value={usr.sequence}><AssistantDirectionIcon/></Button>
                                                <Button value={usr.sequence}><DeleteIcon/></Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
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
                                            <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
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
                                    value={surname}
                                    onChange={(e) => {this.onChangeSurname(e)}}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    variant="standard"
                                    value={name}
                                    onChange={(e) => {this.onChangeName(e)}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Insurance Number"
                                    fullWidth
                                    variant="standard"
                                    value={insuNumber}
                                    onChange={(e) => {this.onChangeInsuNumber(e)}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    variant="standard"
                                    value={email}
                                    onChange={(e) => {this.onChangeEmail(e)}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Password"
                                    fullWidth
                                    variant="standard"
                                    value={password}
                                    type="password"
                                    onChange={(e) => {this.onChangePassword(e)}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Retype Password"
                                    fullWidth
                                    variant="standard"
                                    value={rePassword}
                                    type="password"
                                    onChange={(e) => {this.onChangeRePassword(e)}}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.onClickAddUserDialogSave().then()}>Save</Button>
                        <Button onClick={() => this.onClickAddUserDialogCancel()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default Users;
