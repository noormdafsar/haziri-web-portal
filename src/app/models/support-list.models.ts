export interface Support {
    id: number;
    supportName: string;
    description?: string | null;
    icon?: string | null;
    moduleId: number;
    moduleName?: string; // For display purposes
}

export type SupportCreateDto = Omit<Support, 'id' | 'moduleName'>;