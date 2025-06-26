import { TeamAttributes } from "@/types/teamTypes";
import commonAPI, { Headers, ResponseData } from "./commonAPI";
import server_url from "./serverURL";

export const fetchTeamssAPI = async (header: Headers, reqBody: any): Promise<ResponseData> => {
    return await commonAPI('GET', `${server_url}/teams/fetch`, reqBody, header);
};

export const createTeamssAPI = async (header: Headers, reqBody: TeamAttributes): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/teams/create`, reqBody, header);
};

export const updateTeamsAPI = async (header: Headers, id: string, reqBody: TeamAttributes): Promise<ResponseData> => {
    return await commonAPI('PATCH', `${server_url}/teams/update/${id}`, reqBody, header);
};

export const deleteTeamsAPI = async (header: Headers, reqBody:any): Promise<ResponseData> => {
    return await commonAPI('DELETE', `${server_url}/teams/delete`, reqBody, header);
};