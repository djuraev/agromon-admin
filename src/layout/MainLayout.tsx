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
import 'react-pro-sidebar/dist/css/styles.css';

interface State {

}

interface Props {

}

class MainLayout extends Component<State, Props> {

    render() {
        return (

            <Grid container style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
                <Grid item xs={2} style={{backgroundColor: 'red', height: 80}}>
                </Grid>
                <Grid item xs={10} style={{backgroundColor: 'green'}}>
                </Grid>
                <Grid item xs={2} style={{backgroundColor: '#202020', height: '95vh'}}>
                    <ProSidebar style={{backgroundColor: '#202020'}}>
                        <Menu iconShape="square" style={{alignItems: 'center'}}>
                            <MenuItem icon={<DashboardRoundedIcon />}>
                                Dashboard</MenuItem>
                            <SubMenu icon={<PublicRoundedIcon/>} title="Tenant">
                                <MenuItem icon={<LanguageIcon/>}>
                                Tenants
                                </MenuItem>
                                <MenuItem icon={<AccountBalanceIcon/>}>Region & Districts</MenuItem>
                                <MenuItem icon={<HolidayVillageIcon/>}>Villages</MenuItem>
                            </SubMenu>
                            <MenuItem icon={<PeopleOutlineIcon/>}>Users</MenuItem>
                            <MenuItem icon={<AccountTreeIcon/>}>Fields</MenuItem>
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
                        {this.props.children}
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default MainLayout;
