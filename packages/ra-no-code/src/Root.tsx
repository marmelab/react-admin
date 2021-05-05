import { RaThemeOptions } from 'ra-ui-materialui';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Admin } from './Admin';
import { ApplicationContext } from './ApplicationContext';
import { ApplicationsDashboard } from './ApplicationsDashboard';

export const Root = ({ theme }: { theme: RaThemeOptions }) => {
    const [application, setApplication] = useState();

    const handleExitApplication = () => {
        setApplication(undefined);
    };

    const handleApplicationSelected = selectedApplication => {
        setApplication(selectedApplication);
    };

    const context = useMemo(
        () => ({
            application,
            onExit: handleExitApplication,
        }),
        [application]
    );

    if (context.application) {
        return (
            <ApplicationContext.Provider value={context}>
                <Admin theme={theme} />
            </ApplicationContext.Provider>
        );
    }

    return (
        <ApplicationsDashboard
            onApplicationSelected={handleApplicationSelected}
            theme={theme}
        />
    );
};
