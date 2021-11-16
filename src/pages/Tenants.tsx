import React, {Component} from 'react';
import ApiInvoker from '../helper/ApiInvoker';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import TenantDto from '../data-model/TenantDto';
import {mainServer, tenant} from '../config/mainConfig';

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

    componentDidMount() {
        const tenantList = ApiInvoker.InvokeGet(mainServer+tenant+"/tenants");
        this.setState({tenants: tenantList});
    }

    render() {
        const {tenants} = this.state;
        return (
           <TableContainer>
               <Table sx={{ minWidth: 650 }} aria-label="simple table">
                   <TableHead>
                       <TableRow>
                           <TableCell>ID</TableCell>
                           <TableCell align="right">Country Name</TableCell>
                           <TableCell align="right">Code</TableCell>
                       </TableRow>
                   </TableHead>
                   <TableBody>
                       {tenants.map((tenant) => (
                           <TableRow
                               key={tenant.id}
                               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                           >
                               <TableCell>
                                   {tenant.id}
                               </TableCell>
                               <TableCell align="right">{tenant.country}</TableCell>
                               <TableCell align="right">{tenant.code}</TableCell>
                           </TableRow>
                       ))}
                   </TableBody>
               </Table>
           </TableContainer>
        );
    }
}

export default Tenants;
