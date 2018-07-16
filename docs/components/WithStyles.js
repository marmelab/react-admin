import jss from 'jss';

const WithStyles = ({ styles, children, ...rest }) =>
    children({
        classes: jss.createStyleSheet(styles).attach().classes,
        ...rest,
    });

export default WithStyles;
