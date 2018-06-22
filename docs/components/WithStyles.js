import { cloneElement } from 'react';
import jss from 'jss';

const WithStyles = ({ styles, children }) =>
    children({
        classes: jss.createStyleSheet(styles).attach().classes,
    });

export default WithStyles;
