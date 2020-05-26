import React, { FC } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { useTranslate } from 'react-admin';

import { Order } from '../types';

const lastDay = new Date(new Date().toDateString()).getTime();
const oneDay = 24 * 60 * 60 * 1000;
const lastMonthDays = Array.from(
    { length: 30 },
    (_, i) => lastDay - i * oneDay
).reverse();
const aMonthAgo = new Date();
aMonthAgo.setDate(aMonthAgo.getDate() - 30);

const dateFormatter = (date: number): string =>
    new Date(date).toLocaleDateString();

const aggregateOrdersByDay = (orders: Order[]): { [key: number]: number } =>
    orders
        .filter((order: Order) => order.status !== 'cancelled')
        .reduce(
            (acc, curr) => {
                const day = new Date(
                    new Date(curr.date).toDateString()
                ).getTime();
                if (!acc[day]) {
                    acc[day] = 0;
                }
                acc[day] += curr.total;
                return acc;
            },
            {} as { [key: string]: number }
        );

const getRevenuePerDay = (orders: Order[]): TotalByDay[] => {
    const daysWithRevenue = aggregateOrdersByDay(orders);
    return lastMonthDays.map(date => ({
        date,
        total: daysWithRevenue[date] || 0,
    }));
};

const OrderChart: FC<{ orders?: Order[] }> = ({ orders }) => {
    const translate = useTranslate();
    if (!orders) return null;

    return (
        <Card>
            <CardHeader title={translate('pos.dashboard.month_history')} />
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getRevenuePerDay(orders)}>
                        <XAxis
                            dataKey="date"
                            name="Date"
                            type="number"
                            scale="time"
                            domain={[aMonthAgo.getTime(), new Date().getTime()]}
                            tickFormatter={dateFormatter}
                            reversed
                        />
                        <YAxis dataKey="total" name="Revenue" unit="€" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            formatter={value =>
                                new Intl.NumberFormat(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(value as any)
                            }
                            labelFormatter={(label: any) =>
                                dateFormatter(label)
                            }
                        />
                        <Bar dataKey="total" fill="#31708f" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

interface TotalByDay {
    date: number;
    total: number;
}

export default OrderChart;
