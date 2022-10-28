import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface CompanyEvents extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[];
}