export interface VirtualMeetingLog {
  id: number;
  userName: string;
  startTime: string;
  endTime: string;
  totalMembers: number;
  description: string;
  designations: string;
  gps: string;
  isOnline: boolean;
}

export interface MatDataTableArg {
  pageNo: number;
  pageLength: number;
  search?: { [key: string]: string };
}

export interface MatDataTableData<T> {
  data: T[];
  totalRecords: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}