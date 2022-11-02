import { IContactUsTalk2UsItem } from "../models/IContactUsTalk2UsItem";
import { IContactUsGoogleMapsItem } from "../models/IContactUsGoogleMapsItem";
import { IContactUsMainItem } from "../models/IContactUsMainItem";
import { IContactUsTitle } from "../models/IContactUSTitle";



export interface IAgiIntranetContactUsMainState {
   loading: boolean;
   items: any[];
   contactUsMainItems: IContactUsMainItem[];
   contactUsTalk2UsItems: IContactUsTalk2UsItem[];
   contactUsGoogleMapsItem: IContactUsGoogleMapsItem;
   contactUsTitle: IContactUsTitle[];
   talkToUsTitle: string;
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
   showErrorMessage: boolean;
   validationText: string;
   oddEven: boolean;
}