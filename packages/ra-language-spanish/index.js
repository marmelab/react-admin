module.exports = {
    ra: {
        action: {
            add_filter: 'Añadir filtro',
            add: 'Añadir',
            back: 'Volver',
            bulk_actions: '%{smart_count} seleccionados',
            cancel: 'Cancelar',
            clear_input_value: 'Despejar valor',
            clone: 'Clonar',
            create: 'Crear',
            delete: 'Borrar',
            edit: 'Editar',
            export: 'Exportar',
            list: 'Listar',
            refresh: 'Actualizar',
            remove_filter: 'Eliminar este filtro',
            remove: 'Eliminar',
            save: 'Guardar',
            show: 'Mostrar',
            sort: 'Ordenar',
            undo: 'Deshacer',
        },
        boolean: {
            true: 'Sí',
            false: 'No',
        },
        page: {
            create: 'Crear %{name}',
            dashboard: 'Panel de control',
            edit: '%{name} #%{id}',
            error: 'Algo fué mal.',
            list: 'Listado de %{name}',
            loading: 'Cargando',
            not_found: 'No se encontró',
            show: '%{name} #%{id}',
        },
        input: {
            file: {
                upload_several:
                    'Suelta aquí archivos para subirlos, o haz clic para seleccionarlos.',
                upload_single: 'Suelta aquí el archivo para subirlo, o haz clic para seleccionar uno.',
            },
            image: {
                upload_several:
                    'Suelta aquí imagenes para subirlas, o haz clic para seleccionarlas.',
                upload_single:
                    'Suelta una imagen, o haz clic para seleccionar una.',
            },
            references: {
                all_missing: 'Imposible encontrar referencia de datos.',
                many_missing:
                    'Al menos una de las referencias asociadas parece que ya no está disponible.',
                single_missing:
                    'La referencia asociada parece que ya no está disponible.',
            },
        },
        message: {
            about: 'Acerca de',
            are_you_sure: '¿Está seguro?',
            bulk_delete_content:
                '¿Está seguro que quiere borrar este/a %{name}? |||| ¿Está seguro de que quiere borrar %{smart_count} items?',
            bulk_delete_title:
                'Borrar %{name} |||| Borrar %{smart_count} %{name} items',
            delete_content: '¿Está seguro de que quiere borrar este item?',
            delete_title: 'Borrar %{name} #%{id}',
            details: 'Detalles',
            error:
                "Ocurrió un error de cliente y su petición no se pudo completar.",
            invalid_form: 'El formulario no es válido. Por favor comprueba los errores.',
            loading: 'La página está cargando, un momento por favor.',
            no: 'No',
            not_found:
                'La dirección URL no es válida, quizás la escribiste mal o usaste un link no válido.',
            yes: 'Sí',
        },
        navigation: {
            no_results: 'No se encontraron resultados.',
            no_more_results:
                'La página número %{page} está fuera de rango. Prueba con la anterior.',
            page_out_of_boundaries: 'Página número %{page} fuera de rango',
            page_out_from_end: 'No se puede ir más allá de la última página',
            page_out_from_begin: 'No se puede ir más atrás de la página 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} de %{total}',
            next: 'Siguiente',
            prev: 'Anterior',
        },
        auth: {
            username: 'Nombre de usuario',
            password: 'Contraseña',
            sign_in: 'Iniciar sessión',
            sign_in_error: 'Fallo de autenticación, por favor inténtalo de nuevo',
            logout: 'Cerrar sessión',
        },
        notification: {
            updated: 'Elemento actualizado |||| %{smart_count} elementos actualizados',
            created: 'Elemento creado',
            deleted: 'Elemento borrado |||| %{smart_count} elementos borrados',
            bad_item: 'Elemento incorrecto',
            item_doesnt_exist: 'El elemento no existe',
            http_error: 'Error comunicando con el servidor.',
            data_provider_error:
                'Error "dataProvider". Mira la consola para más detalles.',
            canceled: 'Acción cancelada',
        },
        validation: {
            required: 'Requerido',
            minLength: 'Debe de ser %{min} caracteres mínimo',
            maxLength: 'Debe de ser %{max} caracteres o menos.',
            minValue: 'Debe ser por lo menos %{min}',
            maxValue: 'Debe ser %{max} o menos',
            number: 'Debe ser un número',
            email: 'Debe ser un email válido',
            oneOf: 'Tiene que ser alguno de: %{options}',
            regex: 'Tiene que coincidir con el siguiente formato (expresión regular): %{pattern}',
        },
    },
};
