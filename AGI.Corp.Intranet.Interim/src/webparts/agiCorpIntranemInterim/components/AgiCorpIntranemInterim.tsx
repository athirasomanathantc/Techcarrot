import * as React from 'react';
import styles from './AgiCorpIntranemInterim.module.scss';
import { IAgiCorpIntranemInterimProps } from './IAgiCorpIntranemInterimProps';
import { IAgiCorpIntranemInterimState } from './IAgiCorpIntranemInterimState';
import { sp } from '@pnp/sp/presets/all';
import { IBanner } from '../Models/IBanner';
import { IContent } from '../Models/IContent';
import { VideoCarousel } from './VideoCarousel/VideoCarousel';
import { NULL_CONTENT_ITEM } from '../Common/constants';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';

export default class AgiCorpIntranemInterim extends React.Component<IAgiCorpIntranemInterimProps, IAgiCorpIntranemInterimState> {
  private videoWrapperRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      banner: [],
      content: [],
      moveCarousel: false,
      title:''
    }

  }
  public async componentDidMount(): Promise<void> {
    this.fetchData();
  }
  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  private async fetchData() {
   //debugger;
    const page = this.getQueryStringValue('pageID')
    this.setState({
      title:page
    });
    const bannerList = 'Carousel';
    const contentList = 'InterimContent';
    const filterBanner = `OtherPage eq '${page}'`;
    const filterContent = `Title eq '${page}'`;
    sp.web.lists.getByTitle(bannerList).items.filter(filterBanner).select('*,AttachmentFiles').expand('AttachmentFiles').get()
      .then((item: IBanner[]) => {
        console.log(item);
        this.setState({
          banner: item
        })

      })
    sp.web.lists.getByTitle(contentList).items.filter(filterContent).select('*,AttachmentFiles').expand('AttachmentFiles').get()
      .then((item: IContent[]) => {
        this.setState({
          content: item
        })

      })


  }
  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private videoPlayer() { 
    var aboutVideo:any = document.getElementById("aboutVideo");
      if (aboutVideo.paused)
      {			
       aboutVideo.play();
       $(".playButton").toggle();
       
      
      }
    else 
    {
      aboutVideo.pause();
       $(".playButton").toggle();
      
      
    }
    
       
  }

  private renderData(): JSX.Element {

    return (
      <div className='main-content'>
        <div className="content-wrapper business-details-content-section">
          <div className="container">
            <article className="wrapper">
              <div className="title text-center mb-4">
                <h2 className="">
                  {this.state.title}
                  {/* {
                    this.state.banner.map((items, i) => {
                      return (
                        i == 0 ?
                          items.OtherPage
                          :
                          <></>
                      )
                    })
                  } */}
                </h2>
              </div>

              <div className="banner-slider-section" style={{ display: this.state.banner.length > 0 ? 'block' : 'none' }}>
                <div id="business-details-banner-CarouselControls" className="carousel slide"
                  data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {
                      this.state.banner.map((item, i) => {
                        const type = item.ImageorVideo;
                        if (type === 'Image') {
                          const imgVal = item && item.AttachmentFiles[0]?.ServerRelativeUrl ? item.AttachmentFiles[0]?.ServerRelativeUrl : false;
                          return (
                            imgVal ?
                              <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                                <img src={imgVal} className="d-block w-100" alt="..." />
                              </div>
                              :
                              <></>
                          )

                        }
                        else if (type === 'Video') {
                          const videoVal = item && item.AttachmentFiles[0].ServerRelativeUrl ? item.AttachmentFiles[0].ServerRelativeUrl : false;
                          const thumbnailUrl = item && item.VideoThumbnail ? this.getImageUrl(item.VideoThumbnail) : '';
                          return (
                            videoVal ?
                            <div className={i == 0 ? "carousel-item active" : "carousel-item"} ref={this.videoWrapperRef}>
                              <div className="videoWrapper">
                                <VideoCarousel thumbnailUrl={thumbnailUrl} videoUrl={videoVal} moveCarousel={this.state.moveCarousel} ></VideoCarousel>

                              </div>
                            </div>
                            :
                            <></>
                          )
                        }
                      })
                    }
                  </div>
                  {this.state.banner.length >1 ?
                    <>
                      <button className="carousel-control-prev" type="button"
                        data-bs-target="#business-details-banner-CarouselControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next" type="button"
                        data-bs-target="#business-details-banner-CarouselControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                    :
                    <></>
                  }

                </div>
              </div>
              {
                this.state.content.map((item) => {
                  
                    const videoVal = item && item.AttachmentFiles[0].ServerRelativeUrl ? item.AttachmentFiles[0].ServerRelativeUrl : false;
                    const thumbnailUrl = item && item.VideoThumbnail ? this.getImageUrl(item.VideoThumbnail) : '';

                  
                  return (
                    <>
                    <div className="detail-text mt-5 mb-5">
                      <h6 dangerouslySetInnerHTML={{ __html: item.Desc1 }}></h6>
                      <p dangerouslySetInnerHTML={{ __html: item.Desc2 }}></p>
                    </div>
                    
                    {
                      videoVal?
                    
                    <div className="video-section mt-5">
                    <div className="video-wrapper">
                      <video className="video" id="aboutVideo" poster={thumbnailUrl} loop controls  onClick={() => this.videoPlayer()} >
                        <source src={videoVal} type="video/mp4" />
                      </video>
                      {/* <div className="playButton active" onClick={() => this.videoPlayer()} ></div> */}
                    </div>
                  </div>
                  :
                  <></>
                  }
                  </>
                  )

                })
              }
              

              


            </article>
          </div>
        </div>

      </div>
    )

  }

  public render(): React.ReactElement<IAgiCorpIntranemInterimProps> {

    return (
      <div>
        {this.renderData()}
      </div>
    );
  }
}
