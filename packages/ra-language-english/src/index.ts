import { TranslationMessages } from 'ra-core';

const englishMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: 'Add filter',
            add: 'Add',
            back: 'Go Back',
            bulk_actions: '1 item selected |||| %{smart_count} items selected',
            cancel: 'Cancel',
            clear_input_value: 'Clear value',
            clone: 'Clone',
            confirm: 'Confirm',
            create: 'Create',
            delete: 'Delete',
            edit: 'Edit',
            export: 'Export',
            list: 'List',
            refresh: 'Refresh',
            remove_filter: 'Remove this filter',
            remove: 'Remove',
            save: 'Save',
            search: 'Search',
            show: 'Show',
            sort: 'Sort',
            undo: 'Undo',
            unselect: 'Unselect',
            expand: 'Expand',
            close: 'Close',
            open_menu: 'Open menu',
            close_menu: 'Close menu',
        },
        boolean: {
            true: 'Yes',
            false: 'No',
            null: '',
        },
        page: {
            create: 'Create %{name}',
            dashboard: 'Dashboard',
            edit: '%{name} #%{id}',
            error: 'Something went wrong',
            list: '%{name}',
            loading: 'Loading',
            not_found: 'Not Found',
            show: '%{name} #%{id}',
            empty: 'No %{name} yet.',
            invite: 'Do you want to add one?',
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
            password: {
                toggle_visible: 'Hide password',
                toggle_hidden: 'Show password',
            },
        },
        message: {
            about: 'About',
            are_you_sure: 'Are you sure?',
            bulk_delete_content:
                'Are you sure you want to delete this %{name}? |||| Are you sure you want to delete these %{smart_count} items?',
            bulk_delete_title:
                'Delete %{name} |||| Delete %{smart_count} %{name}',
            delete_content: 'Are you sure you want to delete this item?',
            delete_title: 'Delete %{name} #%{id}',
            details: 'Details',
            error:
                "A client error occurred and your request couldn't be completed.",
            invalid_form: 'The form is not valid. Please check for errors',
            loading: 'The page is loading, just a moment please',
            no: 'No',
            not_found:
                'Either you typed a wrong URL, or you followed a bad link.',
            yes: 'Yes',
            unsaved_changes:
                "Some of your changes weren't saved. Are you sure you want to ignore them?",
        },
        navigation: {
            no_results: 'No results found',
            no_more_results:
                'The page number %{page} is out of boundaries. Try the previous page.',
            page_out_of_boundaries: 'Page number %{page} out of boundaries',
            page_out_from_end: 'Cannot go after last page',
            page_out_from_begin: 'Cannot go before page 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            page_rows_per_page: 'Rows per page:',
            next: 'Next',
            prev: 'Prev',
        },
        sort: {
            sort_by: 'Sort by %{field} %{order}',
            ASC: 'ascending',
            DESC: 'descending',
        },
        auth: {
            auth_check_error: 'Please login to continue',
            user_menu: 'Profile',
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
            data_provider_error:
                'dataProvider error. Check the console for details.',
            i18n_error:
                'Cannot load the translations for the specified language',
            canceled: 'Action cancelled',
            logged_out: 'Your session has ended, please reconnect.',
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

export default englishMessages;
