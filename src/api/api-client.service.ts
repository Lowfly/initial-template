import { Api } from "./generated-api-client";

export interface ApiClient {
    listProperties: (page: number, limit: number) => Promise<any>;
}

export class ApiClientService implements ApiClient {
    private readonly apiClient: Api<unknown>;


    constructor(baseUrl: string) {
        this.apiClient = new Api({ baseUrl });
    }

    listProperties = async (page: number, limit: number) => {
        const response = await this.apiClient.api.propertiesControllerFindAll({page, limit});
        console.log("response");
        console.log(response);
        return response.data;
    }
}

