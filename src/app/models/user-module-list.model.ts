import { DesignationResponse } from "./employee.models";

/**
 * Represents a single module that can be assigned.
 */
export interface Module {
  id: number;
  moduleName: string;
  description: string;
  icon: string;
}

/**
 * Represents a user role to which modules can be assigned.
 */
export interface UserRole {
  id: number;
  roleName: string;
}

/**
 * Represents an item in the user-module assignment list, grouping modules by user role.
 */
export interface UserModuleTableItem {
  moduleId: number;
  moduleName: string;
  availableToDesignations: Array<DesignationResponse>
}

/**
 * Defines the request body for assigning modules to a user role.
 */
export interface AssignModulesRequest {
  moduleId: number;
  designationIds: number[];
}

