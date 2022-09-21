import * as React from 'react';
import styles from './AgiIntranetContactUsMain.module.scss';
import { IAgiIntranetContactUsMainProps } from './IAgiIntranetContactUsMainProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Item, sp } from '@pnp/sp/presets/all';
import { IAgiIntranetContactUsMainState } from './IAgiIntranetContactUsMainState';
import { IContactUsTalk2UsItem } from '../models/IContactUsTalk2UsItem';
import { IContactUsGoogleMapsItem } from '../models/IContactUsGoogleMapsItem';
import { LIST_CONTACTUS_REGISTRATION, LIST_CONTACTUS_TALK2US, NULL_CONTACTUS_TALK2US_ITEM, LIST_CONTACTUS_GOOGLEMAPS, NULL_CONTACTUS_GOOGLEMAPS_ITEM, TEXT_REGISTRATION_SUCCESS, LIST_TALK2US_RIGHT, LIST_TALK2US_LEFT, TEXT_IFRAME_URL, LIST_CONTACTUS_MAIN, NULL_CONTACTUS_MAIN_ITEM } from '../common/constants';
import { IContactUsMainItem } from '../models/IContactUsMainItem';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
export default class AgiIntranetContactUsMain extends React.Component<IAgiIntranetContactUsMainProps, IAgiIntranetContactUsMainState> {


  constructor(props: IAgiIntranetContactUsMainProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      loading: false,
      items: [],
      contactUsMainItems: [],
      contactUsTalk2UsItems: [],
      contactUsGoogleMapsItem: NULL_CONTACTUS_GOOGLEMAPS_ITEM,
      selectedUserName: '',
      selectedUserEmail: '',
      selectedUserExtn: '',
      selectedUserPhone: '',
      selectedUserSubject: '',
      selectedUserMsg: '',
      showSuccessMsg: false,
      showErrorEmailMsg: false,
      showErrorExtnMsg: false,
      showErrorPhoneMsg: false,
      validationText: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getItems();
    await this.getSubjectItem();
    await this.getTalk2UsItem();
    await this.getGoogleMapsItem();
    await this.getUserProfile();
  }

  public getItems(){
    let graphURI: string = "/sites/root/lists";

    if (!this.props.graphClient) {
      return;
    }
    this.setState({
      loading: true,
    });

    this.props.graphClient
      .api(graphURI)
      .version("v1.0")
      .get((err: any, res: any): void => {
        if (err) {
          this.setState({
            loading: false
          });
          return;
        }
        if (res && res.value && res.value.length > 0) {
          console.log("res: ", res);
          this.setState({
            items: res.value,
            loading: false
          });
        }
        else {
          this.setState({
            loading: false
          });
        }
      });

  }

