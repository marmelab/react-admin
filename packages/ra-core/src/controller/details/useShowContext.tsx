import { useContext } from 'react';
import { Record } from '../../types';
import { ShowContext } from './ShowContext';
import { ShowControllerProps } from './useShowController';

export const useShowContext = <RecordType extends Record = Record>(
    props?: Partial<ShowControllerProps<RecordType>>
): Partial<ShowControllerProps<RecordType>> => {
    // Can't find a way to specify the RecordType when CreateContext is declared
    // @ts-ignore
    const context = useContext<ShowControllerProps<RecordType>>(ShowContext);

    if (!context.resource) {
        /**
         * The element isn't inside a <ShowContext.Provider>
         * To avoid breakage in that case, fallback to props
         *
         * @deprecated - to be removed in 4.0
         */
        if (process.env.NODE_ENV !== 'production') {
            console.log(
                "Show components must be used inside a <ShowContext.Provider>. Relying on props rather than context to get Show data and callbacks is deprecated and won't be supported in the next major version of react-admin."
            );
        }
        return props;
    }

    return context;
};
