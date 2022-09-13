import * as React from 'react';
import styles from './AgiIntranetCompanyPolicy.module.scss';
import { IAgiIntranetCompanyPolicyProps } from './IAgiIntranetCompanyPolicyProps';
import { LeftNavigation } from './LeftNavigation/LeftNavigation';
import { SearchBox } from './SearchBar/SearchBox';
import { Policies } from './Policies/Policies';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { sp } from '@pnp/sp/presets/all';

export default class AgiIntranetCompanyPolicy extends React.Component<IAgiIntranetCompanyPolicyProps, { policyType: string; policies: any, filteredPolicies: any }> {
  constructor(props: IAgiIntranetCompanyPolicyProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      policyType: 'General Policies',
      policies: [],
      filteredPolicies: []
    }
  }

  private showPolicies(e: React.MouseEvent<HTMLLIElement, MouseEvent>, policyType: string) {
    this.setState({
      policyType
    })
  }

  private showFilteredPolicies(filteredPolicies: []) {
    this.setState({
      filteredPolicies
    })
  }

  private setPolicies(policies: any) {
    this.setState({
      policies,
      filteredPolicies: policies
    })
  }

  public render(): React.ReactElement<IAgiIntranetCompanyPolicyProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.agiIntranetCompanyPolicy} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className="main-content policy-section">
          <div className="content-wrapper">
            <div className="page-content-section">
              <div className="container">
                <div className="row mb-5">
                  <ErrorBoundary>
                    <LeftNavigation showPolicies={(e: React.MouseEvent<HTMLLIElement, MouseEvent>, policyType: string) => this.showPolicies(e, policyType)}></LeftNavigation>
                  </ErrorBoundary>
                  <div className="content-section col-lg-9">
                    <ErrorBoundary>
                      <SearchBox policies={this.state.policies} showFilteredPolicies={(policies: []) => this.showFilteredPolicies(policies)}></SearchBox>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Policies setPolicies={(policies: []) => this.setPolicies(policies)} policies={this.state.filteredPolicies} policyType={this.state.policyType}></Policies>
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
