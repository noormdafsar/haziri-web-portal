import { APIResponse } from "../../models/api-response-models";

export interface SummaryCounts {
  onlineVisits: number;
  offlineVisits: number;
  forgotCheckout: number;
  totalOtherActivities: number;
  lateArrivals: number;
  pendingLeaves: number;
}

export interface LateCheckout {
  userId: string;
  userName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export type LateCheckoutApiResponse = APIResponse<{ Data: LateCheckout[], Count: number }>;

export interface LateEmployeeSummary {
  employeeId: string;
  name: string;
  designation: string;
  totalLateDays: number;
  averageLateDuration: string;
}

export interface LateArrival {
  employeeId: string;
  name: string;
  date: string;
  checkInTime: string;
}