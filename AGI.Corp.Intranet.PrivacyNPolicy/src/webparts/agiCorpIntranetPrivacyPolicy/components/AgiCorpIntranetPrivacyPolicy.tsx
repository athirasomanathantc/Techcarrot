import * as React from 'react';
import styles from './AgiCorpIntranetPrivacyPolicy.module.scss';
import { IAgiCorpIntranetPrivacyPolicyProps } from './IAgiCorpIntranetPrivacyPolicyProps';
import { escape } from '@microsoft/sp-lodash-subset';
import{sp} from '@pnp/sp/presets/all';
import{IAgiCorpIntranetPrivacyAndPolicyState} from './IAgiCorpIntranetPrivacyPolicyState';
import{IPrivacyAndPolicy} from '../Model/IPrivacyAndPolicy';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
export default class AgiCorpIntranetPrivacyPolicy extends React.Component<IAgiCorpIntranetPrivacyPolicyProps,IAgiCorpIntranetPrivacyAndPolicyState> {
  constructor(props){
    super(props);
    sp.setup({
      spfxContext:this.props.context
    });
    this.state={
      content:[]
    };
    
  }
  public async componentDidMount(): Promise<void> {
    this.getPrivacy();
  }

  public async getPrivacy(): Promise<void>{
    const listName = 'PrivacyAndPolicy';
  sp.web.lists.getByTitle(listName).items.get()
    .then((resp) => {
      console.log('Values', resp);
      this.setState({
        content: resp
      }, () => {

      });
    })
    .catch((error) => {
      console.log('Error:', error);
    })

  console.log('entered getContent');
  }

  public render(): React.ReactElement<IAgiCorpIntranetPrivacyPolicyProps> {
   
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="privacy-terms-section">
            <div className="container terms-privacy-wrapper">
              <div className="row">
                {
                  this.state.content.map((item) => {
                    return (
                      item ?
                        <div className="content-sec pt-3">
                          
                          <h3>{item.Title}</h3>
                          <h5>{ReactHtmlParser(item.Summary) || ""}</h5>
                        </div>
                        :
                        <></>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}
