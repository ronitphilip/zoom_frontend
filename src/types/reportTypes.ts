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
