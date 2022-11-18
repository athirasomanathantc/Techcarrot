import { sp } from "@pnp/sp";
import { forEach } from "lodash";
import * as moment from "moment";
import { INotificationProps } from '../components/notifications/INotificationProps';
import { INotification } from "../models/INotification";
import { INotificationListItem } from "../models/INotificationListItem";
import Common from "./Common";

export class SPService {
    private _common: Common;
    private _props: INotificationProps;

    constructor(props: INotificationProps) {
        this._props = props;
        this._common = new Common();
    }

    /**
     * Format the date field
     * @param items notification items
     * @param dateColumn date field
     * @returns 
     */
    private getFormattedItems(items: any, dateColumn: string, type: string): any {
        const userId = this._props.context.pageContext.legacyPageContext.userId || 0;
        items = items.map((item: any) => {
            const readBy = item.ReadBy;
            const userIds = readBy ? readBy.split(';') : [];
            const isRead = userIds.includes(userId.toString());
            return {
                Id: item.Id,
                Title: item.Title,
                Date: moment(item[dateColumn]).format("MMMM D, YYYY"),
                Time: moment(item[dateColumn]).format("hh:mm A"),
                DateTime: new Date(item[dateColumn]),
                Type: type,
                IsRead: isRead
            };
        }, this)
        return items;
    }

    public async getNotifications(): Promise<INotification[]> {
        let items: INotification[];
        let promise: Promise<INotificationListItem>;
        const promises: Promise<INotificationListItem>[] = [];

        forEach(this._props.lists, (listName: string) => {
            promise = new Promise((resolve, reject) => {
                // If transaction list
                if (listName.indexOf('Transaction') !== -1) {
                    const column: string = `${listName.replace('Transaction', '')}`
                    sp.web.lists.getByTitle(listName).items
                        .select(`Id,Title,ReadBy,Created,${column}/Id`)
                        .expand(column)
                        .filter(this._common.dateRangeFilter)
                        .top(this._props.top)().then((items: any[]) => {
                            items = items.map((item) => {
                                return {
                                    ...item,
                                    Id: item[column]?.Id
                                };
                            })
                            debugger
                            resolve(this.getFormattedItems(items, 'Created', listName))
                        }).catch((exception) => {
                            reject(exception)
                        });
                }
                else {
                    sp.web.lists.getByTitle(listName).items
                        .select(`Id,Title,ReadBy,Created`)
                        .filter(this._common.dateRangeFilter)
                        .top(this._props.top)().then((items: INotification[]) => {
                            resolve(this.getFormattedItems(items, 'Created', listName))
                        }).catch((exception) => {
                            reject(exception)
                        });
                }

            });
            promises.push(promise);
        })

        await Promise.all(promises)
            .then((values: INotification[]) => {
                // Combine the array and sort
                items = values.flat(1).sort(function (a: INotification, b: INotification) {
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