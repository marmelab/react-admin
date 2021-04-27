import React from 'react';
import { useDocumentTitle } from 'ra-core';

export interface TitleTextProps {
    text: string;
    className: string;
}

function TitleText({ text, ...rest }: TitleTextProps) {
    useDocumentTitle(text);

    return <span {...rest}>{text}</span>;
}

export default TitleText;
