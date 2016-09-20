import React from 'react';
import assert from 'assert';
import { shallow, render } from 'enzyme';
import RichTextField, { stripTags, truncate } from './RichTextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
    userAgent: false,
});

describe('stripTags', () => {
    it('should strip HTML tags from input', () => {
        assert.equal(stripTags('<h1>Hello world!</h1>'), 'Hello world!');
        assert.equal(stripTags('<p>Cake is a lie</p>'), 'Cake is a lie');
    });

    it('should strip HTML tags even with attributes', () => {
        assert.equal(stripTags('<a href="http://www.zombo.com">Zombo</a>'), 'Zombo');
        assert.equal(stripTags('<a target="_blank" href="http://www.zombo.com">Zombo</a>'), 'Zombo');
    });

    it('should strip HTML tags splitted on several lines', () => {
        assert.equal(stripTags(`<a
            href="http://www.zombo.com"
        >Zombo</a>`), 'Zombo');
    });
});

describe('<RichTextField />', () => {
    it('should strip HTML tags if stripped is set to true', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(<RichTextField stripped={true} record={record} source="body" />);

        assert.equal(wrapper.html(), '<div>Hello world!</div>');
    });

    it('should not strip HTML tags if stripped is set to false', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(<RichTextField stripped={false} record={record} source="body" />);

        assert.equal(wrapper.html(), '<div><h1>Hello world!</h1></div>');
    });
});
