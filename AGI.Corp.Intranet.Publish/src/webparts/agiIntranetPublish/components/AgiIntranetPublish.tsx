import * as React from 'react';
import styles from './AgiIntranetPublish.module.scss';
import { IAgiIntranetPublishProps } from './IAgiIntranetPublishProps';
import TargetAudience from '../../../common/TargetAudience';
import { IAgiIntranetPublishState } from './IAgiIntranetPublishState';
import spservices from '../../../service/spservices';
import { sp } from '@pnp/sp';

let _sv = new spservices();

export default class AgiIntranetPublish extends React.Component<IAgiIntranetPublishProps, IAgiIntranetPublishState> {
  constructor(props: IAgiIntranetPublishProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      isFeatured: false
    }
  }

  async componentDidMount(): Promise<void> {
    await _sv.getFeatured(parseInt(_sv.getQueryStringValue(this.props.itemId)), this.props.listName)
      .then((isFeatured) => {
        this.setState({
          isFeatured
        });
      });
  }

  private async markFeatured(isFeatured: boolean): Promise<void> {
    const itemId: number = parseInt(_sv.getQueryStringValue(this.props.itemId));

    await _sv.markFeatured(itemId, this.props.listName, isFeatured, this.props.pageContext.legacyPageContext.userId)
      .then(() => {
        this.setState({
          isFeatured
        })
      })
  }

  public render(): React.ReactElement<IAgiIntranetPublishProps> {
    return (
      <TargetAudience pageContext={this.props.pageContext} groupIds={this.props.groupIds}>
        <div className={styles.sampleTargetedComponent}>
          <div className={styles.container}>
            <a href="#" className={styles.button} onClick={() => this.markFeatured(!this.state.isFeatured)}>
              <span className={styles.label}>{!this.state.isFeatured ? 'Mark as Featured' : 'Remove from Featured'}</span>
            </a>
          </div>
        </div>
      </TargetAudience>
    );
  }
}
