import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { INotification } from "../models/INotification";
import Common from "./Common";

export class SPService {
    private _common: Common;
    private top = 5000;

    constructor(private _context: WebPartContext) {
        this._common = new Common();
    }

    /**
     * Format the date field
     * @param items notification items
     * @param dateColumn date field
     * @returns 
     */
    private getFormattedItems(items: any, dateColumn: string, type: string) {
        let userId = this._context.pageContext.legacyPageContext.userId || 0;
        items = items.map((item: any) => {
            let readBy = item.ReadBy;
            const userIds = readBy ? readBy.split(';') : [];
            const isRead = userIds.includes(userId.toString());
            return {
                Id: item.Id,
                Title: item.Title,
                Date: this._common.getFormattedDate(item[dateColumn]),
                Time: this._common.getFormattedTime(item[dateColumn]),
                DateTime: new Date(item[dateColumn]),
                Type: type,
                IsRead: isRead
            };
        }, this)
        return items;
    }

    public async getNotifications(): Promise<any> {
        let items: any = [];
        const getNews = new Promise((resolve, reject) => {
            sp.web.lists.getByTitle('News').items
                .select("Id,Title,PublishedDate,ReadBy")
                .filter(this._common.dateRangeFilter)
                .top(this.top)().then((items: INotification[]) => {
                    resolve(this.getFormattedItems(items, 'PublishedDate', 'News'))
                }).catch((exception) => {
                    reject(exception)
                });
        });
        const getEvents = new Promise((resolve, reject) => {
            sp.web.lists.getByTitle('EventDetails').items
                .select("Id,Title,StartDate,ReadBy")
                .filter(this._common.dateRangeFilter)
                .top(this.top)().then((items: INotification[]) => {
                    resolve(this.getFormattedItems(items, 'StartDate', 'Events'))
                }).catch((exception) => {
                    reject(exception)
                });
        });
        const getAnnouncements = new Promise((resolve, reject) => {
            sp.web.lists.getByTitle('Announcements').items
                .select("Id,Title,PublishedDate,ReadBy")
                .filter(this._common.dateRangeFilter)
                .top(this.top)().then((items: INotification[]) => {
                    resolve(this.getFormattedItems(items, 'PublishedDate', 'Announcements'))
                }).catch((exception) => {
                    reject(exception)
                });
        });
        const getBlogs = new Promise((resolve, reject) => {
            sp.web.lists.getByTitle('Blogs').items
                .select("Id,Title,PublishedDate,ReadBy")
                .filter(this._common.dateRangeFilter)
                .top(this.top)().then((items: INotification[]) => {
                    resolve(this.getFormattedItems(items, 'PublishedDate', 'Blogs'))
                }).catch((exception) => {
                    reject(exception)
                });
        });

        await Promise.all([getNews, getEvents, getAnnouncements, getBlogs])
            .then((values: any) => {
                // Combine the array and sort
                items = values.flat(1).sort(function (a: any, b: any) {
                    return (b.DateTime - a.DateTime);
                });
            })
            .catch((error) => {
                console.error(error.message)
            });
        return items;
    }

}

export default SPService;