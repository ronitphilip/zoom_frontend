// Agent-focused Report Types
export interface AgentTraceRecord {
  date: string;
  time: string;
  sequence: string;
  state: string;
  statusReason: string;
  splitSkill: string;
  queueWaitTime: string;
  duration: string;
  hold: string;
  ring: string;
  channelType: string;
  channelSource: string;
  deviceType: string;
  callingParty: string;
  interactionStatus: string;
  responseTime: string;
  mediaCount: string;
  transferOut: boolean;
  concurrentCount: string;
  disposition: string;
}

export interface AgentSplitSkillRecord {
  date: string;
  agentId: string;
  agentName: string;
  queueId: string;
  queueName: string;
  channelType: string;
  channelSource: string;
  handledCalls: number;
  missedCalls: number;
  refusedCalls: number;
  acdTime: string;
  acwTime: string;
  outboundCalls: number;
  outboundTime: string;
  firstResponseTime: string;
  holdCount: number;
  holdDuration: string;
  transferCount: number;
  transferDuration: string;
  conferenceCount: number;
  conferenceDuration: string;
}

export interface AgentGroupSummaryRecord {
  agentName: string;
  agentId: string;
  staffedTime: string;
  availTime: string;
  auxTime: string;
  occupiedTime: string;
  occupancyPercentage: number;
  totalHandled: number;
  inboundHandled: number;
  outboundHandled: number;
  digitalHandled: number;
  concurrentMax: number;
  avgHandleTime: string;
  avgWrapTime: string;
  totalAcdTime: string;
  totalAcwTime: string;
  agentRingTime: string;
  totalHoldTime: string;
  firstResponseAvg: string;
  channelEscalations: number;
  voiceOccupancy: number;
  digitalOccupancy: number;
}

// Split/Skill-focused Report Types
export interface SplitSkillDailyRecord {
  date: string;
  queueId: string;
  queueName: string;
  agentName: string;
  agentId: string;
  totalOffered: number;
  totalAnswered: number;
  abandonedCalls: number;
  acdTime: string;
  acwTime: string;
  agentRingTime: string;
  avgHandleTime: string;
  avgAcwTime: string;
  maxHandleTime: string;
  holdCount: number;
  holdTime: string;
  transferCount: number;
  conferenceCount: number;
  voiceCalls: number;
  digitalInteractions: number;
  firstResponseTime: string;
  slaCompliance: number;
}

export interface SplitSkillSummaryDailyRecord {
  date: string;
  queueId: string;
  queueName: string;
  totalOffered: number;
  totalHandled: number;
  abandonedCalls: number;
  abandonmentRate: number;
  averageSpeedAnswer: string;
  maxWaitTime: string;
  serviceLevelPercentage: number;
  transferredIn: number;
  transferredOut: number;
  averageHandleTime: string;
  averageAcwTime: string;
  totalTalkTime: string;
  totalAcwTime: string;
  voiceOffered: number;
  voiceHandled: number;
  digitalOffered: number;
  digitalHandled: number;
  averageFirstResponse: string;
  overflowedCalls: number;
}

export interface SplitSkillSummaryIntervalRecord {
  time: string;
  avgSpeedAns: string;
  avgAban: string;
  acdCalls: number;
  avgAcdTime: string;
  avgAcwTime: string;
  abanCalls: number;
  maxDelay: string;
  flowIn: number;
  flowOut: number;
  extnOutCalls: number;
  avgExtnOutTime: string;
  dequeuedCalls: number;
  avgTimeToDequeue: string;
  percentAcdTime: number;
  percentAnsCalls: number;
  avgPos: number;
  callsPerStaff: number;
  pos: number;
}

export interface SplitSkillCallProfileRecord {
  timeInterval: string;
  acdCalls: number;
  abandonedCalls: number;
}

export interface SplitSkillCallProfileSummary {
  totalAcdCalls: number;
  avgSpeedAns: string;
  percentAnsCalls: number;
  totalAbanCalls: number;
  avgAbanTime: string;
  percentAbanCalls: number;
  percentWithinServiceLevel: number;
}

// VDN-focused Report Types
export interface VdnDailyRecord {
  date: string;
  vectorInboundCalls: number;
  flowIn: number;
  calls: number;
  avgSpeedAns: string;
  avgAcdTime: string;
  avgAcwTime: string;
  mainAcdCalls: number;
  backupAcdCalls: number;
  connectTime: string;
  avgConnectCalls: number;
  abanCalls: number;
  avgAbanTime: string;
  percentAban: number;
  forcedBusyCalls: number;
  percentBusy: number;
  forcedDiscCalls: number;
  flowOut: number;
  percentFlowOut: number;
  avgVdnTime: string;
  firstSkillPref: string;
  secondSkillPref: string;
  thirdSkillPref: string;
}

export interface VdnIntervalRecord {
  time: string;
  vectorInboundCalls: number;
  flowIn: number;
  calls: number;
  avgSpeedAns: string;
  avgAcdTime: string;
  avgAcwTime: string;
  mainAcdCalls: number;
  backupAcdCalls: number;
  connectTime: string;
  avgConnectCalls: number;
  abanCalls: number;
  avgAbanTime: string;
  percentAban: number;
  forcedBusyCalls: number;
  percentBusy: number;
  forcedDiscCalls: number;
  flowOut: number;
  percentFlowOut: number;
  avgVdnTime: string;
  firstSkillPref: string;
  secondSkillPref: string;
  thirdSkillPref: string;
}

// Input criteria types
export interface ReportFilterCriteria {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  agentId?: string;
  agentName?: string;
  agentGroup?: string;
  splitSkillId?: string;
  vdnId?: string;
  intervalType?: 'fifteen' | 'thirty' | 'hourly';
  serviceLevelThresholds?: number[];
}
