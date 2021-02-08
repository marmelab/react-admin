import { Record, RecordMap } from '../types';

export const indexById = (records: Record[] = []): RecordMap =>
    records
        .filter(r => typeof r !== 'undefined')
        .reduce((prev, current) => {
            prev[current.id] = current;
            return prev;
        }, {});
