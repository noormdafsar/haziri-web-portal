export interface DistrictResponse {
    id: number;
    name: string;
}

export interface BlockResponse {
    id: number;
    name: string;
    districtId: number;
    districtName: string;
}

export interface CreateDistrictRequest {
    name: string;
}

export interface UpdateDistrictRequest {
    id: number;
    name: string;
}

export interface CreateBlockRequest {
    name: string;
    districtId: number;
}

export interface UpdateBlockRequest {
    id: number;
    name: string;
    districtId: number;
}