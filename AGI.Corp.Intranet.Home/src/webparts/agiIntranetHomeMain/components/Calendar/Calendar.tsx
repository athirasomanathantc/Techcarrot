import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const Calender = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-md-12 mt-4 ">
        <div className="card calendar rounded-0">

            <div className="card-body rounded-0">

                <div className="app">
                    <div className="app__main">
                        <div className="calendar">
                            <div id="calendar"></div>
                            <div><span>Holiday</span></div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    </div>
    );
}