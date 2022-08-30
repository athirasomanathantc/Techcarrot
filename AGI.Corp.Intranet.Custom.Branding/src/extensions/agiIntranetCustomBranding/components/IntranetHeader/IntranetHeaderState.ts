import { INavigationItem } from "../../models/INavigationItem";
import { ISocialLink } from "../../models/ISocialLinkItem";

export interface IIntranetHeaderState {
    navigationItems: INavigationItem[];
    socialLinks: ISocialLink[];
    //breadCrumbVal: string;
    selectedSearchVal: string;
    firstName: string;
    lastName: string;
    userName: string;
    emailID: string;
    domainName: string;
    userId: number;
    profileName: string;
    profilePicture: string;
    showMobileMenu: boolean;
    logoURL: string;
    notificationsURL: string;
}