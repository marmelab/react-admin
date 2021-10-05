import React from 'react';
import { Ready as RaReady } from 'react-admin';
import { ImportResourceDialog } from './ImportResourceDialog';

export const Ready = () => (
    <>
        <RaReady />
        <ImportResourceDialog open />
    </>
);
