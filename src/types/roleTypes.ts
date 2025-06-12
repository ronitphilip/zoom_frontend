export interface Permission {
    [key: string]: string[];
}

export interface Role {
    id: string
    role: string
    permissions?: Permission | null
}
