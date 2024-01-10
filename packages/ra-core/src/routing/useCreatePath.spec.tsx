import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { CreatePathType, useCreatePath } from './useCreatePath';
import { AtRoot, SubPath } from './useCreatePath.stories';
import { Identifier } from '../types';

describe('useCreatePath', () => {
    beforeEach(() => {
        window.history.replaceState({}, '', '/');
    });

    const UseCreatePath = ({
        resource,
        type,
        id,
    }: {
        resource: string;
        type: CreatePathType;
        id?: Identifier;
    }) => {
        const createPath = useCreatePath();
        const path = createPath({ resource, type, id });
        return <div>{path}</div>;
    };

    it('creates links for list views', () => {
        render(<UseCreatePath resource="posts" type="list" />);
        screen.getByText('/posts');
    });

    it('creates links for create views', () => {
        render(<UseCreatePath resource="posts" type="create" />);
        screen.getByText('/posts/create');
    });

    it('creates links for edit views', () => {
        render(<UseCreatePath resource="posts" type="edit" id="1234" />);
        screen.getByText('/posts/1234');
    });

    it('creates links for show views', () => {
        render(<UseCreatePath resource="posts" type="show" id="1234" />);
        screen.getByText('/posts/1234/show');
    });

    it('removes double slashes', () => {
        render(<UseCreatePath resource="/posts" type="edit" id="1234" />);
        screen.getByText('/posts/1234');
    });

    it('creates valid links when used without a basename', async () => {
        render(<AtRoot />);
        await screen.findByText('Home');
        screen.getByText('Post list').click();
        await screen.findByText('Posts');
        screen.getByText('Home').click();
        screen.getByText('Post detail').click();
        await screen.findByText('Post 123');
    });

    it('creates valid links when used with a basename', async () => {
        render(<SubPath />);
        await screen.findByText('Main');
        screen.getByText('Go to admin').click();
        await screen.findByText('Home');
        screen.getByText('Post list').click();
        await screen.findByText('Posts');
        screen.getByText('Home').click();
        screen.getByText('Post detail').click();
        await screen.findByText('Post 123');
    });
});
