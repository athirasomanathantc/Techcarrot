import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { IAnnouncementData } from "../models/IAnnouncementData";

export class SPService {

    constructor(private _context: WebPartContext) {
    }

    public async getAnnouncements(): Promise<IAnnouncementData[]> {
        const listName = 'Announcements';
        return await sp.web.lists.getByTitle(listName).items
            .getAll(5000).then((items: IAnnouncementData[]) => {
                return items;
            });
    }
}