import React, {Component} from 'react';
import {Button, Divider, FormControl, FormHelperText, Grid, MenuItem, Paper, Select} from '@mui/material';

interface Props {

}

interface State {

}
class RegionDistricts extends Component<Props, State> {
    //
    render() {
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
                                <Button style={{width: 200}} variant="outlined">+ Add Region</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200}} variant="outlined">+ Add Region Name</Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button style={{width: 200}} variant="outlined">+ Add District</Button>
                            </Grid>

                            <Grid item xs={3}>
                                <Button style={{width: 200, paddingLeft: 20}} variant="outlined">+ Add District Name</Button>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
        );
    }
}

export default RegionDistricts;
