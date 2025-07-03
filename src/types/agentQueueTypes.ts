export interface SkillRecord {
  channel: string;
  consumer_display_name: string;
  consumer_id: string | null;
  consumer_number: string | null;
  direction: string;
  display_name: string;
  duration: number;
  engagement_id: string;
  flow_duration: number;
  flow_name: string;
  handling_duration: number;
  queue_name: string;
  queue_wait_type: string;
  start_time: string;
  talk_duration: number;
  transferCount: number;
  user_id: string;
  voice_mail: number;
  waiting_duration: number;
  wrap_up_duration: number;
}

export interface RecordSummary {
  date: string;
  queueId: string;
  queueName: string;
  agentId: string | null;
  agentName: string | null;
  totalOffered: number;
  totalAnswered: number;
  abandonedCalls: number;
  acdTime: number;
  acwTime: number;
  agentRingTime: number;
  avgAcwTime: number;
  avgHandleTime: number;
  digitalInteractions: number;
  maxHandleTime: number;
  transferCount: number;
  voiceCalls: number;
}

export interface AgentAbandonedReport {
  startTime: string;
  engagementId: string;
  direction: string;
  consumerNumber: string;
  consumerId: string;
  consumerDisplayName: string;
  queueId: string;
  queueName: string;
  agentId: string;
  agentName: string;
  channel: string;
  queueWaitType: string;
  waitingDuration: number;
  voiceMail: number;
  transferCount: number;
}

export interface ReportRecord {
    date: string;
    flowId: string;
    flowName: string;
    totalOffered: number;
    totalAnswered: number;
    abandonedCalls: number;
    abandonPercentage: string;
    acdTime: number;
    acwTime: number;
    agentRingTime: number;
    avgAcwTime: number;
    avgHandleTime: number;
    digitalInteractions: number;
    inboundCalls: number;
    maxHandleTime: number;
    outboundCalls: number;
    successPercentage: string;
    transferCount: number;
    voiceCalls: number;
}