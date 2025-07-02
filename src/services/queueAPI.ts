import commonAPI, { Headers, ResponseData } from "./commonAPI";
import server_url from "./serverURL";

export const fetchAgentQueuesAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/queues/all`, reqBody, header);
}

export const fetchDailyAgentQueuesAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/queues/daily`, reqBody, header);
}

export const fetchIntervalAgentQueuesAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/queues/interval`, reqBody, header);
}

export const fetchAbandonedCallsAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/queues/abandoned-calls`, reqBody, header);
}

export const getAgentAbandonedReportAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/queues/abandoned-report`, reqBody, header);
}