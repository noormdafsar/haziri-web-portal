export interface UserMini {
    id: number;
    name: string;
}

export interface AssignGpsRequest {
    userId: number;
    gpIds: number[];
}

export interface GpItem {
    id: number;
    name: string;
    districtId?: number;
    blockId?: number;
}

export interface AssignedGpTableItem {
    mentorId: number;
    mentorName: string;
    gpIds: number[];
    gpNames: string[];
    attendence: number[];
}