export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  roleId?: number;
  role?: string | any;
  password?: string;
}

export interface EncryptionResult {
  iv: string;
  encryptedData: string;
}

export interface RegisterRequestBody {
  name: string;
  email: string;
  roleId?: number;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface UserResponseBody {
  token?: string;
  data?: UserAttributes | EncryptionResult;
  success: boolean;
  error?: string;
  response? : [key: object]
}
