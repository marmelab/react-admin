import React, { Fragment } from 'react';

const PropsTable = ({ props, components }) => {
    if (!props) {
        return null;
    }

    const Table = components.table || 'table';
    const Thead = components.thead || 'thead';
    const Tr = components.tr || 'tr';
    const Th = components.th || 'th';
    const Tbody = components.tbody || 'tbody';
    const Td = components.td || 'td';
    const Tooltip = components.tooltip;

    return (
        <Fragment>
            <Table className="PropsTable">
                <Thead>
                    <Tr>
                        <Th className="PropsTable--property">Property</Th>
                        <Th className="PropsTable--type">Type</Th>
                        <Th className="PropsTable--description">Default</Th>
                        <Th width="40%" className="PropsTable--description">
                            Description
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props &&
                        Object.keys(props).map((name: string) => {
                            const prop = props[name];

                            if (!prop.flowType && !prop.type) return null;
                            return (
                                <Tr key={name}>
                                    <Td>{name}</Td>
                                    <Td>{prop.type}</Td>
                                    <Td>{prop.default}</Td>
                                    <Td>
                                        {prop.description && prop.description}
                                    </Td>
                                </Tr>
                            );
                        })}
                </Tbody>
            </Table>
        </Fragment>
    );
};

export default PropsTable;
