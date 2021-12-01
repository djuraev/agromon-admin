import React, {Component} from 'react';
import {
    Button,
    Card,
    CardContent, CardMedia, Dialog, DialogActions, DialogTitle, Divider,
    Grid,
    Typography
} from '@mui/material';
import TenantDto from '../data-model/TenantDto';
import {mainServer, tenant} from '../config/mainConfig';
import axios from 'axios';
import TenantsTable from '../comp/TenantsTable';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import DrawControl from 'react-mapbox-gl-draw';
import ReactMapboxGl from "react-mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormControl from '@mui/material/FormControl';

const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiZGFpbWsiLCJhIjoiY2ttbmt2dzc2MXZ1bjJwcGZsZndoaGdkbiJ9.KzEXKpaGb0yYkV8Npdg65g"
});

interface Props {

}

interface State {
    tenants: TenantDto[];
    mapViewStyle: string;
}


class Tenants extends Component<Props, State> {
    //

    constructor(props: Props) {
        super(props);

        this.state = {
            tenants: [],
            mapViewStyle: "mapbox://styles/mapbox/satellite-v9"
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

    render() {
        return (
          <Grid container spacing={2}>
              <Grid item xs={12} style={{textAlign: 'center'}}>
                  <Typography>Tenants Info</Typography>
              </Grid>
              <Grid item xs={4}>
                  <TenantsTable/>
              </Grid>
              <Grid item xs={8}>
                  <Grid container spacing={1}>
                      <Grid item xs={4}>
                          <Card>
                              <CardMedia style={{alignItems: 'flex-start'}}>
                                  <AccountBoxIcon/>
                              </CardMedia>
                              <CardContent>
                                  <Typography>Users</Typography>
                                  <Divider/>
                                  <Typography>100</Typography>
                              </CardContent>
                          </Card>
                      </Grid>
                      <Grid item xs={4}>
                          <Card>
                              <CardMedia style={{alignItems: 'flex-start'}}>
                                  <NaturePeopleIcon/>
                              </CardMedia>
                              <CardContent>
                                  <Typography>Villages</Typography>
                                  <Divider/>
                                  <Typography>50</Typography>
                              </CardContent>
                          </Card>
                      </Grid>
                      <Grid item xs={4}>
                          <Card>
                              <CardMedia style={{alignItems: 'flex-start'}}>
                                  <NaturePeopleIcon/>
                              </CardMedia>
                              <CardContent>
                                  <Typography>Fields</Typography>
                                  <Divider/>
                                  <Typography>150</Typography>
                              </CardContent>
                          </Card>
                      </Grid>
                      <Grid xs={1}></Grid>
                      <Grid item xs={10} style={{alignItems: 'center'}}>
                          <Map
                              style="mapbox://styles/mapbox/light-v10" // eslint-disable-line
                              center = {[69.240562, 41.311081]}
                              containerStyle={{
                                  height: "400px",
                                  width: "800px"
                              }}
                          >
                              <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={this.onDrawUpdate} />
                          </Map>
                      </Grid>
                      <Grid xs={1}></Grid>
                  </Grid>
              </Grid>
              <Grid xs={12}>
              <Divider/>
              </Grid>
              <Grid xs={12} style={{display:'flex', justifyContent:'center', alignItems:'center', paddingTop: 25}}>
                  <Button style={{width: 250}} variant="outlined">+ Add New Tenant</Button>
              </Grid>
              <Grid xs={12}>
                  <Dialog open={true}>
                      <DialogTitle>Add new Country (Tenant)</DialogTitle>
                  </Dialog>
                  <DialogContent>
                      <DialogContentText>
                          You can set my maximum width and whether to adapt or not.
                      </DialogContentText>
                      <Button>OK</Button>
                  </DialogContent>
                  <DialogActions>
                      <Button>Close</Button>
                      <Button>Close</Button>

                  </DialogActions>
              </Grid>
          </Grid>
        );
    }
}

export default Tenants;
