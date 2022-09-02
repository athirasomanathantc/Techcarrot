import * as React from 'react';
import styles from './AgiCorpIntranetEventsDetails.module.scss';
import { IAgiCorpIntranetEventsDetailsProps } from './IAgiCorpIntranetEventsDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAgiCorpIntranetEventsDetailsStates } from './IAgiCorpIntranetEventsDetailsStates'
import { sp } from '@pnp/sp/presets/all';
import * as moment from 'moment';
import { EVENT_NULL_ITEM } from '../common/constants';
export default class AgiCorpIntranetEventsDetails extends React.Component<IAgiCorpIntranetEventsDetailsProps, IAgiCorpIntranetEventsDetailsStates> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      eventId: null,
      eventsData: EVENT_NULL_ITEM
    }
  }

  public async componentDidMount() {
    this.fetch();
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  private async fetch(): Promise<void> {
    const eventId = this.getQueryStringValue('eventID');
    if (!eventId) {
      return;
    } else {
      const id = parseInt(eventId);

      sp.web.lists.getByTitle('EventDetails').items.getById(id).get().then((item) => {
        this.setState({
          eventsData: item,
          eventId: id
        }, () => {
          console.log('value', item);
        });
      })
      const userId: string = this.props.context.pageContext.legacyPageContent.userId;
      let readBy = this.state.eventsData.ReadBy;
      const userIDColl = readBy ? readBy.split(';') : [];
      const isIdExists = userIDColl.includes(userId.toString());
      if (!isIdExists) {
        readBy = readBy ? `${readBy};${userId}` : userId;
        sp.web.lists.getByTitle('EventDatails').items.getById(this.state.eventId).update({
          ReadBy: readBy
        }).then((data) => {
          console.log('item updated...', data);
        }).catch((error) => {
          console.log('error in updating list item:', error);
        })

      }

    }
  }
  getImageUrl(imageContent: string) {
    if (!imageContent) {
      return;
    }
    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }
  private renderEventDetail(): JSX.Element {
    const event = this.state.eventsData;
    const imageUrl = this.getImageUrl(event.EventImage);
    return (
      <>
        <article className={'news-detail-wrapper'}>
          <header className={'news-detail-header'}>
            <h1>{event.Title}</h1>
          </header>

          <div className={'events-detail-content'}>
            <div className={'row gx-5'}>
              <div className={'col-md-2 events-col'}>
                <div className={'event-date-wrapper'} >
                  <div className={'event-date'} style={{ display: event.StartDate == null ? "none" : "display" }}>
                    <p className={'notification-date'}>{moment(event.StartDate).format('DD')}</p>
                    <p className={'notification-month'}>{moment(event.StartDate).format('MMM')}</p>
                  </div>

                  {
                    event.EndDate &&
                    <>
                      <div className={'divider'} style={{ display: event.StartDate == event.EndDate ? "none" : "display" }}></div>
                      <div className={'event-date'} style={{ display: event.StartDate == event.EndDate ? "none" : "display" }}>
                        <p className={'notification-date'}>{moment(event.EndDate).format('DD')}</p>
                        <p className={'notification-month'}>{moment(event.EndDate).format('MMM')}</p>
                      </div>
                    </>
                  }
                </div>

              </div>

              <div className={'col-md-10  events-col'}>
                <div className={'location-wrapper'}>
                  <div><i><img src={`${this.props.siteUrl}/Assets/icons/icon-location.png`} /></i> {event.Location}</div>

                </div>

              </div>

            </div>

          </div>
          <section className={'news-detail-img'}>
            <img src={imageUrl} className="d-block w-100" alt="..." />
            <div id="carouselExampleControls" className={'carousel slide'} data-bs-ride="carousel" style={{ display: 'none' }}>
              <div className={'carousel-inner'}>
                <div className={'carousel-item active'}>
                  <img src="images/news-detail-img.png" className={'d-block w-100'} alt="..." />
                </div>

              </div>
              <button className={'carousel-control-prev'} type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="prev">
                <span className={'carousel-control-prev-icon'} aria-hidden="true"></span>
                <span className={'visually-hidden'}>Previous</span>
              </button>
              <button className={'carousel-control-next'} type="button" data-bs-target="#carouselExampleControls"
                data-bs-slide="next">
                <span className={'carousel-control-next-icon'} aria-hidden="true"></span>
                <span className={'visually-hidden'}>Next</span>
              </button>
            </div>
          </section>

          <section className={'events-detail news-detail-text'}>
            <div dangerouslySetInnerHTML={{ __html: event.Summary }}>
            </div>


          </section>



        </article>
      </>
    );

  }


  public render(): React.ReactElement<IAgiCorpIntranetEventsDetailsProps> {
    const eventID = this.getQueryStringValue('eventID');
    const category = this.getQueryStringValue('tab');


    return (
      <div className={'main-content'}>
        <div className={'content-wrapper'}>
          <div className={'container'}>
            {/* <div className={'row'}>
          <div className={'mb-4 mt-4 d-flex justify-content-end'}>
              <button className={'btn btn-primary btn-lg btn-back '}>
                <a href={`${this.props.siteUrl}/SitePages/Events.aspx?tab=${category}`}>
                  <span className={'button-content'}>
                    <i><img src={`${this.props.siteUrl}/Assets/icons/Button_Arrow.svg`}data-interception="off" title='Back to Events' alt="" /></i>
                  </span>
                </a>
              </button>
            </div>
            </div> */}
            {
              eventID ?
                this.renderEventDetail()
                :
                <div>
                  Invalid event ID.
                </div>
            }



          </div>

        </div>

      </div>

    );
  }
}
