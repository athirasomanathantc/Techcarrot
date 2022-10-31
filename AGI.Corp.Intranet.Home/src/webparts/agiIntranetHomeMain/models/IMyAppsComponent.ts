import { IAgiIntranetHomeMainProps } from "../components/IAgiIntranetHomeMainProps";
import { IConfigItem } from "./IConfigItem";

export interface IMyAppsComponent extends IAgiIntranetHomeMainProps {
    configItems: IConfigItem[];
}