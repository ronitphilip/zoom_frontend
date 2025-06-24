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
  engagementId: string;
  date: string;
  time: string;
  queue: string;
  channel: string;
  direction: string;
  userName: string;
  duration: string;
  transferInitiatedCount: number;
  transferCompletedCount: number;
  holdCount: number;
  agentOfferedCount: number;
  status: string;
  viewInteraction: string;
}

export interface TraceData {
  workSessionId: string;
  date: string;
  time: string;
  userName: string;
  userStatus: string;
  userSubStatus: string;
  teamName: string;
  duration: string;
  viewSession: string;
}