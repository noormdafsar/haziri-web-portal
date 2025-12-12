import { APIResponse } from "../../models/api-response-models";

export interface SummaryCounts {
  onlineVisits: number;
  offlineVisits: number;
  forgotCheckout: number;
  totalOtherActivities: number;
  otherVirtualMeetings: number;
  pendingLeaves: number;
}

export interface LateCheckout {
  userId: string;
  UserName: string;
  Gpid: string;
  GpName: string;
}

export type LateCheckoutApiResponse = APIResponse<{ Data: LateCheckout[], Count: number }>;