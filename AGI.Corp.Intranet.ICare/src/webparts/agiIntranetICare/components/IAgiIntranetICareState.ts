import {ICareDetails} from "../Models/ICareDetails";
import { ICare } from "../Models/ICare";
import { ICareExtension } from "../Models/ICareExtension";
import { ICareBusiness } from "../Models/ICareBusiness";


export interface ICareState {
    iCareDetails: ICareDetails;
    items: any[];
    iCare: ICare[];
    iCareExtension: ICareExtension[];
    iCareBusiness: ICareBusiness[];
    selectedUserName: string;
    selectedUserEmail: string;
    selectedUserExtn: string;
    selectedUserPhone: string;
    selectedUserDepartment: string;
    selectedUserMsg: string;
    selectedUserJobTitle: string;
    selectedUserBusinessUnit: string;
    selectedUserIsAnonymous: string;
    showSuccessMsg: boolean;
    showErrorEmailMsg: boolean;
    showErrorExtnMsg: boolean;
    showErrorPhoneMsg: boolean;
    validationText: string;
}