import * as React from 'react';
import styles from './Career.module.scss';
import { ICareerProps } from './ICareerProps';
import { ICareerInfo } from '../../Models/ICareerInfo';
import { IcareerDetail } from '../../Models/IcareerDetail';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICareerState } from './ICareerState';
import { sp } from '@pnp/sp/presets/all';
import ReactHtmlParser from 'react-html-parser';
import {
	SPHttpClient,
	SPHttpClientResponse
} from '@microsoft/sp-http'
import { LIST_CAREERS, LIST_CAREER_INFO, NULL_ITEM_CAREER_INFO } from '../common/constants';

const newsDetails: any = require('../images/news-detail-img.png')


export default class Career extends React.Component<ICareerProps, ICareerState> {

	constructor(props: ICareerProps) {
		super(props);
		sp.setup({
			spfxContext: this.props.context
		});
		this.state = {
			careerDetails: [],
			careerInfo: NULL_ITEM_CAREER_INFO
		};

	}
	public async componentDidMount(): Promise<void> {
		await this.getCareerInfoItems();
		await this.getCareerItems();
	}

	private async getCareerInfoItems(): Promise<void> {

		const listName = LIST_CAREER_INFO;
		sp.web.lists.getByTitle(listName).items.select('ID,Title,Content1,Content2,Content2Title,Image,ContactInfo,test')
			.getAll().then((items: ICareerInfo[]) => {
				//const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
				//console.log(resp.length);
				const item = items && items.length > 0 ? items[0] : NULL_ITEM_CAREER_INFO;
				this.setState({
					careerInfo: item
				});
			}).catch((error) => {
				console.log('error in fetching career items', error);
			})
		//this.paging();
	}

	private async getCareerItems(): Promise<void> {

		const listName = LIST_CAREERS;
		sp.web.lists.getByTitle(listName).items.select('ID,Title,Description,Link,ButtonText,Image')
			.getAll().then((items: IcareerDetail[]) => {
				//const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
				//console.log(resp.length);
				this.setState({
					careerDetails: items
				});
			}).catch((error) => {
				console.log('error in fetching career items', error);
			})
		//this.paging();
	}

	private getImageUrl(imageContent: string) {

		if (!imageContent) {

			return;

		}

		const imageObj: any = JSON.parse(imageContent);

		return imageObj.serverUrl + imageObj.serverRelativeUrl;

	}

	public render(): React.ReactElement<ICareerProps> {
		const careerInfo = this.state.careerInfo;
		const imageSrc = this.getImageUrl(careerInfo.Image);

		return (
			<div className="main-content careers-wrapper">
				<div className="content-wrapper">
					<div className="container">
						<div className="section-wrapper">

							<><h1>{careerInfo.Title}</h1>
								<p>{ReactHtmlParser(careerInfo.Content1 ? careerInfo.Content1 : "")}</p></>


						
						<div className="row mb-5">
							<div className="side-by-side-section">
								<img alt="" src={imageSrc} className="pe-lg-4" />
								<div className='content2Title'>{ReactHtmlParser(careerInfo.Content2Title ? careerInfo.Content2Title : "")}</div>
								<div>{ReactHtmlParser(careerInfo.Content2 ? careerInfo.Content2 : "")}</div>
							</div>
						</div>
						<div className="job-openings">
							<div className="row justify-content-center">
								{

									this.state.careerDetails.map((careerDetail: IcareerDetail) => {
										const image = this.getImageUrl(careerDetail.Image);
										const link = careerDetail.Link ? careerDetail.Link.Url : '';
										return (
											<div className="col-md-6 col-lg-5 col-xl-3 mb-3 mb-md-0">
												<div className="card job-opening-card">
													<div className="card-img">
														<img alt="" src={image} className="card-img-top" />
													</div>
													<div className="card-body">
														<h5 className="card-title">{careerDetail.Title}</h5>
														<p className="card-text">{ReactHtmlParser(careerDetail.Description ? careerDetail.Description : "")}</p>
														<a href={link} target="_blank" className="btn btn-gradient">{careerDetail.ButtonText}</a>
													</div>
												</div>
											</div>
										)
									}
									)
								}


							</div>
						</div>
						<div className="row mt-5">
							<div className="col-md-12">

								<p className="text-center">{ReactHtmlParser(careerInfo.ContactInfo ? careerInfo.ContactInfo : "")}</p>
							</div>
						</div>
						</div>
					</div>
				</div>
			</div>
			

		);
	}
}


function renderCareerDetail() {
	throw new Error('Function not implemented.');
}

