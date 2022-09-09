import * as React from 'react';
import styles from './AgiCorpIntranetFaq.module.scss';
import { IAgiCorpIntranetFaqProps } from './IAgiCorpIntranetFaqProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAgiCorpIntranetFaqState } from './IAgiCorpIntranetFaqState';
import { IFaq} from '../Model/IFaq';
import { sp } from '@pnp/sp/presets/all';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export default class AgiCorpIntranetFaq extends React.Component<IAgiCorpIntranetFaqProps, IAgiCorpIntranetFaqState> {

  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state={
      faqItems:[]
    }

  }
  public async componentDidMount(): Promise<void> {
    this.getFaq();
  }

  public async getFaq(): Promise<void> {
    const listName = 'FAQs';
    sp.web.lists.getByTitle(listName).items.get()
      .then((resp) => {
        console.log('Values',resp);
        this.setState({
          faqItems: resp
        },()=>{
          
        });
      })
      .catch((error) => {
        console.log('Error:', error);
      })

      console.log('entered getFaq');

  }

  public render(): React.ReactElement<IAgiCorpIntranetFaqProps> {
    return (
      <div className={'main-content'}>
        <div className={'content-wrapper'}>
          <div className={'faq-section'}>
            <div className={'container faq-wrapper'}>
              <div className={'row'}>
                <div className={'header-title'}>
                  <h3>Frequently Asked Questions</h3>
                </div>
              </div>
              <div className={'row mt-4'}>
                <div className={'accordion accordion-flush'} id="faqlist">
                  {
                    this.state.faqItems.map((item) => {
                      return(
                      item.Category == 'Q&A' ?
                     
                        <div className={'accordion-item'}>
                          <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                              data-bs-target={`#faq-content-${item.ID}`}>
                              {item.Title}
                            </button>
                          </h2>
                          <div id={`faq-content-${item.ID}`} className="accordion-collapse collapse" data-bs-parent="#faqlist">
                            <div className="accordion-body">
                              <p> {ReactHtmlParser(item.Description)||""}</p>
                            </div>
                          </div>

                        </div>
                      
                        :
                        <></>
                      )

                    })


                  }
                </div>

              </div>
              <div className="row">
                <div className="questions">
                  {
                    this.state.faqItems.map((item) => {
                      return(
                      item.Category != 'Q&A' ?
                  <>
                  <h4>{item.Title}</h4>
                  {ReactHtmlParser(item.Description)||""}
                  <a href={`mailto:${item.Email}`}>{item.Email}</a>
                  </>
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
      </div>

    );
  }
}
