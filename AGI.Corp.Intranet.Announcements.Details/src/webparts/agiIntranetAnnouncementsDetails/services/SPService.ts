import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';
import { IAnnouncementData } from "../models/IAnnouncementData";

export class SPService {

    constructor(private _context: WebPartContext) {
    }

    public async getAnnouncementById(announcementId:number): Promise<IAnnouncementData> {
        const listName = 'Announcements';
        return await sp.web.lists.getByTitle(listName).items.select("ID,Title,Description,Summary,AnnouncementImage,AnnouncementThumbnail,PublishedDate,Business/ID,Business/Title,Location").expand("Business")
            .getById(announcementId).get();
    }
}