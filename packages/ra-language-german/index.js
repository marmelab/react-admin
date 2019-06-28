module.exports = {
    ra: {
        action: {
            add_filter: 'Filter hinzufügen',
            add: 'Hinzufügen',
            back: 'Zurück',
            bulk_actions: '1 Element ausgewählt |||| %{smart_count} Elemente ausgewählt',
            cancel: 'Abbrechen',
            clear_input_value: 'Wert zurücksetzten',
            clone: 'Klonen',
            confirm: 'Bestätigen',
            create: 'Erstellen',
            delete: 'Löschen',
            edit: 'Bearbeiten',
            export: 'Exportieren',
            list: 'Liste',
            refresh: 'Aktualisieren',
            remove_filter: 'Filter entfernen',
            remove: 'Entfernen',
            save: 'Speichern',
            search: 'Suchen',
            show: 'Anzeigen',
            sort: 'Sortieren',
            undo: 'Rückgängig machen',
            expand: 'Erweitern',
            close: 'Schliessen',
        },
        boolean: {
            true: 'Ja',
            false: 'Nein',
        },
        page: {
            create: 'Erstelle %{name}',
            dashboard: 'Übersicht',
            edit: '%{name} #%{id}',
            error: 'Etwas ist schief gelaufen',
            list: '%{name}',
            loading: 'Lade',
            not_found: 'Nicht gefunden',
            show: '%{name} #%{id}',
        },
        input: {
            file: {
                upload_several:
                    'Um Dateien hochzuladen, lege sie hier ab oder klicke, um sie auszuwählen.',
                upload_single: 'Um eine Datei hochzuladen, lege sie hier ab oder klicke, um sie auszuwählen.',
            },
            image: {
                upload_several:
                    'Um Bilder hochzuladen, lege sie hier ab oder klicke, um sie auszuwählen.',
                upload_single:
                    'Um ein Bild hochzuladen, lege es hier ab oder klicke, um eines auszuwählen.',
            },
            references: {
                all_missing: 'Referenzierte Felder konnten nicht gefunden werden.',
                many_missing:
                    'Mindestens eine Referenz scheint nicht länger verfügbar zu sein.',
                single_missing:
                    'Die Referenzen scheinen nicht länger verfügbar zu sein.',
            },
        },
        message: {
            about: 'Info',
            are_you_sure: 'Sind Sie sicher?',
            bulk_delete_content:
                'Sind Sie sicher, dass Sie %{name} löschen wollen? |||| Sind Sie sicher, dass Sie %{smart_count} Elemente löschen wollen?',
            bulk_delete_title:
                'Lösche %{name} |||| Lösche %{smart_count} %{name}',
            delete_content: 'Sind Sie sicher, dass Sie dieses Element löschen wollen?',
            delete_title: 'Lösche %{name} #%{id}',
            details: 'Details',
            error:
                "Ein Fehler auf der Klient-Seite ist aufgetaucht und Ihre Anfrage konnte nicht durchgeführt werden.",
            invalid_form: 'Die Daten sind ungültig. Bitte überprüfen Sie die Eingabgen.',
            loading: 'Die Seite wird geladen. Einen Augenblick bitte.',
            no: 'Nein',
            not_found:
                'Entweder Sie haben eine falsche URL eingegeben oder sind einem ungültigen Link gefolgt.',
            yes: 'Ja',
        },
        navigation: {
            no_results: 'Keine Resultate gefunden',
            no_more_results:
                'Die Seitenzahl %{page} ist zu gross. Versuchen Sie es mit einer vorherigen Seite.',
            page_out_of_boundaries: 'Die Seitezahl %{page} existiert nicht',
            page_out_from_end: 'Keine nächste Seite',
            page_out_from_begin: 'Keine vorherige Seite',
            page_range_info: '%{offsetBegin}-%{offsetEnd} von %{total}',
            page_rows_per_page: 'Zeilen pro Seite:',
            next: 'Nächste',
            prev: 'Zurück',
        },
        auth: {
            user_menu: 'Profil',
            username: 'Benutzername',
            password: 'Passwort',
            sign_in: 'Anmelden',
            sign_in_error: 'Anmeldung fehlgeschlagen, bitte versuchen Sie es erneut',
            logout: 'Abmelden',
        },
        notification: {
            updated: 'Element aktualisiert |||| %{smart_count} Elemente aktualisiert',
            created: 'Element erstellt',
            deleted: 'Element gelöscht |||| %{smart_count} Elemente gelöscht',
            bad_item: 'Ungültiges Element',
            item_doesnt_exist: 'Element existiert nicht',
            http_error: 'Kommunikation mit Server fehlgeschlagen',
            data_provider_error:
                'Fehler mit dem dataProvider. Bitte Konsole überprüfen.',
            canceled: 'Aktion abgebrochen',
            logged_out: 'Deine Sitzung ist abgelaufen, bitte erneut verbinden.',
        },
        validation: {
            required: 'Obligatorisch',
            minLength: 'Muss mindestens %{min} Zeichen sein',
            maxLength: 'Darf höchstens %{max} Zeichen sein',
            minValue: 'Muss mindestens %{min} sein',
            maxValue: 'Darf höchstens %{max} sein',
            number: 'Muss eine Nummer sein',
            email: 'Muss eine gültige E-Mail-Adresse sein',
            oneOf: 'Muss eine der folgenden Optionen sein: %{options}',
            regex: 'Muss das Format einhalten (regexp): %{pattern}',
        },
    },
};
