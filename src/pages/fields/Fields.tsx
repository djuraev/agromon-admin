import React, {Component} from 'react';
import ReactMapboxGl from "react-mapbox-gl";
import DrawControl from "react-mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

interface Props {

}

interface State {

}

const Map = ReactMapboxGl({
    accessToken:
        "pk.eyJ1IjoiZGFpbWsiLCJhIjoiY2ttbmt2dzc2MXZ1bjJwcGZsZndoaGdkbiJ9.KzEXKpaGb0yYkV8Npdg65g"
});

class Fields extends Component<Props, State> {
    //
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
            <div>
                <h2>Draw Polygon</h2>
                <Map
                    style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
                    containerStyle={{
                        height: "600px",
                        width: "400px"
                    }}
                >
                    <DrawControl onDrawCreate={this.onDrawCreate} onDrawUpdate={this.onDrawUpdate} />
                </Map>
            </div>
        );
    }
}

export default Fields;
