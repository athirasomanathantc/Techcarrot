import * as React from "react";
import styles from './IntranetFooter.module.scss';
import { IIntranetFooterProps } from "./IntranetFooterProps";
import { IIntranetFooterState } from "./IntranetFooterState";
import SPService from "../../services/spservice";
import { escape } from '@microsoft/sp-lodash-subset';
import { Item, sp } from '@pnp/sp/presets/all';
import { ASSET_LIBRARY, BUSINESS_LIST, CONFIG_LIST, FUNCTION_LIST, LIST_SUBSCRIBE, NAVIGATION_LIST, NULL_COPYRIGHT_ITEM, NULL_SUBSCRIBE_ITEM, SOCIALLINK_LIST, TEXT_BUSINESS, TEXT_COMPANY, TEXT_FUNCTIONS, TEXT_GALLERY, TEXT_NEWSMISC, TEXT_OTHER, TEXT_REGISTRATION_SUCCESS } from "../../common/constants";
import { FontIcon, Icon, Modal, IconButton, IIconProps } from 'office-ui-fabric-react';
import { IConfigItem } from "../../models/IConfigItem";
import { INavigationItem } from "../../models/INavigationItem";
import { ISocialLink } from "../../models/ISocialLinkItem";
import { ISubscribeItem } from "../../models/ISubscribeItem";
import IntranetChatbox from "../Chatbox/IntranetChatbox";
import { IBusinessItem } from "../../models/IBusinessItem";
import { IFunctionItem } from "../../models";



export default class IntranetFooter extends React.Component<IIntranetFooterProps, IIntranetFooterState> {
    constructor(props: IIntranetFooterProps) {
        super(props);
        this.state = {
            subscribeItem: NULL_SUBSCRIBE_ITEM,
            navigationItems: [],
            businessItems: [],
            functionItems: [],
            socialLinks: [],
            configDetails: [],
            copyright: NULL_COPYRIGHT_ITEM,
            selectedUserEmail: '',
            showSuccessMsg: false,
            showErrorEmailMsg: false,
            validationText: '',
            isSubscribed: false,
            checkSubscription: false,
            showAllBusiness: false,
            showAllFunctions: false,
            footerLoaded: false,
            showMore: {
                company: false,
                business: false,
                functions: false,
                news: false,
                gallery: false,
                otherlinks: false,
                misclinks: false
            }
        }
    }

    public async componentDidMount(): Promise<void> {
        Promise.all([
            await this.getUserProfile(),
            await this.getSubscribedItem(),
            await this.getBusinessItems(),
            await this.getFunctionItems(),
            await this.getNavigationItems(),
            await this.getSocialLinkItems(),
            await this.getConfigDetailsItems()
        ]).then(() => {
            this.setState({
                footerLoaded: true
            })
        })
    }

