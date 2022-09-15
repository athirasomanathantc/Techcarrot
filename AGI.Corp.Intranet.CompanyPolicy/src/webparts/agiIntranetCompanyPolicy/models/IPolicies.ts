import { IPolicy } from "./IPolicy";

export interface IPolicies {
    keyword: string;
    siteUrl: string;
    policyType: string;
    policies: IPolicy[];
    setPolicies: (arg0: IPolicy[]) => void
}