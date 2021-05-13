import React from 'react';
import { useDocumentTitle } from 'ra-core';

export interface TitleTextProps extends React.HTMLProps<HTMLSpanElement> {
    text: string;
}

export function TitleText({ text, ...rest }: TitleTextProps) {
    useDocumentTitle(text);

    return <span {...rest}>{text}</span>;
}
