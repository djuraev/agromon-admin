import React from 'react';
import {
    Button, Divider,
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
import AddCardIcon from '@mui/icons-material/AddCard';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import DeleteIcon from '@mui/icons-material/Delete';
import TenantDto from '../../data-model/TenantDto';
import RegionDto from '../../data-model/RegionDto';
import DistrictDto from '../../data-model/DistrictDto';
import VillageDto from '../../data-model/VillageDto';
import {districts, fieldsDynamic, mainServer, regions, tenant, villageFields, villages} from '../../config/mainConfig';
import axios from 'axios';
import FieldDto from '../../data-model/FieldDto';
import AccountDto from '../../data-model/AccountDto';
import LocalStorageHelper from '../../helper/LocalStorageHelper';
import UserDto from '../../data-model/UserDto';

interface State {
    isAddUserDialogOpen: boolean;
    //
    tenants: TenantDto[];
    selectedTenant: string,
    regions: RegionDto[],
    selectedRegionId: string;
    districts: DistrictDto[];
    selectedDistrictId: string;
    villages: VillageDto[];
    selectedVillageId: string;
    //
    fields: FieldDto[];
    currentUser: AccountDto;
    isTenantSelectDisabled: boolean;
}

interface Props {

}

class FieldList extends React.Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            isAddUserDialogOpen: false,
            tenants: [],
            selectedTenant: '',
            regions: [],
            selectedRegionId: '',
            districts: [],
            selectedDistrictId: '',
            villages: [],
            selectedVillageId: '',
            fields: [],
            currentUser: AccountDto.sample(),
            isTenantSelectDisabled: false,
        };
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
            this.getTenantRegions(currentUser.tenantId);
        }
    }

    handleTenantSelectChange(event: SelectChangeEvent) {
        this.setState({selectedTenant: event.target.value, selectedRegionId: '', selectedDistrictId: '',
            selectedVillageId: '', districts: [], villages: []});
        this.getTenantRegions(event.target.value);
    }

    handleRegionSelectChange(event: SelectChangeEvent) {
        const regionId = event.target.value;
        this.setState({selectedRegionId: regionId});
        this.getRegionDistricts(regionId);
    }

    handleDistrictSelectChange(event: SelectChangeEvent) {
        const districtId = event.target.value;
        this.setState({selectedDistrictId: districtId});
        this.getDistrictVillages(districtId);
    }

    handleVillageSelectChange(event: SelectChangeEvent) {
        const villageId = event.target.value;
        this.setState({selectedVillageId: villageId});
    }

    onClickSearchButton() {
        this.getFields();
    }

    getFields() {
        const {selectedVillageId, selectedTenant, selectedRegionId, selectedDistrictId} = this.state;

        const fieldExample = {
            "tenantId": selectedTenant,
            "regionSequence": selectedRegionId,
            "districtSequence": selectedDistrictId,
            "villageSequence": selectedVillageId
        };
        const url = mainServer + fieldsDynamic;
        axios.post(url, fieldExample)
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed)
                {
                    let fields: FieldDto[] = response.data.entities[0];
                    this.setState({fields: fields});
                }
                else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getTenantRegions(tenantCode: string) {
        const url = mainServer + regions+"/"+tenantCode;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({regions: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getRegionDistricts(regionId: string | number) {
        const url = mainServer + districts+"/"+regionId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({districts: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getDistrictVillages(districtId: string | number) {
        const url = mainServer + villages+"/" + districtId;
        axios({
            url: url,
            method: 'GET',
        })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({villages: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
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

    render() {
        const { tenants, selectedTenant, regions, selectedRegionId,
            districts, selectedDistrictId, villages, selectedVillageId, fields, isTenantSelectDisabled} = this.state;

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
                    <Grid item xs={4}>
                        <FormControl fullWidth size={'small'}>
                            <InputLabel id="regionSelectLabel">Region</InputLabel>
                            <Select
                                labelId="regionSelectLabel"
                                id="regionSelect"
                                label="Region"
                                value={selectedRegionId}
                                onChange={(e) => {this.handleRegionSelectChange(e)}}
                            >
                                {
                                    regions ?
                                        regions.map((region) => (
                                            <MenuItem value={region.sequence.toLocaleString()}>{region.name}</MenuItem>
                                        ))
                                        :
                                        <MenuItem>No Regions</MenuItem>
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}/>
                    <Grid item xs={1}/>
                    <Grid item xs={4}>
                        <FormControl fullWidth size={'small'}>
                            <InputLabel id="districtSelectLabel">District</InputLabel>
                            <Select
                                labelId="districtSelectLabel"
                                id="districtSelect"
                                label="District"
                                value={selectedDistrictId}
                                onChange={(e) => {this.handleDistrictSelectChange(e)}}
                            >
                                {districts.map((district) => (
                                    <MenuItem value={district.sequence.toLocaleString()}>{district.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth size={'small'}>
                            <InputLabel id="villageSelectLabel">Village</InputLabel>
                            <Select
                                labelId="villageSelectLabel"
                                id="villageSelect"
                                label="Village"
                                value={selectedVillageId}
                                onChange={(e) => {this.handleVillageSelectChange(e)}}
                            >
                                {villages.map((village) => (
                                    <MenuItem value={village.sequence.toLocaleString()}>{village.name}</MenuItem>
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
                                <TableCell align="center">Village</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Area</TableCell>
                                <TableCell align="center">Center</TableCell>
                                <TableCell align="center">Crop</TableCell>
                                <TableCell align="center">Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields.map((field, idx) => (

                                <TableRow
                                    key={field.fieldId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align="center" width="30">
                                        {idx+1}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {field.villageName}
                                    </TableCell>
                                    <TableCell align="center">{field.name}</TableCell>
                                    <TableCell align="center">{field.agromonArea}</TableCell>
                                    <TableCell align="center">{field.center}</TableCell>
                                    <TableCell align="center">{field.cropName}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Button value={field.fieldId}><AddCardIcon/></Button>
                                            <Button value={field.fieldId}><AssistantDirectionIcon/></Button>
                                            <Button value={field.fieldId}><DeleteIcon/></Button>
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
export default FieldList;
