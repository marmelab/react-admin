import * as React from 'react';
import { useMemo, useState } from 'react';
import { Admin } from './Admin';
import { ApplicationContext } from './ApplicationContext';
import { ApplicationsDashboard } from './ApplicationsDashboard';

export const Root = () => {
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
                <Admin />
            </ApplicationContext.Provider>
        );
    }

    return (
        <ApplicationsDashboard
            onApplicationSelected={handleApplicationSelected}
        />
    );
};
