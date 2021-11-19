import axios from 'axios';

class ApiInvoker {
    //
    constructor() {
        //
    }

     static async InvokeGet(url: string): Promise<any> {
         axios({
             url: url,
             method: 'GET',
         })
             .then(response => {
                 const requestFailed = response.data.requestFailed;
                 if (!requestFailed) {
                     return response.data.entities;
                 } else {
                     alert(response.data.failureMessage.exceptionMessage);
                 }
             })
             .catch(error => {
                 alert(error);
             });

        //return [];
    }
}

export default ApiInvoker;
