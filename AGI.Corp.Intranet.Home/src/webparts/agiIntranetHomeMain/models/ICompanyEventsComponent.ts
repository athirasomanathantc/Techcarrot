import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface ICompanyEventsComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[];
}