  private async getSubjectItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_CONTACTUS_MAIN).items.get().then((items: IContactUsMainItem[]) => {
      const contactUsMainItems = items && items.length > 0 ? items[0] : NULL_CONTACTUS_MAIN_ITEM;
      this.setState({
        contactUsMainItems: items
      });
    });
  }

  private async getTalk2UsItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_CONTACTUS_TALK2US).items.get().then((items: IContactUsTalk2UsItem[]) => {
      const contactUsTalk2UsItem = items && items.length > 0 ? items[0] : NULL_CONTACTUS_TALK2US_ITEM;
      this.setState({
        contactUsTalk2UsItems: items
      });
    });
  }

  private async getUserProfile(): Promise<void> {
    //let loginName="i:0#.f|membership|"+user.userPrincipalName;
    const userPrincipalName = this.props.context.pageContext.legacyPageContext.userLoginName;
    let loginName = `i:0#.f|membership|${userPrincipalName}`;
    sp.web.currentUser.get().then((userData) => {
      //console.log('userdeail', data);
      this.setState({
        selectedUserName: userData.Title,
        selectedUserEmail: userData.Email
      });
    });
  }

  private async getGoogleMapsItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_CONTACTUS_GOOGLEMAPS).items.get().then((items: IContactUsGoogleMapsItem[]) => {
      const contactUsGoogleMapsItem = items && items.length > 0 ? items[0] : NULL_CONTACTUS_GOOGLEMAPS_ITEM;
      this.setState({
        contactUsGoogleMapsItem
      });
    });

  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private renderContactUsContentSection(): JSX.Element {

    // const contactUsTalk2UsItem = this.state.contactUsTalk2UsItem;
    // if (!contactUsTalk2UsItem) {
    //   return;
    // }

    // const contactUsCommChannelItem = this.state.contactUsCommChannelItem;
    // if (!contactUsCommChannelItem) {
    //   return;
    // }

    // const contactUsHyperCareItem = this.state.contactUsHyperCareItem;
    // if (!contactUsHyperCareItem) {
    //   return;
    // }

    // const contactUsWarRoomHotlineItems = this.state.contactUsWarRoomHotlineItems;
    // if (!contactUsWarRoomHotlineItems) {
    //   return;
    // }

    const leftContentItem = this.state.contactUsTalk2UsItems.filter(item => item.Category == LIST_TALK2US_LEFT);
    //const leftContentLinkItem = leftContentItem && leftContentItem.length > 0 ? leftContentItem[0] : null;
    const rightContentItems = this.state.contactUsTalk2UsItems.filter(item => item.Category == LIST_TALK2US_RIGHT);

    // const changeAgentNavUrlLink = this.state.changeAgentItems.filter(item => item.ContentTypeName == TEXT_ABOUT_CHANGEAGENT_NAVIGATION);
    // const changeAgentNavUrlLinkItem = changeAgentNavUrlLink && changeAgentNavUrlLink.length > 0 ? changeAgentNavUrlLink[0] : null;
    // const changeAgentNavUrlLinkItemUrl = changeAgentNavUrlLinkItem && changeAgentNavUrlLinkItem.NavigationUrl ? changeAgentNavUrlLinkItem.NavigationUrl.Url : '';
    // const changeAgentNavUrlText = changeAgentNavUrlLinkItem && changeAgentNavUrlLinkItem.NavigationText ? changeAgentNavUrlLinkItem.NavigationText : '';

    return (

      <div>
        <div className="main-content contact-us-wrapper">
          <div className="content-wrapper">
            <div className="container">
              <div className="contact-section-main">
                <div className="row ">
                  <div className="col-lg-12 contact-talk-to-us-section">
                    <h2 className="d-block d-lg-flex mb-4 section-title">Talk To Us!</h2>
                    <p>We are expanding our reach beyond our presence in 20 countries across the Middle East, Africa and Asia. But you can find us with ease.</p>
                  </div>
                </div>
                <div className="row  contact-section-details">
                  <div className="col-lg-6 contact-details-wrapper border-end">
                    <div className="row mb-5 ">
                      <div className="col-lg-12 d-flex align-items-center ">
                        <div className="icon me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="39.557" height="42.95" viewBox="0 0 39.557 42.95">
                            <g id="Group_9265" data-name="Group 9265" transform="translate(-227.29 -1252.491)">
                              <path id="Path_73967" data-name="Path 73967" d="M214.124,21.456c2.655,2.594,6.14,5.641,9.115,8.682,3.089,3.157,5.63,6.271,6.122,6.865a12.157,12.157,0,0,1,2.549,5.752l.214.195L253.681,21.5c-2.888-2.82-6.752-6.259-9.879-9.464-2.736-2.807-4.906-5.541-5.358-6.087A12.153,12.153,0,0,1,235.9.194s-.215-.2-.215-.2Zm27.019-7.207c3.1,3.132,6.122,5.973,7.389,7.208,0,0-12.275,12.565-15.26,15.525-.051-.032-.042-.012-.053-.045a5.7,5.7,0,0,0-.886-1.661,83.068,83.068,0,0,0-6.4-7.278c-2.9-2.918-5.487-5.4-6.658-6.546,12.379-12.355,12-12.346,15.157-15.475.055.041.043.01.055.045a5.48,5.48,0,0,0,.886,1.622,72.853,72.853,0,0,0,5.765,6.6" transform="translate(13.166 1252.492)" fill="#300b55" />
                              <path id="Path_73968" data-name="Path 73968" d="M293.852,79.159a16.533,16.533,0,0,1-3.6.232,16.1,16.1,0,0,1-3.622-.25,16.467,16.467,0,0,1,.233,3.6,16.047,16.047,0,0,1-.25,3.623,16.507,16.507,0,0,1,3.6-.234,16.124,16.124,0,0,1,3.623.249,16.606,16.606,0,0,1-.232-3.6,16.132,16.132,0,0,1,.249-3.621" transform="translate(-43.028 1191.137)" fill="#9d0371" />
                            </g>
                          </svg>
                        </div>
                        <div className="d-flex align-items-center">
                          <p>
                            {
                              leftContentItem.map((item, i) => {
                                return (
                                  <p>{item.Title}</p>
                                )
                              })
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row mb-5">
                      <div className="col-lg-6 d-flex align-items-center">
                        <div className="icon me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37">
                            <g id="Group_8406" data-name="Group 8406" transform="translate(-341 -1151)">
                              <circle id="Ellipse_620" data-name="Ellipse 620" cx="18.5" cy="18.5" r="18.5" transform="translate(341 1151)" fill="#300b55" />
                              <g id="Group_8242" data-name="Group 8242" transform="translate(350 1160)">
                                <g id="Group_8243" data-name="Group 8243" transform="translate(0 0)">
                                  <path id="Path_74175" data-name="Path 74175" d="M0,40.5a2.822,2.822,0,0,1,.939-2.213c.447-.406.86-.849,1.288-1.275A1.483,1.483,0,0,1,4.6,36.994c.744.739,1.483,1.483,2.224,2.225.05.05.1.1.147.155A1.409,1.409,0,0,1,6.949,41.5c-.454.488-.931.954-1.415,1.412a.508.508,0,0,0-.118.68,12.476,12.476,0,0,0,2.5,3.361,12.245,12.245,0,0,0,3.423,2.551c.363.174.391.176.67-.1.44-.439.878-.882,1.319-1.32a1.464,1.464,0,0,1,2.344-.015q1.148,1.133,2.284,2.279a1.477,1.477,0,0,1,0,2.349c-.438.442-.888.872-1.312,1.326a2.91,2.91,0,0,1-2.569.874A11.512,11.512,0,0,1,9.5,53.259a20.59,20.59,0,0,1-7.864-7.883A12.564,12.564,0,0,1,.1,41.394c-.054-.3-.069-.6-.1-.9" transform="translate(0 -36.41)" fill="#fff" />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div className="">
                          <h6>Landline</h6>
                          <p>
                            <p>
                              {
                                leftContentItem.map((item, i) => {
                                  return (
                                    <p>{item.Landline}</p>
                                  )
                                })
                              }
                            </p>
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-6 d-flex align-items-center">
                        <div className="icon me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37">
                            <g id="Group_9264" data-name="Group 9264" transform="translate(-823 -973)">
                              <g id="Group_8640" data-name="Group 8640" transform="translate(482 -178)">
                                <circle id="Ellipse_620" data-name="Ellipse 620" cx="18.5" cy="18.5" r="18.5" transform="translate(341 1151)" fill="#300b55" />
                              </g>
                              <g id="Printer" transform="translate(828 978)">
                                <rect id="Rectangle_8276" data-name="Rectangle 8276" width="7" height="6" transform="translate(10 17)" fill="#9d0371" />
                                <rect id="Rectangle_8277" data-name="Rectangle 8277" width="5" height="3" transform="translate(18 11)" fill="#9d0371" />
                                <path id="Path_81192" data-name="Path 81192" d="M11,19v6.667a.833.833,0,0,0,.833.833H18.5a.833.833,0,0,0,.833-.833V19Zm5.833,5.833H13.5a.833.833,0,1,1,0-1.667h3.333a.833.833,0,1,1,0,1.667Zm0-2.5H13.5a.833.833,0,1,1,0-1.667h3.333a.833.833,0,1,1,0,1.667Z" transform="translate(-1.333 -2.5)" fill="#fff" />
                                <path id="Path_81193" data-name="Path 81193" d="M22.167,10H5.5A2.5,2.5,0,0,0,3,12.5v6.667a2.507,2.507,0,0,0,2.5,2.5H8v-5a.836.836,0,0,1,.833-.833h10a.836.836,0,0,1,.833.833v5h2.5a2.507,2.507,0,0,0,2.5-2.5V12.5a2.5,2.5,0,0,0-2.5-2.5ZM20.5,14.167a.824.824,0,0,1-.833-.833.833.833,0,1,1,.833.833Z" transform="translate(0 -1)" fill="#fff" />
                                <path id="Path_81194" data-name="Path 81194" d="M20.667,4.833V8.167H9V4.833A.836.836,0,0,1,9.833,4h10A.836.836,0,0,1,20.667,4.833Z" transform="translate(-1)" fill="#fff" />
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div className="">
                          <h6>Fax</h6>
                          <p>
                            <p>
                              {
                                leftContentItem.map((item, i) => {
                                  return (
                                    <p>{item.Fax}</p>
                                  )
                                })
                              }
                            </p>
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row mb-5">
                      <div className="col-lg-6 d-flex align-items-center">
                        <div className="icon me-3">
                          <svg id="Group_8245" data-name="Group 8245" xmlns="http://www.w3.org/2000/svg" width="32.302" height="25.843" viewBox="0 0 32.302 25.843">
                            <g id="Group_8246" data-name="Group 8246" transform="translate(0 0)">
                              <path id="Path_74178" data-name="Path 74178" d="M0,65.852l2.478,1.6q6.436,4.164,12.868,8.334a1.319,1.319,0,0,0,1.611,0q7.443-4.836,14.9-9.649c.122-.079.249-.149.444-.264v.536q0,7.6,0,15.207a3.978,3.978,0,0,1-4.175,4.167H4.173A3.978,3.978,0,0,1,0,81.616q0-7.6,0-15.207v-.557" transform="translate(0 -59.943)" fill="#300b55" />
                              <path id="Path_74179" data-name="Path 74179" d="M17.317,0q6.054,0,12.108,0A3.951,3.951,0,0,1,33.22,2.7c.224.636.22.648-.33,1q-7.6,4.92-15.194,9.847a.62.62,0,0,1-.8,0Q9.235,8.568,1.551,3.614a.512.512,0,0,1-.262-.657A3.974,3.974,0,0,1,5.119,0q6.1-.012,12.2,0" transform="translate(-1.145 0)" fill="#9d0371" />
                            </g>
                          </svg>
                        </div>
                        <div className="">
                          <h6>Email</h6>
                          <p>
                            <p>
                              {
                                leftContentItem.map((item, i) => {
                                  return (
                                    <p>{item.Email}</p>
                                  )
                                })
                              }
                            </p>
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-6 d-flex">
                        <div className="icon me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32.203" height="32.229" viewBox="0 0 32.203 32.229">
                            <g id="Group_8248" data-name="Group 8248" transform="translate(0 0)">
                              <g id="Group_8249" data-name="Group 8249" transform="translate(0 0)">
                                <path id="Path_74180" data-name="Path 74180" d="M31.909,19.064l-2.542-.844.078-.767c-.546,0-1.062.034-1.572-.009a7.161,7.161,0,0,1-1.592-.262c-2.374-.767-4.735-1.573-7.108-2.421h2.5c-.165-1.322-.316-2.565-.484-3.807a.322.322,0,0,0-.235-.207c-1.152.108-2.3.234-3.5.362v1.953c0,.447-.015.9.009,1.341a1.571,1.571,0,0,0,.185.454,3.778,3.778,0,0,0-2.81,2.8c-.1-.074-.179-.195-.263-.2-1.31-.012-2.62-.008-4-.008.1.989.188,1.928.287,2.866.026.25.107.5.115.744.014.389.173.48.554.428.871-.117,1.749-.181,2.623-.267.192-.019.383-.042.6-.065V19.291l.081-.02c.06.183.12.366.181.549.769,2.3,1.543,4.6,2.3,6.912a3.662,3.662,0,0,1,.137.941c.022.426.006.855.006,1.353l.518-.322,1.075,3.216A16.092,16.092,0,1,1,31.909,19.064M7.854,14.735A1.071,1.071,0,0,0,7.9,14.58c.16-1.386.314-2.773.482-4.158.029-.241-.073-.3-.277-.366q-1.5-.514-2.99-1.075c-.235-.089-.366-.061-.464.163C4.162,10.266,3.62,11.369,3.2,12.516a16,16,0,0,0-.488,2.22ZM2.793,17.479a.7.7,0,0,0-.02.147,13.472,13.472,0,0,0,1.912,5.535c.138.226.276.153.455.087.968-.355,1.934-.718,2.914-1.04.289-.095.365-.2.317-.5-.129-.784-.235-1.573-.326-2.362-.072-.619-.11-1.242-.164-1.872ZM29.414,14.73a1.006,1.006,0,0,0,.017-.189,13.592,13.592,0,0,0-1.909-5.45c-.115-.19-.226-.183-.412-.114-.993.369-1.985.741-2.991,1.072-.29.1-.325.216-.284.478.122.785.233,1.573.326,2.362.071.606.109,1.217.163,1.842ZM14.739,11.107c-1.178-.127-2.312-.257-3.449-.358-.09-.008-.264.171-.287.286-.107.533-.194,1.071-.251,1.611-.072.686-.109,1.375-.161,2.071h4.148Zm-3-2.987,2.985.274V3.271c-1,.468-2.385,2.7-2.985,4.849m-.028,16a10.232,10.232,0,0,0,3.015,4.944v-5.22l-3.015.276M17.475,3.177V8.4L20.5,8.119a10.26,10.26,0,0,0-3.021-4.942m4.2.757L23.21,7.552l2.452-.826a13.288,13.288,0,0,0-3.985-2.791M10.523,3.94A13.034,13.034,0,0,0,6.54,6.732L9,7.544l1.527-3.6M6.54,25.513a13.086,13.086,0,0,0,3.982,2.79L8.995,24.7l-2.455.815" transform="translate(0 0)" fill="#300b55" />
                                <path id="Path_74181" data-name="Path 74181" d="M209.455,208.3c.2.062.518.156.834.262q5.918,1.969,11.835,3.941c.079.026.158.055.236.085a1,1,0,0,1,.719.931.968.968,0,0,1-.657.975c-.972.388-1.952.756-2.928,1.133-.82.316-1.646.62-2.456.961a.88.88,0,0,0-.433.438c-.664,1.673-1.3,3.356-1.952,5.036-.035.091-.07.183-.109.272a1.014,1.014,0,0,1-1.015.723,1,1,0,0,1-.931-.776q-.719-2.121-1.426-4.246-1.372-4.11-2.74-8.221a1.05,1.05,0,0,1,1.022-1.514" transform="translate(-190.877 -190.831)" fill="#9d0371" />
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div className="">
                          <h6>Website</h6>
                          <p>
                            <p>
                              {
                                leftContentItem.map((item, i) => {
                                  return (
                                    <p>{item.Website}</p>
                                  )
                                })
                              }
                            </p>
                          </p>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className="col-lg-6 contact-description-details">
                    {
                      rightContentItems.map((item, i) => {
                        return (
                          <p className="mb-5" dangerouslySetInnerHTML={{ __html: item.Detail }}></p>
                        )
                      })
                    }
                  </div>
                </div>


                <div className="row contact-section-form">
                  <h2 className="d-block d-lg-flex mb-4 section-title">Contact Us</h2>
                  <form action="" className="contact-form mt-4">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" id="contactFormName" disabled value={this.state.selectedUserName} onChange={(e) => this.handleNameChange(e)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Subject</label>
                        <select className="form-select form-control" value={this.state.selectedUserSubject} onChange={(e) => this.handleSubjectChange(e)}>
                          <option >IT Support</option>
                        </select>
                      </div>
                      <div className="mb-2 col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" disabled id="contactFormEmail" value={this.state.selectedUserEmail} onChange={(e) => this.handleEmailChange(e)} />
                        <p id="emailErrorMsg" className="errorMsgClass" style={{ display: this.state.showErrorEmailMsg ? "block" : "none" }}>Email id is not valid</p>
                      </div>

                      <div className="mb-3 col-md-6 msgBox">
                        <label className="form-label">Message</label>
                        <textarea rows={4} placeholder="Write your message...." className="form-control" id="contactFormMessage" value={this.state.selectedUserMsg} onChange={(e) => this.handleMsgChange(e)}></textarea>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Phone</label>
                        <div className="d-flex">
                          <div className="col-6 col-md-2">
                            <select className="form-select" value={this.state.selectedUserExtn} onChange={(e) => this.handleExtnChange(e)}>
                              <option value="+971">+971</option>
                            </select>
                          </div>
                          <div className="flex-grow flex-grow-1 ms-3">
                            <input type='number' className="form-control" id="contactFormPhone" value={this.state.selectedUserPhone} onChange={(e) => this.handlePhoneChange(e)} onDrop={(e) => this.returnFalse(e)} onPaste={(e) => this.returnFalse(e)} />
                            <p id="phoneErrorMsg" className="errorMsgClass" style={{ display: this.state.showErrorPhoneMsg ? "block" : "none" }}>Phone Number is not valid</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <input type="button" value="Send Message" className="btn btn-gradient btn-lg btn-hover btn-view-more mt-3" onClick={(e) => this.handleRegister()} />
                        {/* <button className="btn btn-gradient btn-lg btn-hover btn-view-more mt-3" onClick={(e) => this.handleRegister()}>
                          Send Message
                        </button> */}
                      </div>
                    </div>
                  </form>

                </div>





                <div className="row">
                  <p className="text-center">We Are Expanding Our Reach Beyond Our Presence In 20 Countries Across The Middle East, Africa And Asia. But You Can Find Us With Ease.</p>
                </div>


              </div>
            </div>
          </div>

        </div>
        <div className="section map-section">

          {/* <iframe src={TEXT_IFRAME_URL}{this.state.contactUsGoogleMapsItem.Latitude}+",%20"+{this.state.contactUsGoogleMapsItem.Longitude}+"(Al Ghurair Investment LLC)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" width="100%" height="650"></iframe> */}

          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0795559534245!2d55.31411281499079!3d25.26790908386334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cca59d8bc5b%3A0xf1f6b7c9d88f252c!2sAl%20Ghurair%20Investment%20LLC!5e0!3m2!1sen!2sae!4v1659355607157!5m2!1sen!2sae" width="100%" height="650" ></iframe>
        </div></div>
    );
  }

  private returnFalse(event)
  {
    return false;
  }

  private isNumberKey(evt) {

    console.log(document.getElementById("myText").clientHeight);

    var charCode = evt.which;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;

    // if (evt.value.length > evt.maxLength)
    // {

    // evt.value = evt.value.slice(0, evt.maxLength);
    // }
  }

  private handleNameChange(e: any) {
    const Nm = e.target.value;
    this.setState({
      selectedUserName: Nm
    });
  }

  private handleEmailChange(e: any) {
    const Em = e.target.value;
    this.setState({
      selectedUserEmail: Em
    });
  }

  private handleExtnChange(e: any) {
    const Ext = e.target.value;
    this.setState({
      selectedUserExtn: Ext
    });
  }

  private handlePhoneChange(e: any) {
    const Ph = e.target.value;
    this.setState({
      selectedUserPhone: Ph
    });
  }

  private handleSubjectChange(e: any) {
    const Subj = e.target.value;
    this.setState({
      selectedUserSubject: Subj
    });
  }
  private handleMsgChange(e: any) {
    const Msg = e.target.value;
    this.setState({
      selectedUserMsg: Msg
    });
  }

  private handleRegister() {debugger;

    // const isErrors= this.validate(phone, email);

    // if(!isErrors) {
    //   return false;
    // }

    const isFormValid = this.validateForm();

    if (!isFormValid) {
      return false;
    }

    const body = {

      Name: this.state.selectedUserName,
      Email: this.state.selectedUserEmail,
      Extension: this.state.selectedUserExtn,
      Phone: this.state.selectedUserPhone,
      /* Subject: this.state.selectedUserSubject, */
      Message: this.state.selectedUserMsg
    }

    //const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${LIST_REGISTRATION}')/items`;

    sp.web.lists.getByTitle(LIST_CONTACTUS_REGISTRATION).items.add(body).then((data) => {
      console.log('registration completed');
      this.setState({
        showSuccessMsg: true
      });
      this.successResetForm();
    }).catch((error) => {
      console.log('Registration failed', error);
    });
  }

  private validateForm(): boolean {
    //console.log('validation');
    let isValid = false;

    let errors = [];

    let isPhoneValid: boolean = true;
    if (!this.state.selectedUserPhone) {
      errors.push('Phone Number');
      isPhoneValid = false;
    }

    let isMsgValid: boolean = true;
    if (!this.state.selectedUserMsg) {
      errors.push('User Message');
      isMsgValid = false;
    }

    const phoneErrorNew = this.validatePhone(this.state.selectedUserPhone);
    if (phoneErrorNew.length > 0) {
      this.setState({
        showErrorPhoneMsg: true
      });
       return;
    }
    else {
      this.setState({
        showErrorPhoneMsg: false
      });
    }

    isValid = isPhoneValid && isMsgValid;
    if (!isValid) {
      const _error = errors.length > 1 ? 'Mandatory fields' : 'Mandatory field'
      const error = `${_error}: ${errors.join(', ')}`;
      this.setState({
        validationText: error
      });
    }
    return isValid;
  }

  private validateEmail(email) {

    const errorsNew = [];

    if (email.split("").filter(x => x === "@").length !== 1) {
      errorsNew.push("Email should contain '@' ");
    }
    if (email.indexOf(".") === -1) {
      errorsNew.push("Email should contain '.'");
    }

    return errorsNew;
  }


  private validatePhone(phone) {
    const numbers = /^[0-9]+$/;
    const errorsNew = [];

    // if (phone.match(numbers)) {
    //   errorsNew.push("Phone Number format is not correct");
    // }

    if ((phone.length < 9) || (phone.length > 9)) {
      errorsNew.push("Phone Number length is not correct");
    }

    return errorsNew;
  }


  private resetForm() {
    this.setState({
      selectedUserName: '',
      selectedUserEmail: '',
      selectedUserExtn: '',
      selectedUserPhone: '',
      selectedUserSubject: '',
      selectedUserMsg: ''
    });
  }

  private successResetForm() {
    this.setState({
      selectedUserExtn: '',
      selectedUserPhone: '',
      selectedUserSubject: '',
      selectedUserMsg: ''
    });
  }

  private handleCloseSuccessForm(e: any) {
    this.successResetForm();
    this.setState({
      showSuccessMsg: false
    });
  }

  private renderSuccessForm(): JSX.Element {
    return (
      <div className='successOverlay'>
        <div className='overlay'>
          <div className='msgContainer'>
            <div className='msgBox'>
              <div className='msgSuccess'>
                {TEXT_REGISTRATION_SUCCESS}
              </div>
              <div className='btnClose'>
                <input type="button" value={'Close'} onClick={(e) => this.handleCloseSuccessForm(e)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private fnContactUsContent() {
    // this.pestaña = this.$('.pestaña');
    // this.pestaña.on('click', function () {
    //   this.$(this).addClass('activa');
    //   this.pestaña.not($(this)).addClass('desactivada');
    //   this.$(this).parent().addClass("accordion-activa");
    // });

    // this.$('.cerrar').on('click', function () {
    //   this.pestaña.removeClass('activa desactivada');
    //   this.pestaña.parent().removeClass("accordion-activa");
    //   console.log(this.$(this).parent());
    // });

    //sticky-div
    const stickyElem: any = document.querySelector(".sticky-div");
    const currStickyPos = stickyElem.getBoundingClientRect().top + window.pageYOffset;

    window.onscroll = function () {
      if (window.pageYOffset > currStickyPos) {
        stickyElem.style.position = "sticky";
        stickyElem.style.top = "220px";
      } else {
        stickyElem.style.position = "relative";
        stickyElem.style.top = "initial";
      }
    }
  }






  public render(): React.ReactElement<IAgiIntranetContactUsMainProps> {
    return (
      <div className={styles.agiIntranetContactUsMain}>
        {
          this.state.loading &&
          <Spinner label="Loading items..." size={SpinnerSize.large} />
        }
        {this.renderContactUsContentSection()}
        <div style={{ display: this.state.showSuccessMsg ? 'block' : 'none' }}>
          {this.renderSuccessForm()}
        </div>
      </div>
    );
  }
}


function phone(phone: any, email: any): any {
  throw new Error('Function not implemented.');
}

function email(phone: (phone: any, email: any) => any, email: any): any {
  throw new Error('Function not implemented.');
}



