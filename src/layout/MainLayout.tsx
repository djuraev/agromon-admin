import React, {Component} from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {Box, Button, Dialog, DialogActions, DialogContent, Grid, Paper, TextField} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
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
import axios from 'axios';
import UserDto from '../data-model/UserDto';

interface State {
    username: string;
    password: string;
    isLoginModalOpen: boolean;
    currentUser: UserDto;
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
            currentUser: UserDto.of(),
        }
    }

    componentDidMount() {
        if (this.isUserLoggedIn()) {
            this.setState({isLoginModalOpen: false});
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
                    this.setState({currentUser: response.data.entities[0], isLoginModalOpen: false});
                    LocalStorageHelper.setItem("isLoggedIn", "SEYYES")
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
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
            this.setState({isLoginModalOpen: true});
        }

    }

    handleChangeOnUsername(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({username: event.target.value});
    }

    handleChangeOnPassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    render() {
        const {isLoginModalOpen} = this.state;
        return (
            <Grid container style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                <BrowserRouter>
                <Grid item xs={2} style={{height: 80, backgroundColor: '#202020'}}>
                    <img src={logo} height={80}/>
                </Grid>
                <Grid item xs={10} style={{backgroundColor: '#202020'}}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button style={{backgroundColor: '#304050', margin: 15, width: 30}}
                            onClick={(event) => {this.handleLogOutButtonClick()}}>
                            <ExitToAppIcon/>
                        </Button>
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
                        </Menu>
                    </ProSidebar>
                </Grid>
                <Grid item xs={10} style={{height: '95vh'}}>
                        <Switch>
                            {/*<Route path='/dashboard'>
                                <Dashboard/>
                            </Route>*/}
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
            </Grid>
        );
    }

    private handCancelButtonClick() {

    }
}

export default MainLayout;
