import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface IAnnouncementComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[];
}