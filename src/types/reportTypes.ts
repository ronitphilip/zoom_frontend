export interface OverviewData {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  missedCalls: number;
  abandonedCalls: number;
  avgDuration: string;
}

export interface MissedCall {
  id: number;
  callerNumber: string;
  callerName: string;
  time: string;
  didNumber: string;
  didName: string;
  duration: string;
}

export interface MissedCallStat {
  id: number;
  didNumber: string;
  didName: string;
  count: number;
  percentage: number;
}

export interface CallDetailRecord {
  id: string;
  direction: 'Inbound' | 'Outbound';
  callingPartyNumber: string;
  startTime: string;
  duration: string;
  status: string;
}

export interface VisibleColumnType {
  [key: string]: boolean;
}

export interface PerformanceData {
  engagement_id: string;
  start_time: string;
  time: string;
  queue_name: string;
  channel: string;
  direction: string;
  user_name: string;
  conversation_duration: string;
  transfer_initiated_count: number;
  transfer_completed_count: number;
  hold_count: number;
  agent_offered_count: number;
  status: string;
  viewInteraction: string;
}

export interface TraceData {
  work_session_id: string;
  start_time: string;
  time?: string;
  user_name: string;
  user_status: string;
  user_sub_status: string;
  teamName?: string;
  occupied_duration: string;
  viewSession?: string;
}

export interface AgentEngagementAttributes {
  id?: string;
  engagement_id: string;
  direction: string;
  start_time: string;
  channel: string;
  consumer: string;
  dnis: string;
  ani: string;
  queue_name: string;
  user_name: string;
  duration: number;
  hold_count: number;
  warm_transfer_initiated_count: number;
  warm_transfer_completed_count: number;
  direct_transfer_count: number;
  transfer_initiated_count: number;
  transfer_completed_count: number;
  warm_conference_count: number;
  conference_count: number;
  abandoned_count: number;
}

export interface AgentLoginReport {
  user_name: string;
  work_session_id: string;
  login_time: string;
  logout_time: string;
  duration?: number;
}