import commonAPI, { Headers, ResponseData } from "./commonAPI";
import server_url from "./serverURL";

export const fetchAgentReportAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/agent-history`, reqBody, header);
}

export const fetchAgentQueueAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/agent-queue`, reqBody, header);
}