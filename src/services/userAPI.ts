import { UserAttributes } from '@/types/userTypes';
import commonAPI, { Headers, ResponseData } from './commonAPI';
import server_url from './serverURL';

export const fetchRoleAPI = async (header: Headers): Promise<ResponseData> => {
    return await commonAPI('GET', `${server_url}/roles/fetch-role`, null, header);
};

export const fetchAllUsersAPI = async (header: Headers): Promise<ResponseData> => {
    return await commonAPI('GET', `${server_url}/users/all-users`, null, header);
}

export const fetchAllRolesAPI = async (header: Headers): Promise<ResponseData> => {
    return await commonAPI('GET', `${server_url}/roles/all-roles`, null, header);
}
export const updateUserAPI = async (id: string, reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('PATCH', `${server_url}/users/update-user/${id}`, reqBody, header);
}

export const deleteUserAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('DELETE', `${server_url}/users/delete-user`, reqBody, header);
}

export const createRoleAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('POST', `${server_url}/roles/create-role`, reqBody, header);
}

export const addRolePermissionsAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('PATCH', `${server_url}/roles/add-permissions`, reqBody, header);
}

export const assignRoleAPI = async (reqBody: UserAttributes, header: Headers): Promise<ResponseData> => {
    return await commonAPI('PATCH', `${server_url}/roles/add-role`, reqBody, header);
}

export const deleteRoleAPI = async (reqBody: any, header: Headers): Promise<ResponseData> => {
    return await commonAPI('DELETE', `${server_url}/roles/delete`, reqBody, header);
}

