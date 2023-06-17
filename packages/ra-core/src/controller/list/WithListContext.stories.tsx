import * as React from 'react';
import {
    CartesianGrid,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
} from 'recharts';
import fakerestDataProvider from 'ra-data-fakerest';

import { ListBase } from './ListBase';
import { WithListContext } from './WithListContext';
import { CoreAdminContext } from '../../core/CoreAdminContext';

export default {
    title: 'ra-core/controller/list/WithListContext',
};

// Date,Apples,Blueberries,Carrots
const fruitscsv = `2010-01-01,5.53,11.55,9.99
2010-01-02,5.29,11.17,9.57
2010-01-03,4.93,10.86,9.24
2010-01-04,4.64,10.53,8.9
2010-01-05,4.5,10.47,8.86
2010-01-06,4.59,10.46,8.81
2010-01-07,4.75,10.62,8.94
2010-01-08,4.88,10.97,9.21
2010-01-09,4.74,11.29,9.44
2010-01-10,5.33,11.83,9.9
2010-01-11,5.49,11.85,9.85
2010-01-12,5.27,12,9.96
2010-01-13,5.19,12.57,10.39
2010-01-14,5.36,13.43,11.05
2010-01-15,5.59,13.86,11.31
2010-01-16,5.35,13.38,10.86
2010-01-17,5.02,13.43,10.9
2010-01-18,5.18,13.9,11.17
2010-01-19,5.42,14.32,11.43
2010-01-20,5.64,14.7,11.71
2010-01-21,5.68,14.08,11.2
2010-01-22,5.92,13.59,10.75
2010-01-23,5.85,13.43,10.58
2010-01-24,6.27,13.19,10.36
2010-01-25,6.45,13.11,10.19
2010-01-26,6.56,13.09,10.15
2010-01-27,7.19,13.32,10.22
2010-01-28,7.17,13.22,10.04
2010-01-29,6.82,13.16,9.92
2010-01-30,7.48,13.69,10.32
2010-01-31,7.61,14.18,10.6
2010-02-01,7.76,14.27,10.47
2010-02-02,8.31,14.07,10.35
2010-02-03,8.44,13.57,9.95
2010-02-04,8.48,13.37,9.78
2010-02-05,8.83,13.52,9.86
2010-02-06,8.87,13.27,9.74
2010-02-07,8.51,12.74,9.28
2010-02-08,8.54,12.06,8.74
2010-02-09,9.05,12.15,8.83
2010-02-10,9.03,11.72,8.51
2010-02-11,8.82,10.69,7.73
2010-02-12,8.88,10.56,7.58
2010-02-13,8.82,10.66,7.66
2010-02-14,9.45,10.67,7.65
2010-02-15,10.18,10.24,7.32
2010-02-16,10.25,9.96,7.06
2010-02-17,11.27,10.24,7.22
2010-02-18,11.93,10.02,7.04
2010-02-19,12.63,10.21,7.16
2010-02-20,12.92,10.39,7.24
2010-02-21,13.51,10.74,7.4
2010-02-22,15.11,11.43,7.83
2010-02-23,14.51,11.45,7.78
2010-02-24,13.59,10.6,7.11
2010-02-25,12.82,9.24,6.06
2010-02-26,12.62,9.02,5.79
2010-02-27,13.5,9.5,6.06
2010-02-28,14.12,10.12,6.39
2010-03-01,14.2,10.83,6.75
2010-03-02,14.12,9.66,7.21
2010-03-03,13.3,8.99,6.66
2010-03-04,14.15,9.42,6.9
2010-03-05,14,9.3,6.8
2010-03-06,14.43,9.43,6.88
2010-03-07,14.5,9.36,6.83
2010-03-08,14.04,8.98,6.5
2010-03-09,13.21,8.47,6.06
2010-03-10,13.44,8.67,6.22
2010-03-11,13.15,8.37,6.05
2010-03-12,13.48,8.54,6.17
2010-03-13,13.76,8.63,6.28
2010-03-14,13.95,8.8,6.6
2010-03-15,13.9,9.05,6.7
2010-03-16,14.18,9.22,6.73
2010-03-17,14.48,9.45,6.83
2010-03-18,14.73,9.48,7.15
2010-03-19,14.83,9.75,7.29
2010-03-20,14.67,9.76,7.11
2010-03-21,14.02,9.06,6.54
2010-03-22,14.55,9.34,6.6
2010-03-23,15.2,10.26,7.11
2010-03-24,15.6,10.64,7.16
2010-03-25,15.48,12.37,8.03
2010-03-26,16.11,13.04,8.18
2010-03-27,16.36,13.37,8.46
2010-03-28,16.59,13.75,8.58
2010-03-29,15.9,13.65,8.62
2010-03-30,16.55,13.79,8.65
2010-03-31,17.04,14.13,8.72`;

const fruitsData = fruitscsv.split('\n').map((line, id) => {
    const [date, apples, blueberries, carrots] = line.split(',');
    return {
        id,
        date,
        apples: parseFloat(apples),
        blueberries: parseFloat(blueberries),
        carrots: parseFloat(carrots),
    };
});

const dataProvider = fakerestDataProvider({ fruits: fruitsData }, true);

type Fruit = {
    id: number;
    date: string;
    apples: number;
    blueberries: number;
    carrots: number;
};

export const Basic = () => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListBase resource="fruits" disableSyncWithLocation perPage={100}>
            <WithListContext<Fruit>
                render={({ isLoading, data, total }) =>
                    isLoading ? (
                        <>Loading...</>
                    ) : (
                        <table style={{ borderSpacing: '30px 5px' }}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Apples</th>
                                    <th>Blueberries</th>
                                    <th>Carrots</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(fruit => (
                                    <tr key={fruit.id}>
                                        <td>{fruit.date}</td>
                                        <td>{fruit.apples}</td>
                                        <td>{fruit.blueberries}</td>
                                        <td>{fruit.carrots}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4}>Total: {total}</td>
                                </tr>
                            </tfoot>
                        </table>
                    )
                }
            />
        </ListBase>
    </CoreAdminContext>
);

export const Chart = () => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ListBase resource="fruits" disableSyncWithLocation perPage={100}>
            <WithListContext<Fruit>
                render={({ data }) => (
                    <LineChart width={700} height={300} data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line
                            name="Apples"
                            dataKey="apples"
                            type="monotone"
                            stroke="#8884d8"
                            dot={false}
                            isAnimationActive={false}
                        />
                        <Line
                            name="Blueberries"
                            dataKey="blueberries"
                            type="monotone"
                            stroke="#82ca9d"
                            dot={false}
                            isAnimationActive={false}
                        />
                        <Line
                            name="Carrots"
                            dataKey="carrots"
                            type="monotone"
                            stroke="#ffc658"
                            dot={false}
                            isAnimationActive={false}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Tooltip />
                    </LineChart>
                )}
            />
        </ListBase>
    </CoreAdminContext>
);
