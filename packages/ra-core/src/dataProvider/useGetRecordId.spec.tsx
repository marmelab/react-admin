import * as React from 'react';
import { useGetRecordId } from './useGetRecordId';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecordContextProvider } from '..';

describe('useGetRecordId', () => {
    const UseGetRecordId = (props: any) => {
        const recordId = useGetRecordId(props.id);
        return <div>{recordId}</div>;
    };

    it('should return the record id it received in options', () => {
        render(<UseGetRecordId id="abc" />);
        expect(screen.queryByText('abc')).not.toBeNull();
    });

    it('should return the record id it received in options even if it is falsy', () => {
        render(<UseGetRecordId id={0} />);
        expect(screen.queryByText('0')).not.toBeNull();
    });

    it('should return the record id it received through the record context', () => {
        render(
            <RecordContextProvider value={{ id: 'abc' }}>
                <UseGetRecordId />
            </RecordContextProvider>
        );
        expect(screen.queryByText('abc')).not.toBeNull();
    });

    it('should return the record id it received through the record context even if it is falsy', () => {
        render(
            <RecordContextProvider value={{ id: 0 }}>
                <UseGetRecordId />
            </RecordContextProvider>
        );
        expect(screen.queryByText('0')).not.toBeNull();
    });

    it('should return the record id parsed from the location', () => {
        render(
            <MemoryRouter initialEntries={['/posts/abc']}>
                <Routes>
                    <Route path="/posts/:id" element={<UseGetRecordId />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.queryByText('abc')).not.toBeNull();
    });

    it('should return the record id parsed from the location even if it is falsy', () => {
        render(
            <MemoryRouter initialEntries={['/posts/0']}>
                <Routes>
                    <Route path="/posts/:id" element={<UseGetRecordId />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.queryByText('0')).not.toBeNull();
    });
});
