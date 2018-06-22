import React, { Fragment } from 'react';
import styled from 'react-emotion';

const Table = styled('table')`
    width: 100%;
    padding: 0;
    margin-bottom: 50px;
    border-spacing: 0;
    border-collapse: collapse;
    border-style: hidden;
    & thead {
        color: ${p => p.theme.colors.grayDark};
    }
    & thead th {
        text-align: left;
        font-weight: 400;
        padding: 1em;
        &.description {
            min-width: 40%;
        }
    }
    & tbody td {
        padding: 1em;
        &.nowrap {
            white-space: nowrap;
        }
        & code {
            font-size: 0.8em;
            font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        }
        &.description {
            min-width: 40%;
        }
    }
    & tbody > tr {
        display: table-row;
        border-top: 1px solid ${p => p.theme.colors.border};
    }
`;

const PropsTable = ({ props }) => {
    if (!props) {
        return null;
    }

    return (
        <Fragment>
            <Table className="PropsTable">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th className="description">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {props &&
                        Object.keys(props).map((name: string) => {
                            const prop = props[name];

                            if (!prop.flowType && !prop.type) return null;
                            return (
                                <tr key={name}>
                                    <td className="nowrap">
                                        <code>
                                            {name}
                                            {prop.required && ' *'}
                                        </code>
                                    </td>
                                    <td>
                                        <code>{prop.type}</code>
                                    </td>
                                    <td>
                                        <code>{prop.default}</code>
                                    </td>
                                    <td className="description">
                                        {prop.description && prop.description}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </Fragment>
    );
};

export default PropsTable;
