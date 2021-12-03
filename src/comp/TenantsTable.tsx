import React from 'react';
import TenantDto from '../data-model/TenantDto';
import {mainServer, tenant} from '../config/mainConfig';
import axios from 'axios';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';


interface Props {

}

interface State {
    tenants: TenantDto[];
}
class TenantsTable extends React.Component<Props, State> {
    //

    constructor(props: Props) {
        super(props);

        this.state = {
            tenants: [],
        }
    }

    async componentDidMount() {
       // this.retrieveTenants();
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
        const {tenants} = this.state;
        return (
            <Paper style={{borderRadius: 3}}>
                <TableContainer>
                    <Table sx={{ maxWidth: 500, maxHeight: 600}} aria-label="simple table">
                        <TableHead style={{backgroundColor: 'whitesmoke'}}>
                            <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">Country Name</TableCell>
                                <TableCell align="center">Code</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tenants.map((tenant) => (
                                <TableRow
                                    key={tenant.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">
                                        {tenant.id}
                                    </TableCell>
                                    <TableCell align="center">{tenant.country}</TableCell>
                                    <TableCell align="center">{tenant.code}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
    }
}

export default TenantsTable;
