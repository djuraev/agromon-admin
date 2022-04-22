import React from 'react';
import {
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent, TextField
} from '@mui/material';
import Box from '@mui/material/Box';


interface Props {

}

interface State {
    selectedPage: string;
    selectedLanguage: string;
}

class InfoEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedLanguage: '',
            selectedPage: '',
        }
    }

    handleLanguageChange(event: SelectChangeEvent) {
        this.setState({selectedLanguage: event.target.value});
    }
    handlePageChange(event: SelectChangeEvent) {
        this.setState({selectedPage: event.target.value});
    }


    render() {
        const resources = ["Cover", "FAQ", "Estimate", "Insurance"];
        const languages = [
            {"language":"English", "code": "en"},
            {"language":"Russian", "code": "ru"},
            {"language":"Uzbek", "code": "uz"},
            {"language":"Mongolian", "code": "mn"},
        ];
        const {selectedLanguage, selectedPage} = this.state;
        return (
            <Grid container component={Paper} style={{margin: 20, padding: 20, width: '97%'}}>
                <Grid item xs={12}>
                    <Grid container component={Paper} spacing={1} style={{paddingBottom: 20, marginLeft: 0}}>
                        <Grid item xs={3}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="resourceViewSelect">Page</InputLabel>
                                <Select
                                    labelId="countrySelectLabel"
                                    id="resourceViewSelect"
                                    label="Page"
                                    value={selectedPage}
                                    onChange={(event) => {this.handlePageChange(event)}}
                                >
                                    {resources.map((resource) => (
                                        <MenuItem value={resource}>{resource}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth size={'small'}>
                                <InputLabel id="countrySelectLabel">Language</InputLabel>
                                <Select
                                    labelId="countrySelectLabel"
                                    id="countrySelect"
                                    label="Language"
                                    value={selectedLanguage}
                                    onChange={(event) => {this.handleLanguageChange(event)}}
                                >
                                    {languages.map((language) => (
                                        <MenuItem value={language.code}>{language.language}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            height="500px" // fixed the height
                            style={{
                                border: "2px solid black",
                                overflow: "hidden",
                                overflowY: "scroll" // added scroll
                            }}
                        >
                       <TextField
                           style={{height: 500, overflow: "hidden", overflowY: "scroll"}}
                            multiline={true}
                            fullWidth
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: 50, marginBottom: 25}}>
                        <Divider />
                    </Grid>
                    <Grid item xs={5}/>
                    <Grid item xs={2}>
                        <Button variant="contained">Save</Button>
                    </Grid>
                    <Grid item xs={5}/>
                </Grid>
            </Grid>
        );
    }
}

export default InfoEditor;
