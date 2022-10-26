import * as React from "react";
import styles from './LastLogin.module.scss';
import { LastLoginProps } from "../LastLogin/LastLoginProps";
import { LastLoginState } from "../LastLogin/LastLoginState";
import { INavigationItem } from "../../models/INavigationItem";
import SPService from "../../services/spservice";
import { ASSET_LIBRARY, CONFIG_LIST, EMPLOYEE_LAST_LOGIN, NAVIGATION_LIST, NULL_EMPLOYEE_LAST_LOGIN, SOCIALLINK_LIST, TEXT_BUSINESS, TEXT_COMPANY, TEXT_FIRST_LOGIN, TEXT_GALLERY, TEXT_LAST_LOGIN, TEXT_NEWSMISC, TEXT_OTHER } from "../../common/constants";
import { FontIcon, Icon, Modal, IconButton, IIconProps } from 'office-ui-fabric-react';
import { sp } from '@pnp/sp/presets/all';
import { ILastLoginItem } from "../../models/ILastLoginItem";
import * as moment from 'moment';
import { IConfigItem } from "../../models/IConfigItem";

export default class LastLogin extends React.Component<LastLoginProps, LastLoginState> {

  constructor(props: LastLoginProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      FullName: "",
      Email: "",
      Feedback: "",
      enable: false,
      showErrorEmailMsg: false,
      showSuccessMsg: false,
      feedbackError: false,
      userData: NULL_EMPLOYEE_LAST_LOGIN,
      loginVal: "",
      configDetails: [],
      successMsg: "",
      btnValue: "",
      isChecked: false
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.getUserDetails();
    await this.checkUserData();
    await this.getConfigDetails();
    await this.updateUserData();
  }

  private async getUserDetails(): Promise<void> {
    const userPrincipalName = await this.props.context.pageContext.legacyPageContext.userLoginName;
    await sp.web.currentUser.get().then((userData) => {
      this.setState({
        FullName: userData.Title,
        Email: userData.Email
      });
    });
  }

  private async checkUserData(): Promise<void> {
    await sp.web.lists.getByTitle(EMPLOYEE_LAST_LOGIN).items.filter(`Title eq '${this.state.Email}'`).get().then((items: ILastLoginItem[]) => {
      const userData = items && items.length > 0 ? items[0] : NULL_EMPLOYEE_LAST_LOGIN;
      this.setState({
        userData
      });
    });
  }

  private async getConfigDetails(): Promise<void> {
    await sp.web.lists.getByTitle(CONFIG_LIST).items.get().then((items: IConfigItem[]) => {
      this.setState({
        configDetails: items
      });
    });
  }



  private async updateUserData(): Promise<void> {

    const _userData = this.state.userData;

    const _firstLoginDetail = this.state.configDetails.filter(item => item.Title == TEXT_FIRST_LOGIN);
    const _lastLoginDetail = this.state.configDetails.filter(item => item.Title == TEXT_LAST_LOGIN);

    let tempIntVal = _lastLoginDetail[0].Interval;
    var dateDiff = 0;
    var curDate = moment();
    var lastLoggedInDate = moment(this.state.userData.LastLogin, 'YYYY-MM-DD');

    if (curDate.isValid() && lastLoggedInDate.isValid()) {
      dateDiff = curDate.diff(lastLoggedInDate, 'days');
    }

    (_userData.Title.length == 0) ? this.setState({ //(dateDiff == 0) && 
      loginVal: _firstLoginDetail[0].Title,
      successMsg: _firstLoginDetail[0].Message,
      btnValue: _firstLoginDetail[0].Detail,
      showSuccessMsg: true
    }) : (dateDiff >= tempIntVal) ? this.setState({
      loginVal: _lastLoginDetail[0].Title,
      successMsg: _lastLoginDetail[0].Message,
      btnValue: _lastLoginDetail[0].Detail,
      //  showSuccessMsg: true
    }) : this.setState({
      loginVal: _lastLoginDetail[0].Title,
      btnValue: _lastLoginDetail[0].Detail,
      showSuccessMsg: false
    });
  }

  private async handleCloseSuccessForm(e: any) {
    const _userData = this.state.userData;

    const _firstLoginDetail = this.state.configDetails.filter(item => item.Title == TEXT_FIRST_LOGIN);
    const _lastLoginDetail = this.state.configDetails.filter(item => item.Title == TEXT_LAST_LOGIN);

    const list = await sp.web.lists.getByTitle(EMPLOYEE_LAST_LOGIN);

    this.state.loginVal == _firstLoginDetail[0].Title ? list.items.add({
      Title: this.state.Email,
      LastLogin: moment(new Date())//"2022-10-24T08:25:52Z"
    })
      :
      list.items.getById(_userData.ID).update({
        LastLogin: moment(new Date())//"2022-10-24T08:25:52Z"
      });

    this.setState({
      showSuccessMsg: false
    });
  }

  private handleCheckBox() {
    var isChecked = document.getElementById('chk-Agree') as HTMLInputElement;

    this.setState({
      isChecked: isChecked.checked
    })
  }

  private renderSuccessForm(): JSX.Element {
    return (
      <div className='successOverlay'>
        <div className='overlay'>
          <div className='msgContainer'>
            <div className='msgBox'>
              <div className='msgSuccess' dangerouslySetInnerHTML={{ __html: this.state.successMsg }}></div>
              <div className="btn-Agree">
                <input type="checkbox" id="chk-Agree" name="checkbox" className="me-2 custom-chkbox" value="0" onChange={() => this.handleCheckBox()} />
                <label htmlFor="demoCheckbox"> I agree to all Terms of Use.</label>
              </div>
              <div className="btn-Agree float-end">
                <input type="button" disabled={this.state.isChecked ? false : true} value={this.state.btnValue} className="btn btn-gradient btn-lg btn-hover btn-view-more mt-3" onClick={(e) => this.handleCloseSuccessForm(e)} /> {/* disabled={isChecked ? false : true}  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  public render(): React.ReactElement<LastLoginProps> {
    return (
      <div style={{ display: this.state.showSuccessMsg ? 'block' : 'none' }}>
        {this.renderSuccessForm()}
      </div>
    );
  }
}