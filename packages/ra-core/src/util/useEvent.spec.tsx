import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { useEvent } from './useEvent';

describe('useEvent', () => {
    const Parent = () => {
        const [value, setValue] = React.useState(0);
        const handler = useEvent(() => {
            return 1;
        });

        return (
            <>
                <span>Parent {value}</span>;
                <button onClick={() => setValue(val => val + 1)}>Click</button>
                <Child handler={handler} />
            </>
        );
    };

    const Child = React.memo(({ handler }: { handler: () => number }) => {
        const [value, setValue] = React.useState(0);
        React.useEffect(() => {
            setValue(val => val + 1);
        }, [handler]);

        return <span>Child {value}</span>;
    });

    it('should be referentially stable', async () => {
        render(<Parent />);
        expect(screen.getByText('Parent 0')).not.toBeNull();
        expect(screen.getByText('Child 1')).not.toBeNull();
        fireEvent.click(screen.getByText('Click'));
        expect(screen.getByText('Parent 1')).not.toBeNull();
        expect(screen.getByText('Child 1')).not.toBeNull();
        fireEvent.click(screen.getByText('Click'));
        expect(screen.getByText('Parent 2')).not.toBeNull();
        expect(screen.getByText('Child 1')).not.toBeNull();
    });
});
