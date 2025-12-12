export interface AttendenceResponse {
    id: number;
    userId: number;
}

export interface AttendanceDTO {
    userId: number;
    userName: string;
    attendanceInDateTime: string;
    attendanceOutDateTime: string | null;
    latitude: number;
    longitude: number;
}
export interface AttendanceDataTable {
    data: AttendanceDTO[];
    totalRecords: number;
}