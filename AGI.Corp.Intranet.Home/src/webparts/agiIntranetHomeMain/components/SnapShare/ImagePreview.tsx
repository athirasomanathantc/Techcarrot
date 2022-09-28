import * as React from "react";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ISnap } from "../../models/ISnap";
import { useEffect, useState } from "react";
import * as moment from "moment";

interface IImagePreview {
    itemId: number;
    closePreview: Function;
    snaps: ISnap[];
    siteUrl: string;
}

export const ImagePreview = (props: IImagePreview) => {
    const [imageDetails, setImageDetails] = useState(null);

    useEffect(() => {
        const previewSnap = props.snaps.filter((snap) => snap.Id === props.itemId)[0];
        setImageDetails(previewSnap);
    }, [])

    const prevImage = () => {
        debugger
        const currentIndex = props.snaps.map(e => e.Id).indexOf(imageDetails.Id);
        const prevIndex = !currentIndex ? (props.snaps.length - 1) : currentIndex - 1;
        setImageDetails(props.snaps[prevIndex]);
    }

    const nextImage = () => {
        const currentIndex = props.snaps.map(e => e.Id).indexOf(imageDetails.Id);
        const nextIndex = currentIndex == (props.snaps.length - 1) ? 0 : currentIndex + 1;
        setImageDetails(props.snaps[nextIndex]);
    }

    return (<>
        {imageDetails && <div className="imgOverlay" style={{ display: 'block' }}>
            <div className="header">
                <Icon iconName="Cancel" onClick={() => props.closePreview()} />
            </div>
            <div className="imagePreview">
                <div className='arrowContainer'>
                    <Icon iconName="ChevronLeft" onClick={() => prevImage()} />
                </div>
                <div className="img-wrapper" >
                    <div className="img-container">
                        <img src={`${imageDetails.File.ServerRelativeUrl}`} />
                    </div>
                    <div className="imagePreviewCaption">
                        <h2>{imageDetails.File.Name}</h2>
                        <p>{imageDetails.ImageDescription}</p>
                        <ul>
                            <li>
                                <i className="icon user-icon"><img src={`${props.siteUrl}/Assets/icons/icon-avatar.svg`} /></i>
                                <span className='userName'>
                                    {imageDetails.Author.Title}
                                </span>
                                <span className='createdDate'>
                                    <span> Date Taken:</span> {moment(imageDetails.Created).format('DD MMMM YYYY')}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='arrowContainer'>
                    <Icon iconName="ChevronRight" onClick={() => nextImage()} />
                </div>
            </div>
        </div>}
    </>)
}