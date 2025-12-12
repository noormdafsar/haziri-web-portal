/**
 * Represents a GP item in the main list table.
 */
export interface GpMemberTableListItem {
  id: number;
  gpName: string;
  GpMemberName: string;
  ActivityName: string;
  GpMemberId: number;
  otherActivityId: number;
  officeLat: number;
  officeLong: number;
  GpId: number;
  ActivityId: number;
  isActive: boolean;
}

/**
 * Represents the detailed GP object, used for editing.
 */
export interface GpMemberDetails {
  id: number;
  gpName: string;
  GpMemberId: number;
  gpId: number;
  isActive: boolean;
}

export interface GpMemberListResponse {
  data: GpMemberTableListItem[];
  totalRecords: number;
}

export interface GpMemberDataTable {
  pageNo: number;
  pageLength: number;
  search?: { [key: string]: any } | null;
}

export interface CreateGpMemberRequest {
  gpName: string;
  gpMemberId: number;
  otherActivityId: number;
  officeLat: number;
  officeLong: number;
  isActive: boolean;
}

export interface UpdateGpMemberRequest extends CreateGpMemberRequest {
  id: number;
}