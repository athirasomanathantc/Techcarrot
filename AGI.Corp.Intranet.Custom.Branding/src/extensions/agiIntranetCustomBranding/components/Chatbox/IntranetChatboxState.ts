import { IFeedbackDetails } from "../../models/IFeedbackDetails";
import { INavigationItem } from "../../models/INavigationItem";
import { ISocialLink } from "../../models/ISocialLinkItem";

export interface IIntranetChatboxState {

    FullName: string;
    Email: string;
    Feedback: string;
    enable: boolean;
    showErrorEmailMsg: boolean;
    showSuccessMsg: boolean;
    feedbackError: boolean;
    feedbackDetails: IFeedbackDetails;

}