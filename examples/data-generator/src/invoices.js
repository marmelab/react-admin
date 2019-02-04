import { random, lorem } from 'faker/locale/en';
import subDays from 'date-fns/sub_days';
import { randomDate } from './utils';

export default (db, { serializeDate }) => {
    let id = 0;

    return db.commands
        .filter(command => command.status !== 'delivered')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(command => ({
            id: id++,
            date: command.date,
            command_id: command.id,
            customer_id: command.customer_id,
            total_ex_taxes: command.total_ex_taxes,
            delivery_fees: command.delivery_fees,
            tax_rate: command.tax_rate,
            taxes: command.taxes,
            total: command.total,
        }));
};
