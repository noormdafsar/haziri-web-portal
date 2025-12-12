/**
 * Represents a GP item in the main list table.
 */
export interface GpTableListItem {
  id: number;
  gpName: string;
  districtName: string;
  blockName: string;
  districtId: number;
  blockId: number;
  centerLat: number;
  centerLong: number;
  isActive: boolean;
}

/**
 * Represents the detailed GP object, used for editing.
 */
export interface GpDetail {
  id: number;
  gpName: string;
  districtId: number;
  blockId: number;
  isActive: boolean;
}

export interface GpListResponse {
  data: GpTableListItem[];
  totalRecords: number;
}

export interface GpDataTableArg {
  pageNo: number;
  pageLength: number;
  search?: { [key: string]: string } | null;
}

export interface CreateGpRequest {
  gpName: string;
  districtId: number;
  blockId: number;
  centerLat: number;
  centerLong: number;
  // isActive: boolean;
}

export interface UpdateGpRequest extends CreateGpRequest {
  id: number;
  districtId: number;
}

export interface BlockResponse {
  id: number;
  name: string;
}

export interface DistrictResponse {
  id: number;
  name: string;
}
