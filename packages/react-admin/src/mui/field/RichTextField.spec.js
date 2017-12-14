import React from 'react';
import assert from 'assert';
import { render, shallow } from 'enzyme';
import { html } from 'cheerio';
import RichTextField, { removeTags } from './RichTextField';

describe('stripTags', () => {
    test('should strip HTML tags from input', () => {
        assert.equal(removeTags('<h1>Hello world!</h1>'), 'Hello world!');
        assert.equal(removeTags('<p>Cake is a lie</p>'), 'Cake is a lie');
    });

    test('should strip HTML tags even with attributes', () => {
        assert.equal(
            removeTags('<a href="http://www.zombo.com">Zombo</a>'),
            'Zombo'
        );
        assert.equal(
            removeTags(
                '<a target="_blank" href="http://www.zombo.com">Zombo</a>'
            ),
            'Zombo'
        );
    });

    test('should strip HTML tags splitted on several lines', () => {
        assert.equal(
            removeTags(`<a
            href="http://www.zombo.com"
        >Zombo</a>`),
            'Zombo'
        );
    });

    test('should strip HTML embedded tags', () => {
        assert.equal(
            removeTags(
                '<marquee><a href="http://www.zombo.com">Zombo</a></marquee>'
            ),
            'Zombo'
        );
    });

    test('should strip HTML tags even if they are malformed', () => {
        assert.equal(
            removeTags('<p>All our base is belong to us.<p>'),
            'All our base is belong to us.'
        );
    });
});

describe('<RichTextField />', () => {
    test('should render as HTML', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(<RichTextField record={record} source="body" />);
        assert.equal(
            html(wrapper),
            '<span class="MuiTypography-root-1 MuiTypography-body1-10"><h1>Hello world!</h1></span>'
        );
    });

    test('should handle deep fields', () => {
        const record = { foo: { body: '<h1>Hello world!</h1>' } };
        const wrapper = render(
            <RichTextField record={record} source="foo.body" />
        );
        assert.equal(
            html(wrapper),
            '<span class="MuiTypography-root-1 MuiTypography-body1-10"><h1>Hello world!</h1></span>'
        );
    });

    test('should strip HTML tags if stripTags is set to true', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(
            <RichTextField stripTags={true} record={record} source="body" />
        );
        assert.equal(
            html(wrapper),
            '<span class="MuiTypography-root-1 MuiTypography-body1-10">Hello world!</span>'
        );
    });

    test('should not strip HTML tags if stripTags is set to false', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(
            <RichTextField stripTags={false} record={record} source="body" />
        );
        assert.equal(
            html(wrapper),
            '<span class="MuiTypography-root-1 MuiTypography-body1-10"><h1>Hello world!</h1></span>'
        );
    });

    test('should use custom className', () =>
        assert.deepEqual(
            shallow(
                <RichTextField
                    record={{ foo: true }}
                    source="body"
                    className="foo"
                />
            ).prop('className'),
            'foo'
        ));
});
