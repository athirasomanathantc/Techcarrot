import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface ISnapShareComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[]
}