import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface IRewardsComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[];
}