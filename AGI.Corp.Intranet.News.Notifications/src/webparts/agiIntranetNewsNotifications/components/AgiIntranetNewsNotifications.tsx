import * as React from 'react';
import { IAgiIntranetNewsNotificationsProps } from './IAgiIntranetNewsNotificationsProps';
import { IAgiIntranetNewsNotificationsState } from './IAgiIntranetNewsNotificationsState';
import SPService from '../services/SPService';
import ErrorBoundary from './exception/ErrorBoundary';
import Notification from './Notifications/Notification';

export default class AgiIntranetNewsNotifications extends React.Component<IAgiIntranetNewsNotificationsProps, IAgiIntranetNewsNotificationsState> {
  private _spServices: SPService;
  constructor(props: IAgiIntranetNewsNotificationsProps) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {

  }

  public render(): React.ReactElement<IAgiIntranetNewsNotificationsProps> {
    return (
      <div>
        <ErrorBoundary>
          <Notification context={this.props.context}></Notification>
        </ErrorBoundary>
      </div>
    );
  }
}
