export interface IContentItem {
    ID: number;
    Title: string;
    Description: string;
    NavigationText: string;
    NavigationUrl: {Url: string};
    ServiceIcon: string;
    Business: string;
    Function: string;
    isArticle: boolean;
    target: string;
}