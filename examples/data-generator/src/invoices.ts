import type { Db } from './types';

export const generateInvoices = <Serialized extends boolean = false>(
    db: Db<Serialized>
): Invoice<Serialized>[] => {
    let id = 0;

    return (
        db.commands
            .filter(command => command.status !== 'delivered')
            // @ts-ignore
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(
                command =>
                    ({
                        id: id++,
                        date: command.date,
                        command_id: command.id,
                        customer_id: command.customer_id,
                        total_ex_taxes: command.total_ex_taxes,
                        delivery_fees: command.delivery_fees,
                        tax_rate: command.tax_rate,
                        taxes: command.taxes,
                        total: command.total,
                    } as Invoice<Serialized>)
            )
    );
};

export type Invoice<Serialized extends boolean = false> = {
    id: number;
    date: Serialized extends true ? string : Date;
    command_id: number;
    customer_id: number;
    total_ex_taxes: number;
    delivery_fees: number;
    tax_rate: number;
    taxes: number;
    total: number;
};
