import React, {Component} from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import {
    Button,
    ButtonGroup,
    Divider,
    FormControl,
    Grid, IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Paper, TextareaAutosize,
    TextField, Typography
} from '@mui/material';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import TrafficIcon from '@mui/icons-material/Traffic';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import BackspaceSharpIcon from '@mui/icons-material/BackspaceSharp';
import SaveSharpIcon from '@mui/icons-material/SaveSharp';
import LocationSearchingSharpIcon from '@mui/icons-material/LocationSearchingSharp';


interface Props {

}

interface State {
    mapViewStyle: string,
    currentLang: any,
    currentLat: any,
    zoom: number;
    coordinates: string,
    rawCoordinates: any;
}

const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiZGFpbWsiLCJhIjoiY2ttbmt2dzc2MXZ1bjJwcGZsZndoaGdkbiJ9.KzEXKpaGb0yYkV8Npdg65g"
});

class Fields extends Component<Props, State> {
    //
    state: State = {
        mapViewStyle: "mapbox://styles/mapbox/satellite-v9",
        currentLang: null,
        currentLat: null,
        zoom: 16,
        coordinates: '',
        rawCoordinates: null,
    }

    componentDidMount() {
        this.getCurrentLocation();
    }

    onDrawCreate(points: any){
        //console.log(features);
        const {features} = points;
        let coordinates = features[0].geometry.coordinates[0];
        console.log(coordinates);

        let rawStr: string;
        rawStr = '';
        for (let i=0; i<coordinates.length; i++) {
            console.log(coordinates[i][0]+", "+coordinates[i][1]);
            rawStr += '['+coordinates[i][0]+', '+coordinates[i][1]+']\n';
        }
        // @ts-ignore
        document.getElementById("coordinatesArea").value = rawStr;
    };

    async getCurrentLocation() {
        await navigator.geolocation.getCurrentPosition(
            position => this.setState(
                {
                    currentLat: position.coords.latitude,
                    currentLang: position.coords.longitude,
                }),
        );
    }

    onDrawUpdate(points: any ){
        const {features} = points;
        console.log(features[0].geometry.coordinates);
    };

    onChangeMapStyle(style: string) {
        this.setState({mapViewStyle: style});
    }

    onStyleLoad(map: any) {
    }

    zoomInClick() {
        const {zoom} = this.state;
        if (zoom < 17) {
            this.setState({zoom: zoom+0.25})
        }
    }

    zoomOutClick() {
        const {zoom} = this.state;
        if (zoom > 0) {
            this.setState({zoom: zoom-0.25})
        }
    }

    onClickClear() {
        const element = document.getElementById("coordinatesArea");
        if (element) {
            // @ts-ignore
            element.value = '';
        }
    }

    render() {
        const {mapViewStyle, currentLang, currentLat, zoom} = this.state;
        return (
            <Grid container>
                    <Grid item xs={6}>
                        <Paper style={{padding: 5, margin: 5}}>
                            <Grid container>
                                <Grid item xs={1}/>
                                <Grid item xs={8}>
                                    <FormControl variant="standard" style={{width: '90%'}}>
                                        <InputLabel htmlFor="input-with-icon-adornment">
                                            Please, enter user insurance number
                                        </InputLabel>
                                        <Input
                                            id="input-with-icon-adornment"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <AccountBoxOutlinedIcon />
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="outlined" style={{height: 50}}>
                                        <LocationSearchingSharpIcon/>
                                        &nbsp;&nbsp;Search
                                    </Button>
                                </Grid>
                                <Grid item xs={1}/>
                            </Grid>
                        </Paper>
                        <Paper style={{padding: 5, margin: 5, borderColor: 'green'}}>
                            <Grid container>
                                <Grid item xs={1}/>
                                <Grid item xs={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Name" disabled={true}/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Surname"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Insurance Number"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Email"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Region"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="District"/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}/>
                            </Grid>
                        </Paper>
                        <Paper style={{padding: 5, margin: 5}}>
                            <Typography style={{textAlign: 'center'}}>Please, fill in below fields.</Typography>
                        </Paper>
                        <Paper style={{padding: 5, margin: 5}}>
                            <Grid container>
                                <Grid item xs={1}/>
                                <Grid item xs={8}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Village"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Crop Type"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Field Name"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" label="Area (hectare)"/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField size="small" label="Comment" style={{width: '95%'}}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextareaAutosize
                                                style={{width: '95%', height: '20vh'}}
                                                aria-label="maximum height"
                                                id="coordinatesArea"
                                                minRows={4}/>
                                        </Grid>
                                        <Grid item xs={3}/>
                                        <Grid item xs={3}>
                                            <Button variant="outlined"><SaveSharpIcon/>&nbsp;&nbsp;Save</Button>
                                        </Grid>
                                        <Grid item xs={3} >
                                            <Button
                                                variant="outlined"
                                                onClick={this.onClickClear}
                                            ><BackspaceSharpIcon/>&nbsp;&nbsp;Clear</Button>
                                        </Grid>
                                        <Grid item xs={3}/>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}/>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper style={{padding: 5, margin: 5}}>
                            <Grid container>
                                <Grid item xs={12} style={{height: '75vh'}}>
                                    <Map
                                        onStyleLoad={this.onStyleLoad}
                                        style={mapViewStyle} // eslint-disable-line
                                        center = {[currentLang, currentLat]}
                                        zoom={[zoom]}
                                        movingMethod="flyTo"
                                        containerStyle={{
                                            height: '100%',
                                            width: '100%'
                                        }}
                                    >
                                        <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={() => this.onDrawUpdate} />
                                    </Map>
                                </Grid>
                                <Grid item xs={12} style={{margin:5, width:2}}>
                                    <Divider/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container style={{margin: 5, alignItems:'center'}}>
                                        <Grid item xs={3}>
                                            <Button variant="outlined" onClick={() => this.onChangeMapStyle("mapbox://styles/mapbox/satellite-v9")}>
                                                <SatelliteAltIcon/>
                                                &nbsp;&nbsp;Satellite
                                            </Button>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button variant="outlined" onClick={() => this.onChangeMapStyle("mapbox://styles/mapbox/outdoors-v11")}><NaturePeopleIcon/>
                                                &nbsp;&nbsp;Outdoors
                                            </Button>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button variant="outlined" onClick={() => this.onChangeMapStyle("mapbox://styles/mapbox/satellite-streets-v11")}><TrafficIcon/>
                                                &nbsp;&nbsp;Streets
                                            </Button>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <ButtonGroup aria-label="small button group">
                                                <Button onClick={() => (this.zoomOutClick())}><ZoomOutIcon/></Button>
                                                <Button onClick={() => (this.zoomInClick())}><ZoomInIcon/></Button>
                                                <Button onClick={() => (this.getCurrentLocation())}><GpsFixedIcon/></Button>
                                            </ButtonGroup>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
            </Grid>
        );
    }
}

export default Fields;
