import { CallLogRequestBody } from '@/types/zoomTypes';
import commonAPI, { Headers, ResponseData } from './commonAPI';
import server_url from './serverURL';

export const fetchOutbondCallLogsAPI = async (header: Headers, reqBody: CallLogRequestBody): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/outbond-calls`, reqBody, header);
};

export const fetchInbondCallLogsAPI = async (header: Headers, reqBody: CallLogRequestBody): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/zoom/inbond-calls`, reqBody, header);
};