import { TranslationMessages } from 'ra-core';

const germanMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: 'Filter hinzufügen',
            add: 'Neu',
            back: 'Zurück',
            bulk_actions:
                'Ein Element ausgewählt |||| %{smart_count} Elemente ausgewählt',
            cancel: 'Abbrechen',
            clear_input_value: 'Eingabe löschen',
            clone: 'Klonen',
            confirm: 'Bestätigen',
            create: 'Erstellen',
            create_item: ' %{item} erstellen',
            delete: 'Löschen',
            edit: 'Bearbeiten',
            export: 'Exportieren',
            list: 'Liste',
            refresh: 'Aktualisieren',
            remove_filter: 'Filter entfernen',
            remove: 'Entfernen',
            save: 'Speichern',
            select_all: 'Alle auswählen',
            select_row: 'Zeile auswählen',
            search: 'Suchen',
            show: 'Anzeigen',
            sort: 'Sortieren',
            undo: 'Rückgängig',
            unselect: 'Auswahl aufheben',
            expand: 'Erweitern',
            close: 'Schließen',
            open_menu: 'Öffnen des Menüs',
            close_menu: 'Schliessen des Menüs',
            update: 'Aktualisieren',
            move_up: 'Nach oben verschieben',
            move_down: 'Nach unten verschieben',
            open: 'Öffnen',
            toggle_theme: 'Nachtmodus umschalten',
        },
        boolean: {
            true: 'Ja',
            false: 'Nein',
            null: ' ',
        },
        page: {
            create: '%{name} erstellen',
            dashboard: 'Dashboard',
            edit: '%{name} bearbeiten',
            error: 'Etwas ist schief gelaufen',
            list: '%{name}',
            loading: 'Die Seite wird geladen.',
            not_found: 'Nicht gefunden',
            show: '%{name} #%{id}',
            empty: 'Noch kein %{name}.',
            invite: 'Neu erstellen?',
        },
        input: {
            file: {
                upload_several:
                    'Zum Hochladen Dateien hineinziehen oder hier klicken, um Dateien auszuwählen.',
                upload_single:
                    'Zum Hochladen Datei hineinziehen oder hier klicken, um eine Datei auszuwählen.',
            },
            image: {
                upload_several:
                    'Zum Hochladen Bilder hineinziehen oder hier klicken, um Bilder auszuwählen.',
                upload_single:
                    'Zum Hochladen Bild hineinziehen oder hier klicken, um ein Bild auszuwählen.',
            },
            references: {
                all_missing:
                    'Die zugehörigen Referenzen konnten nicht gefunden werden.',
                many_missing:
                    'Mindestens eine der zugehörigen Referenzen scheint nicht mehr verfügbar zu sein.',
                single_missing:
                    'Eine zugehörige Referenz scheint nicht mehr verfügbar zu sein.',
            },
            password: {
                toggle_visible: 'Passwort ausblenden',
                toggle_hidden: 'Passwort einblenden',
            },
        },
        message: {
            about: 'Über',
            are_you_sure: 'Sind Sie sicher?',
            bulk_delete_content:
                'Möchten Sie "%{name}" wirklich löschen? |||| Möchten Sie diese %{smart_count} Elemente wirklich löschen?',
            bulk_delete_title:
                'Lösche %{name} |||| Lösche %{smart_count} %{name} Elemente',
            bulk_update_content:
                'Möchten Sie "%{name}" wirklich aktualisieren? |||| Möchten Sie diese %{smart_count} Elemente wirklich aktualisieren?',
            bulk_update_title:
                'Aktualisiere %{name} |||| Aktualisiere %{smart_count} %{name} Elemente',
            delete_content: 'Möchten Sie diesen Inhalt wirklich löschen?',
            delete_title: 'Lösche %{name} #%{id}',
            details: 'Details',
            error:
                'Beim Laden der Seite ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
            invalid_form:
                'Das Formular enthält ungültige Daten. Bitte korrigieren Sie diese.',
            loading:
                'Die Seite wird geladen. Bitte warten Sie, bis die Seite vollständig geladen ist.',
            no: 'Nein',
            not_found: 'Die Seite konnte nicht gefunden werden.',
            yes: 'Ja',
            unsaved_changes:
                'Einige Änderungen wurden nicht gespeichert. Sind Sie sicher, dass Sie diese Seite verlassen wollen?',
        },
        navigation: {
            no_results: 'Keine Resultate gefunden',
            no_more_results: 'Die Seite %{page} enthält keine Inhalte.',
            page_out_of_boundaries:
                'Die Seite %{page} liegt ausserhalb des gültigen Bereichs',
            page_out_from_end: 'Letzte Seite',
            page_out_from_begin: 'Erste Seite',
            page_range_info: '%{offsetBegin}-%{offsetEnd} von %{total}',
            partial_page_range_info: '%{offsetBegin}-%{offsetEnd} von %{total}',
            page_rows_per_page: '%{page} von %{rowsPerPage}',
            current_page: 'Seite %{currentPage}',
            page: 'Gehe zu Seite %{page}',
            first: 'Gehe zu erste Seite',
            last: 'Gehe zu letzte Seite',
            next: 'Weiter auf die nächste Seite',
            previous: 'Zurück zur vorherigen Seite',
            skip_nav: 'Zum Inhalt springen',
        },
        sort: {
            sort_by: 'Sortiere %{field} %{order}',
            ASC: 'aufsteigend',
            DESC: 'absteigend',
        },
        auth: {
            auth_check_error: 'Bitte verbinden Sie sich um fortzufahren',
            user_menu: 'Profil',
            username: 'Nutzername',
            password: 'Passwort',
            sign_in: 'Anmelden',
            sign_in_error: 'Fehler bei der Anmeldung',
            logout: 'Abmelden',
        },
        notification: {
            updated:
                'Element wurde aktualisiert |||| %{smart_count} Elemente wurden aktualisiert',
            created: 'Element wurde erstellt',
            deleted:
                'Element wurde gelöscht |||| %{smart_count} Elemente wurden gelöscht',
            bad_item: 'Fehlerhaftes Element',
            item_doesnt_exist: 'Das Element existiert nicht',
            http_error: 'Fehler beim Kommunizieren mit dem Server',
            data_provider_error:
                'Fehler im dataProvider. Prüfe die Konsole für Details.',
            i18n_error:
                'Die Übersetzungen für die angegebene Sprache können nicht geladen werden.',
            canceled: 'Aktion abgebrochen',
            logged_out:
                'Ihre Sitzung wurde beendet, bitte verbinden Sie sich neu.',
            not_authorized:
                'Sie sind nicht berechtigt, auf diese Ressource zuzugreifen.',
        },
        validation: {
            required: 'Dieses Feld ist erforderlich',
            minLength: 'Bitte geben Sie mindestens {minLength} Zeichen ein',
            maxLength: 'Bitte geben Sie nicht mehr als {maxLength} Zeichen ein',
            minValue:
                'Bitte geben Sie einen Wert größer oder gleich {minValue} ein',
            maxValue:
                'Bitte geben Sie einen Wert kleiner oder gleich {maxValue} ein',
            number: 'Bitte geben Sie eine Zahl ein',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            oneOf: 'Bitte wählen Sie einen der folgenden Werte aus: {values}',
            regex:
                'Bitte geben Sie einen Wert ein, der dem Muster "{regex}" entspricht',
        },
        saved_queries: {
            label: 'Meine Anfragen',
            query_name: 'Name der Anfrage',
            new_label: 'Zu meinen Anfragen hinzufügen...',
            new_dialog_title:
                'Die aktuelle Anfrage zu meinen Anfragen hinzufügen',
            remove_label: 'Aus meinen Anfragen entfernen',
            remove_label_with_name:
                '"%{name}" aus meinen Suchanfragen entfernen',
            remove_dialog_title: 'Aus meinen Suchanfragen löschen?',
            remove_message:
                'Sind Sie sicher, dass Sie diese Anfrage aus Ihrer Anfrageliste entfernen möchten?',
            help:
                'Filtern Sie die Liste und fügen Sie diese Anfrage zu Ihrer Liste hinzu',
        },
    },
};

export default germanMessages;
