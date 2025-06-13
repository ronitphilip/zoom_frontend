export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface UserDetails {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'agent' | 'supervisor';
}

export interface Token {
    token: string;
}