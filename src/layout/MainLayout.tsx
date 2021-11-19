import React, {Component} from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {Grid, Paper} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LanguageIcon from '@mui/icons-material/Language';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PollIcon from '@mui/icons-material/Poll';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Metrics from '../pages/Metrics';
import Tenants from '../pages/Tenants';
import Users from '../pages/Users';
import Villages from '../pages/Villages';
import RegionDistricts from '../pages/RegionDistricts';
import Fields from '../pages/fields';
import 'react-pro-sidebar/dist/css/styles.css';
import logo from '../img/logo.png';

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
                            <MenuItem icon={<AccountTreeIcon/>}>
                                <Link to={"/fields"}>
                                    Fields
                                </Link>
                            </MenuItem>
                            <SubMenu icon={<PollIcon/>} title="Metrics">
                                <MenuItem>Tenants</MenuItem>
                                <MenuItem>Region & Districts</MenuItem>
                                <MenuItem>Villages</MenuItem>
                            </SubMenu>
                        </Menu>

                    </ProSidebar>
                </Grid>
                <Grid item xs={10} style={{height: '95vh'}}>
                    <Paper>
                        <Switch>
                            <Route path='/dashboard'>
                                <Dashboard/>
                            </Route>
                            <Route path='/tenants'>
                                <Tenants/>
                            </Route>
                            <Route path='/metrics'>
                                <Metrics/>
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
                            <Route path='/region'>
                                <RegionDistricts/>
                            </Route>
                        </Switch>
                    </Paper>
                </Grid>
                </BrowserRouter>
            </Grid>
        );
    }
}

export default MainLayout;
