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
          <div className="content-wrapper">
            <div className="privacy-terms-section">
              <div className="container terms-privacy-wrapper">
                <div className="row">
                  <div className="content-sec pt-3">
                    <ErrorBoundary>
                      <PolicyDetail {...this.props} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
