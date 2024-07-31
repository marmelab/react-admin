export const getCurrentDate = () => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString();
};

export const formatNoteDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
};
