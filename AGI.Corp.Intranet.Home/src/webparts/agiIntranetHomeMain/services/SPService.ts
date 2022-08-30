import { sp } from "@pnp/sp";
import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { ILatestNews } from "../models/ILatestNews";

export class SPService {
    private _props: IAgiIntranetHomeMainProps;

    constructor(props: any) {
        this._props = props;
    }

    public async getLatestNews(): Promise<ILatestNews[]> {
        const latestNews = await sp.web.lists.getByTitle('News').items
            .select("Id,Title,Created,Business/Title,PublishedDate,NewsImage")
            .expand("Business")
            .orderBy("PublishedDate", false)
            .top(this._props.topLatestNews)()
            .then((items: ILatestNews[]) => {
                return items
            }).catch((exception) => {
                throw new Error(exception);
            });
        return latestNews;
    }
}

export default SPService;