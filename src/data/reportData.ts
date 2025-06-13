import { OverviewData, MissedCall, MissedCallStat, CallDetailRecord } from '@/types/reportTypes';

// Sample overview data
export const overviewData: OverviewData = {
  totalCalls: 432,
  inboundCalls: 187,
  outboundCalls: 213,
  missedCalls: 32,
  abandonedCalls: 14,
  avgDuration: "3m 45s"
};

// Sample missed calls data
export const missedCallsData: MissedCall[] = [
  { id: 1, callerNumber: "+16505557890", callerName: "John Smith", time: "Mar 16, 2025, 2:23 PM", didNumber: "+14155552671", didName: "Sales Team", duration: "0:00" },
  { id: 2, callerNumber: "+16505557891", callerName: "Emily Johnson", time: "Mar 16, 2025, 11:05 AM", didNumber: "+14155552672", didName: "Support Team", duration: "0:00" },
  { id: 3, callerNumber: "+16505557892", callerName: "Michael Brown", time: "Mar 15, 2025, 4:42 PM", didNumber: "Main Line", didName: "Main Line", duration: "0:00" },
  { id: 4, callerNumber: "+16505557893", callerName: "Jessica Williams", time: "Mar 15, 2025, 9:17 AM", didNumber: "+14155552673", didName: "Marketing Team", duration: "0:00" },
  { id: 5, callerNumber: "+16505557894", callerName: "David Miller", time: "Mar 14, 2025, 3:39 PM", didNumber: "+14155552671", didName: "Sales Team", duration: "0:00" },
  { id: 6, callerNumber: "+16505557895", callerName: "Sarah Anderson", time: "Mar 14, 2025, 10:12 AM", didNumber: "Main Line", didName: "Main Line", duration: "0:00" },
  { id: 7, callerNumber: "+16505557896", callerName: "Robert Taylor", time: "Mar 13, 2025, 1:35 PM", didNumber: "+14155552674", didName: "Reception", duration: "0:00" },
  { id: 8, callerNumber: "+16505557897", callerName: "Jennifer Davis", time: "Mar 13, 2025, 11:27 AM", didNumber: "+14155552672", didName: "Support Team", duration: "0:00" },
  { id: 9, callerNumber: "+16505557898", callerName: "Thomas Jones", time: "Mar 12, 2025, 4:03 PM", didNumber: "+14155552671", didName: "Sales Team", duration: "0:00" },
  { id: 10, callerNumber: "+16505557899", callerName: "James Wilson", time: "Mar 12, 2025, 9:51 AM", didNumber: "Main Line", didName: "Main Line", duration: "0:00" }
];

// Sample missed calls by DID data
export const missedCallsStats: MissedCallStat[] = [
  { id: 1, didNumber: "+14155552671", didName: "Sales Team", count: 12, percentage: 37.5 },
  { id: 2, didNumber: "+14155552672", didName: "Support Team", count: 8, percentage: 25.0 },
  { id: 3, didNumber: "Main Line", didName: "Main Line", count: 9, percentage: 28.13 },
  { id: 4, didNumber: "+14155552673", didName: "Marketing Team", count: 5, percentage: 15.63 },
  { id: 5, didNumber: "+14155552674", didName: "Reception", count: 7, percentage: 21.87 }
];

// Sample abandoned calls data
export const abandonedCallsData: CallDetailRecord[] = Array.from({ length: 25 }).map((_, index) => ({
  id: `CALL-${12346 + index}`,
  direction: Math.random() > 0.2 ? 'Inbound' : 'Outbound',
  callingPartyNumber: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
  startTime: `2025-03-${10 + Math.floor(Math.random() * 7)} ${Math.floor(10 + Math.random() * 10)}:${Math.floor(10 + Math.random() * 50)}:${Math.floor(10 + Math.random() * 50)}`,
  duration: `00:0${Math.floor(1 + Math.random() * 5)}:${Math.floor(10 + Math.random() * 50)}`,
  status: 'Abandoned'
}));

// Sample outbound calls data
export const outboundCallsData: CallDetailRecord[] = Array.from({ length: 25 }).map((_, index) => ({
  id: `CALL-${22346 + index}`,
  direction: 'Outbound',
  callingPartyNumber: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
  startTime: `2025-03-${10 + Math.floor(Math.random() * 7)} ${Math.floor(10 + Math.random() * 10)}:${Math.floor(10 + Math.random() * 50)}:${Math.floor(10 + Math.random() * 50)}`,
  duration: `00:${Math.floor(1 + Math.random() * 10)}:${Math.floor(10 + Math.random() * 50)}`,
  status: Math.random() > 0.9 ? 'Failed' : 'Completed'
}));

// Sample inbound calls data
export const inboundCallsData: CallDetailRecord[] = Array.from({ length: 25 }).map((_, index) => ({
  id: `CALL-${32346 + index}`,
  direction: 'Inbound',
  callingPartyNumber: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
  startTime: `2025-03-${10 + Math.floor(Math.random() * 7)} ${Math.floor(10 + Math.random() * 10)}:${Math.floor(10 + Math.random() * 50)}:${Math.floor(10 + Math.random() * 50)}`,
  duration: `00:${Math.floor(1 + Math.random() * 10)}:${Math.floor(10 + Math.random() * 50)}`,
  status: Math.random() > 0.1 ? 'Answered' : 'Missed'
}));
