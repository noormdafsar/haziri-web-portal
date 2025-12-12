export interface MatDataTableData<T> {
    data: T[];
    totalRecords: number;
}

export interface ActivityWorkLogAdminDTO {
    id: number;
    activityId: number;
    activityName: string;
    mentorName: string;
    userName: string;
    startTime: string;
    endTime: string | null;
    latitude: number;
    longitude: number;
    isOnline: number;
}

export interface ActivityWorkLogDataTableArg {
    pageNo: number;
    pageLength: number;
    search?: { [key: string]: string } | null;
}