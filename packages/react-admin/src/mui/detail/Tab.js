import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab as MuiTab } from 'material-ui/Tabs';

import Labeled from '../input/Labeled';
import translate from '../../i18n/translate';

/**
 * Tab element for the SimpleShowLayout.
 * 
 * The `<Tab>` component accepts the following props:
 * 
 * - label: The string displayed for each tab
 * - icon: The icon to show before the label (optional). Must be an element.
 * 
 * @example     
 *     // in src/posts.js
 *     import React from 'react';
 *     import FavoriteIcon from 'material-ui-icons/Favorite';
 *     import PersonPinIcon from 'material-ui-icons/PersonPin';
 *     import { Show, TabbedShowLayout, Tab, TextField } from 'react-admin';
 *     
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <TabbedShowLayout>
 *                 <Tab label="Content" icon={<FavoriteIcon />}>
 *                     <TextField source="title" />
 *                     <TextField source="subtitle" />
 *                </Tab>
 *                 <Tab label="Metadata" icon={<PersonIcon />}>
 *                     <TextField source="category" />
 *                </Tab>
 *             </TabbedShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *     
 *     import { PostShow } from './posts';
 *     
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
class Tab extends Component {
    renderHeader = ({ label, icon, value, translate, rest }) => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className="show-tab"
            {...rest}
        />
    );

    renderContent = ({ children, rest }) => (
        <span>
            {React.Children.map(
                children,
                field =>
                    field && (
                        <div
                            key={field.props.source}
                            style={field.props.style}
                            className={`ra-field ra-field-${field.props
                                .source}`}
                        >
                            {field.props.addLabel ? (
                                <Labeled
                                    {...rest}
                                    label={field.props.label}
                                    source={field.props.source}
                                >
                                    {field}
                                </Labeled>
                            ) : typeof field.type === 'string' ? (
                                field
                            ) : (
                                React.cloneElement(field, rest)
                            )}
                        </div>
                    )
            )}
        </span>
    );

    render() {
        const {
            children,
            context,
            icon,
            label,
            translate,
            value,
            ...rest
        } = this.props;
        return context === 'header'
            ? this.renderHeader({ label, icon, value, translate, rest })
            : this.renderContent({ children, rest });
    }
}

Tab.propTypes = {
    context: PropTypes.oneOf(['header', 'content']),
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    value: PropTypes.number,
};

export default translate(Tab);
