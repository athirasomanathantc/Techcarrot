import { sp } from "@pnp/sp";
import * as moment from "moment";
import * as React from "react";
import DayPicker from "react-day-picker";
import 'react-day-picker/lib/style.css';
import { IEventItem } from "../../models/IEventItem";

interface ICalendarProps {

}

interface ICalendarState {
    selectedDay: any,
    day: string;
    selectedMonth: any,
    eventItems: IEventItem[],
    allEvents: any,
    events: any,
    holidays: any,
    announcements: any,
    isMonthEvents: boolean,
    isDayEvent: boolean,
    monthlyHolidaysText: string,
    monthlyEventsText: string,
    dailyEvents: IEventItem[]
}

const EVENTS_LIST = 'Events';
const NO_HOLIDAYS = 'no holidays';
const NO_EVENTS = 'no events';

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default class Calender extends React.Component<ICalendarProps, ICalendarState> {
    public constructor(props: ICalendarProps) {
        super(props);

        this.state = {
            selectedDay: null,
            day: '',
            selectedMonth: new Date(),
            eventItems: [],
            allEvents: [],
            events: [],
            holidays: [],
            announcements: [],
            isMonthEvents: false,
            isDayEvent: false,
            monthlyHolidaysText: NO_HOLIDAYS,
            monthlyEventsText: NO_EVENTS,
            dailyEvents: [],
        }

        this.getMonthlyEvents = this.getMonthlyEvents.bind(this);
    }

    public componentDidMount() {
        this.getCalendarEvents();
    }

    private async getCalendarEvents() {
        const eventItems: IEventItem[] = await sp.web.lists.getByTitle(EVENTS_LIST).items.
            select('*, fRecurrence,Title, EventDate, EndDate, Category, Location').
            get();

        let holidays = [];
        let events = [];
        let announcements = [];
        let allEvents = [];

        eventItems.map((event) => {
            const endDate = this.getEventEndDate(event);
            const dates = this.getDates(event.EventDate, endDate);

            if (event.Category == 'Holiday') {
                dates.map((date) => {
                    holidays.push(new Date(date));
                    allEvents.push({ Title: event.Title, Category: event.Category, EventDate: date })
                })
            }
            else if (event.Category === 'Announcement') {
                dates.map((date) => {
                    announcements.push(new Date(date));
                    allEvents.push({ Title: event.Title, Category: event.Category, EventDate: date })
                })
            }
            else if (event.Category === 'Event') {
                dates.map((date) => {
                    events.push(new Date(date));
                    allEvents.push({ Title: event.Title, Category: event.Category, EventDate: date })
                })
            }
        })
        this.setState({
            eventItems,
            allEvents,
            holidays,
            events,
            announcements
        }, () => {
            this.getCurrentMonthEvents();
        })

    }

    getEventEndDate(event: IEventItem): any {
        let endDate = event.EndDate;

        if (event.fRecurrence) {
            endDate = new Date(event.EventDate).getFullYear() != new Date(event.EndDate).getFullYear() ? event.EventDate : event.EndDate
        }

        return endDate;
    }

    getDates(startDate, endDate): any {
        let dateArray = [];
        let currentDate = moment(startDate);
        const stopDate = moment(endDate);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    handleDayClick(selectedDay, modifiers, e) {
        if (modifiers.disabled) return;
        if (Object.keys(modifiers).length == 0) {
            this.setState({
                selectedDay: undefined,
                isDayEvent: false
            })
            return;
        }

        const date = new Date(selectedDay);
        const day = date.getDate().toString();
        this.setState({ selectedDay, day });

        const dailyEvents = this.state.allEvents.filter((event) =>
            date.getDate() == new Date(event.EventDate).getDate() &&
            date.getMonth() == new Date(event.EventDate).getMonth() &&
            date.getFullYear() == new Date(event.EventDate).getFullYear()
        );

        if (dailyEvents.length > 0) {
            this.setState({
                dailyEvents,
                isDayEvent: true
            })
        }
        else {
            this.setState({
                isDayEvent: false
            })
        }
    }

    renderDay(day, modifiers) {
        const date = day.getDate();
        const today = new Date(new Date().setHours(12, 0, 0, 0));
        const isToday = day.getTime() == today.getTime();

        return (
            <div className="date-container">
                <div className={isToday ? 'date-wrap' : ''}>
                    <span>{date}</span>
                    {isToday && <span>
                        {moment(day)
                            .format('dddd')
                            .substring(0, 3)
                            .toUpperCase()}
                    </span>}
                </div>
                <span className="event"></span>
                <span className="holiday"></span>
                <span className="announcement"></span>
            </div>
        );
    }

    handleMonthChange(month) {
        this.setState({
            isDayEvent: false,
            dailyEvents: []
        })
        if (month != undefined || month != null || month != '') {
            this.getMonthlyEvents(new Date(month));
        }

    }

    getCurrentMonthEvents() {
        this.getMonthlyEvents(new Date());
    }

    getMonthlyEvents(date) {

        const events = this.state.allEvents.filter((event) => new Date(event.EventDate).getMonth() == date.getMonth() &&
            new Date(event.EventDate).getFullYear() == date.getFullYear() &&
            event.Category != 'Holiday')

        const holidays = this.state.allEvents.filter((event) => new Date(event.EventDate).getMonth() == date.getMonth() &&
            new Date(event.EventDate).getFullYear() == date.getFullYear() &&
            event.Category == 'Holiday')

        const eventsCount = events.length;
        const holidaysCount = holidays.length;
        let monthlyHolidaysText = 'no holidays';
        let monthlyEventsText = 'no events';
        if (holidaysCount == 1) {
            monthlyHolidaysText = '1 holiday';
        }
        else if (holidaysCount > 1) {
            monthlyHolidaysText = `${holidaysCount} holidays`;
        }

        this.setState({
            monthlyHolidaysText
        })

        if (eventsCount == 1) {
            monthlyEventsText = '1 event';
        }
        else if (eventsCount > 1) {
            monthlyEventsText = `${eventsCount} events`;
        }

        this.setState({
            monthlyEventsText
        })
    }

    public render(): React.ReactElement<ICalendarProps> {
        return (<>
            <div className="col-md-12 mt-4 ">
                <div className="card calendar rounded-0">
                    <div className="card-body rounded-0">
                        <div className="app">
                            <div className="app__main">
                                <div className="calendar">
                                    <DayPicker modifiers={{ holiday: this.state.holidays, event: this.state.events, announcement: this.state.announcements }}
                                        month={this.state.selectedMonth}
                                        selectedDays={this.state.selectedDay}
                                        onDayClick={(day, modifiers, e) => this.handleDayClick(day, modifiers, e)}
                                        onMonthChange={(month) => this.handleMonthChange(month)}
                                        weekdaysShort={WEEK_DAYS}
                                        renderDay={(day) => this.renderDay(day, { holiday: this.state.holidays, event: this.state.events, announcement: this.state.announcements })}
                                    />
                                    <div className="legend calendar-legend">
                                        <span>Today</span>
                                        <span>Holidays</span>
                                        <span>Announcements</span>
                                        <span>Events</span>
                                    </div>
                                    <div>
                                        {
                                            this.state.dailyEvents.map((event, i) => {
                                                const categoryClass = event.Category == 'Holiday' ? 'Holiday' : (event.Category == 'Event' ? 'Event' : 'Announcement')
                                                return <div className='eventDetail'>
                                                    <div className={`datebox ${categoryClass}`}>{new Date(event.EventDate).getDate()}</div>
                                                    <div className="events in">
                                                        <div className="event">
                                                            <span>{event.Title}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
    }

}