    private async getNavigationItems(): Promise<void> {
        const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${NAVIGATION_LIST}')/items?$filter=(IsActive eq 1 and AvailableInFooter eq 1)`
        await SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
            //debugger; 
            const navigationItems: INavigationItem[] = data;
            this.setState({
                navigationItems
            });
        })
    }

    private async getBusinessItems(): Promise<void> {
        const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${BUSINESS_LIST}')/items`
        SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
            const businessItems: IBusinessItem[] = data;
            ////const showAllBusiness = businessItems.length > 4;
            this.setState({
                businessItems,
                // showAllBusiness
            });
        })
    }

    private async getFunctionItems(): Promise<void> {
        const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${FUNCTION_LIST}')/items`
        SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
            const functionItems: IFunctionItem[] = data;
            this.setState({
                functionItems,
            });
        })
    }

    private async getSocialLinkItems(): Promise<void> {
        const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${SOCIALLINK_LIST}')/items`
        await SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
            const socialLinks: ISocialLink[] = data;
            this.setState({
                socialLinks
            });
        })
    }

    private async getConfigDetailsItems(): Promise<void> {
        const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${CONFIG_LIST}')/items`
        await SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
            const _contactDetails: IConfigItem[] = data;
            const _copyright = _contactDetails.filter((c) => c.Title == 'Copyright');
            const copyright = _copyright && _copyright.length > 0 ? _copyright[0] : { Title: '', Detail: '' }
            this.setState({
                copyright
            });
        })
    }

    private async getSubscribedItem(): Promise<void> {//debugger;
        const userEmail = this.props.context.pageContext.legacyPageContext.userEmail;
        const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${LIST_SUBSCRIBE}')/items?$filter=Email eq '${userEmail}'`
        await SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
            const navigationItems: ISubscribeItem[] = data;

            if (navigationItems.length > 0) {
                console.log(navigationItems[0].Email);
                if (navigationItems[0].Email == userEmail) {
                    this.setState({
                        checkSubscription: true
                    });
                }
                console.log(this.state.checkSubscription);
            }

        })
    }



    private async getUserProfile(): Promise<void> {
        //let loginName="i:0#.f|membership|"+user.userPrincipalName;
        await sp.web.currentUser.get().then((userData) => {
            //console.log('userdeail', data);
            this.setState({
                selectedUserEmail: userData.Email
            });
        });
    }

    private getImageUrl(imageContent: string) {
        if (!imageContent) {
            return '';
        }
        const imageObj: any = JSON.parse(imageContent);
        return imageObj.serverUrl + imageObj.serverRelativeUrl;
    }

    private validateEmail(email) {

        const errorsNew = [];

        if (email.split("").filter(x => x === "@").length !== 1) {
            errorsNew.push("Email should contain '@' ");
        }
        if (email.indexOf(".") === -1) {
            errorsNew.push("Email should contain '.'");
        }

        if (!email.trim().length) {
            errorsNew.push("Email should not be empty");
        }

        else if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(email))) {
            errorsNew.push("You have entered an invalid email address!");
        }

        return errorsNew;
    }

    private validateEmailFormat(e) {
        //let input = document.getElementById("subscribeFormEmail").value;
        //let val = input.value.replace(/\s/g, "");
    }

    private handleEmailChange(e: any) {

        const Em = e.target.value;
        this.setState({
            selectedUserEmail: Em
        });
        console.log(Em);
    }

    private validateForm(): boolean {
        //console.log('validation');
        let isValid = false;

        let errors = [];

        let isEmailValid: boolean = true;
        if (!this.state.selectedUserEmail) {
            errors.push('Email');
            isEmailValid = false;
        }

        const emailErrorNew = this.validateEmail(this.state.selectedUserEmail);
        if (emailErrorNew.length > 0) {
            this.setState({
                showErrorEmailMsg: true
            });
            isEmailValid = false;
            // return;
        }
        else {
            this.setState({
                showErrorEmailMsg: false
            });
        }

        isValid = isEmailValid;
        if (!isValid) {
            const _error = errors.length > 1 ? 'Mandatory fields' : 'Mandatory field'
            const error = `${_error}: ${errors.join(', ')}`;
            this.setState({
                validationText: error
            });
        }
        return isValid;
    }

    private handleRegister() {

        //debugger;
        const isFormValid = this.validateForm();

        if (!isFormValid) {
            return false;
        }

        const body = {
            Email: this.state.selectedUserEmail
        }

        //const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${LIST_REGISTRATION}')/items`;

        sp.web.lists.getByTitle(LIST_SUBSCRIBE).items.add(body).then(() => {
            console.log('registration completed');
            this.setState({
                showSuccessMsg: true
            });
            // this.successResetForm();
        }).catch((error) => {
            console.log('Registration failed', error);
        });
    }

    private showMoreLess(section, more) {
        switch (section) {
            case 'company':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        company: more
                    }
                });
                break;
            case 'business':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        business: more
                    }
                });
                break;
            case 'functions':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        functions: more
                    }
                });
                break;
            case 'news':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        news: more
                    }
                });
                break;
            case 'gallery':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        gallery: more
                    }
                });
                break;
            case 'otherlinks':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        otherlinks: more
                    }
                });
                break;
            case 'misclinks':
                this.setState({
                    showMore: {
                        ...this.state.showMore,
                        misclinks: more
                    }
                });
                break;
            default:
                break
        }
    }

    private renderFooter(): JSX.Element {

        const companyContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_COMPANY);
        //const businessContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_BUSINESS);
        const newsMiscContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_NEWSMISC);
        const galleryContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_GALLERY);
        const otherContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_OTHER);

        const { businessItems, functionItems } = this.state;

        return (
            <>
                {this.state.footerLoaded && <footer className="">
                    <div className="footer-subscription" style={{ 'display': 'none' }}>
                        <div className="container text-center">
                            <div className="subscription-txt">Subscribe to our newsletter and never miss our latest news</div>
                            <div className="newsletter mt-3" style={{ display: this.state.checkSubscription ? 'none' : 'block' }}>
                                <form className="newsletter-form">
                                    <input type="text" placeholder="name@al-gurair.com" id="subscribeFormEmail" value={this.state.selectedUserEmail} onKeyPress={(e) => this.validateEmailFormat(e)} onChange={(e) => this.handleEmailChange(e)} />
                                    <p id="emailErrorMsg" className="errorMsgClass" style={{ display: this.state.showErrorEmailMsg ? "block" : "none" }}>Email id is not valid</p>
                                    <input type='button' className="btn btn-lg btn-gradient" value={'Subscribe'} onClick={() => this.handleRegister()} disabled={this.state.showSuccessMsg} />
                                    {/* <button type="submit" name="" className="btn btn-lg btn-gradient" onClick={(e) => this.handleRegister()}>Subscribe</button> */}
                                </form>
                            </div>
                            {this.state.showSuccessMsg && <p className="success" style={{ display: "block", color: "green", fontSize: "1rem", marginTop: "10px" }}>{TEXT_REGISTRATION_SUCCESS}</p>}
                            <div className="subscription-txt subscription-success" style={{ display: this.state.checkSubscription ? 'block' : 'none', color: "green", fontSize: "1rem", marginTop: "10px" }}>You have already subscribed to the Newsletter.</div>

                        </div>
                    </div>

                    <div className="site-footer">
                        <div className="container">
                            <div className="row top-footer">
                                <div className="col-md-2 mx-auto footer-col">
                                    <h5 className="my-2 font-weight-bold d-none d-md-block">{TEXT_COMPANY}</h5>
                                    <div className="d-md-none title" data-bs-toggle="collapse" data-bs-target="#Company">
                                        <div className="mt-3 font-weight-bold title-wrapper">{TEXT_COMPANY}
                                            <div className="float-right navbar-toggler">
                                                <svg xmlns="http:www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                                        <path id="Path_73662" data-name="Path 73662"
                                                            d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                                            transform="translate(100.366 20.883) rotate(180)" fill="none"
                                                            stroke="#dccede" stroke-width="1.5" />
                                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18"
                                                            transform="translate(84 7.544)" fill="none" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={`list-unstyled collapse ${this.state.showMore.company ? 'show-more' : 'show-less'}`} id="Company">
                                        {
                                            companyContentItems.map((comp) => {
                                                const link = comp.Link && comp.Link.Url ? comp.Link.Url : '';
                                                return (
                                                    <li>
                                                        <a href={`${link}?env=WebView`} data-interception="off">- {comp.Title}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        companyContentItems.length > 4 &&
                                        (this.state.showMore.company
                                            ? <div className="all" onClick={() => this.showMoreLess('company', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('company', true)}>+ Show All</div>)
                                    }
                                </div>


                                <div className="col-md-2 mx-auto footer-col">
                                    <h5 className="my-2 font-weight-bold d-none d-md-block">{TEXT_BUSINESS}</h5>
                                    <div className="d-md-none title" data-bs-toggle="collapse" data-bs-target="#Business">
                                        <div className="mt-3 font-weight-bold title-wrapper">{TEXT_BUSINESS}
                                            <div className="float-right navbar-toggler">
                                                <svg xmlns="http:www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                                        <path id="Path_73662" data-name="Path 73662"
                                                            d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                                            transform="translate(100.366 20.883) rotate(180)" fill="none"
                                                            stroke="#dccede" stroke-width="1.5" />
                                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18"
                                                            transform="translate(84 7.544)" fill="none" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={`list-unstyled collapse ${this.state.showMore.business ? 'show-more' : 'show-less business'}`} id="Business">
                                        {
                                            businessItems.map((bus) => {
                                                const link = `${this.props.siteUrl}/SitePages/Business.aspx?categoryId=${bus.ID}`;
                                                return (
                                                    <li>
                                                        <a href={`${link}&env=WebView`} data-interception="off">- {bus.Title}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        businessItems.length > 4 &&
                                        (this.state.showMore.business
                                            ? <div className="all" onClick={() => this.showMoreLess('business', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('business', true)}>+ Show All</div>)
                                    }
                                    {/** Functions */}
                                    <h5 className="mt-5 font-weight-bold d-none d-md-block">{TEXT_FUNCTIONS}</h5>
                                    <div className="d-md-none title" data-bs-toggle="collapse" data-bs-target="#Functions">
                                        <div className="mt-3 font-weight-bold title-wrapper">{TEXT_FUNCTIONS}
                                            <div className="float-right navbar-toggler">
                                                <svg xmlns="http:www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                                        <path id="Path_73662" data-name="Path 73662"
                                                            d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                                            transform="translate(100.366 20.883) rotate(180)" fill="none"
                                                            stroke="#dccede" stroke-width="1.5" />
                                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18"
                                                            transform="translate(84 7.544)" fill="none" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={`list-unstyled collapse ${this.state.showMore.functions ? 'show-more' : 'show-less functions'}`} id="Functions">
                                        {
                                            functionItems.map((func) => {
                                                const link = `${this.props.siteUrl}/SitePages/Functions.aspx?categoryId=${func.ID}`;
                                                return (
                                                    <li>
                                                        <a href={`${link}&env=WebView`} data-interception="off">- {func.Title}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        functionItems.length > 4 &&
                                        (this.state.showMore.functions
                                            ? <div className="all" onClick={() => this.showMoreLess('functions', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('functions', true)}>+ Show All</div>)
                                    }
                                </div>

                                <div className="col-md-2 mx-auto footer-col">
                                    <h5 className="my-2 font-weight-bold d-none d-md-block">{TEXT_NEWSMISC}</h5>
                                    <div className="d-md-none title" data-bs-target="#NewsMisc" data-bs-toggle="collapse">
                                        <div className="mt-3 font-weight-bold title-wrapper">{TEXT_NEWSMISC}
                                            <div className="float-right navbar-toggler">
                                                <svg xmlns="http:www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                                        <path id="Path_73662" data-name="Path 73662"
                                                            d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                                            transform="translate(100.366 20.883) rotate(180)" fill="none"
                                                            stroke="#dccede" stroke-width="1.5" />
                                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18"
                                                            transform="translate(84 7.544)" fill="none" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={`list-unstyled collapse ${this.state.showMore.news ? 'show-more' : 'show-less'}`} id="NewsMisc">
                                        {
                                            newsMiscContentItems.map((news) => {
                                                const link = news.Link && news.Link.Url ? news.Link.Url : '';
                                                return (
                                                    <li>
                                                        <a href={`${link}?env=WebView`} data-interception="off">- {news.Title}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        newsMiscContentItems.length > 4 &&
                                        (this.state.showMore.news
                                            ? <div className="all" onClick={() => this.showMoreLess('news', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('news', true)}>+ Show All</div>)
                                    }

                                    <h5 className="mt-5 font-weight-bold d-none d-md-block">{TEXT_GALLERY}</h5>
                                    <div className="d-md-none title" data-bs-target="#Gallery" data-bs-toggle="collapse">
                                        <div className="mt-3 font-weight-bold title-wrapper">{TEXT_GALLERY}
                                            <div className="float-right navbar-toggler">
                                                <svg xmlns="http:www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                                        <path id="Path_73662" data-name="Path 73662"
                                                            d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                                            transform="translate(100.366 20.883) rotate(180)" fill="none"
                                                            stroke="#dccede" stroke-width="1.5" />
                                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18"
                                                            transform="translate(84 7.544)" fill="none" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={`list-unstyled collapse ${this.state.showMore.gallery ? 'show-more' : 'show-less'}`} id="Gallery">
                                        {
                                            galleryContentItems.map((gallery) => {
                                                let link = gallery.Link && gallery.Link.Url ? gallery.Link.Url : '';
                                                link = link.toLowerCase().indexOf(this.props.siteUrl?.toLowerCase()) > -1 ? `${link}&env=WebView` : `link`;

                                                return (
                                                    <li>
                                                        <a href={`${link}`} data-interception="off">- {gallery.Title}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        galleryContentItems.length > 4 &&
                                        (this.state.showMore.gallery
                                            ? <div className="all" onClick={() => this.showMoreLess('gallery', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('gallery', true)}>+ Show All</div>)
                                    }
                                </div>
                                <div className="col-md-2 mx-auto footer-col">
                                    <h5 className="my-2 font-weight-bold d-none d-md-block">{TEXT_OTHER}</h5>
                                    <div className="d-md-none title" data-bs-target="#Other-Links" data-bs-toggle="collapse">
                                        <div className="mt-3 font-weight-bold title-wrapper">{TEXT_OTHER}
                                            <div className="float-right navbar-toggler">
                                                <svg xmlns="http:www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                                        <path id="Path_73662" data-name="Path 73662"
                                                            d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                                            transform="translate(100.366 20.883) rotate(180)" fill="none"
                                                            stroke="#dccede" stroke-width="1.5" />
                                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18"
                                                            transform="translate(84 7.544)" fill="none" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={`list-unstyled collapse ${this.state.showMore.otherlinks ? 'show-more' : 'show-less'}`} id="Other-Links">
                                        {
                                            otherContentItems.map((other) => {
                                                let link = other.Link && other.Link.Url ? other.Link.Url : '';
                                                link = link.toLowerCase().indexOf(this.props.siteUrl?.toLowerCase()) > -1 ? `${link}?env=WebView` : link;
                                                return (
                                                    <li>
                                                        <a href={`${link}`} data-interception="off">- {other.Title}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        otherContentItems.length > 4 &&
                                        (this.state.showMore.otherlinks
                                            ? <div className="all" onClick={() => this.showMoreLess('otherlinks', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('otherlinks', true)}>+ Show All</div>)
                                    }
                                </div>
                                <div className="col-md-2 mx-auto footer-col social-icon-footer">
                                    <ul className={`list-unstyled ${this.state.showMore.company ? 'show-more' : 'show-less social'}`} >
                                        {
                                            this.state.socialLinks.map((sl) => {
                                                const link = sl.Link && sl.Link.Url ? sl.Link.Url : '';
                                                const iconUrl = this.getImageUrl(sl.Icon);
                                                return (
                                                    <li>
                                                        <a href={link} target="_blank" data-interception="off">
                                                            <span>
                                                                <img src={iconUrl} alt="" className="me-2" />
                                                            </span>
                                                            {sl.Title}
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    {
                                        this.state.socialLinks.length > 4 &&
                                        (this.state.showMore.misclinks
                                            ? <div className="all" onClick={() => this.showMoreLess('misclinks', false)}>- Show Less</div>
                                            : <div className="all" onClick={() => this.showMoreLess('misclinks', true)}>+ Show All</div>)
                                    }
                                </div>
                            </div>

                            <div className="row text-center p-4 footer-bottom-copyright">
                                <div className="copyright"> {this.state.copyright.Title} {this.state.copyright.Detail}</div>
                            </div>
                        </div>
                    </div>
                    <IntranetChatbox siteUrl={this.props.siteUrl} context={this.props.context}></IntranetChatbox>
                </footer>}
            </>
        )
    }


    public render(): React.ReactElement<IIntranetFooterProps> {
        return (
            <div className={styles.intranetFooter}>
                {this.renderFooter()}
            </div>
        );
    }
}