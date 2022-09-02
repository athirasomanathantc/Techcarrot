import * as React from 'react';
import styles from './AgiCorpIntranetOffersDetails.module.scss';
import { IAgiCorpIntranetOffersDetailsProps } from './IAgiCorpIntranetOffersDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IOfferData } from '../Model/IOfferData';
import { IAgiCorpIntranetOffersDetailsState } from './IAgiCorpIntranetOffersDetailsState';
import { sp } from '@pnp/sp/presets/all';
import { Offer_NULL_ITEM } from '../common/constants'
export default class AgiCorpIntranetOffersDetails extends React.Component<IAgiCorpIntranetOffersDetailsProps, IAgiCorpIntranetOffersDetailsState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      offerData: Offer_NULL_ITEM,
      offerId: 0
    }

  }
  public async componentDidMount() {
    this.getOfferData()
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    console.log("Id", value);
    return value;

  }

  private async getOfferData(): Promise<void> {
    const offerId = this.getQueryStringValue('rewardID');
    console.log("offer id", offerId);
    if (!offerId) {
      return;
    } else {
      console.log("entered inside");
      const id = parseInt(offerId);
      sp.web.lists.getByTitle('Offers').items.getById(id).get()
        .then((item) => {
          this.setState({
            offerData: item,
            offerId: id
          }, () => {
            console.log('value', item);
          });
        })
      const userId: string = this.props.context.pageContext.legacyPageContent.userId;
      let readBy = this.state.offerData.ReadBy;
      const userIDColl = readBy ? readBy.split(';') : [];
      const isIdExists = userIDColl.includes(userId.toString());
      if (!isIdExists) {
        readBy = readBy ? `${readBy};${userId}` : userId;
        sp.web.lists.getByTitle('Offers').items.getById(this.state.offerId).update({
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

  private renderData(): JSX.Element {
    const offer = this.state.offerData;
    const imageUrl = this.getImageUrl(offer.OfferImage);
    const imagebet=this.getImageUrl(offer.MiddleImage);
    console.log("Offer Image", offer.OfferImage);
    console.log("small", offer.MiddleImage)
    return (
      <>
        <article className={'detail-wrapper'}>
          <header className={'detail-header'}>
            <h1>{this.state.offerData.Title}</h1>
          </header>
          <div className={'full-width-img mt-5'} style={{ display: offer.OfferImage === null ? "none" : "display" }}>
            <img src={imageUrl} className={'d-block w-100'} alt="..." />
          </div>
          <div className={'detail-text mt-5'} style={{ display: offer.OfferImage === null ? "none" : "display" }} dangerouslySetInnerHTML={{ __html: offer.Content1 }}>

          </div>

          <div className={'half-width mt-5'} style={{ display: offer.MiddleImage === null ? "none" : "display" }}>
            <div className={'container'}>
              <div className={'row gx-5'}>
                <div className={'col-lg-6 '}>
                  <div className={'image-container'} >
                    <img className={'w-100  mb-4 mb-md-0'} src={imagebet} alt="" />
                  </div>
                </div>
                <div className={'col-lg-6 d-flex flex-column justify-content-center align-items-center'}>
                  <div className={'text-container'} dangerouslySetInnerHTML={{ __html: offer.Content2 }}>
                    
                </div>
              </div>
            </div>
          </div>
          </div>

          
        </article>


      </>
    )
  }


  public render(): React.ReactElement<IAgiCorpIntranetOffersDetailsProps> {
    const offerId = this.getQueryStringValue('rewardID')
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
              offerId ?
                this.renderData()
                :
                <div>
                  Invalid Reward ID.
                </div>
            }



          </div>

        </div>

      </div>
    );
  }
}
