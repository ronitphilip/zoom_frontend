import commonAPI, { Headers, ResponseData } from "./commonAPI";
import server_url from "./serverURL";

export const fetchAgentPerfomanceAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/agent-perfomance`, reqBody, header);
}

export const fetchAgentQueueAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/time-card`, reqBody, header);
}