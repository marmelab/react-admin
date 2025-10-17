import { faker } from '@faker-js/faker';

export const weightedArrayElement = <T>(values: T[], weights): T =>
    faker.helpers.arrayElement(
        values.reduce(
            (acc, value, index) =>
                acc.concat(new Array(weights[index]).fill(value)),
            []
        )
    );

export const weightedBoolean = likelyhood => faker.number.int(99) < likelyhood;

export const randomDate = (
    minDate?: Date | string,
    maxDate?: Date | string
) => {
    const minTs =
        minDate instanceof Date
            ? minDate.getTime()
            : typeof minDate === 'string'
              ? new Date(minDate).getTime()
              : Date.now() - 5 * 365 * 24 * 60 * 60 * 1000; // 5 years
    const maxTs =
        maxDate instanceof Date
            ? maxDate.getTime()
            : typeof maxDate === 'string'
              ? new Date(maxDate).getTime()
              : Date.now();

    const range = maxTs - minTs;
    const randomRange = faker.number.int({ max: range });
    // move it more towards today to account for traffic increase
    const ts = Math.sqrt(randomRange / range) * range;
    return new Date(minTs + ts);
};

export const randomFloat = (min, max) =>
    parseFloat(faker.number.float({ min, max, fractionDigits: 2 }).toFixed(2));
