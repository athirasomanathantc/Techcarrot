import * as React from 'react';
import styles from './AgiIntranetCompanyPolicyDetails.module.scss';
import { IAgiIntranetCompanyPolicyDetailsProps } from './IAgiIntranetCompanyPolicyDetailsProps';
import { PolicyDetail } from './PolicyDetail/PolicyDetail';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { sp } from '@pnp/sp/presets/all';

export default class AgiIntranetCompanyPolicyDetails extends React.Component<IAgiIntranetCompanyPolicyDetailsProps, {}> {
  constructor(props: IAgiIntranetCompanyPolicyDetailsProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
  }

  public render(): React.ReactElement<IAgiIntranetCompanyPolicyDetailsProps> {
    const {
      hasTeamsContext
    } = this.props;

    return (
      <section className={`${styles.agiIntranetCompanyPolicyDetails} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className="main-content">
          <ErrorBoundary>
            <PolicyDetail {...this.props} />
          </ErrorBoundary>
        </div>
      </section>
    );
  }
}
