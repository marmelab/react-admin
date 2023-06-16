import debounce from 'lodash/debounce';

/**
 * A version of lodash/debounce that always returns a promise but wait for the debounced function to return to resolve it.
 * @param func The function to debounce
 * @param wait The debounce delay
 * @returns A debounced function that returns a promise
 */
export function asyncDebounce<
    FunctionType extends (...args: any[]) => Promise<any>
>(func: FunctionType, wait?: number) {
    const resolveSet = new Set<(p: any) => void>();
    const rejectSet = new Set<(p: any) => void>();

    const debounced = debounce((args: Parameters<FunctionType>) => {
        func(...args)
            .then((...res) => {
                resolveSet.forEach(resolve => resolve(...res));
            })
            .catch((...res) => {
                rejectSet.forEach(reject => reject(...res));
            })
            .finally(() => {
                resolveSet.clear();
                rejectSet.clear();
            });
    }, wait);

    return (...args: Parameters<FunctionType>): ReturnType<FunctionType> =>
        new Promise((resolve, reject) => {
            resolveSet.add(resolve);
            rejectSet.add(reject);
            debounced(args);
        }) as ReturnType<FunctionType>;
}
