/**
 * Represents a Module item in the main list table.
 */
export interface ModuleListItem {
  id: number;
  moduleName: string;
  description: string;
  icon: string;
}

/**
 * Represents the detailed Module object, used for editing.
 */
export interface ModuleDetail extends ModuleListItem {}

export interface CreateModuleRequest {
  moduleName: string;
  description: string;
  icon: string;
}

export interface UpdateModuleRequest extends CreateModuleRequest {}