module.exports = {
    ra: {
        action: {
            delete: 'Delete',
            show: 'Show',
            list: 'List',
            save: 'Save',
            create: 'Create',
            edit: 'Edit',
            sort: 'Sort',
            cancel: 'Cancel',
            undo: 'Undo',
            refresh: 'Refresh',
            add_filter: 'Add filter',
            remove_filter: 'Remove this filter',
            back: 'Go Back',
            bulk_actions: '%{smart_count} selected',
        },
        boolean: {
            true: 'Yes',
            false: 'No',
        },
        page: {
            list: '%{name} List',
            edit: '%{name} #%{id}',
            show: '%{name} #%{id}',
            create: 'Create %{name}',
            dashboard: 'Dashboard',
            not_found: 'Not Found',
            loading: 'Loading',
        },
        input: {
            file: {
                upload_several:
                    'Drop some files to upload, or click to select one.',
                upload_single: 'Drop a file to upload, or click to select it.',
            },
            image: {
                upload_several:
                    'Drop some pictures to upload, or click to select one.',
                upload_single:
                    'Drop a picture to upload, or click to select it.',
            },
            references: {
                all_missing: 'Unable to find references data.',
                many_missing:
                    'At least one of the associated references no longer appears to be available.',
                single_missing:
                    'Associated reference no longer appears to be available.',
            },
        },
        message: {
            yes: 'Yes',
            no: 'No',
            are_you_sure: 'Are you sure?',
            about: 'About',
            not_found:
                'Either you typed a wrong URL, or you followed a bad link.',
            loading: 'The page is loading, just a moment please',
            invalid_form: 'The form is not valid. Please check for errors',
            delete_title: 'Delete %{name} #%{id}',
            delete_content: 'Are you sure you want to delete this item?',
            bulk_delete_title:
                'Delete %{name} |||| Delete %{smart_count} %{name} items',
            bulk_delete_content:
                'Are you sure you want to delete this %{name}? |||| Are you sure you want to delete these %{smart_count} items?',
        },
        navigation: {
            no_results: 'No results found',
            no_more_results:
                'The page number %{page} is out of boundaries. Try the previous page.',
            page_out_of_boundaries: 'Page number %{page} out of boundaries',
            page_out_from_end: 'Cannot go after last page',
            page_out_from_begin: 'Cannot go before page 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            next: 'Next',
            prev: 'Prev',
        },
        auth: {
            username: 'Username',
            password: 'Password',
            sign_in: 'Sign in',
            sign_in_error: 'Authentication failed, please retry',
            logout: 'Logout',
        },
        notification: {
            updated: 'Element updated |||| %{smart_count} elements updated',
            created: 'Element created',
            deleted: 'Element deleted |||| %{smart_count} elements deleted',
            bad_item: 'Incorrect element',
            item_doesnt_exist: 'Element does not exist',
            http_error: 'Server communication error',
            canceled: 'Action cancelled',
        },
        validation: {
            required: 'Required',
            minLength: 'Must be %{min} characters at least',
            maxLength: 'Must be %{max} characters or less',
            minValue: 'Must be at least %{min}',
            maxValue: 'Must be %{max} or less',
            number: 'Must be a number',
            email: 'Must be a valid email',
            oneOf: 'Must be one of: %{options}',
            regex: 'Must match a specific format (regexp): %{pattern}',
        },
    },
};
