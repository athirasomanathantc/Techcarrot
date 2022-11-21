import * as React from 'react';
import styles from './AgiIntranetAnnouncementsDetails.module.scss';
import { IAgiIntranetAnnouncementsDetailsProps } from './IAgiIntranetAnnouncementsDetailsProps';
import { IAgiIntranetAnnouncementsDetailsStates } from './IAgiIntranetAnnouncementsDetailsStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPService } from '../services/SPService';
import { sp } from "@pnp/sp/presets/all";
import { IAnnouncementData } from '../models/IAnnouncementData';
import * as moment from 'moment';
import { ANNOUNCEMENTS_NULL_ITEM, LIST_ANNOUNCEMENTS, LIST_ANNOUNCEMENTS_TRANSACTION } from '../common/constants';


export default class AgiIntranetAnnouncementsDetails extends React.Component<IAgiIntranetAnnouncementsDetailsProps, IAgiIntranetAnnouncementsDetailsStates> {
  private _spServices: SPService;
  constructor(props: IAgiIntranetAnnouncementsDetailsProps) {
    super(props);
    this._spServices = new SPService(this.props.context);
    sp.setup({
      spfxContext: this.props.context
    })
    this.state = {
      announcementsId: null,
      announcements: ANNOUNCEMENTS_NULL_ITEM,
      announcementData: null,
      exceptionOccured: false,
      userPicture: '',
      viewsCount: 0,
      userId: 0,
      errorText: ''
    }
  }

