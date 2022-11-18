import * as moment from "moment";

export class Common {
    constructor() {

    }

    public getDateRangeFilter(listname: string) {
        let dateRangeFilter: string;
        const dateTo = moment().toISOString(); //format('YYYY-MM-DD T00-00-00');
        const dateFrom = moment().subtract(30, 'days').toISOString(); //format('YYYY-MM-DD T00-00-00');
        const column = this.getColumn(listname);
        dateRangeFilter = `${column} ge '${dateFrom}' and ${column} le '${dateTo}'`;
        return dateRangeFilter;
    }

    public getColumn(listname: string) {
        let column = 'Created';
        if (listname.indexOf('Transaction') !== -1) {
            column = `${listname.replace('Transaction', '')}/Created`;
        }
        return column;
    }
}

export default Common;