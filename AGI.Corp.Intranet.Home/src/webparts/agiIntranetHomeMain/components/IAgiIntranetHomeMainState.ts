import { IConfigItem } from "../models/IConfigItem";

export interface IAgiIntranetHomeMainState {
    hideLoader: boolean;
    configItems: IConfigItem[];
}