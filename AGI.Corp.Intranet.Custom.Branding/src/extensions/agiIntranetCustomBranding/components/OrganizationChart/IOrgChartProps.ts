

import { IPropertyFieldGroupOrPerson } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
export interface IOrgChartProps {
  context: any;
  startFromUser: IPropertyFieldGroupOrPerson[];
  showManagers: string;
  showActionsBar: boolean;
}
