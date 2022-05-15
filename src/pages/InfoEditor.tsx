import React from 'react';
import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select, SelectChangeEvent
} from '@mui/material';

import axios from 'axios';
import {mainServer} from '../config/mainConfig';



interface Props {

}

interface State {
    selectedPage: string;
    selectedLanguage: string;
    selectedFile: FileList | null;
}

class InfoEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedLanguage: '',
            selectedPage: '',
            selectedFile: null,
        }
    }

    handleLanguageChange(event: SelectChangeEvent) {
        this.setState({selectedLanguage: event.target.value});
    }

    handlePageChange(event: SelectChangeEvent) {
        this.setState({selectedPage: event.target.value});
    }

    uploadHtmlFile() {
        //
        const formData = new FormData();
        const {selectedFile, selectedLanguage, selectedPage} = this.state;

        if (!selectedLanguage || selectedLanguage.length === 0) {
            alert("Please, select the language.");
            return;
        }

        if (!selectedPage || selectedPage.length === 0) {
            alert("Please, select the page.");
            return;
        }

        if (selectedFile) {
            formData.append('file', selectedFile[0])
        }
        else {
            alert("Please, select the .html file to upload");
            return;
        }

        const url = mainServer + "/info/html/upload/"+selectedPage+"/"+selectedLanguage;
        axios.post(url, formData)
            .then(response => {
                if (response.data.requestFailed) {
                    alert(response.data.failureMessage);
                }
                else {
                    alert("File has been uploaded successfully.");
                }
            })
            .catch(error => alert(JSON.stringify(error)));
    }

    handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        // @ts-ignore
        const fileList = e.target.files;
        if (!fileList) {
            return;
        }
        this.setState({selectedFile: fileList});
    }

    render() {
        const resources = ["Cover", "FAQ", "EstimateRate", "Insurance"];
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
                </Grid>
                <Grid item xs={12}>
                    <Grid container component={Paper} spacing={1} style={{paddingBottom: 20, marginLeft: 0, marginTop: 10}}>
                        <Grid item xs={1}/>
                        <Grid item xs={2}>
                            <Box>
                                <label htmlFor="photo">
                                    <input
                                        accept=".html"
                                        style={{ display: "none" }}
                                        id="photo"
                                        name="photo"
                                        type="file"
                                        multiple={false}
                                        onChange={(event) => this.handleFileChange(event)}
                                    />
                                    <Button
                                        component="span"
                                        variant="contained"
                                    >
                                        Choose HTML File
                                    </Button>
                                </label>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                onClick={() => {this.uploadHtmlFile()}}
                            >Save
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}


export default InfoEditor;
