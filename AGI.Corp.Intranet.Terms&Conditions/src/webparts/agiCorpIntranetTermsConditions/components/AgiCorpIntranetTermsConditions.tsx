import * as React from 'react';
import styles from './AgiCorpIntranetTermsConditions.module.scss';
import { IAgiCorpIntranetTermsConditionsProps } from './IAgiCorpIntranetTermsConditionsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAgiCorpIntranetTermsAndConditionsState } from './IAgiCorpIntranetTermsConditionsState';
import { ITermsAndConditions } from '../Model/ITermsAndConditions';
import { sp } from '@pnp/sp/presets/all';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


export default class AgiCorpIntranetTermsConditions extends React.Component<IAgiCorpIntranetTermsConditionsProps, IAgiCorpIntranetTermsAndConditionsState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      content: []
    }

  }
  public async componentDidMount(): Promise<void> {
    this.getTC();
  }
  public async getTC(): Promise<void> {
    const listName = 'TermsAndConditions';
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
  public render(): React.ReactElement<IAgiCorpIntranetTermsConditionsProps> {

    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="privacy-terms-section">
            <div className="container .terms-privacy-wrappet">
              <div className="row">
                {
                  this.state.content.map((item) => {
                    return (
                      item ?
                        <div className="content-sec pt-3">
                          
                          {ReactHtmlParser(item.Summary) || ""}
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
