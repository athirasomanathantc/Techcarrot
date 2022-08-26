export interface INotification {
    Id: number;
    Title: string;
    PublishedDate: string;
    Date: string;
    Time: string;
    Type: string;
    IsRead: boolean;
    Created: Date;
    ReadBy: string;
    DateTime?: number;
}