export interface IFolderItem {
    ID?: number;
    Name?: string;
    Count?: number;
    BusinessId?: number;
    Business?: {
        ID: number;
        Title: string;
    }
    FunctionsId?: number;
    Function?: {
        ID: number;
        Title: string;
    }
}