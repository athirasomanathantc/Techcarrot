import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface IEmployeeSurveyComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[];
}