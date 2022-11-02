import { sp } from "@pnp/sp";
import { IListInfo } from "@pnp/sp/lists";
import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IAnnouncement } from "../models/IAnnouncement";
import { IConfigItem } from "../models/IConfigItem";
import { IEvent } from "../models/IEvent";
import { ILatestNews } from "../models/ILatestNews";
import { IMyApp } from "../models/IMyApp";
import { INavigation } from "../models/INavigation";
import { IReward } from "../models/IReward";
import { ISnap } from "../models/ISnap";
import { IQuizOption } from "../models/IQuizOptions";
import { IQuizQuestion } from "../models/IQuizQuestion ";
import { IQuizResponse } from "../models/IQuizResponse";
import * as moment from 'moment';
//import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { LIST_PATH_SURVEY, LIST_SURVEY, LIST_SURVEY_RESPONSE_ENTRIES } from "../common/constants";
import { ISocialMediaPost } from "../models/ISocialMediaPost";
//const sp1 = spfi(...);

export class SPService {
    private _props: IAgiIntranetHomeMainProps;

    constructor(props: any) {
        this._props = props;
    }

    public async getLatestNews(): Promise<ILatestNews[]> {
        return await sp.web.lists.getByTitle('News').items
            .select("Id,Title,Created,Business/Title,Functions/Title,PublishedDate,NewsImage")
            .expand("Business,Functions")
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
            .orderBy('PublishedDate', false)
            .top(this._props.topAnnouncements)()
            .then((items: IAnnouncement[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getSnaps(): Promise<ISnap[]> {
        return await sp.web.lists.getByTitle('SnapAndShare').items.select("ID,Title,File,ImageDescription,Author/Title,Created")
            .expand('Author,File')
            .filter(`ApprovalStatus eq 'Approved'`)
            .orderBy('Created', false)
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
            .top(5000)
            .orderBy("StartDate", true)()
            .then((items: IEvent[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getConfigItems(): Promise<IConfigItem[]> {
        return await sp.web.lists.getByTitle('IntranetConfig').items
            .select('Id,Title,Detail,Link,Image,Hide,Section')
            .get()
            .then((items: IConfigItem[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }
    /* public async getSurveyQuestions(): Promise<ISurveyQuestion[]> {
         return await sp.web.lists.getByTitle('SurveyQuestions').items.select("Id,Title,SortOrder")
             .top(this._props.topSurveyQuestions)
             .orderBy("SortOrder", true)()
             .then((items: ISurveyQuestion[]) => {
                 return items;
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
     }*/

    public async getQuizQuestions(): Promise<IQuizQuestion[]> {
        return await sp.web.lists.getByTitle('SurveyQuestions').items.select("Id,Title,SortOrder")
            .top(this._props.topSurveyQuestions)
            .orderBy("SortOrder", true)()
            .then((items: IQuizQuestion[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getSocialMediaPosts(): Promise<ISocialMediaPost[]> {
        return await sp.web.lists.getByTitle('SocialMediaPosts').items.select("Id,Title,PostUrl,Description,Icon,ImageUrl")
            .top(this._props.topSocialMediaPosts)()
            .then((items: ISocialMediaPost[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }

    public async getQuizOptions(): Promise<IQuizOption[]> {
        return await sp.web.lists.getByTitle('SurveyOptions').items.select("Id,Title,Question/Title,Question/Id,CorrectOption")
            .top(5000)
            .expand("Question")()
            .then((items: IQuizOption[]) => {
                return items;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }
    public async submitQuiz(quiz: any) {
        if (quiz != null) {
            const userEmail = this._props.context.pageContext.legacyPageContext.userEmail;

            if (!quiz.submitted) {

                //delete a folder if not present already
                /*await sp.web.lists.getByTitle("SurveyResponses").rootFolder.folders.getByName(userEmail).delete()
                .then((data)=>{
                    console.log(data);
                })*/
                //Create a folder if not present already
                return await sp.web.lists.getByTitle("SurveyResponses").items
                    .add({ Title: userEmail, ContentTypeId: "0x0120" }).then(async result => {
                        return await result.item.update({
                            Title: userEmail,
                            FileLeafRef: `/${userEmail}`
                        }).then(() => {
                            quiz.submitted = true;
                            const response = this.createResponse(quiz.responses);
                            return response.then(async (result) => {
                                await this.createResponseEntry(userEmail);
                                return true;
                            });
                        });
                    })
                    .catch(function (err) {
                        console.log('first folder creation', err);
                    });
            }
            else {
                //update existing responses
                await this.updateResponses(userEmail)
                // add new responses
                const response = this.createResponse(quiz.responses);
                return response.then((result) => {
                    this.createResponseEntry(userEmail);
                    return true;
                })
            }

        }
    }

    private async updateResponses(email: string): Promise<any> {
        debugger;
        const listName = LIST_SURVEY;
        const siteRelativePath = this._props.context.pageContext.web.serverRelativeUrl;
        const listUri = `${siteRelativePath}/Lists/${LIST_PATH_SURVEY}`;

        const list = sp.web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();

        return new Promise((resolve, reject) => {
            list
                .items.filter(`FileDirRef eq '${listUri}/${email}'`)
                .get().then((data) => {
                    console.log('responses');
                    console.log(data);
                    //batch update
                    let createBatchRequest = sp.web.createBatch();
                    data.forEach((item) => {
                        list.items.getById(item.ID)
                            .inBatch(createBatchRequest)
                            .update({ LatestResponse: false }, '*', entityTypeFullName);
                    });

                    createBatchRequest.execute().then((createResponse: any) => {
                        console.log("All Item Updated")
                        resolve(createResponse);
                    }).catch((error) => {
                        reject(error);
                        console.log('error in executing batch request');
                    });
                }).catch((error) => {
                    reject(error);
                    console.log('error');
                    console.log(error);
                });
        });
    }

    private createResponse(responses): Promise<any[]> {
        let date = moment();//.toISOString;
        console.log(date);
        return new Promise((resolve, reject) => {
            let promises: Promise<any>[] = [];
            const _spPageContextInfo = this._props.context.pageContext.legacyPageContext;
            const webUrl = _spPageContextInfo.webAbsoluteUrl;
            const listPath = webUrl + "/Lists/SurveyResponses";
            let folderName;
            let promise;

            responses.forEach((response) => {
                folderName = response.UserEmail;
                promise = sp.site.rootWeb.lists.getByTitle("SurveyResponses").addValidateUpdateItemUsingPath([
                    { FieldName: 'Title', FieldValue: response.Title },
                    { FieldName: 'QuestionId', FieldValue: String(response.QuestionId) },
                    { FieldName: 'Option', FieldValue: response.Option },
                    { FieldName: 'OptionId', FieldValue: String(response.OptionId) },
                    { FieldName: 'UserEmail', FieldValue: folderName },
                    { FieldName: 'UserId', FieldValue: String(response.UserId) },
                    //{ FieldName: 'SubmittedDate', FieldValue: '2022-10-25T10:27:44Z' }
                ]
                    , `${listPath}/${folderName}`);
                promises.push(promise);
            })

            Promise.all(promises).then(result => {
                resolve(result);
            }).catch((exception) => {
                reject(exception)
            });
        });
    }

    private async createResponseEntry(email: string): Promise<void> {
        const listName = LIST_SURVEY_RESPONSE_ENTRIES;
        sp.web.lists.getByTitle(listName).items.add({ Title: email }).then((response) => {
            console.log('response entry added successfully');
        }).catch((error) => {
            console.log('error', error);
        });
    }

    public async checkSubmitted(email: any): Promise<any> {
        // debugger;

        const folderName = this._props.context.pageContext.web.serverRelativeUrl + "/Lists/SurveyResponses/" + email;
        const folder = await sp.web.getFolderByServerRelativePath(folderName).select('Exists').get();

        if (folder.Exists) {
            return true;
        } else {
            return false;
        }

        //    let folder;  
        //       folder= await sp.web.lists.getByTitle('SurveyResponses').rootFolder.folders.
        //       getByName(email).
        //       .get();
        //       console.log("folders Exist",folder);
        // .then((data) => {
        //     debugger;
        //     console.log("folders", data);
        //     if (data) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // // }).catch((exception) => {
        //     if ({ data: exception.message == 'File Not Found' }) {
        //         return false;
        //         console.log('excep', exception);
        //     }
        //     else {
        //         throw new Error(exception);
        //     }
        // });
        //return isExists;
    }


    public async getListGuid(listname: string) {
        return await sp.web.lists.getByTitle(listname)()
            .then((response: IListInfo) => {
                return response.Id;
            })
            .catch((exception) => {
                throw new Error(exception);
            });
    }
    public async getData(email: any, length: any): Promise<any> {
        const listName = 'SurveyResponses';

        const list = sp.web.lists.getByTitle(listName);

        // Get list's root folders and their items' props
        return await sp.web.lists.getByTitle(listName).items.filter(`FSObjType eq 0`).orderBy('ID', false).top(length).get()
            .then((folders: IQuizResponse[]) => {
                console.log("folder items", folders)
                return folders;
                //
            })
            .catch(console.error);
    }

    public async CalculateScore(givenAns: IQuizResponse[], options: IQuizOption[]): Promise<any> {

        let scores = 0;
        await givenAns.map((ans) => {
            options.map((option) => {
                if (option.Question.Id.toString() == ans.QuestionId && option.CorrectOption) {
                    if (option.Id.toString() == ans.OptionId)
                        scores++;
                }
            })

        })
        return scores;

    }





}

export default SPService;