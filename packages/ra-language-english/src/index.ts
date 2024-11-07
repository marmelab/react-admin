import { TranslationMessages } from 'ra-core';

const englishMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: 'Add filter',
            add: 'Add',
            back: 'Go Back',
            bulk_actions: '1 item selected |||| %{smart_count} items selected',
            cancel: 'Cancel',
            clear_array_input: 'Clear the list',
            clear_input_value: 'Clear value',
            clone: 'Clone',
            confirm: 'Confirm',
            create: 'Create',
            create_item: 'Create %{item}',
            delete: 'Delete',
            edit: 'Edit',
            export: 'Export',
            list: 'List',
            refresh: 'Refresh',
            remove_filter: 'Remove this filter',
            remove_all_filters: 'Remove all filters',
            remove: 'Remove',
            save: 'Save',
            search: 'Search',
            select_all: 'Select all',
            select_row: 'Select this row',
            show: 'Show',
            sort: 'Sort',
            undo: 'Undo',
            unselect: 'Unselect',
            expand: 'Expand',
            close: 'Close',
            open_menu: 'Open menu',
            close_menu: 'Close menu',
            update: 'Update',
            move_up: 'Move up',
            move_down: 'Move down',
            open: 'Open',
            toggle_theme: 'Toggle light/dark mode',
            select_columns: 'Columns',
            update_application: 'Reload Application',
        },
        boolean: {
            true: 'Yes',
            false: 'No',
            null: ' ',
        },
        page: {
            create: 'Create %{name}',
            dashboard: 'Dashboard',
            edit: '%{name} %{recordRepresentation}',
            error: 'Something went wrong',
            list: '%{name}',
            loading: 'Loading',
            not_found: 'Not Found',
            show: '%{name} %{recordRepresentation}',
            empty: 'No %{name} yet.',
            invite: 'Do you want to add one?',
            access_denied: 'Access denied',
            authentication_error: 'Authentication error',
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
            auth_error:
                'An error occurred while validating the authentication token.',
            bulk_delete_content:
                'Are you sure you want to delete this %{name}? |||| Are you sure you want to delete these %{smart_count} items?',
            bulk_delete_title:
                'Delete %{name} |||| Delete %{smart_count} %{name}',
            bulk_update_content:
                'Are you sure you want to update this %{name}? |||| Are you sure you want to update these %{smart_count} items?',
            bulk_update_title:
                'Update %{name} |||| Update %{smart_count} %{name}',
            clear_array_input: 'Are you sure you want to clear the whole list?',
            delete_content: 'Are you sure you want to delete this item?',
            delete_title: 'Delete %{name} #%{id}',
            details: 'Details',
            error: "A client error occurred and your request couldn't be completed.",

            invalid_form: 'The form is not valid. Please check for errors',
            loading: 'Please wait',
            no: 'No',
            not_found:
                'Either you typed a wrong URL, or you followed a bad link.',
            yes: 'Yes',
            unsaved_changes:
                "Some of your changes weren't saved. Are you sure you want to ignore them?",
            access_denied:
                "You don't have the right permissions to access this page",
            authentication_error:
                'The authentication server returned an error and your credentials could not be checked.',
        },
        navigation: {
            clear_filters: 'Clear filters',
            no_filtered_results: 'No %{name} found using the current filters.',
            no_results: 'No %{name} found',
            no_more_results:
                'The page number %{page} is out of boundaries. Try the previous page.',
            page_out_of_boundaries: 'Page number %{page} out of boundaries',
            page_out_from_end: 'Cannot go after last page',
            page_out_from_begin: 'Cannot go before page 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}',
            current_page: 'Page %{page}',
            page: 'Go to page %{page}',
            first: 'Go to first page',
            last: 'Go to last page',
            next: 'Go to next page',
            previous: 'Go to previous page',
            page_rows_per_page: 'Rows per page:',
            skip_nav: 'Skip to content',
        },
        sort: {
            sort_by: 'Sort by %{field_lower_first} %{order}',
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
            not_authorized: "You're not authorized to access this resource.",
            application_update_available: 'A new version is available.',
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
            unique: 'Must be unique',
        },
        saved_queries: {
            label: 'Saved queries',
            query_name: 'Query name',
            new_label: 'Save current query...',
            new_dialog_title: 'Save current query as',
            remove_label: 'Remove saved query',
            remove_label_with_name: 'Remove query "%{name}"',
            remove_dialog_title: 'Remove saved query?',
            remove_message:
                'Are you sure you want to remove that item from your list of saved queries?',
            help: 'Filter the list and save this query for later',
        },
        configurable: {
            customize: 'Customize',
            configureMode: 'Configure this page',
            inspector: {
                title: 'Inspector',
                content: 'Hover the application UI elements to configure them',
                reset: 'Reset Settings',
                hideAll: 'Hide All',
                showAll: 'Show All',
            },
            Datagrid: {
                title: 'Datagrid',
                unlabeled: 'Unlabeled column #%{column}',
            },
            SimpleForm: {
                title: 'Form',
                unlabeled: 'Unlabeled input #%{input}',
            },
            SimpleList: {
                title: 'List',
                primaryText: 'Primary text',
                secondaryText: 'Secondary text',
                tertiaryText: 'Tertiary text',
            },
        },
    },
};

export default englishMessages;
