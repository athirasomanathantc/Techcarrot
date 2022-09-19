import { sp } from "@pnp/sp";
import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IAnnouncement } from "../models/IAnnouncement";
import { IConfigItem } from "../models/IConfigItem";
import { IEvent } from "../models/IEvent";
import { ILatestNews } from "../models/ILatestNews";
import { IMyApp } from "../models/IMyApp";
import { INavigation } from "../models/INavigation";
import { IReward } from "../models/IReward";
import { ISnap } from "../models/ISnap";
import { ISocialMediaPost } from "../models/ISocialMediaPost";
import { ISurveyOption } from "../models/ISurveyOption";
import { ISurveyQuestion } from "../models/ISurveyQuestion";

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

    public async getRewards(): Promise<IReward[]> {
        return await sp.web.lists.getByTitle('Offers').items.select("Id,Title,Description,OfferImage")
            .top(this._props.topRewards)()
            .then((items: IReward[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getEvents(): Promise<IEvent[]> {
        return await sp.web.lists.getByTitle('EventDetails').items.select("Id,Title,StartDate")
            .top(this._props.topEvents)
            .orderBy("StartDate", false)()
            .then((items: IEvent[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getConfigItems(): Promise<IConfigItem> {
        return await sp.web.lists.getByTitle('IntranetConfig').items
            .select('Id,Title,Detail,Link,Image')
            .get()
            .then((items: IConfigItem[]) => {
                const _surveyItems = items.filter((item) => item.Title == 'EmployeeSurvey');
                return _surveyItems[0];
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getSurveyOptions(): Promise<ISurveyOption[]> {
        return await sp.web.lists.getByTitle('SurveyOptions').items.select("Id,Title,Question/Title,Question/Id")
            .top(5000)
            .expand("Question")()
            .then((items: ISurveyOption[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

}

export default SPService;