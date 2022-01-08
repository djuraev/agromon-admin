import React, {Component} from 'react';
import ClaimDto from '../data-model/ClaimDto';
import TenantDto from '../data-model/TenantDto';
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

interface Props {

}

interface State {
    claims: ClaimDto[];
    rowsPerPage: number;
    page: number;
    //
    tenants: TenantDto[];
    selectedTenant: string;

}

class Claims extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            claims: [],
            tenants: [],
            selectedTenant: '',
            rowsPerPage: 10,
            page: 0,
        }
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
        const {selectedTenant, tenants, claims,rowsPerPage, page} = this.state;
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
                <TableContainer component={Paper} style={{marginTop: 20}}>
                    <Table aria-label="custom pagination table">
                        <TableHead style={{backgroundColor: 'whitesmoke'}}>
                            <TableRow>
                                <TableCell align="center">N</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Username</TableCell>
                                <TableCell align="center">Farmer</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Crop</TableCell>
                                <TableCell align="center">Other</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {claims.map((claim, idx) => (

                                <TableRow
                                    key={claim.sequence}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align="center" width="30">
                                        {idx+1}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                            {claim.date}
                                        </TableCell>
                                        <TableCell align="center">{claim.username}</TableCell>
                                        <TableCell align="center">{claim.farmerName}</TableCell>
                                        <TableCell align="center">{claim.description}</TableCell>
                                        <TableCell align="center">{claim.cropType}</TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Button value={claim.fieldId}><AddCardIcon/></Button>
                                            </Stack>
                                        </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 20, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={100}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={(e, p) => {
                                        this.handleChangePage(e, p)}}
                                    onRowsPerPageChange={(event) =>this.handleChangeRowsPerPage(event)}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
        </Grid>);
    }
}

export default Claims;
