import * as React from 'react';
import styles from './AgiIntranetPublish.module.scss';
import { IAgiIntranetPublishProps } from './IAgiIntranetPublishProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TargetAudience from '../../../common/TargetAudience';
import { IAgiIntranetPublishState } from './IAgiIntranetPublishState';

export default class AgiIntranetPublish extends React.Component<IAgiIntranetPublishProps, IAgiIntranetPublishState> {
  constructor(props: IAgiIntranetPublishProps) {
    super(props);
    this.state = {
      description: this.props.description
    };
  }

  public render(): React.ReactElement<IAgiIntranetPublishProps> {
    return (
      <TargetAudience pageContext={this.props.pageContext} groupIds={this.props.groupIds}>
        <div className={styles.sampleTargetedComponent}>
          <div className={styles.container}>
            <a href="#" className={styles.button}>
              <span className={styles.label}>Mark as Featured</span>
            </a>
          </div>
        </div>
      </TargetAudience>
    );
  }
}
