import * as React from 'react';
import { IAgiIntranetICareProps } from './IAgiIntranetICareProps';
import { ICareState } from './IAgiIntranetICareState';
import { ICare } from '../Models/ICare';
import { ICareDetails } from '../Models/ICareDetails';
import { ICareExtension } from '../Models/ICareExtension';
import { ICareBusiness } from '../Models/ICareBusiness';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import ReactHtmlParser from 'react-html-parser';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http'
import { LIST_ICARE, LIST_ICARE_BUSINESS, LIST_ICARE_DETAILS, LIST_ICARE_EXTENSION, NULL_ICARE_BUSINESS_ITEM, NULL_ICARE_DETAILS_ITEM, NULL_ICARE_EXTENSION_ITEM, NULL_ICARE_ITEM, TEXT_REGISTRATION_SUCCESS } from '../common/constants';


export default class AgiIntranetICare extends React.Component<IAgiIntranetICareProps, ICareState> {
  
  constructor(props: IAgiIntranetICareProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
    iCareDetails: NULL_ICARE_DETAILS_ITEM,
    iCareExtension: [],
    iCareBusiness: [],
    iCareIsAnonymous: false,
    items: [],
    iCare: [],
    selectedUserName: '',
    selectedUserEmail: '',
    selectedUserExtn: '',
    selectedUserPhone: '',
    selectedUserDepartment: '',
    selectedUserMsg: '',
    selectedUserJobTitle: '',
    selectedUserIsAnonymous: '',
    selectedUserBusinessUnit: '',
    showSuccessMsg: false,
    showErrorEmailMsg: false,
    showErrorExtnMsg: false,
    showErrorPhoneMsg: false,
    showErrorMessage: false,
    showErrorDepartment: false,
    showErrorJobTitle: false,
    validationText: '',
    };
  }
  public async componentDidMount(): Promise<void> {
		await this.getICareDetailsItems();
    await this.getICareItems();
    await this.getUserProfile();
    await this.getExtensionItem();
    await this.getBusinessItem();
	}
  private async getExtensionItem(): Promise<void> {
    sp.web.lists.getByTitle(LIST_ICARE_EXTENSION).items.get().then((items: ICareExtension[]) => {
      const iCareExtension = items && items.length > 0 ? items[0] : NULL_ICARE_EXTENSION_ITEM;
      this.setState({
        iCareExtension: items,
        selectedUserExtn: items[0]?.ID?.toString()
      });
    });
  }
  private async getBusinessItem(): Promise<void> {
    sp.web.lists.getByTitle(LIST_ICARE_BUSINESS).items.get().then((items: ICareBusiness[]) => {
      const iCareBusiness = items && items.length > 0 ? items[0] : NULL_ICARE_BUSINESS_ITEM;
      this.setState({
        iCareBusiness: items,
        selectedUserBusinessUnit: items[0]?.ID?.toString()
      });
    });
  }
  private async getICareDetailsItems(): Promise<void> {

		const listName = LIST_ICARE_DETAILS;
		sp.web.lists.getByTitle(listName).items.select('ID,Title,Description,Logo,TitleDescription,BottomDetails')
			.getAll().then((items: ICareDetails[]) => {
				//const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
				//console.log(resp.length);
				const item = items && items.length > 0 ? items[0] : NULL_ICARE_DETAILS_ITEM;
				this.setState({
					iCareDetails: item
				});
			}).catch((error: any) => {
				console.log('error in fetching career items', error);
			})
		//this.paging();
	}
  private async getICareItems(): Promise<void> {

    sp.web.lists.getByTitle(LIST_ICARE).items.get().then((items: ICare[]) => {
      const iCare = items && items.length > 0 ? items[0] : NULL_ICARE_ITEM;
      this.setState({
        iCare: items
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
  private getImageUrl(imageContent: string) {
    if (!imageContent) {
      return;
    }
    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;

  }

  public render(): React.ReactElement<IAgiIntranetICareProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    const iCareDetailsInfo = this.state.iCareDetails;
    
    return (
      <div className="main-content contact-us-wrapper iCare-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <div className="contact-section-main">
            <div className="row mb-4">
              <div className="col-md-5 col-lg-3">
                <img className="img-responsive" src={this.getImageUrl(iCareDetailsInfo.Logo)}/>
              </div>
              <div className="col-md-7 col-lg-9">
                <h4 className="pt-3">{iCareDetailsInfo.Title}</h4>
                <p>{iCareDetailsInfo.TitleDescription}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 contact-talk-to-us-section">
                <p>{ReactHtmlParser(iCareDetailsInfo.Description ? iCareDetailsInfo.Description : "")}</p>
              </div>
            </div>
  
  
  
            <div className="row contact-section-form iCare-section-form">
              <form action="" className="contact-form mt-4">
                <div className="row">
                  <div className="col-12">
                    <label className="container-check">Post your message anonymously
                      <input type="checkbox" id="anonymousCheck" checked={this.state.iCareIsAnonymous} onChange={(e) => this.handleIsAnonymousChange(e)} />
                      <span className="checkmark"></span>
                      </label>  
                  </div>
                  <div className="mb-4 col-md-6">
                    <label htmlFor="contactFormName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="contactFormName" disabled value={this.state.selectedUserName} onChange={(e) => this.handleNameChange(e)} />
                  </div>
  
                  <div className="mb-4 col-md-6">
                    <label htmlFor="contactFormEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="contactFormEmail" disabled value={this.state.selectedUserEmail} onChange={(e) => this.handleEmailChange(e)} />
                    <p id="emailErrorMsg" className="errorMsgClass" style={{ display: this.state.showErrorEmailMsg ? "block" : "none" }}>Email id is not valid</p>
                  </div>
  
                  <div className="mb-4 col-md-6">
                    <label htmlFor="contactFormName" className="form-label">Department</label>
                    <input type="text" className="form-control" id="contactFormDepartment" value={this.state.selectedUserDepartment} onChange={(e) => this.handleDepartmentChange(e)} />
                    <p id="errorDepartment" className="errorMsgClass" style={{ display: this.state.showErrorDepartment ? "block" : "none" }}>Department is required</p>
                  </div>
  
                  <div className="mb-4 col-md-6">
                    <label htmlFor="contactFormEmail" className="form-label">Job Title</label>
                    <input type="text" className="form-control" id="contactFormJobTitle" value={this.state.selectedUserJobTitle} onChange={(e) => this.handleJobTitleChange(e)} />
                    <p id="errorJobTitle" className="errorMsgClass" style={{ display: this.state.showErrorJobTitle ? "block" : "none" }}>Job Title is required</p>
                  </div>
  
                  <div className="mb-4 col-md-6">
                    <label htmlFor="contactFormSubject" className="form-label">Business Unit</label>
                    <select className="form-select form-control" value={this.state.selectedUserBusinessUnit} onChange={(e) => this.handleBusinessUnitChange(e)}>
                      {
                          this.state.iCareBusiness.map((iCareBusiness : ICareBusiness)=>{
                            return <option value={iCareBusiness.ID}>{iCareBusiness.Title}</option>
                          })
                      }
                    
                    </select>
                  </div>
                  <div className="mb-4 col-md-6">
                    <label htmlFor="contactFormPhone" className="form-label">Phone</label>
                    <div className="d-flex">
                      <div className="col-6 col-md-3">
                        <select className="form-select" value={this.state.selectedUserExtn} onChange={(e) => this.handleExtnChange(e)}>
                        {
                          this.state.iCareExtension.map((iCareExtension : ICareExtension)=>{
                            return <option value={iCareExtension.ID}>{iCareExtension.Title}</option>
                          })
                      }
                        </select>
                      </div>
                      <div className="flex-grow flex-grow-1 ms-3">
                      <input type='number' className="form-control" id="contactFormPhone" value={this.state.selectedUserPhone} onChange={(e) => this.handlePhoneChange(e)} onDrop={(e) => this.returnFalse(e)} onPaste={(e) => this.returnFalse(e)} />
                      <p id="phoneErrorMsg" className="errorMsgClass" style={{ display: this.state.showErrorPhoneMsg ? "block" : "none" }}>Phone Number is not valid</p>
                      </div>
                    </div>
                  </div>
  
                  <div className="mb-4 col-md-12 msgBox">
                    <label htmlFor="contactFormMessage" className="form-label">Submit</label>
                    <textarea className="form-control" placeholder="Write your message...." id="contactFormMessage" rows={4} value={this.state.selectedUserMsg} onChange={(e) => this.handleMsgChange(e)}></textarea>
                    <p id="errorMessage" className="errorMsgClass" style={{ display: this.state.showErrorMessage ? "block" : "none" }}>Message is required</p>
                  </div>
  
  
                  <div className="btn-wrap">
                    <input type="button" value="Send Message" className="btn btn-gradient btn-lg btn-hover btn-view-more mt-3" onClick={(e) => this.checkIsAnonymousChange()} />
                    <input type="button" value="Close" className="btn btn-gradient btn-lg btn-hover btn-view-more mt-3 close-btn ms-3"/>
                     
                  </div>
                </div>
              </form>
  
            </div>
  
  
  
  
  
            <div className="row">
              <p className="text-center">{iCareDetailsInfo.BottomDetails}</p>
            </div>
  
  
          </div>
        </div>
      </div>
      <div style={{ display: this.state.showSuccessMsg ? 'block' : 'none' }}>
          {this.renderSuccessForm()}
        </div>
    </div>
          );
  }
  private returnFalse(event: React.DragEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>) {
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
  private handleDepartmentChange(e: any) {
    const Dp = e.target.value;
    this.setState({
      selectedUserDepartment: Dp
    });
  }
  private handleBusinessUnitChange(e: any) {
    const Bu = e.target.value;
    this.setState({
      selectedUserBusinessUnit: Bu
    });
  }
  private handleJobTitleChange(e: any) {
    const Jt = e.target.value;
    this.setState({
      selectedUserJobTitle: Jt
    });
  }
  private handleMsgChange(e: any) {
    const Msg = e.target.value;
    this.setState({
      selectedUserMsg: Msg
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
  private handleIsAnonymousChange(e: any) {debugger;
    const Ia = e.target.checked;
    this.setState({
      iCareIsAnonymous: Ia
    });
    
  }
  private checkIsAnonymousChange() {debugger;
    const Iac = this.state.iCareIsAnonymous;
    if(Iac == true){
      const IsAnonymousForm = this.validateAnonymousForm();
    }
    else{
      const isFormValid = this.handleRegister();
    }
    
  }
  private validateAnonymousForm(){
    const isFormValid = this.validateFormforAnonymous();
    if (!isFormValid) {
      return false;
    }

    const body = {
      BusinessId: this.state.selectedUserBusinessUnit,
      Message: this.state.selectedUserMsg,
      IsAnonymous: this.state.iCareIsAnonymous
    }

    //const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${LIST_REGISTRATION}')/items`;

    sp.web.lists.getByTitle(LIST_ICARE).items.add(body).then((data) => {
      console.log('registration completed');
      this.setState({
        showSuccessMsg: true
      });
      this.successResetForm();
    }).catch((error) => {
      console.log('Registration failed', error);
    });
  }
  private handleRegister() {
    debugger;
    
    const isFormValid = this.validateForm();
    if (!isFormValid) {
      return false;
    }

    const body = {

      Title: this.state.selectedUserName,
      Email: this.state.selectedUserEmail,
      ExtensionId: this.state.selectedUserExtn,
      Number: this.state.selectedUserPhone,
      JobTitle: this.state.selectedUserJobTitle,
      Department: this.state.selectedUserDepartment,
      BusinessId: this.state.selectedUserBusinessUnit,
      Message: this.state.selectedUserMsg,
      IsAnonymous: this.state.iCareIsAnonymous
    }

    //const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${LIST_REGISTRATION}')/items`;

    sp.web.lists.getByTitle(LIST_ICARE).items.add(body).then((data) => {
      console.log('registration completed');
      this.setState({
        showSuccessMsg: true
      });
      this.successResetForm();
    }).catch((error) => {
      console.log('Registration failed', error);
    });

  }
  private validateFormforAnonymous(): boolean{
    let isValid = false;

    let errors = [];
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
    isValid = isMsgValid ;
    if (!isValid) {
      const _error = errors.length > 1 ? 'Mandatory fields' : 'Mandatory field'
      const error = `${_error}: ${errors.join(', ')}`;
      this.setState({
        validationText: error
      });
    }
    return isValid;
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
    let isDeptValid: boolean = true;
    if (!this.state.selectedUserDepartment.trim().length) {
      errors.push('Department');
      isDeptValid = false;
      this.setState({
        showErrorDepartment: true
      })
    }
    else {
      this.setState({
        showErrorDepartment: false
      })
    }
    let isJobTitleValid: boolean = true;
    if (!this.state.selectedUserJobTitle.trim().length) {
      errors.push('Job Title');
      isJobTitleValid = false;
      this.setState({
        showErrorJobTitle: true
      })
    }
    else {
      this.setState({
        showErrorJobTitle: false
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
    debugger
    isValid = isPhoneValid && isMsgValid && isDeptValid && isJobTitleValid;
    if (!isValid) {
      const _error = errors.length > 1 ? 'Mandatory fields' : 'Mandatory field'
      const error = `${_error}: ${errors.join(', ')}`;
      this.setState({
        validationText: error
      });
    }
    return isValid;
  }
  private validateEmail(email: { split: (arg0: string) => { (): any; new(): any; filter: { (arg0: (x: any) => boolean): { (): any; new(): any; length: number; }; new(): any; }; }; indexOf: (arg0: string) => number; }) {

    const errorsNew = [];

    if (email.split("").filter((x: string) => x === "@").length !== 1) {
      errorsNew.push("Email should contain '@' ");
    }
    if (email.indexOf(".") === -1) {
      errorsNew.push("Email should contain '.'");
    }

    return errorsNew;
  }


  private validatePhone(phone: string | any[]) {
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
      selectedUserBusinessUnit: '',
      selectedUserJobTitle: '',
      selectedUserDepartment: '',
      selectedUserMsg: ''
    });
  }

  private successResetForm() {
    this.setState({
      selectedUserExtn: '',
      selectedUserPhone: '',
      selectedUserBusinessUnit: '',
      selectedUserJobTitle: '',
      selectedUserDepartment: '',
      selectedUserMsg: ''
    });
  }

  private handleCloseSuccessForm(e: any) {
    this.successResetForm();
    this.setState({
      showSuccessMsg: false
    });
    window.location.reload();
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
}
function phone(phone: any, email: any): any {
  throw new Error('Function not implemented.');
}

function email(phone: (phone: any, email: any) => any, email: any): any {
  throw new Error('Function not implemented.');
}
