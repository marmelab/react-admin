import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    Errored,
    Loading,
    WithRenderProp,
} from './ReferenceArrayFieldBase.stories';

import { ReferenceArrayFieldBase } from './ReferenceArrayFieldBase';
import { useResourceContext } from '../../core/useResourceContext';
import { testDataProvider } from '../../dataProvider/testDataProvider';
import { CoreAdminContext } from '../../core/CoreAdminContext';

describe('ReferenceArrayFieldBase', () => {
    it('should display an error if error is defined', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        render(<Errored />);
        await waitFor(() => {
            expect(screen.queryByText('Error: Error')).not.toBeNull();
        });
    });

    it('should pass the loading state', async () => {
        jest.spyOn(console, 'error')
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {});

        render(<Loading />);
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeNull();
        });
    });
    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const resource = useResourceContext();
            return <div>{resource}</div>;
        };
        const dataProvider = testDataProvider({
            getList: () =>
                // @ts-ignore
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldBase reference="posts" source="post_id">
                    <MyComponent />
                </ReferenceArrayFieldBase>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('posts')).not.toBeNull();
        });
    });

    it('should render the data', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.queryByText('John Lennon')).not.toBeNull();
            expect(screen.queryByText('Paul McCartney')).not.toBeNull();
            expect(screen.queryByText('Ringo Star')).not.toBeNull();
            expect(screen.queryByText('George Harrison')).not.toBeNull();
            expect(screen.queryByText('Mick Jagger')).not.toBeNull();
            expect(screen.queryByText('Keith Richards')).not.toBeNull();
            expect(screen.queryByText('Ronnie Wood')).not.toBeNull();
            expect(screen.queryByText('Charlie Watts')).not.toBeNull();
        });
    });

    it('should support renderProp', async () => {
        render(<WithRenderProp />);
        await waitFor(() => {
            expect(screen.queryByText('John Lennon')).not.toBeNull();
            expect(screen.queryByText('Paul McCartney')).not.toBeNull();
            expect(screen.queryByText('Ringo Star')).not.toBeNull();
            expect(screen.queryByText('George Harrison')).not.toBeNull();
            expect(screen.queryByText('Mick Jagger')).not.toBeNull();
            expect(screen.queryByText('Keith Richards')).not.toBeNull();
            expect(screen.queryByText('Ronnie Wood')).not.toBeNull();
            expect(screen.queryByText('Charlie Watts')).not.toBeNull();
        });
    });
});
