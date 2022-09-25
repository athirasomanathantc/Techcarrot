import { IConfigItem } from "../../models/IConfigItem";
import { INavigationItem } from "../../models/INavigationItem";
import { ISocialLink } from "../../models/ISocialLinkItem";
import { ISubscribeItem } from "../../models/ISubscribeItem";

export interface IIntranetFooterState {
    navigationItems: INavigationItem[];
    socialLinks: ISocialLink[];
    configDetails: IConfigItem[];
    copyright: IConfigItem;
    selectedUserEmail: string;
    showSuccessMsg: boolean;
    showErrorEmailMsg: boolean;
    validationText: string;
    isSubscribed: boolean;
    subscribeItem: ISubscribeItem;
    footerLoaded: boolean;
}