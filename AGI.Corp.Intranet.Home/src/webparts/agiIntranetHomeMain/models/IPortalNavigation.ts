import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface IPortalNavigation extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[]
}