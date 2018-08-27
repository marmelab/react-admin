/* eslint-disable no-console */
import { ToggleButtons } from '@material-ui/core';

// ToogleButtons was introduced on Material-UI 1.4.0
// which is the minimum supported version of React Admin
// https://github.com/mui-org/material-ui/releases/tag/v1.4.0
const muiVersionIsSupported = !!ToggleButtons;

export const warnForUnsupportedMuiVersion = () => {
    if (process.env.NODE_ENV !== 'production' && !muiVersionIsSupported) {
        console.error(
            `Your version of @material-ui/core is not supported by ra-ui-materialui!
            Please install @material-ui/core@^1.4.0 in order to avoid uncertain UI behaviors on production.
            More infos at https://github.com/marmelab/react-admin/issues/1782`
        );
    }
};
