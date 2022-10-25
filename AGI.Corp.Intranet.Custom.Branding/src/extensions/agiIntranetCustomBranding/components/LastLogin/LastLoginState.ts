import { INavigationItem } from "../../models/INavigationItem";
import { ISocialLink } from "../../models/ISocialLinkItem";
import { ILastLoginItem } from "../../models/ILastLoginItem";
import { IConfigItem } from "../../models/IConfigItem";

export interface LastLoginState {

    FullName: string;
    Email: string;
    Feedback: string;
    enable: boolean;
    showErrorEmailMsg: boolean;
    showSuccessMsg: boolean;
    feedbackError: boolean;
    userData: ILastLoginItem;
    loginVal: string;
    configDetails: IConfigItem[];
    successMsg: string;
    btnValue: string;
}