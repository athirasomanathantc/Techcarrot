import * as moment from "moment";

export class Common {
    public dateRangeFilter: string;
    constructor() {
        const dateTo = moment().toISOString(); //format('YYYY-MM-DD T00-00-00');
        const dateFrom = moment().subtract(30, 'days').toISOString(); //format('YYYY-MM-DD T00-00-00');
        this.dateRangeFilter = `Created ge '${dateFrom}' and Created le '${dateTo}'`;
    }
}

export default Common;