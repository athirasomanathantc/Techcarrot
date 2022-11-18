import * as $ from 'jquery';
import { sp } from "@pnp/sp/presets/all";

export default class spservices {
    /*check if user is a member of the group, using SP rest
    */
    public async isMember(groupName: string, userId: string, webAbsoluteUrl: string): Promise<any> {
        const p = new Promise<any>(async (resolve, reject) => {
            await $.ajax({
                url: webAbsoluteUrl + "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=Id eq " + userId,
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: (data: { d: { results: any[]; }; }) => {
                    if (data.d.results[0] !== undefined) {
                        resolve(true);
                    }
                    else {
                        reject(false);
                    }
                },
                error: (error: any) => {
                    reject(false);
                },
            });
        });
        return p;
    }

    public async markFeatured(itemId: number, listName: string, isFeatured: boolean, reviewerId: number) {
        const list = sp.web.lists.getByTitle(listName);
        return await list.items.getById(itemId)
            .update({
                'Featured': isFeatured,
                'ReviewerId': reviewerId
            });
    }

    public async getFeatured(itemId: number, listName: string): Promise<any> {
        return await sp.web.lists.getByTitle(listName).items
            .filter(`Id eq ${itemId}`)
            .get().then((items: any) => {
                return items[0]?.Featured;
            });
    }

    public getQueryStringValue(param: string): string {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(param) || '';
        return value;
    }

}