import {Button, Grid, Paper, TextField} from '@mui/material';
import React from 'react';
import {Face, Fingerprint} from '@mui/icons-material';

interface Props {

}

interface State {
    username: string;
    password: string;
}

class Login extends React.Component<Props, State> {
    //
    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        }

    }

    handleChangeOnUsername(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({username: event.target.value});
    }

    handleChangeOnPassword(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({password: event.target.value});
    }

    handleLoginButtonClick() {
        const {username, password} = this.state;
        const user = {
            'username': username,
            'password': password,
        };
        alert(JSON.stringify(user));
        document.location.href = "MainLayout";
    }

    render() {
        return (
            <Paper style={{marginLeft: '30vw', marginTop: '20vh', width: '30vw', padding: 20, backgroundColor: 'whitesmoke'}}>
                <Grid container spacing={2}>
                    <Grid item xs={1}/>
                    <Grid item xs={2}>
                        <Face fontSize='large'/>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="username"
                            label="Username"
                            type="email"
                            size="small"
                            fullWidth
                            autoFocus
                            onChange={(event) => {this.handleChangeOnUsername(event)}}
                            required />
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={2}>
                        <Fingerprint fontSize='large'/>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            size="small"
                            fullWidth
                            required
                            onChange={(event => {this.handleChangeOnPassword(event)})}/>
                    </Grid>
                    <Grid item xs={3}/>
                    <Grid item xs={4}>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            style={{ textTransform: "none" }}
                            onClick={() => {this.handleLoginButtonClick()}}
                            >
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={3}/>
                </Grid>
            </Paper>
        );
    }
}

export default (Login);
