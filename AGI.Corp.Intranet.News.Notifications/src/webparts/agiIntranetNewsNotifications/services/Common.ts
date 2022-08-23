import * as moment from "moment";

export class Common {
    public dateRangeFilter: string;
    constructor() {
        const dateTo = moment().toISOString(); //format('YYYY-MM-DD T00-00-00');
        const dateFrom = moment().subtract(30, 'days').toISOString(); //format('YYYY-MM-DD T00-00-00');
        this.dateRangeFilter = `Created ge '${dateFrom}' and Created le '${dateTo}'`;
    }

    public getFormattedDate(date: string) {
        const d = new Date(date);
        const month = d.toLocaleString('default', { month: 'long' });
        return `${month} ${d.getDate()}, ${d.getFullYear()}`;
    }

    public getFormattedTime(date: string) {
        const d = new Date(date);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutestring = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutestring + ' ' + ampm;
        return strTime;
    }
}

export default Common;