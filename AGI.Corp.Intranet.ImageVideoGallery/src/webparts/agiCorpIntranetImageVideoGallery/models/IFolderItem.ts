export interface IFolderItem {
    ID?: number;
    Name?: string;
    Count?: number;
    BusinessId?: number;
    Business?:{
        ID:number;
        Title:string;
    }
}