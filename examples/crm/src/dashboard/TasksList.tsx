import * as React from 'react';
import { Card, Box, Stack, Typography } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { AddTask } from '../tasks/AddTask';
import {
    startOfToday,
    endOfToday,
    endOfTomorrow,
    endOfWeek,
    getDay,
} from 'date-fns';
import { TasksListFilter } from './TasksListFilter';
import { TasksListEmpty } from './TasksListEmpty';

const today = new Date();
const todayDayOfWeek = getDay(today);
const isBeforeFriday = todayDayOfWeek < 5; // Friday is represented by 5
const startOfTodayDateISO = startOfToday().toISOString();
const endOfTodayDateISO = endOfToday().toISOString();
const endOfTomorrowDateISO = endOfTomorrow().toISOString();
const endOfWeekDateISO = endOfWeek(today, { weekStartsOn: 0 }).toISOString();

const taskFilters = {
    overdue: { 'done_date@is': null, 'due_date@lt': startOfTodayDateISO },
    today: {
        'done_date@is': null,
        'due_date@gte': startOfTodayDateISO,
        'due_date@lte': endOfTodayDateISO,
    },
    tomorrow: {
        'done_date@is': null,
        'due_date@gt': endOfTodayDateISO,
        'due_date@lt': endOfTomorrowDateISO,
    },
    thisWeek: {
        'done_date@is': null,
        'due_date@gte': endOfTomorrowDateISO,
        'due_date@lte': endOfWeekDateISO,
    },
    later: { 'done_date@is': null, 'due_date@gt': endOfWeekDateISO },
};

export const TasksList = () => {
    return (
        <Stack>
            <Box display="flex" alignItems="center" mb={1}>
                <Box mr={1} display="flex">
                    <AssignmentTurnedInIcon
                        color="disabled"
                        fontSize="medium"
                    />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    Upcoming Tasks
                </Typography>
                <AddTask display="icon" selectContact />
            </Box>
            <Card sx={{ p: 2 }}>
                <Stack>
                    <TasksListEmpty />
                    <TasksListFilter
                        title="Overdue"
                        filter={taskFilters.overdue}
                    />
                    <TasksListFilter title="Today" filter={taskFilters.today} />
                    <TasksListFilter
                        title="Tomorrow"
                        filter={taskFilters.tomorrow}
                    />
                    {isBeforeFriday && (
                        <TasksListFilter
                            title="This week"
                            filter={taskFilters.thisWeek}
                        />
                    )}
                    <TasksListFilter title="Later" filter={taskFilters.later} />
                </Stack>
            </Card>
        </Stack>
    );
};
