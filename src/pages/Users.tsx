import React, {Component} from 'react';
import {
    Button, Dialog, DialogActions, DialogTitle, Divider, FormControl,
    Grid, InputLabel, List, MenuItem,
    Paper,
    Select, SelectChangeEvent, Stack,
    Table,
    TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography
} from '@mui/material';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import InfoIcon from '@mui/icons-material/Info';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import AddCardIcon from '@mui/icons-material/AddCard';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from 'axios';
import DialogContent from '@mui/material/DialogContent';
import {
    districts,
    fields,
    mainServer,
    regions,
    tenant,
    user,
    userClaims,
    userPurchases,
    usersDynamic,
    villages
} from '../config/mainConfig';
import TenantDto from '../data-model/TenantDto';
import RegionDto from '../data-model/RegionDto';
import DistrictDto from '../data-model/DistrictDto';
import VillageDto from '../data-model/VillageDto';
import UserDto from '../data-model/UserDto';
import FieldDto from '../data-model/FieldDto';
import PurchaseDto from '../data-model/PurchaseDto';
import ClaimDto from '../data-model/ClaimDto';
import LocalStorageHelper from '../helper/LocalStorageHelper';
import AccountDto from '../data-model/AccountDto';

interface Props {

}

interface State {
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
    dateOfBirth: string;
    phoneNumber: string;
    extraInfo: string;
    selectedUser: UserDto;
    isAboutDialogOpen: boolean;
    isUserFieldsDialogOpen: boolean;
    userFields: FieldDto[];
    isUserPurchasesDialogOpen: boolean;
    userPurchases: PurchaseDto[];
    isUserClaimsDialogOpen: boolean;
    userClaims: ClaimDto[];
    currentUser: AccountDto;
    userCount: number;
    isTenantSelectDisabled: boolean;
}

