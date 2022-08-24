import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { IAnnouncementData } from "../models/IAnnouncementData";
import { IBusinessData } from "../models/IBusinessData";

export class SPService {

    constructor(private _context: WebPartContext) {
    }

    public async getAnnouncements(): Promise<IAnnouncementData[]> {
        const listName = 'Announcements';
        return await sp.web.lists.getByTitle(listName).items.select("ID,Title,Description,Summary,AnnouncementImage,AnnouncementThumbnail,PublishedDate,Business/ID,Business/Title,Location").expand("Business")
            .getAll(5000).then((items: IAnnouncementData[]) => {
                return items;
            });
    }

    public async getBussiness(): Promise<IBusinessData[]> {
        const listName = 'Business';
        return await sp.web.lists.getByTitle(listName).items.select("ID,Title")
            .getAll(5000).then((items: IBusinessData[]) => {
                return items;
            });
    }
}