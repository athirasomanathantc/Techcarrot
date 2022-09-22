import * as React from "react";
import styles from './IntranetChatbox.module.scss';
import { IIntranetChatboxProps } from "./IntranetChatboxProps";
import { IIntranetChatboxState } from "./IntranetChatboxState";
import { INavigationItem } from "../../models/INavigationItem";
import SPService from "../../services/spservice";
import { ASSET_LIBRARY, CONFIG_LIST, NAVIGATION_LIST, SOCIALLINK_LIST, TEXT_BUSINESS, TEXT_COMPANY, TEXT_GALLERY, TEXT_NEWSMISC, TEXT_OTHER } from "../../common/constants";
import { FontIcon, Icon, Modal, IconButton, IIconProps } from 'office-ui-fabric-react';
import { sp } from '@pnp/sp/presets/all';



export default class IntranetChatbox extends React.Component<IIntranetChatboxProps, IIntranetChatboxState> {

  constructor(props: IIntranetChatboxProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      FullName: "",
      Email: "",
      Feedback: "",
      enable:false,
      showErrorEmailMsg:false,
      showSuccessMsg:false,
      

    }
  }

  public async componentDidMount(): Promise<void> {
    this.getUserDetails();
  }





  private async getUserDetails(): Promise<void> {
    //debugger;
    const userPrincipalName = this.props.context.pageContext.legacyPageContext.userLoginName;
    let loginName = `i:0#.f|membership|${userPrincipalName}`;
    sp.web.currentUser.get().then((userData) => {
      //console.log('userdeail', data);
      this.setState({
        FullName: userData.Title,
        Email: userData.Email
      });
    });
  }
  private toggleclassName() {
    this.setState({
      enable:true

    })
  }
  private removeClass() {
    this.setState({
      enable:false

    })
  }
  private handleEmailChange(e: any) {
    const Em = e.target.value;
    this.setState({
      Email: Em
    });
  }
  private handleNameChange(e: any) {
    const Nm = e.target.value;
    this.setState({
      FullName: Nm
    });
  }
  private handleMsgChange(e: any) {
    const Msg = e.target.value;
    this.setState({
      Feedback: Msg
    });
  }
  private successResetForm() {
    this.setState({
      enable:false,
      Feedback:"",
      showErrorEmailMsg:false,
      showSuccessMsg:false
    });
  }

  private handleRegister(e:any) {
    debugger;
    e.preventDefault();

    // const isErrors= this.validate(phone, email);

    // if(!isErrors) {
    //   return false;
    // }

  //  const isFormValid = this.validateForm();

    // if (!isFormValid) {
    //   return false;
    // }

    const body = {

      Title: this.state.FullName,
      Email: this.state.Email,
      Feedback: this.state.Feedback,
    }

    //const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${LIST_REGISTRATION}')/items`;

    sp.web.lists.getByTitle('Feedback').items.add(body).then((data) => {
      console.log('Feedback completed');
      this.setState({
        showSuccessMsg: true
      });
      this.successResetForm();
    }).catch((error) => {
      console.log('Feedback Submitted', error);
    });
  }

  public render(): React.ReactElement<IIntranetChatboxProps> {
    return (<>
      <div className="chatbox-wrapper">
        <div className="chat-toggler">
          <button  onClick={this.state.enable?() => {this.removeClass() }:() => {this.toggleclassName() }}><i><img src={`${this.props.siteUrl}/Assets/icons/Chat_feedback.svg`}  /></i></button>
        </div>
        <div className={`${this.state.enable ?'chatbox showChatBox':'chatbox'}`} id="chatBox">
          <div className="close-btn">
            <button type="button" onClick={() => {this.removeClass() }} className="btn btn-primary"><i><img src={`${this.props.siteUrl}/Assets/icons/icon-close.svg`}  alt="" /></i></button>
          </div>
          <div className="chatbox-header">
            <h4>Send us your feedback</h4>
            <p>Do you have a suggestion or found some bug? let us know in the field bellow.</p>
          </div>
          <div className="chatbox-body">
            <form action="">
              <div>
                <input type="text" name="" id="contactFormName" className="form-control" disabled value={this.state.FullName} onChange={(e) => this.handleNameChange(e)} />
              </div>
              <div>
              <input type="email" className="form-control" disabled id="contactFormEmail" value={this.state.Email} onChange={(e) => this.handleEmailChange(e)} />
                        <p id="emailErrorMsg" className="errorMsgClass" style={{ display: this.state.showErrorEmailMsg ? "block" : "none" }}>Email id is not valid</p>
              </div>
              <div>
                <textarea name="" id="contactFormMessage" cols={30} className="form-control" rows={10} placeholder="Write your feedback here" value={this.state.Feedback} onChange={(e) => this.handleMsgChange(e)}></textarea>
              </div>
              <div>
                <button type="submit" className="btn btn-primary" onClick={(e) => this.handleRegister(e)}>Send Feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>);

  }
}