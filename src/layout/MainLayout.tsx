import React, {Component} from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
    Box,
    Button,
    ButtonGroup,
    Dialog, DialogActions,
    DialogContent,
    Grid,
    TextField,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LanguageIcon from '@mui/icons-material/Language';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import NfcIcon from '@mui/icons-material/Nfc';
import AddCommentIcon from '@mui/icons-material/AddComment';
import PollIcon from '@mui/icons-material/Poll';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GrainIcon from '@mui/icons-material/Grain';
import PanoramaPhotosphereIcon from '@mui/icons-material/PanoramaPhotosphere';
import VillaIcon from '@mui/icons-material/Villa';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MetricsAndCrops from '../pages/metrics/MetricsAndCrops';
import Tenants from '../pages/Tenants';
import Users from '../pages/Users';
import Villages from '../pages/Villages';
import RegionDistricts from '../pages/RegionDistricts';
import Fields from '../pages/fields';
import 'react-pro-sidebar/dist/css/styles.css';
import logo from '../img/logo.png';
import DistrictMetrics from '../pages/metrics/DistrictMetrics';
import VillageMetrics from '../pages/metrics/VillageMetrics';
import FieldList from '../pages/fields/FieldList';
import {Face, Fingerprint} from '@mui/icons-material';
import Purchases from '../pages/Purchases';
import Claims from '../pages/Claims';
import InfoEditor from '../pages/InfoEditor';
import LocalStorageHelper from '../helper/LocalStorageHelper';
import {mainServer, tenant, userAuth} from '../config/mainConfig';
import axios, {AxiosError} from 'axios';
import AccountDto from '../data-model/AccountDto';
import Dashboard from '../pages/dashboard';
import AdminManagement from '../pages/AdminManagement';

interface State {
    username: string;
    password: string;
    isLoginModalOpen: boolean;
    accountInfo: AccountDto;
    isProfileDialogOpen: boolean;
}

interface Props {

}

