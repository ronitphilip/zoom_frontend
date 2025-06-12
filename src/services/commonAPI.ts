import axios, { AxiosError } from 'axios';

export interface Headers {
    [key: string]: string;
}

export interface ResponseData {
    token?: string;
    data?: any;
    success: boolean;
    error?: string;
}

const commonAPI = async <T>(httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', url: string, reqBody?: any | null, headers: Headers | null = null): Promise<ResponseData> => {
    try {
        const isFormData = reqBody instanceof FormData;

        const result = await axios({
            method: httpMethod,
            url,
            data: reqBody,
            headers: {
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                ...headers,
            },
        });

        return result.data as ResponseData;
    } catch (err) {
        const error = err as AxiosError;
        const errorMessage = (error.response?.data as { error?: string })?.error || 'Request failed';
        return {
            success: false,
            error: errorMessage,
        } as ResponseData;
    }
};

export default commonAPI;
