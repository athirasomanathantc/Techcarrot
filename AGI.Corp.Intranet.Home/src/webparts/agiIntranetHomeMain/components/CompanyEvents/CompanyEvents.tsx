import * as moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import { IEvent } from "../../models/IEvent";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

const Events = (props: IEvent) => {
    return (<>
        <li className="list-group-item">
            <a href={`${siteUrl}/SitePages/News/Events/Event%20Details.aspx?eventID=${props.Id}`}>
                <div className="d-flex align-items-center">
                    <div className="event-date flex-shrink-0 me-3">
                        <p className="notification-date">{moment(props.StartDate).format("DD")}</p>
                        <p className="notification-month">{moment(props.StartDate).format("MMM")}</p>
                    </div>
                    <div className="d-flex flex-column flex-wrap">

                        <p className="mb-2 text-break text-wrap">
                            {props.Title}
                        </p>
                    </div>
                </div>
            </a>
        </li>
    </>)
}

let siteUrl: string = '';

export const CompanyEvents = (props: IAgiIntranetHomeMainProps) => {
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;

    useEffect(() => {
        const getLatestNews = async () => {
            let events: IEvent[] = await _spService.getEvents();
            setEvents(events);
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        {events.length > 0 && <div className="col-md-12 mt-4  ">
            <div className="card  company-event">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title m-2 me-2">Company Events</h4>
                    <a href={`${props.siteUrl}/SitePages/News/Events.aspx`} className="viewall-link">View All</a>
                </div>
                <div className="card-body">
                    <ul className="p-0 m-0 list-group">
                        {events.map((event: IEvent, index: number) => <Events index={index} key={`key${index}`} {...event}></Events>)}
                    </ul>


                </div>
            </div>
        </div>}
    </>);
}