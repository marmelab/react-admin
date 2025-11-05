import * as React from 'react';
import { Translate } from '../i18n/Translate';
import { useTranslate } from '../i18n/useTranslate';
import { useListContext } from '../controller/list/useListContext';

export const Pagination = () => {
    const { page, perPage, total, setPage } = useListContext();
    const translate = useTranslate();

    if (total === undefined) {
        return null;
    }
    const nbPages = Math.ceil(total / perPage) || 1;
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Translate
                    i18nKey="ra.navigation.page_range_info"
                    options={{
                        offsetBegin: (page - 1) * perPage + 1,
                        offsetEnd: Math.min(page * perPage, total),
                        total,
                    }}
                >
                    {`${(page - 1) * perPage + 1}-${Math.min(page * perPage, total)} of ${total}`}
                </Translate>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '0',
                    alignItems: 'center',
                    justifyContent: 'end',
                }}
            >
                {page > 1 && (
                    <button onClick={() => setPage(page - 1)} type="button">
                        <Translate i18nKey="ra.navigation.previous">
                            Previous
                        </Translate>
                    </button>
                )}
                {Array.from({ length: nbPages }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => {
                            setPage(p);
                        }}
                        style={{
                            fontWeight: p === page ? 'bold' : 'normal',
                        }}
                        aria-label={translate('ra.navigation.page', {
                            page: p,
                        })}
                        type="button"
                    >
                        {p}
                    </button>
                ))}
                {page < nbPages && (
                    <button onClick={() => setPage(page + 1)} type="button">
                        <Translate i18nKey="ra.navigation.next">Next</Translate>
                    </button>
                )}
            </div>
        </div>
    );
};
