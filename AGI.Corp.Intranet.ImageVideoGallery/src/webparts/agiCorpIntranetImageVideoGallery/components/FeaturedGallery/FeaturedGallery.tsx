import * as React from 'react';
import { IFileData } from '../../models/IFileData';
import { IFolderItem } from '../../models/IFolderItem';
import { IImageItem } from '../../models/IImageItem';
import Paging from '../Paging/Paging';

interface IFeaturedGallery {
    siteUrl: string;
    tab: string;
    pageData: IFolderItem[];
    videoData: IImageItem[];
    getImageGalleryItems: (string) => void;
    fileData: IFileData[];
    selectedImageFolder: string;
    closeImageFolder: () => void;
    pagedImages: IImageItem[];
    imageItems: IImageItem[];
    previewImage: (e) => void;
    imagesCurrentPage: number;
    totalImages: number;
    imagesPerPage: number;
    onPageUpdateImages: (page) => void;
    fnCurTab: (string) => void;
    getImageUrl: (string) => string;
    openVideo: (number) => void;
}

const FeaturedGallery = (props: IFeaturedGallery) => {
    const { siteUrl,
        tab,
        pageData,
        videoData,
        getImageGalleryItems,
        fileData,
        selectedImageFolder,
        closeImageFolder,
        pagedImages,
        imageItems,
        previewImage,
        imagesCurrentPage,
        totalImages,
        imagesPerPage,
        onPageUpdateImages,
        fnCurTab,
        getImageUrl,
        openVideo } = props;

    return (
        <section className="featured-section gallery-featured-section col-lg-12 mt-5 ">
            <div className="container" style={{ display: selectedImageFolder ? 'none' : 'block' }}>
                <div className="tabs">
                    <div className="tab-header">
                        <div className="row title-wrapper">
                            <div className="col-md-12">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={tab == "image" ? `nav-link active` : `nav-link`} id="featured-image-gallery-tab" data-bs-toggle="tab" data-bs-target="#featured-image-gallery" type="button" role="tab" aria-controls="featured-image-gallery" aria-selected="true" onClick={() => { fnCurTab("image") }}>Featured Image Gallery
                                            <i>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                                    <g id="Image_Gallery_active" data-name="Image Gallery_active" transform="translate(-195 -370)">
                                                        <g id="Group_9544" data-name="Group 9544" transform="translate(197 374)">
                                                            <g id="Group_8147" data-name="Group 8147" transform="translate(0 0)">
                                                                <path id="Path_73956" data-name="Path 73956" d="M177.107,159.668a3.118,3.118,0,1,0,3.118,3.118A3.118,3.118,0,0,0,177.107,159.668Zm0,4.752a1.633,1.633,0,0,1,0-3.267h0a1.633,1.633,0,1,1,0,3.267Z" transform="translate(-161.626 -150.211)" fill="#9d0e71" />
                                                                <path id="Path_73957" data-name="Path 73957" d="M27.917,28.905,7.648,26.6a2.784,2.784,0,0,0-2.19.631,2.821,2.821,0,0,0-1.077,1.93L4.01,32.209H2.859A2.983,2.983,0,0,0,0,35.29V50.473a2.821,2.821,0,0,0,2.746,2.895H23.24a3.047,3.047,0,0,0,3.118-2.9v-.594a3.712,3.712,0,0,0,1.411-.594,3.081,3.081,0,0,0,1.077-2l1.708-15.072A3.007,3.007,0,0,0,27.917,28.905ZM24.873,50.473a1.563,1.563,0,0,1-1.633,1.411H2.859a1.336,1.336,0,0,1-1.375-1.3q0-.057,0-.114V47.726L7.24,43.494a1.782,1.782,0,0,1,2.3.111l4.046,3.564a3.49,3.49,0,0,0,2.19.817A3.378,3.378,0,0,0,17.56,47.5l7.313-4.232v7.2Zm0-8.947L16.78,46.241a1.893,1.893,0,0,1-2.19-.186l-4.083-3.6a3.3,3.3,0,0,0-4.121-.149l-4.9,3.564V35.29a1.5,1.5,0,0,1,1.374-1.6H23.24a1.708,1.708,0,0,1,1.633,1.6v6.237Zm4.2-9.518v.015L27.323,47.1a1.262,1.262,0,0,1-.483,1c-.149.149-.483.223-.483.3V35.29a3.193,3.193,0,0,0-3.118-3.081H5.5l.334-2.9a1.708,1.708,0,0,1,.557-.965,1.708,1.708,0,0,1,1.114-.3L27.732,30.39A1.485,1.485,0,0,1,29.069,32.009Z" transform="translate(0 -26.576)" fill="#9d0e71" />
                                                            </g>
                                                        </g>
                                                        <rect id="Rectangle_8528" data-name="Rectangle 8528" width="35" height="35" transform="translate(195 370)" fill="none" />
                                                    </g>
                                                </svg>
                                            </i>
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={tab == "video" ? `nav-link active` : `nav-link`} id="featured-video-gallery-tab" data-bs-toggle="tab" data-bs-target="#featured-video-gallery" type="button" role="tab" aria-controls="featured-video-gallery" aria-selected="false" onClick={() => fnCurTab("video")}>Featured Video Gallery
                                            <i>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                                    <g id="Video_Galley_Active" data-name="Video Galley_Active" transform="translate(-409 -370)">
                                                        <g id="Page-1_26_" transform="translate(414 375)">
                                                            <g id="web_export_26_">
                                                                <path id="play_x2C_-gallery_x2C_-video_x2C_-copy_x2C_-list" d="M316.9,796.9v1.493a2.985,2.985,0,0,1-2.985,2.985H298.985A2.985,2.985,0,0,1,296,798.393V783.466a2.985,2.985,0,0,1,2.985-2.985h1.493v-1.493A2.985,2.985,0,0,1,303.463,776H318.39a2.985,2.985,0,0,1,2.985,2.985v14.926a2.985,2.985,0,0,1-2.985,2.985H316.9Zm-16.419-14.927h-1.493a1.493,1.493,0,0,0-1.493,1.493v14.927a1.493,1.493,0,0,0,1.493,1.493h14.926a1.493,1.493,0,0,0,1.493-1.493V796.9H303.463a2.985,2.985,0,0,1-2.985-2.985Zm2.985-4.478a1.493,1.493,0,0,0-1.493,1.493v14.926a1.493,1.493,0,0,0,1.493,1.493H318.39a1.493,1.493,0,0,0,1.493-1.493V778.989a1.493,1.493,0,0,0-1.493-1.493H303.463Zm4.1,5.224a.746.746,0,0,1,1.16-.621l5.6,3.732a.746.746,0,0,1,0,1.242l-5.6,3.732a.746.746,0,0,1-1.16-.621Zm1.493,1.395v4.674l3.506-2.337Z" transform="translate(-296 -776.003)" fill="#9d0e71" />
                                                            </g>
                                                        </g>
                                                        <rect id="Rectangle_8529" data-name="Rectangle 8529" width="35" height="35" transform="translate(409 370)" fill="none" />
                                                    </g>
                                                </svg>
                                            </i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="featured-image-gallery" className={`featured-carousel tab-pane fade ${tab == "image" ? `show active` : ''}`} role="tabpanel" aria-labelledby="image-gallery-tab">
                            <div id="featuredCarousel" className="carousel slide" data-bs-interval="false" data-bs-ride="carousel">
                                <div className="carousel-inner" role="listbox">
                                    {
                                        pageData.length > 0 ?
                                            pageData.map((folder, index) => {
                                                const folderName = folder.Name;
                                                const _folder = fileData.filter((f) => f.FolderName == folderName);
                                                const coverImage = _folder && _folder.length > 0 ? _folder[0].FilePath : `${siteUrl}/Assets/images/gallery-item-img.png`;
                                                return (
                                                    <div className={`carousel-item ${!index ? 'active' : ''}`}>
                                                        <div className="col-md-3 h-100">
                                                            <div className="badge-label"><span><i><img src={`${siteUrl}/Assets/images/star.svg`} /></i></span><span
                                                                className="badge-txt">Featured</span></div>
                                                            <div className="gallery-item">
                                                                <a href="javascript:void(0)" onClick={() => getImageGalleryItems(folder.Name)}>
                                                                    <div className="gallery-item--img">
                                                                        <img src={coverImage} alt="" />
                                                                    </div>
                                                                    <div className="gallery-item--text">
                                                                        <p>{folder.Name}</p>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className={'invalidTxt'}>
                                                NO IMAGES
                                            </div>
                                    }
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarousel"
                                    data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#featuredCarousel"
                                    data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                        <div id="featured-video-gallery" className={`featured-carousel tab-pane fade ${tab == "video" ? `show active` : ''}`} role="tabpanel" aria-labelledby="featured-video-gallery-tab">
                            <div id="featuredCarouselVideo" className="carousel slide" data-bs-interval="false" data-bs-ride="carousel">
                                <div className="carousel-inner row" role="listbox">
                                    {
                                        videoData.length > 0 ?
                                            videoData.map((item, i) => {
                                                const imageUrl = getImageUrl(item.VideoThumbnail);
                                                return (
                                                    <div className={`carousel-item ${!i ? 'active' : ''}`}>
                                                        <div className="col-md-3">
                                                            <div className="badge-label"><span>
                                                                <i>
                                                                    <img src={`${siteUrl}/Assets/images/star.svg`} />
                                                                </i>
                                                            </span>
                                                                <span className="badge-txt">Featured</span>
                                                            </div>
                                                            <div className="gallery-item video-gallery-item">
                                                                <a href="javascript:void(0);" onClick={() => openVideo(item.ID)} data-toggle="lightbox" data-gallery="image-gallery" data-video-caption="asdsad">
                                                                    <div className="gallery-item--img">
                                                                        <img src={imageUrl} alt="" />
                                                                    </div>
                                                                    <div className="gallery-item--button">
                                                                        <button><img src={`${props.siteUrl}/Assets/images/icon-play.svg`} alt="" /></button>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                            :
                                            <div className={'invalidTxt'}>
                                                NO VIDEOS
                                            </div>
                                    }
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarouselVideo"
                                    data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#featuredCarouselVideo"
                                    data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-content" style={{ display: selectedImageFolder ? 'block' : 'none' }}>
                <div className="content-wrapper">
                    <div className="container">
                        <div className="tabs">
                            <div className="tab-header">
                                <div className="row">
                                    <div className="col-md-12">
                                        <ul className="nav">
                                            <li className="nav-item" role="presentation">
                                                <a href="javascript:void(0)" onClick={() => closeImageFolder()} className="nav-link">
                                                    <i>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="23.916" height="23.916" viewBox="0 0 23.916 23.916">
                                                            <g id="Group_8097" data-name="Group 8097" transform="translate(23.916 0) rotate(90)">
                                                                <g id="Group_7978" data-name="Group 7978" transform="translate(0)">
                                                                    <path id="Path_73804" data-name="Path 73804" d="M25.836,13.135a.5.5,0,1,0-.681.721l4.079,3.853-4.079,3.853a.5.5,0,1,0,.681.721L30.3,18.069a.5.5,0,0,0,0-.721l-4.461-4.213Z" transform="translate(-15.802 -6.254)" fill="#666" />
                                                                    <path id="Path_73805" data-name="Path 73805" d="M11.958,0A11.957,11.957,0,0,0,3.5,20.413,11.957,11.957,0,1,0,20.413,3.5,11.877,11.877,0,0,0,11.958,0Zm7.4,19.356A10.462,10.462,0,1,1,4.56,4.56a10.462,10.462,0,1,1,14.8,14.8Z" transform="translate(0 0)" fill="#666" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </i>
                                                    {selectedImageFolder}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {
                                    pagedImages.map((items) => {
                                        return (
                                            // <a href="images/gallery-folder-img-large.png" data-toggle="lightbox" data-gallery="image-gallery" className="col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                                            //   <img src={`${props.siteUrl}/Assets/images/gallery-folder-img.png`} alt="" className="gallery-item--img" />
                                            // </a>
                                            <a href={'javascript:void(0);'} onClick={(e) => previewImage(e)} data-src={items.ServerRelativeUrl} data-id={items.ListItemAllFields.ID} data-toggle="lightbox" data-gallery="image-gallery"
                                                className=" col-6 col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                                                <img src={items.ServerRelativeUrl} alt={items.Title} style={{ width: '100%' }} data-src={items.ServerRelativeUrl} data-id={items.ListItemAllFields.ID} className="gallery-item--img" />
                                            </a>
                                        )
                                    })
                                }
                            </div>
                            <div className={'pagination-wrapper'} style={{ display: imageItems.length > 0 ? 'block' : 'none' }} >
                                <Paging currentPage={imagesCurrentPage}
                                    totalItems={totalImages}
                                    itemsCountPerPage={imagesPerPage}
                                    onPageUpdate={(page) => onPageUpdateImages(page)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default FeaturedGallery;