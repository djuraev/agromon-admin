import React, {Component} from 'react';
import {
    Button, Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent, Stack,
    Table, TableBody, TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination, TableRow
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import TenantDto from '../data-model/TenantDto';
import PurchaseDto from '../data-model/PurchaseDto';
import AccountDto from '../data-model/AccountDto';
import LocalStorageHelper from '../helper/LocalStorageHelper';
import {mainServer, tenant} from '../config/mainConfig';
import axios from 'axios';

interface Props {

}

interface State {
    rowsPerPage: number;
    page: number;
    //
    tenants: TenantDto[];
    selectedTenant: string;
    purchases: PurchaseDto[];
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
}

class Purchases extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tenants: [],
            selectedTenant: '',
            purchases: [],
            rowsPerPage: 10,
            page: 0,
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
        }
    }

    componentDidMount() {
        const user = LocalStorageHelper.getItem("currentUser");
        const currentUser = JSON.parse(user);
        this.setState({currentUser: currentUser});
        this.getTenants();
        if (currentUser.adminType === "SUPER") {

        }
        else {
            this.setState({selectedTenant: currentUser.tenantId});
            this.setState({isTenantSelectDisabled: true})
        }
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
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }


    getPurchases(tenantId: string) {
        const url = mainServer + tenant + "/tenants";
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({purchases: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    handleTenantSelectChange(event: SelectChangeEvent) {
        this.setState({selectedTenant: event.target.value});
    }

    onClickSearchButton() {
        //this.getFields();
    }

    handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
        this.setState({page: newPage});
    }

    handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const perPage = parseInt(event.target.value, 10);
        this.setState({rowsPerPage: perPage, page: 0});
    }

    render() {
        const {selectedTenant, tenants, purchases,rowsPerPage, page} = this.state;
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
                                    onChange={(event) => {this.handleTenantSelectChange(event)}}
                                >
                                    {tenants.map((tenant) => (
                                        <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
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
                    <TableContainer component={Paper} style={{marginTop: 20}} sx={{ maxHeight: 500}}>
                        <Table aria-label="custom pagination table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">N</TableCell>
                                    <TableCell align="center">Farmer</TableCell>
                                    <TableCell align="center">Phone</TableCell>
                                    <TableCell align="center">Field ID</TableCell>
                                    <TableCell align="center">Field Name</TableCell>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Other</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchases.map((purchase, idx) => (

                                    <TableRow
                                        key={purchase.sequence}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" align="center" width="30">
                                            {idx+1}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            {purchase.farmerName}
                                        </TableCell>
                                        <TableCell align="center">{purchase.phoneNumber}</TableCell>
                                        <TableCell align="center">{purchase.fieldId}</TableCell>
                                        <TableCell align="center">{purchase.fieldName}</TableCell>
                                        <TableCell align="center">{purchase.date}</TableCell>
                                        <TableCell align="center">{purchase.status}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Button value={purchase.fieldId}><AddCardIcon/></Button>
                                            </Stack>
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
            </Grid>
        )
    }
}


export default Purchases;
