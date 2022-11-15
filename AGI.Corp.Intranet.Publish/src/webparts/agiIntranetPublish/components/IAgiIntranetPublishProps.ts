import { PageContext } from '@microsoft/sp-page-context';
import { ITargetAudienceProps } from '../../../common/TargetAudience';

export interface IAgiIntranetPublishProps extends ITargetAudienceProps {
  listName: string;
  itemId: string;
  pageContext: PageContext;
  context: any;
}
