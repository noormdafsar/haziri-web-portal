export interface HolidayDTO {
    id: number;
    holidayName: string;
    holidayDate: string;
}

export interface HolidayCreateDto {
    holidayName: string;
    holidayDate: string;
}

export interface HolidayDataTable {
    data: HolidayDTO[];
    totalRecords: number;
}
