import * as React from 'react';
import {
    useCreatePath,
    useGetRecordId,
    useListIdsContext,
    useResourceContext,
} from 'ra-core';
import IconButton from '@mui/material/IconButton';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useMatch, useNavigate } from 'react-router';

export const PrevNextButton = () => {
    const listIds = useListIdsContext();
    const navigate = useNavigate();
    const recordId = useGetRecordId();
    const resource = useResourceContext();
    const createPath = useCreatePath();
    const type = useMatch('edit') ? 'edit' : 'show';

    if (!recordId) return null;

    const index = listIds.indexOf(recordId);
    const previousId = index > 0 ? listIds[index - 1] : null;
    const nextId =
        index !== -1 && index < listIds.length - 1 ? listIds[index + 1] : null;

    const handleClickPrev = () => {
        const link = createPath({
            type,
            resource,
            id: previousId,
        });
        navigate(link);
    };

    const handleClickNext = () => {
        const link = createPath({
            type,
            resource,
            id: nextId,
        });
        navigate(link);
    };

    return (
        <>
            {previousId && (
                <IconButton aria-label="previous" onClick={handleClickPrev}>
                    <NavigateBefore />
                </IconButton>
            )}
            {nextId && (
                <IconButton aria-label="next" onClick={handleClickNext}>
                    <NavigateNext />
                </IconButton>
            )}
        </>
    );
};