  private getQueryStringValue(param: string): string {
    try {
      const params = new URLSearchParams(window.location.search);
      let value = params.get(param) || '';
      return value;
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  public async componentDidMount() {
    try {
      const userId = this.props.context.pageContext.legacyPageContext.userId;
      const userEmail = this.props.context.pageContext.legacyPageContext.userEmail;
      const profilePictureUrl = `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${userEmail}`;
      this.setState({
        userPicture: profilePictureUrl,
        userId
      });

      let announcementsId = this.getQueryStringValue('announcementID');

      await this.getAnnouncementItem(announcementsId);

    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  private getImageUrl(announcementImage: string): string {
    try {
      if (!announcementImage) {
        return;
      }
      const imageObj: any = JSON.parse(announcementImage);
      return imageObj.serverUrl + imageObj.serverRelativeUrl;
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  private async getAnnouncementItem(announcementsId: string): Promise<void> {
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    if (!announcementsId)
      return;
    const id = parseInt(announcementsId);
    this.setState({
      announcementsId: id
    });

    await sp.web.lists.getByTitle(LIST_ANNOUNCEMENTS).items.getById(id)
      .select('*,Business/Title,Business/ID,Functions/Title,Functions/ID')
      .expand('Business,Functions')
      .get().then(async (item: IAnnouncementData) => {
        await sp.web.lists.getByTitle(LIST_ANNOUNCEMENTS_TRANSACTION).items
          .filter(`AnnouncementsId eq ${announcementsId}`)
          .select("ID,Announcements/Title,Announcements/ID,ReadBy,ViewsJSON")
          .expand("Announcements")
          .get().then((announcementsTransactionItems) => {
            let viewJSON = '';
            let announcementsTransactionItem;

            if (announcementsTransactionItems.length) {
              announcementsTransactionItem = announcementsTransactionItems[0];
              if (announcementsTransactionItem.ViewsJSON) {
                viewJSON = announcementsTransactionItem.ViewsJSON;
                let _viewJSON = JSON.parse(viewJSON);
                if (_viewJSON && _viewJSON.length > 0) {
                  const _records = _viewJSON.filter((o: { userId: number; }) => o.userId == this.state.userId);
                  if (_records && _records.length == 0) {
                    _viewJSON.push({ userId: userId, views: 0 });
                    viewJSON = JSON.stringify(_viewJSON);
                  }
                }
              }
              else {
                let _viewJSON = [];
                _viewJSON.push({ userId: userId, views: 0 });
                viewJSON = JSON.stringify(_viewJSON);
              }
            }
            else {
              let _viewJSON = [];
              _viewJSON.push({ userId: userId, views: 0 });
              viewJSON = JSON.stringify(_viewJSON);
            }

            const viewsCount = this.getViewCount(viewJSON);
            // update view
            let updateViewJSON = JSON.parse(viewJSON);

            const newViewsCount = viewsCount + 1;
            const updatedViews = updateViewJSON.map((obj: { userId: any; }) => {
              if (obj.userId == userId) {
                return { ...obj, views: newViewsCount }
              }
              return obj;
            });
            this.updateViews(parseInt(announcementsId), JSON.stringify(updatedViews), announcementsTransactionItems, item)
              .then((response) => {
                let announcementsId;
                let announcementsTransactionItem = response.data?.Id ? response.data : announcementsTransactionItems[0];

                if (response.data.Id) {
                  announcementsId = announcementsTransactionItem.AnnouncementsId;
                }
                else {
                  announcementsId = announcementsTransactionItem.Announcements.ID;
                }

                this.setState({
                  announcements: {
                    ...item,
                    Announcements: {
                      ID: announcementsId
                    }
                  },
                  viewsCount: viewsCount
                });
              });

          });
      });
  }

  private async updateViews(announcementsID: number, viewsJSON: string, announcementsTransactionItems: any, item: IAnnouncementData) {
    const userId: string = this.props.context.pageContext.legacyPageContext.userId;

    let body: any = {
      ViewsJSON: viewsJSON,
      Title: item.Title
    };

    if (announcementsTransactionItems.length > 0) {
      let readBy = announcementsTransactionItems[0].ReadBy;
      const userIDColl = readBy ? readBy.split(';') : [];
      const isIdExists = userIDColl.includes(userId.toString());
      if (!isIdExists) {
        readBy = readBy ? `${readBy};${userId}` : userId.toString();
        body = {
          ...body,
          ReadBy: readBy
        }
      }
      return await sp.web.lists.getByTitle(LIST_ANNOUNCEMENTS_TRANSACTION).items.getById(announcementsTransactionItems[0].Id).update(body)
    }
    else {
      return await sp.web.lists.getByTitle(LIST_ANNOUNCEMENTS_TRANSACTION).items.add({
        ViewsJSON: viewsJSON,
        AnnouncementsId: announcementsID,
        ReadBy: userId.toString(),
        Title: item.Title
      });
    }
  }

  private getViewCount(viewsJSON: string): number {
    let count = 0;
    if (viewsJSON) {
      const data = JSON.parse(viewsJSON);
      if (data && data.length > 0) {
        const _records = data.filter((o: { userId: number; }) => o.userId == this.state.userId);
        if (_records && _records.length > 0) {
          const record = _records[0];
          count = record.views;
        }
      }
    }

    return count;
  }

  private renderAnnouncementsDetail(): JSX.Element {
    const announcements = this.state.announcements;
    const userId = this.state.userId;
    const imageUrl = this.getImageUrl(announcements.AnnouncementImage);

    return (
      <>
        <article className="news-detail-wrapper">
          <header className="news-detail-header">
            <p>
              <i><img src={`${this.props.siteUrl}/Assets/icons/Date.svg`} /></i>
              {
                announcements.PublishedDate && moment(announcements.PublishedDate).format('MMMM DD, YYYY')
              }
            </p>
            <h1>{announcements.Title}</h1>
          </header>
          <section className="news-detail-content">
            <div className="row">
              <div className="col-md-12">
                <ul className="justify-content-start ps-0">
                  <li className="ps-0"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-tag.png`} /></i> {announcements.Business?.Title || (announcements.Functions?.Title)}</li>
                </ul>
              </div>
            </div>
          </section>
          <section className="news-detail-img">
            <img src={imageUrl} className="d-block w-100" alt="..." />
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" style={{ display: 'none' }}>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={`${this.props.siteUrl}/Assets/images/news-springfield.png`} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={`${this.props.siteUrl}/Assets/images/news-springfield.png`} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={`${this.props.siteUrl}/Assets/images/news-springfield.png`} className="d-block w-100" alt="..." />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </section>
          <section className="news-detail-text" >
            <div dangerouslySetInnerHTML={{ __html: announcements.Summary }}>
            </div>
          </section>
        </article>
      </>
    )
  }

  public render(): React.ReactElement<IAgiIntranetAnnouncementsDetailsProps> {
    const announcementsID = this.getQueryStringValue('announcementID');
    return (
      <div className={styles.agiIntranetAnnouncementsDetails}>
        <div className="main-content news-content">
          <div className="content-wrapper">
            <div className="container">
              {
                announcementsID ?

                  this.renderAnnouncementsDetail()
                  :
                  <div className='warning-text'>
                    Invalid Announcement ID.
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

