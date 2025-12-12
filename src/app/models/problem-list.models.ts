export interface Problem {
    id: number;
    problemName: string;
    supportId: number;
    supportName: string;
    moduleId: number;
    moduleName: string;
}

export interface ProblemCreateDto {
    problemName: string;
    supportId: number;
}