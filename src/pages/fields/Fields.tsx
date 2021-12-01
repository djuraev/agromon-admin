import React, {Component} from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import {Button, Divider, Grid} from '@mui/material';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import TrafficIcon from '@mui/icons-material/Traffic';
interface Props {

}

interface State {
    mapViewStyle: string,
}

const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiZGFpbWsiLCJhIjoiY2ttbmt2dzc2MXZ1bjJwcGZsZndoaGdkbiJ9.KzEXKpaGb0yYkV8Npdg65g"
});

class Fields extends Component<Props, State> {
    //
    state: State = {
        mapViewStyle: "mapbox://styles/mapbox/satellite-v9"
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

    onChangeMapStyle(style: string) {
        this.setState({mapViewStyle: style});
    }

    onStyleLoad(map: any) {
    }

    render() {
        const {mapViewStyle} = this.state;
        return (
            <Grid container>
                <Grid item xs={6}>
                    <Grid container></Grid>
                </Grid>
                <Grid item xs={6} style={{paddingTop: 10, paddingBottom: 10}}>
                    <div>
                        <Map
                            onStyleLoad={this.onStyleLoad}
                            style={mapViewStyle} // eslint-disable-line
                            center = {[69.240562, 41.311081]}
                            containerStyle={{
                                height: "600px",
                                width: "680px"
                            }}
                        >
                            <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={this.onDrawUpdate} />
                        </Map>
                    </div>
                </Grid>
                <Grid item xs={6}>

                </Grid>
                <Grid item xs={6} style={{alignItems: 'flex', padding: 1}}>
                    <Grid container>
                        <Grid item xs={4}>
                            <Button variant="outlined" onClick={() => this.onChangeMapStyle("mapbox://styles/mapbox/satellite-v9")}>
                                <SatelliteAltIcon/>
                                Satellite
                            </Button>
                        </Grid>
                        <Grid xs={4}>
                            <Button variant="outlined" onClick={() => this.onChangeMapStyle("mapbox://styles/mapbox/outdoors-v11")}><NaturePeopleIcon/>Outdoors</Button>
                        </Grid>
                        <Grid xs={4}>
                            <Button variant="outlined" onClick={() => this.onChangeMapStyle("mapbox://styles/mapbox/satellite-streets-v11")}><TrafficIcon/>Satellite Streets</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default Fields;
