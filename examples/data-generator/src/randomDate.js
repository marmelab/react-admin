export default function(chance, serializeDate = false) {
    return function randomDate(minDate, maxDate) {
        const minTs =
            minDate instanceof Date
                ? minDate.getTime()
                : Date.now() - 5 * 365 * 24 * 60 * 60 * 1000; // 5 years
        const maxTs = maxDate instanceof Date ? maxDate.getTime() : Date.now();
        const range = maxTs - minTs;
        let ts = chance.natural({ max: range });
        // move it more towards today to account for traffic increase
        ts = Math.sqrt(ts / range) * range;
        const date = new Date(minTs + ts);

        if (serializeDate) {
            return date.toISOString();
        }

        return date;
    };
}
