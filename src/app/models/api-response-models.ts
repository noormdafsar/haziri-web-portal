export interface APIResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  error?: APIError;
  timestamp: string; // ISO date string
}

export interface APIError {
  errorMessage: string;
  validationErrors?: string[];
  details?: any;
  stackTrace?: string;
  innerException?: string;
}

/**
 * Represents the data structure for paginated table responses from the API.
 */
export interface MatDataTableData<T> {
  data: T[];
  totalRecords: number;
}