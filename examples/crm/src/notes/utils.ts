export const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString();
};

export const formatNoteDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString();
};