class Users extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
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
            phoneNumber: '',
            extraInfo: '',
            dateOfBirth: '',
            selectedUser: UserDto.of(),
            isAboutDialogOpen: false,
            isUserFieldsDialogOpen: false,
            userFields: [],
            userPurchases: [],
            userClaims: [],
            isUserClaimsDialogOpen: false,
            isUserPurchasesDialogOpen: false,
            currentUser: AccountDto.sample(),
            userCount: 0,
            isTenantSelectDisabled: false,
        };
    }

    componentDidMount() {
        const user = LocalStorageHelper.getItem("currentUser");
        const currentUser = JSON.parse(user);
        this.setState({currentUser: currentUser});
        this.getTenants();
        if (currentUser.adminType === "SUPER") {

        }
        else {
            this.setState({selectedTenant: currentUser.tenantId, selectedTenantModal: currentUser.tenantId});
            this.setState({isTenantSelectDisabled: true})
            this.getTenantRegions(currentUser.tenantId, false);
        }
    }

    setAddUserDialog(isOpen: boolean) {
        this.setState({isAddUserDialogOpen: isOpen});
    }

    onAddNewUserClick() {
        //this.getTenants();

        this.setAddUserDialog(true);
        const {currentUser} = this.state;
        if (currentUser.adminType !== "SUPER") {
            this.getTenantRegions(currentUser.tenantId.toLocaleString(), true);
        }
    }

    async onClickAddUserDialogSave() {
        const {surname, name, email, insuNumber, password, rePassword} = this.state;
        const { selectedTenantModal, selectedRegionIdModal, selectedDistrictModal, selectedVillageIdModal, phoneNumber, extraInfo, dateOfBirth } = this.state;

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
            'dateOfBirth': dateOfBirth,
            'extraInfo': extraInfo,
            'phoneNumber': phoneNumber,
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
        this.setAddUserDialog(false)
    }

    onClickAddUserDialogCancel() {
        this.setAddUserDialog(false);
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
        const url = mainServer + villages + "/" + districtId;
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

        const url = mainServer + usersDynamic;

        const {selectedTenant, selectedRegionId, selectedDistrictId, selectedVillageId} = this.state;
        if (!selectedTenant || selectedTenant === '') {
            alert("Please, select country at least.");
            return;
        }
        const userExample = {
            "tenantId": selectedTenant,
            "regionSequence": selectedRegionId,
            "districtSequence": selectedDistrictId,
            "villageSequence": selectedVillageId
        };

        axios.post(url, userExample)
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed)
                {
                    let users: UserDto[] = response.data.entities;
                    this.setState({users: users});
                }
                else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getUserFields(userId: string) {
        const url = mainServer + fields+"/"+userId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    let userFields: FieldDto[] = response.data.entities[0];
                    this.setState({userFields: userFields});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getUserPurchases(userId: string) {
        const url = mainServer + userPurchases + "/" + userId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    let userPurchases: PurchaseDto[] = response.data.entities[0];
                    this.setState({userPurchases: userPurchases});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getUserClaims(userId: string) {
        const url = mainServer + userClaims + "/" +userId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    let userClaims: ClaimDto[] = response.data.entities[0];
                    this.setState({userClaims: userClaims});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    deleteUser(userId: number) {
        const url = mainServer + user + "/" + userId;
        axios({
            url: url,
            method: 'DELETE'
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    alert(response.data.entities[0]);
                    this.getUsers();
                }
                else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
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

    private onChangeBirthOfDate(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({dateOfBirth: e.target.value});
    }

    private onChangeExtraInfo(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({extraInfo: e.target.value});

    }

    private onChangePhoneNumber(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({phoneNumber: e.target.value});
    }

    private onClickAboutButton(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isAboutDialogOpen: true});
        const selectedUserId = parseInt(e.currentTarget.value);
        const {users} = this.state;
        const selectedUser = users.find(user => user.sequence === selectedUserId);
        if (selectedUser)
            this.setState({selectedUser: selectedUser});
    }

    onClickAboutWindowClose() {
        this.setState({isAboutDialogOpen: false});
    }

    onClickUserFieldsButton(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isUserFieldsDialogOpen: true});
        const selectedUserId = parseInt(e.currentTarget.value);
        const {users} = this.state;
        const selectedUser = users.find(user => user.sequence === selectedUserId);
        if (selectedUser) {
            this.setState({selectedUser: selectedUser});
            this.getUserFields(selectedUser.insuranceNumber);
        }
    }

    onClickUserPurchasesButton(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isUserPurchasesDialogOpen: true});
        const selectedUserId = parseInt(e.currentTarget.value);
        const {users} = this.state;
        const selectedUser = users.find(user => user.sequence === selectedUserId);
        if (selectedUser) {
            this.setState({selectedUser: selectedUser});
            this.getUserPurchases(selectedUser.insuranceNumber);
        }
    }

    onClickUserClaimsButton(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isUserClaimsDialogOpen: true});
        const selectedUserId = parseInt(e.currentTarget.value);
        const {users} = this.state;
        const selectedUser = users.find(user => user.sequence === selectedUserId);
        if (selectedUser) {
            this.setState({selectedUser: selectedUser});
            this.getUserClaims(selectedUser.insuranceNumber);
        }
    }

    deleteUserByUserId(e: React.MouseEvent<HTMLButtonElement>) {
        const answer = window.confirm("Do you want to delete user?");
        if (!answer) {
            return;
        }
        const selectedUserId = parseInt(e.currentTarget.value);
        this.deleteUser(selectedUserId);
    }

    onClickUserFieldDialogClose() {
        this.setState({isUserFieldsDialogOpen: false});
    }

    onClickUserPurchasesDialogClose() {
        this.setState({isUserPurchasesDialogOpen: false});
    }

    onClickUserClaimsDialogClose() {
        this.setState({isUserClaimsDialogOpen: false});
    }

    render() {
        const { tenants, selectedTenant, regions, selectedRegionId,
                districts, selectedDistrictId, villages, selectedVillageId,
                tenantsModal, regionsModal, districtsModal, villagesModal,
                dateOfBirth, extraInfo, phoneNumber,
                selectedDistrictModal, selectedRegionIdModal, selectedTenantModal, selectedVillageIdModal,
                selectedUser, userFields, userPurchases, userClaims, isTenantSelectDisabled} = this.state;

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
                                    disabled={isTenantSelectDisabled}
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
                                    <TableCell align="center">Birthday</TableCell>
                                    <TableCell align="center">Operations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.map((usr, idx) => (

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
                                        <TableCell align="center">{usr.dateOfBirth}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Button value={usr.sequence} onClick={(event) =>{this.onClickAboutButton(event);}}><InfoIcon/></Button>
                                                <Button value={usr.sequence} onClick={(event) => {this.onClickUserFieldsButton(event)}}><SatelliteAltIcon/></Button>
                                                <Button value={usr.sequence} onClick={(event) => {this.onClickUserPurchasesButton(event)}}><AddCardIcon/></Button>
                                                <Button value={usr.sequence} onClick={(event) => {this.onClickUserClaimsButton(event)}}><AssistantDirectionIcon/></Button>
                                                <Button value={usr.sequence} onClick={(event) => {this.deleteUserByUserId(event)}}><PersonRemoveIcon/></Button>
                                               {/* <Button value={usr.sequence}><DeleteIcon/></Button>*/}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                           {/* <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 20, 30]}
                                        colSpan={3}
                                        count={userCount}
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

                                    />
                                </TableRow>
                            </TableFooter>*/}
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
                                        disabled={isTenantSelectDisabled}
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
                                    label="Date of Birth(DD.MM.YYYY)"
                                    fullWidth
                                    variant="standard"
                                    value={dateOfBirth}
                                    onChange={(e) => {this.onChangeBirthOfDate(e)}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    variant="standard"
                                    value={phoneNumber}
                                    onChange={(e) => {this.onChangePhoneNumber(e)}}
                                >
                                </TextField>
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
                            <Grid item xs={12}>
                                <TextField
                                    label="Extra info"
                                    fullWidth
                                    variant="standard"
                                    value={extraInfo}
                                    onChange={(e) => {this.onChangeExtraInfo(e)}}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.onClickAddUserDialogSave().then()}>Save</Button>
                        <Button onClick={() => this.onClickAddUserDialogCancel()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.isAboutDialogOpen} maxWidth="sm">
                    <DialogTitle>User Info</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} style={{marginTop: 5}} component={Paper}>
                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Country:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.country}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Region:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.region}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>District:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.district}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Village:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.village}</Grid>
                            <Grid item xs={12}><Divider/></Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Surname:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.surname}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Name:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.name}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Birthday:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.dateOfBirth}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Insurance:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.insuranceNumber}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Phone:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.phoneNumber}</Grid>

                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Email:</Typography></Grid>
                            <Grid item xs={4}>{selectedUser.email}</Grid>

                            <Grid item xs={12}><Divider/></Grid>
                            <Grid item xs={2}><Typography style={{fontWeight: 'bold'}}>Extra Info:</Typography></Grid>
                            <Grid item xs={10}>{selectedUser.extraInfo}</Grid>
                            <Grid item xs={12}><Divider/></Grid>
                            <Grid item xs={5}/>
                            <Grid item xs={6}>
                                <Button variant="outlined" onClick={() => {this.onClickAboutWindowClose()}}>Close</Button>
                            </Grid>
                            <Grid item xs={4}/>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <Dialog open={this.state.isUserFieldsDialogOpen} maxWidth="md">
                    <DialogTitle>User Fields</DialogTitle>
                    <DialogContent>
                        {userFields.length !== 0 ?
                        <List dense sx={{width: '100%', color: 'background.paper'}}>
                            {userFields.map((field) => {
                               return (
                                   <Paper style={{padding: 5, margin: 5}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}> Field Id:</Typography></Grid>
                                        <Grid item xs={3}>{field.fieldId}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Field Name:</Typography></Grid>
                                        <Grid item xs={3}>{field.name}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Crop Id:</Typography></Grid>
                                        <Grid item xs={3}>{field.cropId}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Crop Name:</Typography></Grid>
                                        <Grid item xs={3}>{field.cropName}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Village:</Typography></Grid>
                                        <Grid item xs={3}>{field.villageName}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>User Area:</Typography></Grid>
                                        <Grid item xs={3}>{field.userArea ? field.userArea : '-'}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>API Key:</Typography></Grid>
                                        <Grid item xs={9}>{field.apiKey}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Comment:</Typography></Grid>
                                        <Grid item xs={9}>{field.comment ? field.comment : '-'}</Grid>

                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Agromon Area:</Typography></Grid>
                                        <Grid item xs={3}>{field.agromonArea ? field.agromonArea : '-'}</Grid>

                                        <Grid item xs={12}/>
                                        <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Polygon:</Typography></Grid>
                                        <Grid item xs={9}>
                                            <TextField
                                                fullWidth
                                                value={field.polygon}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>)
                            })}
                        </List> : "No User Fields"}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() =>{this.onClickUserFieldDialogClose();}}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.isUserPurchasesDialogOpen} maxWidth="md">
                    <DialogTitle>User Purchases</DialogTitle>
                    <DialogContent>
                        {userPurchases.length !== 0 ?
                        <List dense sx={{width: '100%', color: 'background.paper'}}>
                            {userPurchases.map((purchase) => {
                                return (
                                    <Paper style={{padding: 5, margin: 5}}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Farmer Name:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.farmerName}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>User Name:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.username}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Phone:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.phoneNumber}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Crop:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.cropName}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Field:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.fieldName}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Hectare:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.hectares}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Date:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.date}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Status:</Typography></Grid>
                                            <Grid item xs={3}>{purchase.status}</Grid>
                                        </Grid>
                                    </Paper>)
                            })}
                        </List> : "No User Purchases" }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() =>{this.onClickUserPurchasesDialogClose();}}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.isUserClaimsDialogOpen} maxWidth="md">
                    <DialogTitle>User Claims</DialogTitle>
                    <DialogContent>
                        {userClaims.length !== 0 ?
                        <List dense sx={{width: '100%', color: 'background.paper'}}>
                            {
                                userClaims.map((claim) => {
                                return (
                                    <Paper style={{padding: 5, margin: 5}}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Farmer Name:</Typography></Grid>
                                            <Grid item xs={3}>{claim.farmerName}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>User Name:</Typography></Grid>
                                            <Grid item xs={3}>{claim.username}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Phone:</Typography></Grid>
                                            <Grid item xs={3}>{claim.farmerPhone}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Crop:</Typography></Grid>
                                            <Grid item xs={3}>{claim.cropType}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Field:</Typography></Grid>
                                            <Grid item xs={3}>{claim.fieldName}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Date:</Typography></Grid>
                                            <Grid item xs={3}>{claim.date}</Grid>

                                            <Grid item xs={3}><Typography style={{fontWeight: 'bold'}}>Status:</Typography></Grid>
                                            <Grid item xs={3}>{claim.status}</Grid>
                                        </Grid>
                                    </Paper>)
                            })}
                        </List> : "No User Claims"}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() =>{this.onClickUserClaimsDialogClose();}}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default Users;
