export interface CallLogRequestBody {
    from: string;
    to: string;
    direction?: string
}

export interface ZoomAccount {
    id: number;
    account_id: string;
    client_id: string;
    primary: boolean;
}

export interface CallLogEntry {
  id?: string;
  call_id?: string;
  call_path_id?: string;
  call_result?: string;
  call_type?: string;
  callee_country_code?: string;
  callee_country_iso_code?: string;
  callee_did_number?: string;
  callee_email?: string;
  callee_ext_id?: string;
  callee_ext_number?: string;
  callee_ext_type?: string;
  callee_name?: string;
  callee_number_type?: string;
  caller_country_code?: string;
  caller_country_iso_code?: string;
  caller_did_number?: string;
  caller_name?: string;
  caller_number_type?: string;
  connect_type?: string;
  direction?: string;
  duration?: number;
  end_time?: string;
  end_to_end?: boolean;
  hide_caller_id?: boolean;
  international?: boolean;
  recording_status?: string;
  site_id?: string;
  site_name?: string;
  start_time?: string;
}