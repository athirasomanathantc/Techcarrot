export interface IContentItem {
    ID: number;
    Title: string;
    Description: string;
    NavigationText: string;
    Business: string;
    Function: string;
    MediaIcon: string;
    SitePages: {ID: number, Title: string, NavigationComponent: string};
}