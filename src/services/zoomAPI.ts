import { CallLogRequestBody } from '@/types/zoomTypes';
import commonAPI, { Headers, ResponseData } from './commonAPI';
import server_url from './serverURL';

export const fetchOutbondCallLogsAPI = async (header: Headers, reqBody: CallLogRequestBody): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/outbond-calls`, reqBody, header);
};

export const fetchInbondCallLogsAPI = async (header: Headers, reqBody: CallLogRequestBody): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/inbond-calls`, reqBody, header);
};

export const rawCallLogsAPI = async (header: Headers, reqBody: CallLogRequestBody): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/raw-call-logs`, reqBody, header);
}

export const refreshCallLogsAPI = async (header: Headers, reqBody: CallLogRequestBody): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/refresh-call-logs`, reqBody, header);
}

export const addUserAccountAPI = async (header: Headers, reqBody: any): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/save-zoomuser`, reqBody, header);
}

export const fetchZoomAccountsAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/fetch-accounts`, reqBody, header);
}

export const setPrimaryAccountAPI = async (header: Headers, reqBody: any): Promise<ResponseData> => {
    return await commonAPI('PATCH', `${server_url}/zoom/set-primary`, reqBody, header);
}