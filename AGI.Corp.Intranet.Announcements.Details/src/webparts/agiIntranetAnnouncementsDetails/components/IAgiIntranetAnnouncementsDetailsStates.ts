import { IAnnouncementData } from "../models/IAnnouncementData";

export interface IAgiIntranetAnnouncementsDetailsStates {
    announcementsId: number;
    announcementData: IAnnouncementData;
    announcements: IAnnouncementData;
    exceptionOccured: boolean;
    viewsCount: number;   
    userPicture: string;
    userId: number;
    errorText: string;
}