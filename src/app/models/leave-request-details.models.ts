// src/app/models/leave-request-details.models.ts
import { MatDataTableData } from './api-response-models';

/**
 * Arguments for fetching leave request data for the data table.
 */
export interface LeaveRequestDataTableArg {
  pageNo: number;
  pageLength: number;
  search?: { [key: string]: string } | null;
}

/**
 * Represents a single leave request item in the data table.
 */
export interface LeaveRequestDetails {
  id: number;
  employeeId: number;
  employeeName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  requestDate: string
  leaveDays: number;
  leaveDescription: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  balance: number;
}

/**
 * Represents the detailed leave balance for a employee.
 */
export interface LeaveBalance {
  leaveType: string;
  totalBalance: number;
  balance: number;
  days?: number; // Add optional days property to handle API response
}

/**
 * Represents the response for a list of leave requests.
 */
export interface LeaveRequestListResponse extends MatDataTableData<LeaveRequestDetails> {}

/**
 * Represents the payload for updating the status of a leave request.
 */
export interface LeaveStatusUpdateRequest {
  approvalStatus: 'Approved' | 'Rejected';
}
