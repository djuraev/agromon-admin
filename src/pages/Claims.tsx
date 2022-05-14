import React, {Component} from 'react';
import ClaimDto from '../data-model/ClaimDto';
import TenantDto from '../data-model/TenantDto';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent, Stack,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow
} from '@mui/material';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';
import AccountDto from '../data-model/AccountDto';
import LocalStorageHelper from '../helper/LocalStorageHelper';
import {claim, mainServer, tenant, updateClaimStatus} from '../config/mainConfig';
import CompareIcon from '@mui/icons-material/Compare';
import axios from 'axios';

interface Props {

}

interface State {
    claims: ClaimDto[];
    rowsPerPage: number;
    page: number;
    //
    tenants: TenantDto[];
    selectedTenant: string;
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
    claimStatus: string;
    selectedClaim: ClaimDto;
    isClaimStatusChangeWindowOpen: boolean;
    selectedClaimId: number;
    selectedClaimStatusModal: string;
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
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
            claimStatus: 'Submitted',
            selectedClaim: ClaimDto.sample(),
            isClaimStatusChangeWindowOpen: false,
            selectedClaimId: -1,
            selectedClaimStatusModal: '',
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

    getClaims() {
        const {claimStatus, selectedTenant} = this.state;
        const url = mainServer + claim + "/claims/" + selectedTenant + "/" + claimStatus;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({claims: response.data.entities[0]});
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
        this.getClaims();
    }

    handleClaimStatusChange(event: SelectChangeEvent) {
        this.setState({claimStatus: event.target.value});
    }

    onClickStatusChangeButton(e: React.MouseEvent<HTMLButtonElement>) {
        this.setState({isClaimStatusChangeWindowOpen: true});
        const claimId = parseInt(e.currentTarget.value);
        const {claims} = this.state;
        const selectedClaim = claims.find(cl => cl.sequence === claimId);
        // @ts-ignore
        this.setState({selectedClaimId: claimId, selectedClaimStatusModal: selectedClaim.status, selectedClaim: selectedClaim})
    }

    handleStatusChange(event: SelectChangeEvent) {
        this.setState({selectedClaimStatusModal: event.target.value});
    }

    handleModalCancel() {
        this.setState({isClaimStatusChangeWindowOpen: false});
    }

    handleUpdateClaimStatusOK() {
        const {selectedClaim, selectedClaimStatusModal} = this.state;
        this.updateClaimStatus(selectedClaim.sequence, selectedClaimStatusModal);
        this.setState({isClaimStatusChangeWindowOpen: false});
    }

    updateClaimStatus(claimId: number, status: string) {
        //
        const url = mainServer + updateClaimStatus + "/" + claimId;
        const data = {
            'status': status
        }
        axios.put(url, data)
        .then(response => {
            const requestFailed = response.data.requestFailed;
            if (!requestFailed) {
                alert("Claim status updated.");
                this.getClaims();
            } else {
                alert(response.data.failureMessage.exceptionMessage);
            }
        })
        .catch(error => {
            alert(error);
        });
    }

    render() {
        const {selectedTenant, tenants, claims, isTenantSelectDisabled, claimStatus, selectedClaim, isClaimStatusChangeWindowOpen,
                    selectedClaimStatusModal} = this.state;
        const claimStatuses = ["Submitted", "Approved", "Rejected"];
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
                                disabled={isTenantSelectDisabled}
                                label="Country"
                                onChange={(event) => {this.handleTenantSelectChange(event)}}
                            >
                                {tenants.map((tenant) => (
                                    <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl fullWidth size={'small'}>
                            <InputLabel id="countrySelectLabel">Status</InputLabel>
                            <Select
                                labelId="statusSelectLabel"
                                id="statusSelect"
                                value={claimStatus}
                                label="Status"
                                onChange={(event) => {this.handleClaimStatusChange(event)}}
                            >
                                {claimStatuses.map((status) => (
                                    <MenuItem value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}/>
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
                                <TableCell align="center">Username</TableCell>
                                <TableCell align="center">Field Name</TableCell>
                                <TableCell align="center">Crop</TableCell>
                                <TableCell align="center">Area Ton</TableCell>
                                <TableCell align="center">Farmer Name</TableCell>
                                <TableCell align="center">Farmer Phone</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Operations</TableCell>
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
                                            {claim.username}
                                        </TableCell>
                                        <TableCell align="center">{claim.fieldName}</TableCell>
                                        <TableCell align="center">{claim.cropType}</TableCell>
                                        <TableCell align="center">{claim.areaTon}</TableCell>
                                        <TableCell align="center">{claim.farmerName}</TableCell>
                                        <TableCell align="center">{claim.farmerPhone}</TableCell>
                                        <TableCell align="center">{claim.description}</TableCell>
                                        <TableCell align="center">{claim.status}</TableCell>
                                        <TableCell align="center">{claim.date}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Button value={claim.sequence} onClick={(event) => {this.onClickStatusChangeButton(event)}}><CompareIcon/></Button>
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
                <Dialog open={isClaimStatusChangeWindowOpen} maxWidth="xs">
                    <DialogTitle>Change Claim Status</DialogTitle>
                    <DialogContent>
                        <Select
                            fullWidth
                            value={selectedClaimStatusModal}
                            onChange={(e)=> {this.handleStatusChange(e)}}
                        >
                            <MenuItem value={'Submitted'}>Submitted</MenuItem>
                            <MenuItem value={'Approved'}>Approved</MenuItem>
                            <MenuItem value={'Rejected'}>Rejected</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="outlined"
                            onClick={() => {this.handleUpdateClaimStatusOK()}}>Save</Button>
                        <Button
                            variant="outlined"
                            onClick={() => {this.handleModalCancel()}}>Cancel</Button>
                    </DialogActions>
                </Dialog>
        </Grid>
        );}
}

export default Claims;
