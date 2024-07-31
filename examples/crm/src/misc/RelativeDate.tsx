import { formatRelative } from 'date-fns';

export function RelativeDate({ date }: { date: string }) {
    return formatRelative(new Date(date), new Date());
}
