import commonAPI, { Headers, ResponseData } from "./commonAPI";
import server_url from "./serverURL";

export const fetchAgentPerfomanceAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/agent-perfomance`, reqBody, header);
}

export const fetchAgentQueueAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/time-card`, reqBody, header);
}

export const fetchGroupSummaryAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/group-summary`, reqBody, header);
}

export const fetchAgentEngagementAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/agent-engagement`, reqBody, header);
}

export const refreshAgentPerformanceAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/refresh/agent-perfomance`, reqBody, header);
};

export const refreshTimeCardAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/refresh/time-card`, reqBody, header);
};

export const refreshGroupSummaryAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/refresh/group-summary`, reqBody, header);
};

export const refreshAgentEngagementAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/refresh/agent-engagement`, reqBody, header);
};

export const fetchAgentLoginReportAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/agent-login-report`, reqBody, header);
};

export const refreshAgentLoginReportAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/reports/refresh/agent-login-report`, reqBody, header);
};