import * as moment from 'moment';
import * as React from 'react'
import { IBlogData } from '../../Model/IBlogData';

interface IBLogCard {
    siteUrl: string;
    imageUrl: string;
    item: IBlogData;
    category: string;
    isFeatured: boolean;
}

const BlogCard = (props: IBLogCard) => {
    const { siteUrl, imageUrl, item, category, isFeatured } = props;
    return (
        <div className={'card news-card'}>
            <a href={`${siteUrl}/SitePages/News/Blogs/Blog Details.aspx?blogID=${item.ID}`} className={'align-self-start'} data-interception="off">
                {isFeatured && <div className="badge-label">
                    <span>
                        <i>
                            <img src={`${siteUrl}/Assets/images/star.svg`} />
                        </i>
                    </span>
                    <span className="badge-txt">Featured</span>
                </div>}
                <img src={imageUrl} className={'card-img-top'} alt="Card Image" />
            </a>
            <div className={'card-body d-flex flex-column'}>
                <div className={'category'}>
                    <span><i><img src={`${siteUrl}/Assets/icons/Tag.svg`} alt="" /></i> {category}</span>
                </div>
                {/* <a href={`${siteUrl}/SitePages/News/Blogs/Blog Details.aspx?blogID=${item.ID}`} className={'align-self-start'} data-interception="off"></a> */}
                <div className={'mb-2 mt-2 card-content-header'}>
                    <h5 className={'card-title'}>{item.Title}</h5>
                </div>
                <div className={'date'}>
                    <span><i><img src={`${siteUrl}/Assets/icons/Date-blue.svg`} alt="" /></i> {moment(item.PublishedDate).format('DD-MMM-YYYY')}</span>
                </div>
                <p className={'card-text mt-2'}><i><img src={`${siteUrl}/Assets/icons/avatar.png`} alt="" /></i> <span>{item.Author.Title}</span></p>
            </div>
        </div>
    )
}

export default BlogCard;