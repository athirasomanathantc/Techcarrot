import * as React from 'react';
import styles from './AgiIntranetCompanyPolicy.module.scss';
import { IAgiIntranetCompanyPolicyProps } from './IAgiIntranetCompanyPolicyProps';
import { LeftNavigation } from './LeftNavigation/LeftNavigation';
import { SearchBox } from './SearchBar/SearchBox';
import { Policies } from './Policies/Policies';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import { sp } from '@pnp/sp/presets/all';
import { IPolicy } from '../models/IPolicy';

interface IAgiIntranetCompanyPolicyState {
  policyType: string;
  policies: IPolicy[];
  filteredPolicies: IPolicy[];
  keyword: string;
}

export default class AgiIntranetCompanyPolicy extends React.Component<IAgiIntranetCompanyPolicyProps, IAgiIntranetCompanyPolicyState> {
  constructor(props: IAgiIntranetCompanyPolicyProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      policyType: 'General Policies',
      policies: [],
      filteredPolicies: [],
      keyword: ''
    }
  }

  private showPolicies(e: React.MouseEvent<HTMLLIElement, MouseEvent>, policyType: string): void {
    this.setState({
      policyType
    })
  }
  private getQueryStringValue(param:string):string{
    const params= new URLSearchParams(window.location.search);
    let value=params.get(param) || '';
    return value;
  }
  public async componentDidMount(): Promise<void> {
    const policyType = this.getQueryStringValue('Policy');
    
    if(policyType==''){
      
    }
    else{
      this.setState({
        policyType:policyType,
        
      },()=>{
        console.log('policy type',this.state.policyType);

      });

    }
    
  }

  private showFilteredPolicies(filteredPolicies: IPolicy[]): void {
    this.setState({
      filteredPolicies
    })
  }

  private setPolicies(policies: IPolicy[]): void {
    this.setState({
      policies,
      filteredPolicies: policies
    })
  }

  private setKeyword(keyword: string): void {
    this.setState({
      keyword
    })
  }

  public render(): React.ReactElement<IAgiIntranetCompanyPolicyProps> {
    const {
      hasTeamsContext
    } = this.props;

    return (
      <section className={`${styles.agiIntranetCompanyPolicy} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className="main-content policy-section">
          <div className="content-wrapper">
            <div className="page-content-section">
              <div className="container">
                <div className="row mb-5">
                  <ErrorBoundary>
                    <LeftNavigation policyType={this.state.policyType} showPolicies={(e: React.MouseEvent<HTMLLIElement, MouseEvent>, policyType: string) => this.showPolicies(e, policyType)} />
                  </ErrorBoundary>
                  <div className="content-section col-lg-9">
                    <ErrorBoundary>
                      <SearchBox siteUrl={this.props.context.pageContext.web.absoluteUrl} keyword={this.state.keyword} setKeyword={(keyword: string) => this.setKeyword(keyword)} />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Policies siteUrl={this.props.context.pageContext.web.absoluteUrl} setPolicies={(policies: []) => this.setPolicies(policies)} policies={this.state.filteredPolicies} policyType={this.state.policyType} keyword={this.state.keyword} />
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
