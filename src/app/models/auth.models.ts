export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  employee: EmployeeInfo;
}

export interface EmployeeInfo {
  empoyeeId: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  designationId: number;
  designationName: string;
  hasAttendance: boolean;
  gender: string | null;
  roleName?: string; // Making this optional as it was not in the API response you shared
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface KeyExchangeResponse {
  sessionKey: string;
  sessionIV: string;
  sessionId: string;
  expiresAt: string;
}

export interface EmployeeProfile {
  employeeId: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  designationId: number;
  designationName: string;
  gender: string;
}

export interface UpdateProfile {
  name: string;
  email: string;
  phone: string;
  password?: string;
}