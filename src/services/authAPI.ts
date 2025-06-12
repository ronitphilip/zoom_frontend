import commonAPI from './commonAPI';
import server_url from './serverURL';
import { RegisterRequestBody, LoginRequestBody, UserResponseBody } from '@/types/userTypes';

export const registerAPI = async (reqBody: RegisterRequestBody): Promise<UserResponseBody> => {
  return await commonAPI('POST', `${server_url}/users/register`, reqBody);
};

export const loginAPI = async (reqBody: LoginRequestBody): Promise<UserResponseBody> => {
  return await commonAPI('POST', `${server_url}/users/login`, reqBody);
};