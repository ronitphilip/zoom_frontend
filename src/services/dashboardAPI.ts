import commonAPI, { Headers } from "./commonAPI";
import server_url from "./serverURL";

export interface zoomDataAttributes {
    total_calls: string;
    inbound_calls: string;
    outbound_calls: string;
    missed_calls: string;
    abandoned_calls: string;
    avg_call_duration: string;
    total_channel_count: string;
    voice_channel_percentage: string;
    video_channel_percentage: string;
    chat_channel_percentage: string;
    email_channel_percentage: string;
    call_success_rate: string;
    avg_speed_to_answer: string;
    max_speed_to_answer: string,
    min_speed_to_answer: string,
    inbound_call_minutes: string;
    outbound_call_minutes: string;
    total_call_minutes: string;
    avg_inbound_call_duration: string;
    avg_outbound_call_duration: string;
}

export interface dashboardResponse {
    success: boolean;
    data?: zoomDataAttributes;
}

export interface DashboardRequestBody {
    from: string;
    to: string;
}

export const fetchDashboardDataAPI = async (reqBody: DashboardRequestBody, header: Headers): Promise<dashboardResponse> => {
  return await commonAPI('POST', `${server_url}/dashboard`, reqBody, header);
};