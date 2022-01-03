import React, {Component} from 'react';
import TabControl from '../../comp/TabControl';
import {Grid, Paper} from '@mui/material';
import MetricDto from '../../data-model/MetricDto';
import CropDto from '../../data-model/CropDto';
import {crops, mainServer, metrics} from '../../config/mainConfig';
import axios from 'axios';


interface Props {

}

interface State {
    metrics: MetricDto[];
    crops: CropDto[];
}
class MetricsAndCrops extends Component<Props, State> {
    //

    constructor(props: Props) {
        super(props);
        this.state = {
            metrics: [],
            crops: [],
        }
    }

    componentDidMount() {
        this.getAllCrops();
        this.getAllMetrics();
    }

    getAllMetrics() {
        const url = mainServer + metrics;
        axios.get(url)
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({metrics: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    getAllCrops() {
        const url = mainServer + crops;
        axios.get(url)
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    this.setState({crops: response.data.entities[0]});
                } else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    render() {
        const {metrics, crops} = this.state;
        return (
            <Grid container component={Paper} style={{margin: 20, padding: 20, width: '97%'}}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <TabControl
                    metrics={metrics}
                    crops={crops}/>
                </Grid>
            </Grid>
        );
    }
}

export default MetricsAndCrops;
