import React, {Component} from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import TenantDto from '../data-model/TenantDto';
import {mainServer, tenant} from '../config/mainConfig';
import axios from 'axios';
import TenantsTable from '../comp/TenantsTable';

interface Props {

}

interface State {
    tenants: TenantDto[];
}



class Tenants extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);

        this.state = {
            tenants: [],
        }
    }

    async componentDidMount() {
      this.retrieveTenants();
    }

    retrieveTenants() {
        const url = mainServer + tenant + "/tenants";
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({tenants: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });

    }

    render() {

        return (
            <Paper style={{padding: 2}}>
                <TenantsTable/>
            </Paper>

        );
    }
}

export default Tenants;
