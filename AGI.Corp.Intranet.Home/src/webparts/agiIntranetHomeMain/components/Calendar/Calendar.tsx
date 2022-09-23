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
            isMonthEvents: false,
            isDayEvent: false,
            monthlyHolidaysText: NO_HOLIDAYS,
            monthlyEventsText: NO_EVENTS,
            dailyEvents: [],
        }

        this.getMonthlyEvents = this.getMonthlyEvents.bind(this);
    }

    public componentDidMount() {
        // var cw = $('.DayPicker .DayPicker-Day').width() + 5;
        // $('.DayPicker .DayPicker-Day').css({ 'height': cw + 'px' });
        // var x = document.getElementsByClassName("DayPicker-Day");
        this.getCalendarEvents();

    }

    private async getCalendarEvents() {
        const eventItems: IEventItem[] = await sp.web.lists.getByTitle(EVENTS_LIST).items.
            select('*, fRecurrence,Title, EventDate, EndDate, Category, Location').
            get();



        let holidays = [];
        let events = [];
        let allEvents = [];

        //console.log("Events ");
        //console.table(eventItems);

        eventItems.map((event) => {
            //const dates = this.getDates(event.EventDate, event.fRecurrence ? event.EventDate : event.EventDate);
            const endDate = this.getEventEndDate(event);
            const dates = this.getDates(event.EventDate, endDate);
            //console.log("Event " + event.Title);
            //console.table(dates);

            if (event.Category == 'Holiday') {
                dates.map((date) => {
                    holidays.push(new Date(date));
                    allEvents.push({ Title: event.Title, Category: event.Category, EventDate: date })
                })
                //event.EventDate && holidays.push(new Date(event.EventDate));
            }
            else {
                dates.map((date) => {
                    events.push(new Date(date));
                    allEvents.push({ Title: event.Title, Category: event.Category, EventDate: date })
                })
                //event.EventDate && events.push(new Date(event.EventDate));
            }

        })
        this.setState({
            eventItems,
            allEvents,
            holidays,
            events
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
            // dateArray.push(moment(currentDate).format('YYYY-MM-DD') )
            // currentDate = moment(currentDate).add(1, 'days');

            dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    handleDayClick(selectedDay, modifiers, e) {
        //console.log('modifiers');
        //console.table(modifiers);
        //console.log(modifiers);

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
        if (day.getTime() == new Date(new Date().setHours(12, 0, 0, 0)).getTime()) {
            return (
                <div className="date-wrap">
                    <span>{date}</span>
                    <span>
                        {moment(day)
                            .format('dddd')
                            .substring(0, 3)
                            .toUpperCase()}
                    </span>
                </div>
            );
        }
        else {
            return (
                <div>{date}</div>
            );
        }
    }

    handleMonthChange(month) {
        //console.log('month changed');
        //console.log(month);
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

        //console.log('Events for selected month');
        //console.table(events);

        //console.log('Holidays for selected month');
        //console.table(holidays);
    }

    public render(): React.ReactElement<ICalendarProps> {
        return (<>
            <div className="col-md-12 mt-4 ">
                <div className="card calendar rounded-0">
                    <div className="card-body rounded-0">
                        <div className="app">
                            <div className="app__main">
                                <div className="calendar">
                                    <DayPicker modifiers={{ holiday: this.state.holidays, event: this.state.events }}
                                        month={this.state.selectedMonth}
                                        selectedDays={this.state.selectedDay}
                                        onDayClick={(day, modifiers, e) => this.handleDayClick(day, modifiers, e)}
                                        onMonthChange={(month) => this.handleMonthChange(month)}
                                        weekdaysShort={WEEK_DAYS}
                                        renderDay={(day, modifiers) => this.renderDay(day, modifiers)}
                                    />
                                    <div className="legend calendar-legend">
                                        <span>Today</span>
                                        <span>Holidays</span>
                                    </div>
                                    <div>
                                        {
                                            this.state.dailyEvents.map((event, i) => {
                                                return <div className='eventDetail'>
                                                    <div className={`datebox ${event.Category == 'Holiday' ? 'Holiday' : 'Event'}`}>{new Date(event.EventDate).getDate()}</div>
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
