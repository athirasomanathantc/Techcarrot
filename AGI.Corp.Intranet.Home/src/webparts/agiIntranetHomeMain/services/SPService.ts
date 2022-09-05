import { sp } from "@pnp/sp";
import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IAnnouncement } from "../models/IAnnouncement";
import { ILatestNews } from "../models/ILatestNews";
import { IMyApp } from "../models/IMyApp";
import { INavigation } from "../models/INavigation";
import { ISnap } from "../models/ISnap";
import { ISocialMediaPost } from "../models/ISocialMediaPost";

export class SPService {
    private _props: IAgiIntranetHomeMainProps;

    constructor(props: any) {
        this._props = props;
    }

    public async getLatestNews(): Promise<ILatestNews[]> {
        return await sp.web.lists.getByTitle('News').items
            .select("Id,Title,Created,Business/Title,PublishedDate,NewsImage")
            .expand("Business")
            .orderBy("PublishedDate", false)
            .top(this._props.topLatestNews)()
            .then((items: ILatestNews[]) => {
                return items
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getAnnouncements(): Promise<IAnnouncement[]> {
        return await sp.web.lists.getByTitle('Announcements').items.select("ID,Title,Description,AnnouncementThumbnail,PublishedDate")
            .top(this._props.topAnnouncements)()
            .then((items: IAnnouncement[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getSnaps(): Promise<ISnap[]> {
        return await sp.web.lists.getByTitle('SnapAndShare').items.select("ID,Title,File,ImageDescription,Author/Title")
            .expand('Author,File')
            .top(this._props.topSnaps)()
            .then((items: ISnap[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getExtraNavigation(): Promise<INavigation[]> {
        return await sp.web.lists.getByTitle('ExtraNavigation').items.select("Id,Title,NavIcon,NavigationUrl")
            .top(this._props.topNavigations)()
            .then((items: INavigation[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getMyApps(): Promise<IMyApp[]> {
        return await sp.web.lists.getByTitle('MyApps').items.select("Id,Title,AppIcon,NavigationUrl")
            .top(this._props.topMyApps)()
            .then((items: IMyApp[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getSocialMediaPosts(): Promise<ISocialMediaPost[]> {
        return await sp.web.lists.getByTitle('SocialMediaPosts').items.select("Id,Title,Thumbnail,Description,Icon")
            .top(this._props.topSocialMediaPosts)()
            .then((items: ISocialMediaPost[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }
}

export default SPService;