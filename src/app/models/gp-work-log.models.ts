import { MatDataTableData } from "./api-response-models";

/**
 * Arguments for fetching GP Work Log data.
 */
export interface GpWorkLogDataTableArg {
    pageNo: number;
    pageLength: number;
    search?: {
        searchText?: string;
    } | null;
}

/**
 * Represents a single item in the GP Work Log list.
 */
export interface GpWorkLogItem {
    id: number;
    gpName: string;
    moduleName: string;
    supportName: string;
    problemName: string;
    problemCategoryName: string;
    problemCategoryOptionName:string;
    description: string;
    submittedBy: string;
    isOnline: number;
}