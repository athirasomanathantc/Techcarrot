import { ITargetAudienceState } from "../../../common/TargetAudience";

export interface IAgiIntranetPublishState extends ITargetAudienceState {
    listName?: string;
    isFeatured: boolean;
}