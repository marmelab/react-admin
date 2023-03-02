import * as React from 'react';
import { expectTypeOf } from 'expect-type';
import { getTypedFields } from './getTypedFields';

describe('getTypedFields', () => {
    type Post = {
        id: number;
        author: {
            name: string;
        };
        tags: {
            name: string;
        }[];
    };

    it('should correctly extract the type paths to restrict the source prop', () => {
        const Fields = getTypedFields<Post>();
        type Source = React.ComponentProps<
            typeof Fields.BooleanField
        >['source'];
        // eslint-disable-next-line prettier/prettier
        type ExpectedSource = 'id' | 'author' | 'author.name' | 'tags' | `tags[${number}]` | `tags[${number}].name`;

        // This will only raise compile-time errors
        expectTypeOf<Source>().toEqualTypeOf<ExpectedSource>();
    });
});
