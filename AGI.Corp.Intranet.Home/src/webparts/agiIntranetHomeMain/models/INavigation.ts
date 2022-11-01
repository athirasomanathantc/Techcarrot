export interface INavigation {
    Id: number;
    Title: string;
    NavIcon: string;
    IsExternal: boolean;
    NavigationUrl: {
        Url: string;
    };
}