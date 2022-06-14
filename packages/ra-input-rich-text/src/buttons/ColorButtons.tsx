import * as React from 'react';
import {
    Box,
    Card,
    ToggleButton,
    ToggleButtonGroup,
    ToggleButtonProps,
} from '@mui/material';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { useTranslate } from 'ra-core';
import { useTheme } from 'ra-ui-materialui';
import { useTiptapEditor } from '../useTiptapEditor';
import {
    grey,
    red,
    orange,
    yellow,
    green,
    blue,
    purple,
} from '@mui/material/colors';

/**
 * Hook that listens clicks outside of the passed ref
 */
const useOutsideListener = (
    ref: React.MutableRefObject<any>,
    onClick: () => void
) => {
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClick();
            }
        };
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClick]);
};

type OutsideListenerProps = {
    className?: string;
    onClick: () => void;
    children: React.ReactNode;
};

/**
 * Component that listens if you click outside of it
 */
const OutsideListener = ({
    className,
    onClick,
    children,
}: OutsideListenerProps) => {
    const wrapperRef = React.useRef(null);
    useOutsideListener(wrapperRef, onClick);

    return (
        <div className={className} ref={wrapperRef}>
            {children}
        </div>
    );
};

enum ColorType {
    FONT = 'font',
    BACKGROUND = 'background',
}

interface ColorChoiceDialogProps {
    editor: any;
    close: () => void;
    colorType: ColorType;
}

const ColorChoiceDialog = ({
    editor,
    close,
    colorType,
}: ColorChoiceDialogProps) => {
    const [theme] = useTheme();
    const colors = [grey, red, orange, yellow, green, blue, purple];
    const shades = [900, 700, 500, 300, 100];

    const selectColor = (color: string) => {
        if (colorType === ColorType.FONT) {
            editor.chain().focus().setColor(color).run();
        } else {
            editor.chain().focus().toggleHighlight({ color }).run();
        }
        close();
    };

    return (
        <Card
            sx={{
                position: 'absolute',
                top: 38,
                left: colorType === ColorType.FONT ? 0 : '50%',
                p: 1,
                border: `1px solid ${theme?.palette?.background?.default}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                zIndex: 1,
            }}
        >
            {shades.map((shade, line) => (
                <Box
                    key={`shade-${shade}`}
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
                >
                    {colors.map((color, row) => (
                        <Box
                            key={`color-${line * colors.length + row + 1}`}
                            sx={{
                                width: 16,
                                height: 16,
                                cursor: 'pointer',
                                // @ts-ignore
                                backgroundColor: color[shade],
                            }}
                            // @ts-ignore
                            onClick={() => selectColor(color[shade])}
                        ></Box>
                    ))}
                </Box>
            ))}
        </Card>
    );
};

export const ColorButtons = (props: Omit<ToggleButtonProps, 'value'>) => {
    const translate = useTranslate();
    const editor = useTiptapEditor();
    const [showColorChoiceDialog, setShowColorChoiceDialog] = React.useState<
        boolean
    >(false);
    const [colorType, setColorType] = React.useState<ColorType>(ColorType.FONT);

    const colorLabel = translate('ra.tiptap.color', { _: 'Color' });
    const highlightLabel = translate('ra.tiptap.highlight', { _: 'Highlight' });

    const displayColorChoiceDialog = (colorType: ColorType) => {
        setShowColorChoiceDialog(true);
        setColorType(colorType);
    };

    return editor ? (
        <Box sx={{ position: 'relative' }}>
            <OutsideListener onClick={() => setShowColorChoiceDialog(false)}>
                <ToggleButtonGroup>
                    <ToggleButton
                        aria-label={colorLabel}
                        title={colorLabel}
                        {...props}
                        disabled={!editor?.isEditable}
                        value="color"
                        onClick={() => displayColorChoiceDialog(ColorType.FONT)}
                    >
                        <FormatColorTextIcon fontSize="inherit" />
                    </ToggleButton>
                    <ToggleButton
                        aria-label={highlightLabel}
                        title={highlightLabel}
                        {...props}
                        disabled={!editor?.isEditable}
                        value="highlight"
                        onClick={() =>
                            displayColorChoiceDialog(ColorType.BACKGROUND)
                        }
                    >
                        <FontDownloadIcon fontSize="inherit" />
                    </ToggleButton>
                </ToggleButtonGroup>
                {showColorChoiceDialog && (
                    <ColorChoiceDialog
                        editor={editor}
                        close={() => setShowColorChoiceDialog(false)}
                        colorType={colorType}
                    />
                )}
            </OutsideListener>
        </Box>
    ) : null;
};
