import * as React from 'react';
import { useState } from 'react';
import { Admin } from './Admin';
import { ApplicationsDashboard } from './ApplicationsDashboard';

export const Root = () => {
    const [application, setApplication] = useState();

    const handleApplicationSelected = selectedApplication => {
        setApplication(selectedApplication);
    };

    if (application) {
        return <Admin application={application} />;
    }

    return (
        <ApplicationsDashboard
            onApplicationSelected={handleApplicationSelected}
        />
    );
};
