import React, {Component} from 'react';
import {
    Button, Dialog, DialogActions,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid, InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent,
    TextField
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import TenantDto from '../data-model/TenantDto';
import {mainServer, regions, tenant} from '../config/mainConfig';
import axios from 'axios';
import RegionDto from '../data-model/RegionDto';

interface Props {

}

interface State {
    tenantsModal1: TenantDto[];
    selectedTenantModal1: string;
    selectedTenantModal2: string;
    isAddNewRegionOpen: boolean;
    isAddNewDistrictOpen: boolean;
    selectedRegionIdModal: '';
    regionsModal: RegionDto[];
}
class RegionDistricts extends Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            tenantsModal1: [],
            selectedTenantModal1: '',
            selectedTenantModal2: '',
            isAddNewRegionOpen: false,
            isAddNewDistrictOpen: false,
            selectedRegionIdModal: '',
            regionsModal: []
        };
    }

    componentDidMount() {
        //
        this.getTenants();
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
                    this.setState({tenantsModal1: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    handleTenantSelectChangeModal(event: SelectChangeEvent) {
        this.setState({selectedTenantModal1: event.target.value});
    }

    handleTenantSelectChangeModal2(event: SelectChangeEvent) {
        this.setState({selectedTenantModal2: event.target.value});
    }

    handleRegionSelectChangeModal(event: SelectChangeEvent) {
       // this.setState({selectedRegionIdModal: event.target.value});
    }

    render() {
        const {selectedTenantModal1, tenantsModal1, selectedTenantModal2, regionsModal} = this.state;
        return (
            <Grid container spacing={1} style={{padding: 10}}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <Paper style={{paddingTop: 10}}>
                        <Grid container spacing={2} style={{}}>
                            <Grid item xs={1}/>
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <Select
                                        id="demo-simple-select"
                                        label="Choose Country"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                    <FormHelperText>*You must choose country first</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                                <FormControl fullWidth>
                                    <Select
                                        id="demo-simple-select"
                                        label="Country"
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}/>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}/>
                <Grid item xs={10} style={{height: '60vh'}}>
                    <Paper style={{paddingTop: 10, height: '59vh'}}>

                    </Paper>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}/>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={10} >
                        <Grid container style={{paddingTop: 15}}>
                            <Grid item xs={3} style={{alignContent: 'center'}}>
                                <Button style={{width: 200}}
                                        variant="outlined"
                                        onClick={() => {this.setState({isAddNewRegionOpen: true})}}>+ Add Region</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200}} variant="outlined">+ Add Region Name</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200}}
                                        variant="outlined"
                                        onClick={() => {this.setState({isAddNewDistrictOpen: true})}}>+ Add District</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200, paddingLeft: 20}} variant="outlined">+ Add District Name</Button>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs={1}/>
                <Dialog open={this.state.isAddNewRegionOpen} maxWidth="xs">
                    <DialogTitle>Add New Region</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControl fullWidth size={'small'} style={{marginTop: 10}}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelectModal"
                                        value={selectedTenantModal1}
                                        label="Country"
                                        onChange={(event) => {this.handleTenantSelectChangeModal(event)}}
                                    >
                                        {tenantsModal1.map((tenant) => (
                                            <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Region Name"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.setState({isAddNewRegionOpen: false})}}>Save</Button>
                        <Button onClick={() => {this.setState({isAddNewRegionOpen: false})}}>Cancel</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.isAddNewDistrictOpen} maxWidth="xs">
                    <DialogTitle>Add New Region</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControl fullWidth size={'small'} style={{marginTop: 10}}>
                                    <InputLabel id="countrySelectLabel">Country</InputLabel>
                                    <Select
                                        labelId="countrySelectLabel"
                                        id="countrySelectModal"
                                        value={selectedTenantModal2}
                                        label="Country"
                                        onChange={(event) => {this.handleTenantSelectChangeModal2(event)}}
                                    >
                                        {tenantsModal1.map((tenant) => (
                                            <MenuItem value={tenant.id}>{tenant.country}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth size={'small'}>
                                    <InputLabel id="regionSelectLabel">District</InputLabel>
                                    <Select
                                        labelId="regionSelectLabel"
                                        id="regionSelectModal"
                                        label="Region"
                                        value={selectedTenantModal2}
                                        onChange={(e) => {this.handleRegionSelectChangeModal(e)}}
                                    >
                                        {
                                            regionsModal.map((region) => (
                                                    <MenuItem value={region.sequence.toLocaleString()}>{region.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Region Name"
                                    fullWidth
                                    variant="standard"/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {this.setState({isAddNewRegionOpen: false})}}>Save</Button>
                        <Button onClick={() => {this.setState({isAddNewRegionOpen: false})}}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        );
    }
}

export default RegionDistricts;
