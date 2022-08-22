import * as React from 'react';
import styles from './AgiIntranetAnnouncementsListing.module.scss';
import { IAgiIntranetAnnouncementsListingProps } from './IAgiIntranetAnnouncementsListingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";

export default class AgiIntranetAnnouncementsListing extends React.Component<IAgiIntranetAnnouncementsListingProps, {}> {
  constructor(props:IAgiIntranetAnnouncementsListingProps) {
    super(props);    
  }
  public render(): React.ReactElement<IAgiIntranetAnnouncementsListingProps> {    
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div className="main-content">
      <div className="content-wrapper">
        <div className="container">
        <div className="main-header-section">
              <div className="row ">
                <div className="col-12">
                  <h3>Announcements</h3>
                </div>
                
              </div>
            </div>
          <article className="row gx-5 mb-5">           
            <section className="col-lg-12 announcement-listing">
              <div className="row">
                <div className="col-lg-3 mb-4 d-flex align-items-stretch">
                  <div className="card news-card">
                    
                      <img src={`${this.props.siteUrl}/Assets/images/announcement-1.png`} className="card-img-top" alt="Card Image"/>
                      <div className="card-body d-flex flex-column">
                        <div className="mb-3 card-content-header">
                          <h5 className="card-title">Eid Al Adha 2022 in UAE: Likely dates revealed; residents to get 4-day holiday</h5>
                        </div>
                        <div className="news-details">
                          <span><i><img src="images/Date.svg" alt=""/></i> 21 Mar, 2022</span>
                          <span><i><img src="images/icon-tag.svg" alt=""/></i> Business</span>
                          
                        </div>
                        <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                          <a href="announcement-details.html" className="btn news-read-more  align-self-start">Read more</a>
                        <a href="#" className="btn news-read-more mt-auto align-self-start">View Full Article</a>
                      </div>
                    
                  </div>
                </div>  
                <div className="col-lg-3 mb-4 d-flex align-items-stretch">
                  <div className="card news-card">                    
                      <img src={`${this.props.siteUrl}/Assets/images/announcement-1.png`} className="card-img-top" alt="Card Image"/>
                      <div className="card-body d-flex flex-column">
                        <div className="mb-3 card-content-header">
                          <h5 className="card-title">Eid Al Adha 2022 in UAE: Likely dates revealed; residents to get 4-day holiday</h5>
                        </div>
                        <div className="news-details">
                          <span><i><img src="images/Date.svg" alt=""/></i> 21 Mar, 2022</span>
                          <span><i><img src="images/icon-tag.svg" alt=""/></i> Business</span>
                          
                        </div>
                        <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                          <a href="announcement-details.html" className="btn news-read-more  align-self-start">Read more</a>
                        <a href="#" className="btn news-read-more mt-auto align-self-start">View Full Article</a>
                      </div>
                    
                  </div>
                </div>         
              </div>
            </section>
          </article>
          <div className="col-12">
            <div className="d-flex justify-content-end">
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center justify-content-md-end align-items-center">
                   <li className="page-item">
                      <a className="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">«</span>
                      </a>
                      </li>
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item active"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">4</a></li>
                  <li className="page-item"><a className="page-link" href="#">5</a></li>
                   <li className="page-item">
                      <a className="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">»</span>
                      </a>
                      </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
