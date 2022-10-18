import * as React from 'react';
import { IAgiIntranetAskJohnProps } from './IAgiIntranetAskJohnProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAskJohnDetails } from "../../Models/IAskJohn";
import { sp } from '@pnp/sp/presets/all';
import {
	SPHttpClient,
	SPHttpClientResponse
} from '@microsoft/sp-http'
import { IAskJohnState } from './IAgiIntranetAskJohnState';
import { LIST_Ask_John, NULL_ITEM_ASK_JOHN } from '../../Common/constants';
import ReactHtmlParser from 'react-html-parser';


export default class AgiIntranetAskJohn extends React.Component<IAgiIntranetAskJohnProps, IAskJohnState> {
  constructor(props: IAgiIntranetAskJohnProps) {
		super(props);
		sp.setup({
			spfxContext: this.props.context
		});
		this.state = {
			askJohnDetails: NULL_ITEM_ASK_JOHN
		};

	}
	public async componentDidMount(): Promise<void> {
		await this.getAskJohnItems();
	}
  private async getAskJohnItems(): Promise<void> {

		const listName = LIST_Ask_John;
		sp.web.lists.getByTitle(listName).items.select('ID,Title,Description')
			.getAll().then((items: IAskJohnDetails[]) => {
				//const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
				//console.log(resp.length);
				const item = items && items.length > 0 ? items[0] : NULL_ITEM_ASK_JOHN;
				this.setState({
					askJohnDetails: item
				});
			}).catch((error: any) => {
				console.log('error in fetching career items', error);
			})
		//this.paging();
	}

  public render(): React.ReactElement<IAgiIntranetAskJohnProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    const askJohnInfo = this.state.askJohnDetails;

    return (
      <div className="main-content contact-us-wrapper">
		<div className="content-wrapper">
			<div className="container">
				<div className="contact-section-main">
					<div className="row">
						<h1>{askJohnInfo.Title}</h1>
						<p>{ReactHtmlParser(askJohnInfo.Description ? askJohnInfo.Description : "")}</p>
					</div>
				</div>
			</div>
		</div>

	</div>
         );
  }
}
