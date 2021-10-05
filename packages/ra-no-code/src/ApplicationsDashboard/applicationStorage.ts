export const loadApplicationsFromStorage = () => {
    const storedValue = window.localStorage.getItem(
        '@@ra-no-code/applications'
    );

    if (storedValue) {
        return JSON.parse(storedValue);
    }

    return [];
};

export const storeApplicationsInStorage = applications => {
    window.localStorage.setItem(
        '@@ra-no-code/applications',
        JSON.stringify(applications)
    );
};
