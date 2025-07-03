import commonAPI, { Headers, ResponseData } from "./commonAPI";
import server_url from "./serverURL";

export const fetchAgentVDNIntervalAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/vdn/interval`, reqBody, header);
}