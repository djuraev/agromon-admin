import React, {Component} from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {Grid, Paper} from '@mui/material';
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

interface State {

}

interface Props {

}

class MainLayout extends Component<State, Props> {

    render() {
        return (

            <Grid container style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                <BrowserRouter>
                <Grid item xs={2} style={{height: 80, backgroundColor: '#202020'}}>
                    <img src={logo} height={80}/>
                </Grid>
                <Grid item xs={10} style={{backgroundColor: '#202020'}}>
                    <Paper />
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
                                    <Link to={"/metrics"}>
                                        Purchases
                                    </Link>
                                </MenuItem>
                                <MenuItem icon={<CreditScoreIcon/>}>
                                    <Link to={"/districtMetrics"}>
                                        Claims
                                    </Link>
                                </MenuItem>
                            </SubMenu>
                            <MenuItem icon={<FormatColorTextIcon/>}>
                                <Link to={"/villageMetrics"}>
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
                        </Switch>
                </Grid>
                </BrowserRouter>
            </Grid>
        );
    }
}

export default MainLayout;
