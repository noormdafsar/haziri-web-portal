export interface GpVisitLogDataTableArg {
    pageNo: number;
    pageLength: number;
    search?: {
        searchText?: string;
        mentorId?: string; // For filtering by mentor in GP-specific view (this is the user who visited)
        userId?: string; // For filtering by a specific user (this is the user whose logs we want to see)
        gpId?: string;
        startDate?: string; // For date range filtering
        endDate?: string; // For date range filtering
        visitDate?: string; // For filtering by date
    } | null;
}

export interface GpVisitLogItem {
    gpVisitLogId: number;
    gpid: number;
    gpName?: string; // GP Name might not be on every log item from the API
    userId: number; // The user who made the visit 
    userName: string; // The name of the user who made the visit 
    latitude: number | null;
    longitude: number | null;
    gpinTime: string;
    gpoutTime: string | null;
    isOnline: number;
}

export interface GpVisitLogListResponse {
    data: GpVisitLogItem[];
    totalRecords: number;
}

export interface MentorMini {
    id: number;
    name: string;
}