class MainLayout extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoginModalOpen: true,
            accountInfo: AccountDto.sample(),
            isProfileDialogOpen: false,
        }
    }

    componentDidMount() {
        if (this.isUserLoggedIn()) {
            this.setState({isLoginModalOpen: false});
            const user = LocalStorageHelper.getItem("currentUser");
            const currentUser = JSON.parse(user);
            this.setState({accountInfo: currentUser});
        }
    }

    userLogin(username: string, password: string) {

        const url = mainServer + userAuth;
        const userInfo = {
            "username": username,
            "password": password
        };

        axios
            .post(url, userInfo)
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    const currentUser = response.data.entities[0];
                    this.setState({accountInfo: currentUser, isLoginModalOpen: false});
                    LocalStorageHelper.setItem("isLoggedIn", "SEYYES");
                    LocalStorageHelper.setItem("currentUser", JSON.stringify(currentUser));
                    window.location.reload();
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch((error: AxiosError) => {
                if (error.response!.status === 404) {
                    alert("Username/password error.");
                }
                else {
                    alert(error.message)
                }
            })
    }

    loginButtonClickHandle() {
        const {username, password} = this.state;
        this.userLogin(username, password);
    }

    isUserLoggedIn(): boolean {
       const loggedIn = LocalStorageHelper.getItem("isLoggedIn");
       return loggedIn;
    }

    handleLogOutButtonClick() {
        // eslint-disable-next-line no-restricted-globals
        const response = confirm("Would you like to logout now?");
        if (response) {
            LocalStorageHelper.removeItem("isLoggedIn");
            LocalStorageHelper.removeItem("currentUser");
            this.setState({isLoginModalOpen: true});
        }

    }

    handleChangeOnUsername(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({username: event.target.value});
    }

    handleChangeOnPassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    handleProfileViewClick () {
        this.setState({isProfileDialogOpen: true});
    }

    render() {
        const {isLoginModalOpen, accountInfo} = this.state;
        return (
            <Grid container style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                <BrowserRouter>
                    <Grid item xs={2} style={{height: 80, backgroundColor: '#202020'}}>
                        <img src={logo} height={80}/>
                    </Grid>
                    <Grid item xs={10} style={{backgroundColor: '#202020'}}>
                        <Box display="flex" justifyContent="flex-end">
                            <ButtonGroup style={{backgroundColor: '#304050', marginRight: 10, marginTop: 20}}>
                            <Button
                                onClick={(event) => {this.handleProfileViewClick()}}>
                                <AccountCircleIcon/>
                            </Button>
                            <Button
                                onClick={(event) => {this.handleLogOutButtonClick()}}>
                                <ExitToAppIcon/>
                            </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={2} style={{backgroundColor: '#202020', height: '95vh'}}>
                    <ProSidebar style={{backgroundColor: '#202020'}}>
                            <Menu iconShape="square" style={{alignItems: 'center'}}>
                            <MenuItem icon={<DashboardRoundedIcon />}>
                                <Link to={"/dashboard"}>
                                    Dashboard
                                </Link>
                            </MenuItem>
                            <SubMenu icon={<PublicRoundedIcon/>} title="Tenant">
                                <MenuItem icon={<LanguageIcon/>}>
                                    <Link to={"/tenants"}>
                                        Tenants
                                    </Link>
                                </MenuItem>
                                <MenuItem icon={<AccountBalanceIcon/>}>
                                    <Link to={"/region"}>
                                        Region & Districts
                                    </Link>
                                </MenuItem>
                                <MenuItem icon={<HolidayVillageIcon/>}>
                                    <Link to={"/villages"}>
                                        Villages
                                    </Link>
                                </MenuItem>
                            </SubMenu>
                            <MenuItem icon={<PeopleOutlineIcon/>}>
                                <Link to={"/users"}>
                                    Users
                                </Link>
                            </MenuItem>
                                <SubMenu icon={<NfcIcon/>} title="Fields">
                                    <MenuItem icon={<AccountTreeIcon/>}>
                                        <Link to={"/fieldList"}>
                                            Field List
                                        </Link>
                                    </MenuItem>
                                    <MenuItem icon={<AddCommentIcon/>}>
                                        <Link to={"/fields"}>
                                            New Field
                                        </Link>
                                    </MenuItem>
                                </SubMenu>
                            <SubMenu icon={<PollIcon/>} title="Metrics">
                                <MenuItem icon={<GrainIcon/>}>
                                    <Link to={"/metrics"}>
                                    Metrics/Crops
                                    </Link>
                                </MenuItem>
                                <MenuItem icon={<PanoramaPhotosphereIcon/>}>
                                    <Link to={"/districtMetrics"}>
                                    District Metrics
                                    </Link>
                                </MenuItem>
                                <MenuItem icon={<VillaIcon/>}>
                                    <Link to={"/villageMetrics"}>
                                        Village Metrics
                                    </Link>
                                </MenuItem>
                            </SubMenu>
                            <SubMenu icon={<ShoppingCartIcon/>} title="Purchase/Claim">
                                <MenuItem icon={<AddShoppingCartIcon/>}>
                                    <Link to={"/purchases"}>
                                        Purchases
                                    </Link>
                                </MenuItem>
                                <MenuItem icon={<CreditScoreIcon/>}>
                                    <Link to={"/claims"}>
                                        Claims
                                    </Link>
                                </MenuItem>
                            </SubMenu>
                            <MenuItem icon={<FormatColorTextIcon/>}>
                                <Link to={"/infoEditor"}>
                                    Info Editor
                                </Link>
                            </MenuItem>
                            <MenuItem icon={<AdminPanelSettingsIcon/>}>
                                <Link to={"/adminManagement"}>
                                    Admin Management
                                </Link>
                            </MenuItem>
                        </Menu>
                    </ProSidebar>
                </Grid>
                    <Grid item xs={10} style={{height: '95vh'}}>
                        <Switch>
                            <Route path='/dashboard'>
                                <Dashboard/>
                            </Route>
                            <Route path='/tenants'>
                                <Tenants/>
                            </Route>
                            <Route path='/metrics'>
                                <MetricsAndCrops/>
                            </Route>
                            <Route path='/users'>
                                <Users/>
                            </Route>
                            <Route path='/villages'>
                                <Villages/>
                            </Route>
                            <Route path='/fields'>
                                <Fields/>
                            </Route>
                            <Route path='/fieldList'>
                                <FieldList/>
                            </Route>
                            <Route path='/region'>
                                <RegionDistricts/>
                            </Route>
                            <Route path='/districtMetrics'>
                                <DistrictMetrics/>
                            </Route>
                            <Route path='/villageMetrics'>
                                <VillageMetrics/>
                            </Route>
                            <Route path='/purchases'>
                                <Purchases/>
                            </Route>
                            <Route path='/claims'>
                                <Claims/>
                            </Route>
                            <Route path='/infoEditor'>
                                <InfoEditor/>
                            </Route>
                            <Route path='/adminManagement'>
                                <AdminManagement/>
                            </Route>
                        </Switch>
                </Grid>
                </BrowserRouter>
                <Dialog open={isLoginModalOpen} maxWidth="xs" style={{background: 'black'}}>
                    <DialogContent >

                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <Face fontSize='large'/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="username"
                                        label="Username"
                                        type="email"
                                        size="small"
                                        autoFocus
                                        onChange={(event) => {this.handleChangeOnUsername(event)}}
                                        required />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={3}>
                                    <Button
                                        variant={"contained"}
                                        onClick={(event ) => {this.loginButtonClickHandle()}}
                                        >&nbsp;Login&nbsp;</Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <Fingerprint fontSize='large'/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="password"
                                        label="Password"
                                        type="password"
                                        size="small"
                                        required
                                        onChange={(event => {this.handleChangeOnPassword(event)})}
                                    />
                                </Grid>
                                <Grid item xs={1}/>
                                <Grid item xs={3}>
                                    <Button
                                        variant={"contained"}
                                        onClick={event =>{this.handCancelButtonClick()}}>
                                        Cancel</Button>
                                </Grid>
                            </Grid>
                    </DialogContent>
                </Dialog>
                <Dialog open={this.state.isProfileDialogOpen} >
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={6}>Name</Grid>
                            <Grid item xs={6}>{accountInfo.name}</Grid>
                            <Grid item xs={6}>Surname</Grid>
                            <Grid item xs={6}>{accountInfo.surname}</Grid>
                            <Grid item xs={6}>Username</Grid>
                            <Grid item xs={6}>{accountInfo.username}</Grid>
                            <Grid item xs={6}>Admin Type</Grid>
                            <Grid item xs={6}>{accountInfo.adminType}</Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {this.onClickProfileDialogOk()}}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }

    private onClickProfileDialogOk() {
        this.setState({isProfileDialogOpen: false});
    }

    private handCancelButtonClick() {

    }
}

export default MainLayout;
