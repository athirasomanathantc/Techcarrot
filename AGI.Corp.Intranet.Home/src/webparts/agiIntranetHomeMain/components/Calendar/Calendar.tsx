import * as React from "react";
import { useState } from "react";
import DayPicker from "react-day-picker";
import 'react-day-picker/lib/style.css';

export const Calender = (props: any) => {
    const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const [selectedDays, setSelectedDays] = useState(null);

    return (<div className="col-md-12 mt-4 ">
        <div className="card calendar rounded-0">
            <div className="card-body rounded-0">
                <div className="app">
                    <div className="app__main">
                        <div className="calendar">
                            <DayPicker
                                month={new Date()}
                                selectedDays={selectedDays}
                                weekdaysShort={WEEK_DAYS}
                            />
                            <div className="legend calendar-legend">
                                <span>Today</span>
                                <span>Holidays</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
