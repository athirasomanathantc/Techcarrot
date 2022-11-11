import * as React from 'react';
import styles from './AgiIntranetContactUsMain.module.scss';
import { IAgiIntranetContactUsMainProps } from './IAgiIntranetContactUsMainProps';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntranetContactUsMainState } from './IAgiIntranetContactUsMainState';
import { IContactUsTalk2UsItem } from '../models/IContactUsTalk2UsItem';
import { IContactUsGoogleMapsItem } from '../models/IContactUsGoogleMapsItem';
import { LIST_CONTACTUS_REGISTRATION, LIST_CONTACTUS_TALK2US, NULL_CONTACTUS_TALK2US_ITEM, LIST_CONTACTUS_GOOGLEMAPS, NULL_CONTACTUS_GOOGLEMAPS_ITEM, TEXT_REGISTRATION_SUCCESS, LIST_TALK2US_RIGHT, LIST_TALK2US_LEFT, LIST_CONTACTUS_MAIN, NULL_CONTACTUS_MAIN_ITEM, LIST_CONTACTUS_TITLE, LIST_TALK2US_FOOTER } from '../common/constants';
import { IContactUsMainItem } from '../models/IContactUsMainItem';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import ReactHtmlParser from 'react-html-parser';
import { IContactUsTitle } from '../models/IContactUSTitle';
import { eq } from 'lodash';

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
      contactUsTitle: [],
      talkToUsTitle: '',
      contactUsTalk2UsItems: [],
      contactUsGoogleMapsItem: NULL_CONTACTUS_GOOGLEMAPS_ITEM,
      selectedUserName: '',
      selectedUserEmail: '',
      selectedUserExtn: '+971',
      selectedUserPhone: '',
      selectedUserSubject: '',
      selectedUserMsg: '',
      showSuccessMsg: false,
      showErrorEmailMsg: false,
      showErrorExtnMsg: false,
      showErrorPhoneMsg: false,
      showErrorMessage: false,
      validationText: '',
      oddEven: false
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getItems();
    await this.getSubjectItem();
    await this.getTalk2UsItem();
    await this.getGoogleMapsItem();
    await this.getUserProfile();
    await this.getTitleContactUs();
    await this.getTitleTalkToUs();
  }

  public getItems() {
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
      this.setState({
        contactUsMainItems: items,
        selectedUserSubject: items[0]?.ID?.toString()
      });
      console.log('hi' + items);
    });
  }

  private async getTitleContactUs(): Promise<void> {
    sp.web.lists.getByTitle('TitleConfig').items.filter("Title eq 'Contact Us Title'")
      .get().then((items: any) => {
        this.setState({
          contactUsTitle: items[0]?.Header
        });
      });
  }
  private async getTitleTalkToUs(): Promise<void> {
    sp.web.lists.getByTitle('TitleConfig').items.filter("Title eq 'Talk To Us Title'")
      .get().then((items: any) => {
        this.setState({
          talkToUsTitle: items[0]?.Header
        });
      });
  }

  private async getTalk2UsItem(): Promise<void> {
    sp.web.lists.getByTitle(LIST_CONTACTUS_TALK2US).items.get().then((items: IContactUsTalk2UsItem[]) => {
      this.setState({
        contactUsTalk2UsItems: items
      });
    });
  }

  private async getUserProfile(): Promise<void> {
    sp.web.currentUser.get().then((userData) => {
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

  private generateGroupedItems = (items: any, itemCount: number) => {
    let itemGroup = [];
    let itemColl = [];
    for (let i = 0; i < items.length; i += itemCount) {
      itemColl = [];
      for (let j = 0; j < itemCount; j++) {
        if (items[i + j]) {
          itemColl.push(items[i + j]);
        }
      }
      if (itemColl.length) {
        itemGroup.push(itemColl);
      }
    }
    return itemGroup;
  }

  private renderContactUsContentSection(): JSX.Element {
    let leftContentItem: any = this.state.contactUsTalk2UsItems.filter(item => item.Category == LIST_TALK2US_LEFT);
    leftContentItem = this.generateGroupedItems(leftContentItem, 2);

    const headingContent = this.state.contactUsTalk2UsItems.filter(item => item.Category == "Heading");
    const rightContentItems = this.state.contactUsTalk2UsItems.filter(item => item.Category == LIST_TALK2US_RIGHT);

    let footerText: any = this.state.contactUsTalk2UsItems.filter(item => item.Category == LIST_TALK2US_FOOTER);

    return (
      <div>
        <div className="main-content contact-us-wrapper">
          <div className="content-wrapper">
            <div className="container">
              <div className="contact-section-main">
                <div className="row ">
                  <div className="col-lg-12 contact-talk-to-us-section">
                    <h2 className="d-block d-lg-flex mb-4 section-title">{this.state.talkToUsTitle}</h2>
                    <p>
                      {
                        headingContent.map((item) => {
                          return (
                            <p>{ReactHtmlParser(item.Detail)}</p>
                          )
                        })
                      }
                    </p>
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
                              headingContent.map((item) => {
                                return (
                                  <p>{item.Title}</p>
                                )
                              })
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    {
                      leftContentItem.map((itemGroup) => {
                        return (
                          <div className="row mb-5">
                            {
                              itemGroup.map((item: IContactUsTalk2UsItem) => {
                                let icon = JSON.parse(item.Icon);
                                icon = `${icon?.serverUrl}${icon?.serverRelativeUrl}`;

                                const tempTitle: any = item.Title;
                                return (
                                  <div className="col-lg-6 d-flex align-items-center">
                                    <div className="icon me-3">
                                      <img src={icon}></img>
                                    </div>
                                    <div className="">
                                      <h6>{item.Title}</h6>
                                      <p>{ReactHtmlParser(item.Detail)}</p>
                                    </div>
                                  </div>
                                )
                              })
                            }

                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="col-lg-6 contact-description-details">
                    {
                      rightContentItems.map((item) => {
                        return (
                          <p className="mb-5" dangerouslySetInnerHTML={{ __html: item.Detail }}></p>
                        )
                      })
                    }
                  </div>
                </div>
                <div className="row contact-section-form">
                  <h2 className="d-block d-lg-flex mb-4 section-title">{this.state.contactUsTitle}</h2>
                  <form action="" className="contact-form mt-4">
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" id="contactFormName" disabled value={this.state.selectedUserName} onChange={(e) => this.handleNameChange(e)} />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Subject</label>
                        <select className="form-select form-control" value={this.state.selectedUserSubject} onChange={(e) => this.handleSubjectChange(e)}>
                          {
                            this.state.contactUsMainItems.map((contactUsMainItem: IContactUsMainItem) => {
                              return <option value={contactUsMainItem.ID}>{contactUsMainItem.Title}</option>
                            })
                          }

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
                        <p id="errorMessage" className="errorMsgClass" style={{ display: this.state.showErrorMessage ? "block" : "none" }}>Message is required</p>
                      </div>
                      <div className="mb-3 col-md-6">
                        <label className="form-label">Phone</label>
                        <div className="d-flex">
                          <div className="col-4 col-md-2">
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
                        <input type="button" value="Send Message" className="btn btn-gradient btn-lg btn-hover btn-view-more mt-3" onClick={() => this.handleRegister()} />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="row">
                  <p className="text-center">{footerText.map((footerTextItem) => {
                    return (<>{ReactHtmlParser(footerTextItem.Detail)}</>)
                  })}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="section map-section">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0795559534245!2d55.31411281499079!3d25.26790908386334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cca59d8bc5b%3A0xf1f6b7c9d88f252c!2sAl%20Ghurair%20Investment%20LLC!5e0!3m2!1sen!2sae!4v1659355607157!5m2!1sen!2sae" width="100%" height="650" ></iframe>
        </div></div>
    );
  }

  private returnFalse(event) {
    return false;
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

  private handleRegister() {
    const isFormValid = this.validateForm();

    if (!isFormValid) {
      return false;
    }

    const body = {

      Name: this.state.selectedUserName,
      Email: this.state.selectedUserEmail,
      Extension: this.state.selectedUserExtn,
      Phone: this.state.selectedUserPhone,
      Message: this.state.selectedUserMsg,
      SubjectId: this.state.selectedUserSubject
    }

    sp.web.lists.getByTitle(LIST_CONTACTUS_REGISTRATION).items.add(body).then(() => {
      console.log('registration completed');
      this.setState({
        showSuccessMsg: true
      });
      this.successResetForm();
    }).catch((error) => {
      console.log('Registration failed', error);
    });
  }

  private handleRedirection(pageName) {
    const tempURl = `${this.props.siteUrl}/SitePages/Contact Us/${pageName}.aspx`;
    window.open(tempURl, '_blank');
  }

  private validateForm(): boolean {
    let isValid = false;

    let errors = [];

    let isPhoneValid: boolean = true;
    if (!this.state.selectedUserPhone) {
      errors.push('Phone Number');
      isPhoneValid = false;
    }

    let isMsgValid: boolean = true;
    if (!this.state.selectedUserMsg.trim().length) {
      errors.push('User Message');
      isMsgValid = false;
      this.setState({
        showErrorMessage: true
      })
    }
    else {
      this.setState({
        showErrorMessage: false
      })
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

    const messageError = this.state.selectedUserMsg

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



  private validatePhone(phone) {
    const errorsNew = [];

    if ((phone.length < 9) || (phone.length > 9)) {
      errorsNew.push("Phone Number length is not correct");
    }

    return errorsNew;
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

  public render(): React.ReactElement<IAgiIntranetContactUsMainProps> {
    return (
      <div className={styles.agiIntranetContactUsMain} >
        {
          this.state.loading &&
          <Spinner label="Loading items..." size={SpinnerSize.large} />
        }
        {this.renderContactUsContentSection()
        }
        < div style={{ display: this.state.showSuccessMsg ? 'block' : 'none' }}>
          {this.renderSuccessForm()}
        </div >
      </div >
    );
  }
}






