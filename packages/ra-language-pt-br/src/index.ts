import { TranslationMessages } from 'ra-core';

const ptBrMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: 'Adicionar filtro',
            add: 'Adicionar',
            back: 'Retornar',
            bulk_actions:
                '%{smart_count} selecionado |||| %{smart_count} selecionados',
            cancel: 'Cancelar',
            clear_input_value: 'Limpar valor',
            clone: 'Duplicar',
            confirm: 'Confirmar',
            create: 'Criar',
            delete: 'Remover',
            edit: 'Alterar',
            export: 'Exportar',
            list: 'Listar',
            refresh: 'Atualizar',
            remove_filter: 'Remover filtro',
            remove: 'Remover',
            save: 'Salvar',
            search: 'Buscar',
            show: 'Mostrar',
            sort: 'Ordenar',
            undo: 'Desfazer',
            expand: 'Expandir',
            close: 'Fechar',
            open_menu: 'Abrir menu',
            close_menu: 'Fechar menu',
        },
        boolean: {
            true: 'Sim',
            false: 'Não',
            null: '',
        },
        page: {
            create: 'Criar %{name}',
            dashboard: 'Dashboard',
            edit: '%{name} #%{id}',
            error: 'Ocorreu um problema',
            list: '%{name}',
            loading: 'Carregando',
            not_found: 'Não encontrado',
            show: '%{name} #%{id}',
            empty: 'Sem %{name} ainda.',
            invite: 'Você quer adicionar um?',
        },
        input: {
            file: {
                upload_several:
                    'Solte arquivos para upload, ou clique para selecionar um.',
                upload_single:
                    'Solte um arquivo para upload, ou clique para selecioná-lo.',
            },
            image: {
                upload_several:
                    'Solte imagens para upload, ou clique para selecionar uma.',
                upload_single:
                    'Solte uma imagem para upload, ou clique para selecioná-la.',
            },
            references: {
                all_missing:
                    'Não foi possível encontrar os dados de referência.',
                many_missing:
                    'Pelo menos uma das referências associadas aparenta não estar mais disponível.',
                single_missing:
                    'A referência associada aparenta não estar mais disponível.',
            },
            password: {
                toggle_visible: 'Ocultar senha',
                toggle_hidden: 'Mostrar senha',
            },
        },
        message: {
            about: 'Sobre',
            are_you_sure: 'Tem certeza?',
            bulk_delete_content:
                'Você tem certeza que quer remover isso %{name}? |||| Você tem certeza que quer remover estes %{smart_count} items?',
            bulk_delete_title: 'Remover %{name} |||| Remover %{smart_count} %{name}',
            delete_content: 'Você tem certeza que quer remover este item?',
            delete_title: 'Remover %{name} #%{id}',
            details: 'Detalhes',
            error:
                'Ocorreu um erro no navegador e seu requisição não foi completada.',
            invalid_form: 'O formulário não é válido. Por favor, verifique os erros',
            loading: 'A página está carregando, aguarde um momento',
            no: 'Não',
            not_found: 'Você digitou uma URL errada, ou seguiu um link errado.',
            yes: 'Sim',
            unsaved_changes:
                'Algumas de suas alteracões não foram salvas. Você tem certeza que quer ignorá-las?',
        },
        navigation: {
            no_results: 'Nenhum resultado encontrado',
            no_more_results:
                'A página número %{page} fora dos limites. Tente a página anterior.',
            page_out_of_boundaries: 'A página %{page} está fora dos limites',
            page_out_from_end: 'Fim da paginação',
            page_out_from_begin: 'A página não pode ser menor que 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} de %{total}',
            page_rows_per_page: 'Linhas por página:',
            next: 'Próxima',
            prev: 'Anterior',
        },
        auth: {
            auth_check_error: 'Faça o login para continuar',
            user_menu: 'Perfil',
            username: 'Usuário',
            password: 'Senha',
            sign_in: 'Entrar',
            sign_in_error: 'Erro na autenticação, por favor tente novamente',
            logout: 'Sair',
        },
        notification: {
            updated:
                'Elemento atualizado |||| %{smart_count} elementos atualizados',
            created: 'Elemento criado',
            deleted: 
                'Elemento removido |||| %{smart_count} elementos removidos',
            bad_item: 'Elemento incorreto',
            item_doesnt_exist: 'O elemento não existe',
            http_error: 'Erro de comunicação com o servidor',
            data_provider_error:
                'Erro com o dataProvider. Verifique o console para mais detalhes.',
            i18n_error:
                'Não foi possível carregar as traduções para a linguagem especificada',
            canceled: 'Ação cancelada',
            logged_out: 'Sua sessão foi finalizada, por favor reconecte.',
        },
        validation: {
            required: 'Obrigatório',
            minLength: 'Deve ter pelo menos %{min} caracteres',
            maxLength: 'Deve ter no máximo %{max} caracteres',
            minValue: 'Deve ser no mínimo %{min}',
            maxValue: 'Deve ser no máximo %{max}',
            number: 'Deve ser um número',
            email: 'Deve ser um e-mail válido',
            oneOf: 'Deve ser um destes: %{options}',
            regex: 'Deve respeiter um formato específico (regexp): %{pattern}',
        },
    },
};

export default ptBrMessages;
