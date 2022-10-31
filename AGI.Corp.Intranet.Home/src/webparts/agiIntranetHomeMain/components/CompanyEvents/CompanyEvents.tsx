import * as moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import { ICompanyEventsComponent } from "../../models/ICompanyEventsComponent";
import { IConfigItem } from "../../models/IConfigItem";
import { IEvent } from "../../models/IEvent";
import SPService from "../../services/SPService";

const Events = (props: IEvent) => {
    return (<>
        <li className="list-group-item">
            <a href={`${siteUrl}/SitePages/News/Events/Event%20Details.aspx?eventID=${props.Id}&env=WebView`}>
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
            <div className="text-center">
                <img src={`${siteUrl}/Assets/images/calendar-icon.svg`} alt="" />
                <a target="_blank" style={{ display: 'inline-block' }} data-interception="off" className="add-to-calendar" href={`${siteUrl}/_vti_bin/owssvr.dll?CS=109&Cmd=Display&List=%7B${props.guid}%7D&CacheControl=1&ID=${props.Id}&Using=event.ics`} download="Event.ics">
                    Add to Calendar
                </a>
            </div>
        </li>
    </>)
}

let siteUrl: string = '';

export const CompanyEvents = (props: ICompanyEventsComponent) => {
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [guid, setGuid] = useState("");
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    const configItem: IConfigItem = props.configItems.filter((configItem) => configItem.Title === 'Company Events Title' && configItem.Section === 'Home')[0];

    useEffect(() => {
        const getLatestNews = async () => {
            const guid = await _spService.getListGuid('EventDetails');
            setGuid(guid);
            let events: IEvent[] = await _spService.getEvents();

            let upcoming: IEvent[] = events.filter((item, index, arr) => {
                if (moment().isBefore(item.StartDate)) {
                    return (item);
                }
            });
            upcoming = upcoming.slice(0, props.topEvents);

            setEvents(upcoming);
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        {events.length > 0 && !configItem?.Hide && <div className="col-md-12 mt-4  ">
            <div className="card  company-event">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title m-2 me-2">{configItem?.Detail}</h4>
                    <a href={`${props.siteUrl}/SitePages/News/Events.aspx?env=WebView`} className="viewall-link">View All</a>
                </div>
                <div className="card-body">
                    <ul className="p-0 m-0 list-group">
                        {events.map((event: IEvent, index: number) => <Events index={index} key={`key${index}`} {...event} guid={guid}></Events>)}
                    </ul>


                </div>
            </div>
        </div>}
    </>);
}