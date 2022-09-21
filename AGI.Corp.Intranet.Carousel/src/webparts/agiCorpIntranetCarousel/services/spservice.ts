import { SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

class SPService {

    public static getItemsByListDataSvc(url: string, spHttpClient: SPHttpClient): Promise<any> {
        
        return new Promise<string>((resolve, reject) => {
            let data;
            try{
                spHttpClient.get(url,
                SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
                  return response.json();
                }).then((response: any): void => {
                    data =  response && response.d ? response.d : null
                    resolve(data);
                }, (error) => {
  
                  console.log("getItemsByListDataSvc: api call error");
                  console.log("request uri: " + url);
                  console.log(error);
                  data = [];
                  reject(data);  
                });
              }
          catch(error) {
              console.log("getItemsByListDataSvc: try catch error");
              console.log("request uri: " + url);
              console.log(error);
              data = [];
              reject(data);
          }
        });
       
       
    }

    public static getChoiceValues(url: string, spHttpClient: SPHttpClient): Promise<any> {
      return new Promise<string>((resolve, reject) => {
          let data;
          try{
              spHttpClient.get(url,
              SPHttpClient.configurations.v1)
              .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
                return response.json();
              }).then((response: any): void => {
                  data =  response && response.value ? response.value[0].Choices : null
                  resolve(data);
              }, (error) => {

                console.log("getChoiceValues: api call error");
                console.log("request uri: " + url);
                console.log(error);
                data = [];
                reject(data);  
              });
            }
          catch(error) {
            console.log("getChoiceValues: try catch error");
            console.log("request uri: " + url);
            console.log(error);
            data = [];
            reject(data);
          }
      });
    }
     

    public static getItemsByRestApi(url: string, spHttpClient: SPHttpClient): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            let data;
            try{
                spHttpClient.get(url,
                SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
                  return response.json();
                }).then((response: any): void => {
                    data =  response && response.value ? response.value : null
                    resolve(data);
                }, (error) => {
  
                  console.log("getItemsByRestApi: api call error");
                  console.log("request uri: " + url);
                  console.log(error);
                  data = [];
                  reject(data);  
                });
              }
            catch(error) {
              console.log("getItemsByRestApi: try catch error");
              console.log("request uri: " + url);
              console.log(error);
              data = [];
              reject(data);
            }
        });
    }

    public static getItemByID(url: string, spHttpClient: SPHttpClient): Promise<any> {
      return new Promise<string>((resolve, reject) => {
          let data;
          try{
              spHttpClient.get(url,
              SPHttpClient.configurations.v1)
              .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
                return response.json();
              }).then((response: any): void => {
                  data =  response ? response : null
                  resolve(data);
              }, (error) => {
                console.log("getItemByID: api call error");
                console.log("request uri: " + url);
                console.log(error);
                data = [];
                reject(data);  
              });
            }
          catch(error) {
            console.log("getItemByID: try catch error");
            console.log("request uri: " + url);
            console.log(error);
            data = [];
            reject(data);
          }
      });
  }

    public static getItemCount(url: string, spHttpClient: SPHttpClient): Promise<any> {
      return new Promise<string>((resolve, reject) => {
          let data;
          try{
              spHttpClient.get(url,
              SPHttpClient.configurations.v1)
              .then((response: SPHttpClientResponse): Promise<{ value: any[] }> => {
                return response.json();
              }).then((response: any): void => {
                  data =  response && response.value ? response.value : null
                  resolve(data);
              }, (error) => {

                console.log("getItemsByRestApi: api call error");
                console.log("request uri: " + url);
                console.log(error);
                data = [];
                reject(data);  
              });
            }
          catch(error) {
            console.log("getItemsByRestApi: try catch error");
            console.log("request uri: " + url);
            console.log(error);
            data = [];
            reject(data);
          }
      });
  }

    public static addItem(url: string, spHttpClient: SPHttpClient, body: string): Promise<any> {

      const headers: any = {
        'Accept' : 'application/json;odata=nometadata',
        'Content-type' : 'application/json;odata=nometadata',
        'odata-version' : '',
        'X-HTTP-Method': 'POST'
      };
      return new Promise<string>((resolve, reject) => {
          try{
              spHttpClient.post(
                  url,
                  SPHttpClient.configurations.v1,
                  {
                      headers : headers,
                      body : body
                  }
              ).then((response: SPHttpClientResponse): void => {
                    if(response.status == 400){
                      console.log("addItem: http error");
                      console.log('status code: ' + response.status);
                      console.log(response.statusText);
                      reject('error');
                    }
                    else {
                      console.log('request submitted successfully.')
                      console.log(response);
                      resolve('success');
                    }
                }, (error: any): void => {
                  console.log("addItem: api call error");
                  console.log("request uri: " + url);
                  console.log(error);
                  reject('error');  
              });

            }
        catch(error) {
            console.log("addItem: try catch error");
            console.log("request uri: " + url);
            console.log(error);
            reject('error');
        }
      });
    }
}

export default SPService;