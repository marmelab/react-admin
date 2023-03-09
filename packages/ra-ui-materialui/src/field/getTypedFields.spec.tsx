import * as React from 'react';
import { expectTypeOf } from 'expect-type';
import { getTypedFields } from './getTypedFields';
import { RaRecord } from 'ra-core';

describe('getTypedFields', () => {
    interface Post extends RaRecord {
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
