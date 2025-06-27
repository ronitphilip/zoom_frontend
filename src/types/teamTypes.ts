export interface TeamMember {
    user_id?: string;
    name?: string;
}

export interface TeamAttributes {
    id?: number;
    team_name: string;
    team_members: TeamMember[];
}

export interface TeamUser {
  user_id: string;
  name: string;
}