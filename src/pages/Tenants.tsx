import React, {Component} from 'react';
import {
    Dialog, DialogActions, DialogTitle, TextField,
    Grid, Paper, Divider, Button,
} from '@mui/material';
import TenantDto from '../data-model/TenantDto';
import {mainServer, tenant} from '../config/mainConfig';
import axios from 'axios';
import TenantsTable from '../comp/TenantsTable';
import DrawControl from 'react-mapbox-gl-draw';
import ReactMapboxGl from "react-mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DialogContent from '@mui/material/DialogContent';

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
}


class Tenants extends Component<Props, State> {
    //

    constructor(props: Props) {
        super(props);

        this.state = {
            tenants: [],
            mapViewStyle: "mapbox://styles/mapbox/satellite-v9",
            isDialogOpen: false,
        }
    }

    async componentDidMount() {
      //this.retrieveTenants();
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
        this.setState({isDialogOpen: false})
    }

    onClickAddNewTenant() {
        this.setState({isDialogOpen: true})
    }

    render() {
        const { isDialogOpen } = this.state;
        return (
          <Grid container spacing={2}>
              <Grid item xs={12} style={{textAlign: 'center'}}>
                  <h3>Tenants Info</h3>
              </Grid>
              <Grid item xs={4}>
                  <TenantsTable/>
              </Grid>
              <Grid item xs={7}>
                  <Grid container spacing={1}>
                      <Grid item xs={10} style={{alignItems: 'center'}}>
                          <Paper style={{padding: 5}}>
                          <Map
                              style="mapbox://styles/mapbox/light-v10" // eslint-disable-line
                              center = {[69.240562, 41.311081]}
                              containerStyle={{
                                  height: "450px",
                                  width: "800px"
                              }}
                          >
                              <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={this.onDrawUpdate} />
                          </Map>
                          </Paper>
                      </Grid>
                      <Grid xs={1}></Grid>
                  </Grid>
              </Grid>
              <Grid xs={12}>
              <Divider/>
              </Grid>
              <Grid xs={6} style={{display:'flex', justifyContent:'right', alignItems:'center', paddingTop: 25, paddingRight: 5}}>
                  <Button style={{width: 250}} variant="outlined" onClick={() => {this.onClickAddNewTenant()}}>+ Add New Tenant</Button>
              </Grid>
              <Grid xs={6} style={{display:'flex', justifyContent:'left', alignItems:'center', paddingTop: 25, paddingLeft: 5}}>
                  <Button style={{width: 250}} variant="outlined" onClick={() => {this.onClickAddNewTenant()}}>+ Add Tenant Name</Button>
              </Grid>
              <Dialog open={isDialogOpen} maxWidth="xs">
                  <DialogTitle>Add New Country</DialogTitle>
                  <DialogContent>
                      <Grid container spacing={2}>
                          <Grid item xs={12}>
                              <TextField
                                  label="Country Name"
                                  fullWidth
                                  variant="standard"/>
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  label="Country Code"
                                  fullWidth
                                  variant="standard"/>
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  label="Capital"
                                  fullWidth
                                  variant="standard"/>
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                  label="Capital location[long:lat]"
                                  fullWidth
                                  variant="standard"/>
                          </Grid>
                      </Grid>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={() => {this.onClickSave()}}>Save</Button>
                      <Button onClick={() => {this.onClickCancel()}}>Cancel</Button>
                  </DialogActions>
              </Dialog>
          </Grid>
        );
    }
}

export default Tenants;
