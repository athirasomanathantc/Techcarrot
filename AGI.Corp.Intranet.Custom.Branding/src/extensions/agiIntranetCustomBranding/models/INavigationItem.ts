export interface INavigationItem {
    ID?: number;
    Title: string;
    Link: {
        Url: string;
        Description: string;
    };
    IsActive: boolean;
    NavigationOrder: number;
    Parent: string;
    AvailableInHeader: boolean;
    AvailableInFooter: boolean;
    BusinessId: number;
    FunctionsId: number;
}