export interface TeamMemeber {
    user_id?: string;
    name?: string;
}

export interface TeamAttributes {
    id?: number;
    team_name: string;
    team_members: TeamMemeber[];
}