import { IContactUsTalk2UsItem } from "../models/IContactUsTalk2UsItem";
import { IContactUsGoogleMapsItem } from "../models/IContactUsGoogleMapsItem";
import { IContactUsMainItem } from "../models/IContactUsMainItem";



export interface IAgiIntranetHomeMainState {
   contactUsMainItems: IContactUsMainItem[];
   contactUsTalk2UsItems: IContactUsTalk2UsItem[];
   contactUsGoogleMapsItem: IContactUsGoogleMapsItem;
   selectedUserName: string;
   selectedUserEmail: string;
   selectedUserExtn: string;
   selectedUserPhone: string;
   selectedUserSubject: string;
   selectedUserMsg: string;
   showSuccessMsg: boolean;
   showErrorEmailMsg: boolean;
   showErrorExtnMsg: boolean;
   showErrorPhoneMsg: boolean;
   validationText: string;
}