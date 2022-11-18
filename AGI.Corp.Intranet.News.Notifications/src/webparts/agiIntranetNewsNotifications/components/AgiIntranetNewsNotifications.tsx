import * as React from 'react';
import { IAgiIntranetNewsNotificationsProps } from './IAgiIntranetNewsNotificationsProps';
import { IAgiIntranetNewsNotificationsState } from './IAgiIntranetNewsNotificationsState';
import SPService from '../services/SPService';
import ErrorBoundary from './exception/ErrorBoundary';
import Notification from './notifications/Notification';

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
          <Notification {...this.props}></Notification>
        </ErrorBoundary>
      </div>
    );
  }
}
