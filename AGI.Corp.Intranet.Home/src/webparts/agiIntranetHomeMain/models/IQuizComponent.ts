import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface IQuizComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[]
}