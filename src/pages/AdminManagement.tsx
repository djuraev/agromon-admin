import React, {Component} from 'react';
import {
    Button, Dialog, DialogActions, DialogTitle, Divider, FormControl,
    Grid, InputLabel, MenuItem,
    Paper,
    Select, SelectChangeEvent,
    Table,
    TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from 'axios';
import DialogContent from '@mui/material/DialogContent';
import {
    mainServer, manager, managers,
    tenant,
    user
} from '../config/mainConfig';
import TenantDto from '../data-model/TenantDto';
import UserDto from '../data-model/UserDto';
import LocalStorageHelper from '../helper/LocalStorageHelper';
import AccountDto from '../data-model/AccountDto';
import AdminDto from '../data-model/AdminDto';

interface Props {

}

interface State {
    isAddAdminDialogOpen: boolean;
    //for add
    tenantsModal: TenantDto[];
    selectedTenantModal: string;
    surname: string;
    name: string;
    password: string;
    rePassword: string;
    //
    extraInfo: string;
    selectedUser: UserDto;
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
    admins: AdminDto[];
    selectedAdminType: string;
    username: string;
}

class Users extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            isAddAdminDialogOpen: false,
            tenantsModal: [],
            selectedTenantModal: '',
            surname: '',
            name: '',
            password: '',
            rePassword: '',
            extraInfo: '',
            selectedUser: UserDto.of(),
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
            admins: [],
            selectedAdminType: '',
            username: '',
        };
    }

    componentDidMount() {
        const user = LocalStorageHelper.getItem("currentUser");
        const currentUser = JSON.parse(user);
        this.setState({currentUser: currentUser});
        this.getTenants();
        if (currentUser.adminType === "SUPER") {
            this.getManagers();
        }
        else {
            this.setState({selectedTenantModal: currentUser.tenantId});
            this.setState({isTenantSelectDisabled: true})

        }
    }

    setAddUserDialog(isOpen: boolean) {
        this.setState({isAddAdminDialogOpen: isOpen});
    }

    onAddNewUserClick() {
        const {currentUser} = this.state;
        if (currentUser.adminType !== "SUPER") {
            return;
        }
        this.setAddUserDialog(true);
    }

    async onClickAddUserDialogSave() {
        const {surname, name, password, rePassword, selectedAdminType, extraInfo} = this.state;
        const { selectedTenantModal, username } = this.state;

        const userInfo = {
            'tenantId': selectedTenantModal,
            'surname': surname,
            'name': name,
            'password': password,
            'adminType':selectedAdminType,
            'extraInfo': extraInfo,
            'username': username
        };

        if (password !== rePassword) {
            alert('Password do not match. Please, check password.');
            return;
        }
        const url = mainServer + manager;
        axios.post(url, userInfo)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage);
                }
                else {
                    alert("Admin successfully registered.");
                    this.getManagers();
                }
            })
            .catch(error => alert(JSON.stringify(error)));
        this.setAddUserDialog(false)
    }

    onClickAddUserDialogCancel() {
        this.setAddUserDialog(false);
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
                    this.setState({tenantsModal: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getManagers() {
        const url = mainServer + managers ;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    let adminDtos: AdminDto[] = response.data.entities[0];
                    this.setState({admins: adminDtos});
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
                }
                else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            });
    }

    handleTenantSelectChangeModal(event: SelectChangeEvent) {
        this.setState({selectedTenantModal: event.target.value});
    }

    handleAdminTypeSelectChangeModal(event: SelectChangeEvent) {
        this.setState({selectedAdminType: event.target.value});
    }

    onChangeSurname(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
       this.setState({surname: event.target.value});
    }

    onChangeUsername(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({username: event.target.value});
    }

    onChangeName(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({name: event.target.value});
    }

    onChangePassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    onChangeRePassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({rePassword: event.target.value});
    }

    onChangeExtraInfo(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({extraInfo: event.target.value});
    }

    deleteUserByUserId(e: React.MouseEvent<HTMLButtonElement>) {
        const answer = window.confirm("Do you want to delete user?");
        if (!answer) {
            return;
        }
        const selectedUserId = parseInt(e.currentTarget.value);
        this.deleteUser(selectedUserId);
    }

    render() {
        const { tenantsModal, extraInfo, selectedTenantModal,  isTenantSelectDisabled} = this.state;

        const {surname, name, password, rePassword, admins, selectedAdminType, username} = this.state;
        const adminTypes = [{"name":"SUPER", "level": 0},{"name":"NORMAL", "level": 1},{"name":"LOW", "level": 2}];
        return (
            <Grid container component={Paper} style={{margin: 20, padding: 20, width: '97%'}}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} style={{marginTop: 20}}>
                        <Table aria-label="custom pagination table">
                            <TableHead style={{backgroundColor: 'whitesmoke'}}>
                                <TableRow>
                                    <TableCell align="center">N</TableCell>
                                    <TableCell align="center">Country</TableCell>
                                    <TableCell align="center">Admin Type</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Surname</TableCell>
                                    <TableCell align="center">Username</TableCell>
                                    <TableCell align="center">Extra Info</TableCell>
                                    <TableCell align="center">Operations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    admins.map((usr, idx) => (

                                    <TableRow
                                        key={usr.sequence}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center" width="30">
                                            {idx+1}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            {usr.country}
                                        </TableCell>
                                        <TableCell align="center">{usr.adminType}</TableCell>
                                        <TableCell align="center">{usr.name}</TableCell>
                                        <TableCell align="center">{usr.surname}</TableCell>
                                        <TableCell align="center">{usr.username}</TableCell>
                                        <TableCell align="center">{usr.extraInfo}</TableCell>
                                        <TableCell align="center">
                                            <Button value={usr.sequence} onClick={(event) => {this.deleteUserByUserId(event)}}><PersonRemoveIcon/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
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
                            >Add New Admin</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Dialog open={this.state.isAddAdminDialogOpen} maxWidth="md">
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
                                    <InputLabel id="adminTypeSelectLabel">Admin Type</InputLabel>
                                    <Select
                                        labelId="adminTypeSelectLabel"
                                        id="adminTypeSelectModal"
                                        value={selectedAdminType}
                                        label="Admin Type"
                                        onChange={(event) => {this.handleAdminTypeSelectChangeModal(event)}}
                                    >
                                        {adminTypes.map((adminType) => (
                                            <MenuItem value={adminType.level}>{adminType.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Username"
                                    fullWidth
                                    variant="standard"
                                    value={username}
                                    onChange={(e) => {this.onChangeUsername(e)}}/>
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
                                    onChange={(e) => {this.onChangeExtraInfo(e)}}
                                />
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
