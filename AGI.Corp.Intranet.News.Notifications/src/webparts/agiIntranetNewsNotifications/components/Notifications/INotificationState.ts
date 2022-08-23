import { INotification } from "../../models/INotification";

export interface INotificationState {
    notifications: INotification[];
    exception: string;
    rowCount: number;
}