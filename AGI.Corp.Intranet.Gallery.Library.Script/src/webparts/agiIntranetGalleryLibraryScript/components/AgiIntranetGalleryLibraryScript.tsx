import * as React from 'react';
import styles from './AgiIntranetGalleryLibraryScript.module.scss';
import { IAgiIntranetGalleryLibraryScriptProps } from './IAgiIntranetGalleryLibraryScriptProps';
import { escape } from '@microsoft/sp-lodash-subset';

require('../css/style.css');

export default class AgiIntranetGalleryLibraryScript extends React.Component<IAgiIntranetGalleryLibraryScriptProps, {}> {

  private backToListing() {
    location.href = `${this.props.siteUrl}/SitePages/Toolkit.aspx`;
  }

  public render(): React.ReactElement<IAgiIntranetGalleryLibraryScriptProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.agiIntranetGalleryLibraryScript} ${hasTeamsContext ? styles.teams : ''} galleryBackNavigation`}>
        <div className="container">
          <div className="tab-header">
            <div className="row">
              <div className="col-md-12">
                <ul className="nav">
                  <li className="nav-item" role="presentation">
                    <a href="javascript:void(0)" onClick={(e) => this.backToListing()} className="nav-link">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="23.916" height="23.916" viewBox="0 0 23.916 23.916">
                          <g id="Group_8097" data-name="Group 8097" transform="translate(23.916 0) rotate(90)">
                            <g id="Group_7978" data-name="Group 7978" transform="translate(0)">
                              <path id="Path_73804" data-name="Path 73804" d="M25.836,13.135a.5.5,0,1,0-.681.721l4.079,3.853-4.079,3.853a.5.5,0,1,0,.681.721L30.3,18.069a.5.5,0,0,0,0-.721l-4.461-4.213Z" transform="translate(-15.802 -6.254)" fill="#666" />
                              <path id="Path_73805" data-name="Path 73805" d="M11.958,0A11.957,11.957,0,0,0,3.5,20.413,11.957,11.957,0,1,0,20.413,3.5,11.877,11.877,0,0,0,11.958,0Zm7.4,19.356A10.462,10.462,0,1,1,4.56,4.56a10.462,10.462,0,1,1,14.8,14.8Z" transform="translate(0 0)" fill="#666" />
                            </g>
                          </g>
                        </svg>
                      </i>
                      Back
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
