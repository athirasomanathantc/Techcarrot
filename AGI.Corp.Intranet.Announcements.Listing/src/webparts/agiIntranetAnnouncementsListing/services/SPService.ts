import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { IAnnouncementData } from "../models/IAnnouncementData";
import { IBusinessData } from "../models/IBusinessData";
import { IFunctionData } from "../models/IFunctionData";

export class SPService {

    constructor(private _context: WebPartContext) {
    }

    public async getAnnouncements(): Promise<IAnnouncementData[]> {
        const listName = 'Announcements';
        return await sp.web.lists.getByTitle(listName).items
            .select("ID,Title,Description,Summary,AnnouncementImage,AnnouncementThumbnail,PublishedDate,Business/ID,Business/Title,Location,Functions/ID,Functions/Title,Featured")
            .expand("Business,Functions")
            .orderBy("PublishedDate",false)
            .get()
            .then((items: IAnnouncementData[]) => {
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

    public async getFunctionData(): Promise<IFunctionData[]> {
        const listName = 'Functions';
        return await sp.web.lists.getByTitle(listName).items.select("ID,Title")
            .getAll(5000).then((items: IFunctionData[]) => {
                return items;
            });
    }

    public async getConfigItems(): Promise<string> {
        const listName = 'IntranetConfig';
        return await sp.web.lists.getByTitle(listName).items
            .filter("Title eq 'FeaturedAnnouncements'")
            .select("ID,Title,Detail")
            .top(1)().then((items: any[]) => {
                return items[0]?.Detail;
            });
    }
}