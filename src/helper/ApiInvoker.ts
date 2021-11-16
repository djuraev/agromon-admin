import axios from 'axios';

class ApiInvoker {
    //
    constructor() {
        //
    }

    public static InvokeGet(url: string) {
        axios({
            url: url,
            method: 'GET',
            })
            .then(response => {
                const requestFailed = response.data.requestFailed;
                if (!requestFailed) {
                    return response.data.entities;
                }
                else {
                    alert(response.data.failureMessage.exceptionMessage);
                }
            })
            .catch(error => {
                alert(error);
            })
        return [];
    }
}

export default ApiInvoker;
