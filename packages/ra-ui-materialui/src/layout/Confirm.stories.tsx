import * as React from 'react';

import { Confirm } from './Confirm';

export default {
    title: 'ra-ui-materialui/layout/Confirm',
};

export const BackClick = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);

    return (
        <>
            <button
                onClick={e => {
                    setIsOpen(true);
                    e.stopPropagation();
                }}
            >
                Open Dialog
            </button>
            <div
                onClick={() => setIsClicked(true)}
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: 'red',
                    padding: 10,
                }}
            >
                <div>Back layer {isClicked ? 'clicked' : 'not Clicked'}</div>
                <Confirm
                    isOpen={isOpen}
                    title="Delete Item"
                    content="Are you sure you want to delete this item?"
                    confirm="Yes"
                    confirmColor="primary"
                    onConfirm={() => setIsOpen(false)}
                    onClose={() => setIsOpen(false)}
                />
            </div>
        </>
    );
};
