/**
 * employee arg data
 */
export interface EmployeeDataTableArg {
  pageNo: number;
  pageLength: number;
  search?: { [key: string]: string; } | null;
}

/**
 * Represents a employee item in the main employee list table.
 */
export interface EmployeeTableListItem {
  id: number;
  employeeId: number;
  name: string;
  // email: string;
  phone: string;
  gender: string;
  password: string;
  employeeRoleId: number;
  employeeRoleName: string;
  designationId: number;
  designationName: string;
  isActive: number; 
}

/**
 * Represents the detailed employee object, used for editing.
 */
export interface EmployeeDetail {
  id: number;
  employeeId: number;
  name: string;
  employeeCode: string;
  // email: string;
  phone: string;
  gender: string;
  designationId: number;
  employeeRoleId: number;
  isActive: number; // 0 for Inactive, 1 for Active
}

export interface EmployeeListResponse {
  data: EmployeeTableListItem[];
  totalRecords: number;
}

/**
 * Represents the structure for creating a new employee.
 */
export interface CreateEmployeeRequest {
  name: string;
  // employeeCode: string;
  designationId: number;
  employeeRoleId: number;
  gender: string;
  // email?: string;
  phone: string;
  password?: string;
  isActive: number;
}

/**
 * Represents the structure for updating an existing employee.
 * This is the same as CreateEmployeeRequest for this model.
 */
export type UpdateEmployeeRequest = CreateEmployeeRequest;

// Other related models that are used in the component
export interface DesignationResponse { id: number; name: string; }
export interface RoleResponse { id: number; roleName: string; }

/**
 * Represents the structure for assigned locations for a employee.
 */
// export interface AssignedGp {
//   gpId: number;
//   gpName: string;
// }

// export interface AssignedBlock {
//   blockId: number;
//   blockName: string;
//   gps: AssignedGp[];
// }

// export interface AssignedDistrict {
//   districtId: number;
//   districtName: string;
//   blocks: AssignedBlock[];
// }