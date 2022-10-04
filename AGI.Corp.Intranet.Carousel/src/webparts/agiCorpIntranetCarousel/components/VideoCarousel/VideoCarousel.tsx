import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface IVideoCarousel {
    thumbnailUrl: string;
    videoUrl: string;
    moveCarousel: boolean;
}

export const VideoCarousel = (props: IVideoCarousel) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (props.moveCarousel) {
            videoRef.current.pause();
        }
    })

    return (<>
        <video className="video1" loop controls autoPlay muted poster={props.thumbnailUrl} ref={videoRef}>
            <source src={props.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>

    </>)
}