import React, {Component} from 'react';
import {
    Dialog, DialogActions, DialogTitle, TextField,
    Grid, Paper, Divider, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
} from '@mui/material';
import TenantDto from '../data-model/TenantDto';
import {mainServer, newTenant, tenant} from '../config/mainConfig';
import axios from 'axios';
import DrawControl from 'react-mapbox-gl-draw';
import ReactMapboxGl from "react-mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DialogContent from '@mui/material/DialogContent';
import AssistantDirectionIcon from '@mui/icons-material/AssistantDirection';
import PublicIcon from '@mui/icons-material/Public';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';

const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiZGFpbWsiLCJhIjoiY2ttbmt2dzc2MXZ1bjJwcGZsZndoaGdkbiJ9.KzEXKpaGb0yYkV8Npdg65g"
});

interface Props {

}

interface State {
    tenants: TenantDto[];
    mapViewStyle: string;
    isDialogOpen: boolean;
    newTenantName: string;
    newTenantCode: string;
    newTenantCapital: string;
    newTenantCoordinates: string;
    currentLong: number;
    currentLat: number;
    zoom: number;
}


class Tenants extends Component<Props, State> {
    //

    constructor(props: Props) {
        super(props);

        this.state = {
            tenants: [],
            mapViewStyle: "mapbox://styles/mapbox/satellite-v9",
            isDialogOpen: false,
            newTenantName: '',
            newTenantCode: '',
            newTenantCapital: '',
            newTenantCoordinates: '',
            currentLat: 10,
            currentLong: 20,
            zoom: 1,
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

    onDrawCreate(points: any){
        //console.log(features);
        const {features} = points;
        console.log(features[0].geometry.coordinates);

    };

    onDrawUpdate(points: any ){
        const {features} = points;
        console.log(features[0].geometry.coordinates);
    };

    onClickCancel() {
        this.setState({isDialogOpen: false});
    }

    onClickSave() {
        const {newTenantName, newTenantCode, newTenantCapital, newTenantCoordinates} = this.state;
        const tenant = {
            "code": newTenantCode,
            "country": newTenantName,
            "capital": newTenantCapital,
            "coordinates": newTenantCoordinates
        }

        axios.post(mainServer + newTenant, tenant)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage.exceptionMessage);
                }
                else {
                    alert("Country successfully registered.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
        this.setState({isDialogOpen: false})
    }

    onClickAddNewTenant() {
        this.setState({isDialogOpen: true})
    }

    onChangeNewTenantName(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({newTenantName: event.target.value});
    }

    onChangeNewTenantCode(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({newTenantCode: event.target.value});
    }

    onChangeNewTenantCapital(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({newTenantCapital: event.target.value});
    }

    onChangeNewTenantCoordinates(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({newTenantCoordinates: event.target.value});
    }

    onClickTableRow(tenantId: number) {
        const {tenants, zoom} = this.state;
        const selectedTenant = tenants.find(tenant => tenant.id === tenantId);
        if (selectedTenant) {
            const coordinates = selectedTenant.coordinates.split(":");
            const long = parseFloat(coordinates[0]);
            const lat = parseFloat(coordinates[1]);
            this.setState({currentLong: lat, currentLat: long, zoom: 8});
        }
    }

    render() {
        const { isDialogOpen, tenants, newTenantCapital, newTenantCode, newTenantName, newTenantCoordinates, zoom } = this.state;
        const {currentLat, currentLong} = this.state;
        return (
          <Grid container spacing={2}>
              <Grid item xs={12} style={{textAlign: 'center', backgroundColor: '#005f73', margin: 20}}>
                  <h2>Tenants Info</h2>
              </Grid>
              <Grid item xs={4}>
                  <TableContainer sx={{ maxWidth: 500, maxHeight: 600}} aria-label="sticky table">
                      <Table stickyHeader>
                          <TableHead style={{backgroundColor: 'whitesmoke'}}>
                              <TableRow>
                                  <TableCell align="center">ID</TableCell>
                                  <TableCell align="center">Country Name</TableCell>
                                  <TableCell align="center">Code</TableCell>
                                  <TableCell align="center">-</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {tenants.map((tenant) => (
                                  <TableRow
                                      key={tenant.id}
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
                                      onClick={(event) => {this.onClickTableRow(tenant.id)}}>
                                      <TableCell align="center">{tenant.id}</TableCell>
                                      <TableCell align="center">{tenant.country}</TableCell>
                                      <TableCell align="center">{tenant.country}</TableCell>
                                      <TableCell align="center"><Button><AssistantDirectionIcon/></Button></TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </TableContainer>
              </Grid>
              <Grid item xs={7}>
                  <Grid container spacing={1}>
                      <Grid item xs={10} style={{alignItems: 'center'}}>
                          <Paper style={{padding: 5}}>
                          <Map
                              style="mapbox://styles/mapbox/light-v10" // eslint-disable-line
                              center = {[currentLong, currentLat]}
                              zoom={[zoom]}
                              containerStyle={{
                                  height: "450px",
                                  width: "800px"
                              }}
                          >
                              <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={this.onDrawUpdate} />
                          </Map>
                          </Paper>
                      </Grid>
                      <Grid xs={1}/>
                  </Grid>
              </Grid>
              <Grid xs={12}>
              <Divider/>
              </Grid>
              <Grid xs={6} style={{display:'flex', justifyContent:'right', alignItems:'center', paddingTop: 25, paddingRight: 5}}>
                  <Button style={{width: 250}} variant="outlined" onClick={() => {this.onClickAddNewTenant()}}>
                      <PublicIcon/>
                      &nbsp;&nbsp;
                      Add New Country</Button>
              </Grid>
              <Grid xs={6} style={{display:'flex', justifyContent:'left', alignItems:'center', paddingTop: 25, paddingLeft: 5}}>
                  <Button style={{width: 250}} variant="outlined" onClick={() => {this.onClickAddNewTenant()}}>
                      <VideoLabelIcon/>
                      &nbsp;&nbsp;
                      Add Country Name
                  </Button>
              </Grid>
              <Dialog open={isDialogOpen} maxWidth="xs">
                  <DialogTitle>Add New Country</DialogTitle>
                  <DialogContent>
                      <Grid container spacing={2}>
                          <Grid item xs={12}>
                              <TextField
                                  label="Country Name"
                                  fullWidth
                                  variant="standard"
                                  value={newTenantName}
                                  onChange={(event) => {this.onChangeNewTenantName(event)}}/>
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  label="Country Code"
                                  fullWidth
                                  variant="standard"
                                  value={newTenantCode}
                                  onChange={(event) => {this.onChangeNewTenantCode(event)}}/>
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  label="Capital"
                                  fullWidth
                                  variant="standard"
                                  value={newTenantCapital}
                                  onChange={(event) => {this.onChangeNewTenantCapital(event)}}/>
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  label="Capital location[lat:long]"
                                  fullWidth
                                  variant="standard"
                                  value={newTenantCoordinates}
                                  onChange={(event) => {this.onChangeNewTenantCoordinates(event)}}
                                  />
                          </Grid>
                      </Grid>
                  </DialogContent>
                  <DialogActions>
                      <Button
                          onClick={() => {this.onClickSave()}}>
                          Save
                      </Button>
                      <Button
                          onClick={() => {this.onClickCancel()}}>
                          Cancel
                      </Button>
                  </DialogActions>
              </Dialog>
          </Grid>
        );
    }
}

export default Tenants;
