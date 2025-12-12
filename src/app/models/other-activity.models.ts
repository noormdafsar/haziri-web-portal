/**
 * Represents the arguments for fetching a paginated list of activities.
 */
export interface ActivityDataTableArg {
  pageNo: number;
  pageLength: number;
  search?: { [key: string]: string } | null;
}

/**
 * Represents an activity item in the main list table, matching the backend DTO.
 */
export interface ActivityListItem {
  id: number;
  activityName: string;
  // The backend doesn't currently support these fields.
  // description: string;
  // isActive: boolean;
}

/**
 * Represents the response structure for a paginated list of activities.
 */
export interface ActivityListResponse {
  data: ActivityListItem[];
  totalRecords: number;
}

/**
 * Represents the request payload for creating or updating an activity.
 */
export interface ActivityRequest {
  activityName: string;
}