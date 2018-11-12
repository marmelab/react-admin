module.exports = {
    ra: {
        action: {
            add_filter: 'إضافة فلتر',
            add: 'إضافة',
            back: 'العودة',
            bulk_actions: '1 عنصر مختار |||| %{smart_count} عناصر مختارة',
            cancel: 'إلغاء',
            clear_input_value: 'مسح القيمة',
            clone: 'نسخ',
            create: 'جديد',
            delete: 'حذف',
            edit: 'تعديل',
            export: 'إستخراج',
            list: 'قائمة',
            refresh: 'إعادة تحميل',
            remove_filter: 'إزالة هذا الفلتر',
            remove: 'إزالة',
            save: 'تخزين',
            search: 'بحث',
            show: 'عرض',
            sort: 'ترتيب',
            undo: 'إبطال',
        },
        boolean: {
            true: 'نعم',
            false: 'ﻻ',
        },
        page: {
            create: '%{name} جديد',
            dashboard: 'اللوحة الرئيسية',
            edit: '%{name} #%{id}',
            error: 'حدث خطأ ما',
            list: 'قائمة %{name}',
            loading: 'تحميل',
            not_found: 'لم يتم العثور عليه',
            show: '%{name} #%{id}',
        },
        input: {
            file: {
                upload_several:
                    'انزل بعض الملفات ليتم تحميلها, أو اضغط لتختار احدها.',
                upload_single: 'أنزل ملف ليتم تحميله, أو إضغط لتختاره.',
            },
            image: {
                upload_several:
                    'انزل بعض الصور ليتم تحميلها, أو اضغط لتختار احدها.',
                upload_single:
                    'أنزل صورة ليتم تحميله, أو إضغط لتختارها.',
            },
            references: {
                all_missing: 'غير قادر على إيجاد مراجع البيانات.',
                many_missing:
                    'على الأقل أحد المراجع المعنية ﻻ تبدو متواجدة بعد الآن.',
                single_missing:
                    'المرجع المعني ﻻ يبدو متواجدا بعد الآن.',
            },
        },
        message: {
            about: 'حول',
            are_you_sure: 'هل أنت متأكد?',
            bulk_delete_content:
                'هل انت متأكد انك تريد حذف هذا؟ %{name} |||| هل انت متأكد من انك تريد حذف هذه %{smart_count} العناصر؟',
            bulk_delete_title:
                'حذف %{name} |||| حذف %{smart_count} %{name} عناصر',
            delete_content: 'هل أنت متأكد من إنك تريد حذف هذا ؟',
            delete_title: 'حذف %{name} #%{id}',
            details: 'التفاصيل',
            error:
                "حدث خطأ الى العميل و لم يتم تلبية طلبك.",
            invalid_form: 'هذا النموذج ليس كما يجب , أرجو التأكد من الأخطاء.',
            loading: 'الصفحة تحمل الآن , أرجوا الإنتظار',
            no: 'ﻻ',
            not_found:
                'ﻻبد من إنك إتبعت رابطا خاطئا أو كتبته بشكل خاطيء',
            yes: 'نعم',
        },
        navigation: {
            no_results: 'ﻻ توجد نتائج',
            no_more_results:
                'الصفحة رقم %{page} هي خارج النطاق. جرب الصفحة السابقة.',
            page_out_of_boundaries: 'صفحة رقم %{page} هي خارج النطاق',
            page_out_from_end: 'ﻻ تستطيع الذهاب بعد الصفحة الأخيرة',
            page_out_from_begin: 'ﻻ تستطيع الذهاب قبل الصفحة الأولى',
            page_range_info: '%{offsetBegin}-%{offsetEnd} من %{total}',
            page_rows_per_page: 'صفوف بكل صفحة:',
            next: 'التالي',
            prev: 'السابق',
        },
        auth: {
            user_menu: 'ملف',
            username: 'معرف الدخول',
            password: 'كلمة السر',
            sign_in: 'الدخول',
            sign_in_error: 'فشل الدخول, الرجاء إعادة المحاولة',
            logout: 'الخروج',
        },
        notification: {
            updated: 'تم تحديث العنصر |||| %{smart_count} تم تحديث العناصر',
            created: 'Element created',
            deleted: 'حذف العنصر |||| %{smart_count} تم حذف العناصر',
            bad_item: 'عنصر خاطئ',
            item_doesnt_exist: 'ﻻ وجود لهذا العنصر',
            http_error: 'خطأ فالإتصال بالسيرفر',
            data_provider_error:
                'خطأ فالداتابروفايدور الرجاء التحقق من الكونسول.',
            canceled: 'تم إبطال الأمر',
        },
        validation: {
            required: 'الزامي',
            minLength: 'يجب ان يحتوي على %{min} احرف على الاقل',
            maxLength: 'يجب ان يحتوي على %{max} احرف او اقل',
            minValue: 'يجب ان يكون على الاقل %{min}',
            maxValue: 'يجب ان يكون %{max} او اقل',
            number: 'يجب ان يكون رقم',
            email: 'يجب ان يكون بريد الكتروني فاعل',
            oneOf: 'يجب ان يكون احد: %{options}',
            regex: 'يجب ان يكون ضمن نطاق معين (regexp): %{pattern}',
        },
    },
};
