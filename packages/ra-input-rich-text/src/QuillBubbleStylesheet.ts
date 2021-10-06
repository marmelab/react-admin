import { StyleRules } from '@mui/styles';

// converted from vendor (node_modules/quill/dist/quill.bubble.css) using the jss cli
export default {
    '@global': {
        '.ql-container': {
            boxSizing: 'border-box',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 13,
            height: '100%',
            margin: 0,
            position: 'relative',
        },
        '.ql-container.ql-disabled .ql-tooltip': {
            visibility: 'hidden',
        },
        '.ql-container.ql-disabled .ql-editor ul[data-checked] > li::before': {
            pointerEvents: 'none',
        },
        '.ql-clipboard': {
            left: -100000,
            height: 1,
            overflowY: 'hidden',
            position: 'absolute',
            top: '50%',
        },
        '.ql-clipboard p': {
            margin: '0',
            padding: '0',
        },
        '.ql-editor': {
            boxSizing: 'border-box',
            lineHeight: '1.42',
            height: '100%',
            outline: 'none',
            overflowY: 'auto',
            padding: '12px 15px',
            tabSize: '4',
            M: '4',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
        },
        '.ql-editor > *': {
            cursor: 'text',
        },
        '.ql-editor p, .ql-editor ol, .ql-editor ul, .ql-editor pre, .ql-editor blockquote, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6': {
            margin: '0',
            padding: '0',
            counterReset:
                'list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9',
        },
        '.ql-editor ol, .ql-editor ul': {
            paddingLeft: '1.5em',
        },
        '.ql-editor ol > li, .ql-editor ul > li': {
            listStyleType: 'none',
        },
        '.ql-editor ul > li::before': {
            content: "'\\2022'",
        },
        '.ql-editor ul[data-checked=true], .ql-editor ul[data-checked=false]': {
            pointerEvents: 'none',
        },
        '.ql-editor ul[data-checked=true] > li *, .ql-editor ul[data-checked=false] > li *': {
            pointerEvents: 'all',
        },
        '.ql-editor ul[data-checked=true] > li::before, .ql-editor ul[data-checked=false] > li::before': {
            color: '#777',
            cursor: 'pointer',
            pointerEvents: 'all',
        },
        '.ql-editor ul[data-checked=true] > li::before': {
            content: "'\\2611'",
        },
        '.ql-editor ul[data-checked=false] > li::before': {
            content: "'\\2610'",
        },
        '.ql-editor li::before': {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            width: '1.2em',
        },
        '.ql-editor li:not(.ql-direction-rtl)::before': {
            marginLeft: '-1.5em',
            marginRight: '0.3em',
            textAlign: 'right',
        },
        '.ql-editor li.ql-direction-rtl::before': {
            marginLeft: '0.3em',
            marginRight: '-1.5em',
        },
        '.ql-editor ol li:not(.ql-direction-rtl), .ql-editor ul li:not(.ql-direction-rtl)': {
            paddingLeft: '1.5em',
        },
        '.ql-editor ol li.ql-direction-rtl, .ql-editor ul li.ql-direction-rtl': {
            paddingRight: '1.5em',
        },
        '.ql-editor ol li': {
            counterReset:
                'list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9',
            counterIncrement: 'list-0',
        },
        '.ql-editor ol li:before': {
            content: "counter(list-0, decimal) '. '",
        },
        '.ql-editor ol li.ql-indent-1': {
            counterIncrement: 'list-1',
            counterReset:
                'list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-1:before': {
            content: "counter(list-1, lower-alpha) '. '",
        },
        '.ql-editor ol li.ql-indent-2': {
            counterIncrement: 'list-2',
            counterReset: 'list-3 list-4 list-5 list-6 list-7 list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-2:before': {
            content: "counter(list-2, lower-roman) '. '",
        },
        '.ql-editor ol li.ql-indent-3': {
            counterIncrement: 'list-3',
            counterReset: 'list-4 list-5 list-6 list-7 list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-3:before': {
            content: "counter(list-3, decimal) '. '",
        },
        '.ql-editor ol li.ql-indent-4': {
            counterIncrement: 'list-4',
            counterReset: 'list-5 list-6 list-7 list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-4:before': {
            content: "counter(list-4, lower-alpha) '. '",
        },
        '.ql-editor ol li.ql-indent-5': {
            counterIncrement: 'list-5',
            counterReset: 'list-6 list-7 list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-5:before': {
            content: "counter(list-5, lower-roman) '. '",
        },
        '.ql-editor ol li.ql-indent-6': {
            counterIncrement: 'list-6',
            counterReset: 'list-7 list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-6:before': {
            content: "counter(list-6, decimal) '. '",
        },
        '.ql-editor ol li.ql-indent-7': {
            counterIncrement: 'list-7',
            counterReset: 'list-8 list-9',
        },
        '.ql-editor ol li.ql-indent-7:before': {
            content: "counter(list-7, lower-alpha) '. '",
        },
        '.ql-editor ol li.ql-indent-8': {
            counterIncrement: 'list-8',
            counterReset: 'list-9',
        },
        '.ql-editor ol li.ql-indent-8:before': {
            content: "counter(list-8, lower-roman) '. '",
        },
        '.ql-editor ol li.ql-indent-9': {
            counterIncrement: 'list-9',
        },
        '.ql-editor ol li.ql-indent-9:before': {
            content: "counter(list-9, decimal) '. '",
        },
        '.ql-editor .ql-indent-1:not(.ql-direction-rtl)': {
            paddingLeft: '3em',
        },
        '.ql-editor li.ql-indent-1:not(.ql-direction-rtl)': {
            paddingLeft: '4.5em',
        },
        '.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right': {
            paddingRight: '3em',
        },
        '.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right': {
            paddingRight: '4.5em',
        },
        '.ql-editor .ql-indent-2:not(.ql-direction-rtl)': {
            paddingLeft: '6em',
        },
        '.ql-editor li.ql-indent-2:not(.ql-direction-rtl)': {
            paddingLeft: '7.5em',
        },
        '.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right': {
            paddingRight: '6em',
        },
        '.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right': {
            paddingRight: '7.5em',
        },
        '.ql-editor .ql-indent-3:not(.ql-direction-rtl)': {
            paddingLeft: '9em',
        },
        '.ql-editor li.ql-indent-3:not(.ql-direction-rtl)': {
            paddingLeft: '10.5em',
        },
        '.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right': {
            paddingRight: '9em',
        },
        '.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right': {
            paddingRight: '10.5em',
        },
        '.ql-editor .ql-indent-4:not(.ql-direction-rtl)': {
            paddingLeft: '12em',
        },
        '.ql-editor li.ql-indent-4:not(.ql-direction-rtl)': {
            paddingLeft: '13.5em',
        },
        '.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right': {
            paddingRight: '12em',
        },
        '.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right': {
            paddingRight: '13.5em',
        },
        '.ql-editor .ql-indent-5:not(.ql-direction-rtl)': {
            paddingLeft: '15em',
        },
        '.ql-editor li.ql-indent-5:not(.ql-direction-rtl)': {
            paddingLeft: '16.5em',
        },
        '.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right': {
            paddingRight: '15em',
        },
        '.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right': {
            paddingRight: '16.5em',
        },
        '.ql-editor .ql-indent-6:not(.ql-direction-rtl)': {
            paddingLeft: '18em',
        },
        '.ql-editor li.ql-indent-6:not(.ql-direction-rtl)': {
            paddingLeft: '19.5em',
        },
        '.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right': {
            paddingRight: '18em',
        },
        '.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right': {
            paddingRight: '19.5em',
        },
        '.ql-editor .ql-indent-7:not(.ql-direction-rtl)': {
            paddingLeft: '21em',
        },
        '.ql-editor li.ql-indent-7:not(.ql-direction-rtl)': {
            paddingLeft: '22.5em',
        },
        '.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right': {
            paddingRight: '21em',
        },
        '.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right': {
            paddingRight: '22.5em',
        },
        '.ql-editor .ql-indent-8:not(.ql-direction-rtl)': {
            paddingLeft: '24em',
        },
        '.ql-editor li.ql-indent-8:not(.ql-direction-rtl)': {
            paddingLeft: '25.5em',
        },
        '.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right': {
            paddingRight: '24em',
        },
        '.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right': {
            paddingRight: '25.5em',
        },
        '.ql-editor .ql-indent-9:not(.ql-direction-rtl)': {
            paddingLeft: '27em',
        },
        '.ql-editor li.ql-indent-9:not(.ql-direction-rtl)': {
            paddingLeft: '28.5em',
        },
        '.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right': {
            paddingRight: '27em',
        },
        '.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right': {
            paddingRight: '28.5em',
        },
        '.ql-editor .ql-video': {
            display: 'block',
            maxWidth: '100%',
        },
        '.ql-editor .ql-video.ql-align-center': {
            margin: '0 auto',
        },
        '.ql-editor .ql-video.ql-align-right': {
            margin: '0 0 0 auto',
        },
        '.ql-editor .ql-bg-black': {
            backgroundColor: '#000',
        },
        '.ql-editor .ql-bg-red': {
            backgroundColor: '#e60000',
        },
        '.ql-editor .ql-bg-orange': {
            backgroundColor: '#f90',
        },
        '.ql-editor .ql-bg-yellow': {
            backgroundColor: '#ff0',
        },
        '.ql-editor .ql-bg-green': {
            backgroundColor: '#008a00',
        },
        '.ql-editor .ql-bg-blue': {
            backgroundColor: '#06c',
        },
        '.ql-editor .ql-bg-purple': {
            backgroundColor: '#93f',
        },
        '.ql-editor .ql-color-white': {
            color: '#fff',
        },
        '.ql-editor .ql-color-red': {
            color: '#e60000',
        },
        '.ql-editor .ql-color-orange': {
            color: '#f90',
        },
        '.ql-editor .ql-color-yellow': {
            color: '#ff0',
        },
        '.ql-editor .ql-color-green': {
            color: '#008a00',
        },
        '.ql-editor .ql-color-blue': {
            color: '#06c',
        },
        '.ql-editor .ql-color-purple': {
            color: '#93f',
        },
        '.ql-editor .ql-font-serif': {
            fontFamily: 'Georgia, Times New Roman, serif',
        },
        '.ql-editor .ql-font-monospace': {
            fontFamily: 'Monaco, Courier New, monospace',
        },
        '.ql-editor .ql-size-small': {
            fontSize: '0.75em',
        },
        '.ql-editor .ql-size-large': {
            fontSize: '1.5em',
        },
        '.ql-editor .ql-size-huge': {
            fontSize: '2.5em',
        },
        '.ql-editor .ql-direction-rtl': {
            direction: 'rtl',
            textAlign: 'inherit',
        },
        '.ql-editor .ql-align-center': {
            textAlign: 'center',
        },
        '.ql-editor .ql-align-justify': {
            textAlign: 'justify',
        },
        '.ql-editor .ql-align-right': {
            textAlign: 'right',
        },
        '.ql-editor.ql-blank::before': {
            color: 'rgba(0,0,0,0.6)',
            content: 'attr(data-placeholder)',
            fontStyle: 'italic',
            left: 15,
            pointerEvents: 'none',
            position: 'absolute',
            right: 15,
        },
        '.ql-bubble.ql-toolbar:after, .ql-bubble .ql-toolbar:after': {
            clear: 'both',
            content: "''",
            display: 'table',
        },
        '.ql-bubble.ql-toolbar button, .ql-bubble .ql-toolbar button': {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-block',
            float: 'left',
            height: 24,
            padding: '3px 5px',
            width: 28,
        },
        '.ql-bubble.ql-toolbar button svg, .ql-bubble .ql-toolbar button svg': {
            float: 'left',
            height: '100%',
        },
        '.ql-bubble.ql-toolbar button:active:hover, .ql-bubble .ql-toolbar button:active:hover': {
            outline: 'none',
        },
        '.ql-bubble.ql-toolbar input.ql-image[type=file], .ql-bubble .ql-toolbar input.ql-image[type=file]': {
            display: 'none',
        },
        '.ql-bubble.ql-toolbar button:hover, .ql-bubble .ql-toolbar button:hover, .ql-bubble.ql-toolbar button:focus, .ql-bubble .ql-toolbar button:focus, .ql-bubble.ql-toolbar button.ql-active, .ql-bubble .ql-toolbar button.ql-active, .ql-bubble.ql-toolbar .ql-picker-label:hover, .ql-bubble .ql-toolbar .ql-picker-label:hover, .ql-bubble.ql-toolbar .ql-picker-label.ql-active, .ql-bubble .ql-toolbar .ql-picker-label.ql-active, .ql-bubble.ql-toolbar .ql-picker-item:hover, .ql-bubble .ql-toolbar .ql-picker-item:hover, .ql-bubble.ql-toolbar .ql-picker-item.ql-selected, .ql-bubble .ql-toolbar .ql-picker-item.ql-selected': {
            color: '#fff',
        },
        '.ql-bubble.ql-toolbar button:hover .ql-fill, .ql-bubble .ql-toolbar button:hover .ql-fill, .ql-bubble.ql-toolbar button:focus .ql-fill, .ql-bubble .ql-toolbar button:focus .ql-fill, .ql-bubble.ql-toolbar button.ql-active .ql-fill, .ql-bubble .ql-toolbar button.ql-active .ql-fill, .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-bubble.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-bubble .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-bubble.ql-toolbar button:focus .ql-stroke.ql-fill, .ql-bubble .ql-toolbar button:focus .ql-stroke.ql-fill, .ql-bubble.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-bubble .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill': {
            fill: '#fff',
        },
        '.ql-bubble.ql-toolbar button:hover .ql-stroke, .ql-bubble .ql-toolbar button:hover .ql-stroke, .ql-bubble.ql-toolbar button:focus .ql-stroke, .ql-bubble .ql-toolbar button:focus .ql-stroke, .ql-bubble.ql-toolbar button.ql-active .ql-stroke, .ql-bubble .ql-toolbar button.ql-active .ql-stroke, .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-bubble.ql-toolbar button:hover .ql-stroke-miter, .ql-bubble .ql-toolbar button:hover .ql-stroke-miter, .ql-bubble.ql-toolbar button:focus .ql-stroke-miter, .ql-bubble .ql-toolbar button:focus .ql-stroke-miter, .ql-bubble.ql-toolbar button.ql-active .ql-stroke-miter, .ql-bubble .ql-toolbar button.ql-active .ql-stroke-miter, .ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter': {
            stroke: '#fff',
        },
        '@media (pointer: coarse)': {
            '.ql-bubble.ql-toolbar button:hover:not(.ql-active), .ql-bubble .ql-toolbar button:hover:not(.ql-active)': {
                color: '#ccc',
            },
            '.ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-fill, .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-fill, .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill, .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill': {
                fill: '#ccc',
            },
            '.ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke, .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke, .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter, .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter': {
                stroke: '#ccc',
            },
        },
        '.ql-bubble': {
            boxSizing: 'border-box',
        },
        '.ql-bubble *': {
            boxSizing: 'border-box',
        },
        '.ql-bubble .ql-hidden': {
            display: 'none',
        },
        '.ql-bubble .ql-out-bottom, .ql-bubble .ql-out-top': {
            visibility: 'hidden',
        },
        '.ql-bubble .ql-tooltip': {
            position: 'absolute',
            transform: 'translateY(10px)',
            backgroundColor: '#444',
            borderRadius: 25,
            color: '#fff',
        },
        '.ql-bubble .ql-tooltip a': {
            cursor: 'pointer',
            textDecoration: 'none',
        },
        '.ql-bubble .ql-tooltip.ql-flip': {
            transform: 'translateY(-10px)',
        },
        '.ql-bubble .ql-formats': {
            display: 'inline-block',
            verticalAlign: 'middle',
        },
        '.ql-bubble .ql-formats:after': {
            clear: 'both',
            content: "''",
            display: 'table',
        },
        '.ql-bubble .ql-stroke': {
            fill: 'none',
            stroke: '#ccc',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: '2',
        },
        '.ql-bubble .ql-stroke-miter': {
            fill: 'none',
            stroke: '#ccc',
            strokeMiterlimit: 10,
            strokeWidth: '2',
        },
        '.ql-bubble .ql-fill, .ql-bubble .ql-stroke.ql-fill': {
            fill: '#ccc',
        },
        '.ql-bubble .ql-empty': {
            fill: 'none',
        },
        '.ql-bubble .ql-even': {
            fillRule: 'evenodd',
        },
        '.ql-bubble .ql-thin, .ql-bubble .ql-stroke.ql-thin': {
            strokeWidth: '1',
        },
        '.ql-bubble .ql-transparent': {
            opacity: 0.4,
        },
        '.ql-bubble .ql-direction svg:last-child': {
            display: 'none',
        },
        '.ql-bubble .ql-direction.ql-active svg:last-child': {
            display: 'inline',
        },
        '.ql-bubble .ql-direction.ql-active svg:first-child': {
            display: 'none',
        },
        '.ql-bubble .ql-editor h1': {
            fontSize: '2em',
        },
        '.ql-bubble .ql-editor h2': {
            fontSize: '1.5em',
        },
        '.ql-bubble .ql-editor h3': {
            fontSize: '1.17em',
        },
        '.ql-bubble .ql-editor h4': {
            fontSize: '1em',
        },
        '.ql-bubble .ql-editor h5': {
            fontSize: '0.83em',
        },
        '.ql-bubble .ql-editor h6': {
            fontSize: '0.67em',
        },
        '.ql-bubble .ql-editor a': {
            textDecoration: 'underline',
        },
        '.ql-bubble .ql-editor blockquote': {
            borderLeft: '4px solid #ccc',
            marginBottom: 5,
            marginTop: 5,
            paddingLeft: 16,
        },
        '.ql-bubble .ql-editor code, .ql-bubble .ql-editor pre': {
            backgroundColor: '#f0f0f0',
            borderRadius: 3,
        },
        '.ql-bubble .ql-editor pre': {
            whiteSpace: 'pre-wrap',
            marginBottom: 5,
            marginTop: 5,
            padding: '5px 10px',
        },
        '.ql-bubble .ql-editor code': {
            fontSize: '85%',
            padding: '2px 4px',
        },
        '.ql-bubble .ql-editor pre.ql-syntax': {
            backgroundColor: '#23241f',
            color: '#f8f8f2',
            overflow: 'visible',
        },
        '.ql-bubble .ql-editor img': {
            maxWidth: '100%',
        },
        '.ql-bubble .ql-picker': {
            color: '#ccc',
            display: 'inline-block',
            float: 'left',
            fontSize: 14,
            fontWeight: 500,
            height: 24,
            position: 'relative',
            verticalAlign: 'middle',
        },
        '.ql-bubble .ql-picker-label': {
            cursor: 'pointer',
            display: 'inline-block',
            height: '100%',
            paddingLeft: 8,
            paddingRight: 2,
            position: 'relative',
            width: '100%',
        },
        '.ql-bubble .ql-picker-label::before': {
            display: 'inline-block',
            lineHeight: 22,
        },
        '.ql-bubble .ql-picker-options': {
            backgroundColor: '#444',
            display: 'none',
            minWidth: '100%',
            padding: '4px 8px',
            position: 'absolute',
            whiteSpace: 'nowrap',
        },
        '.ql-bubble .ql-picker-options .ql-picker-item': {
            cursor: 'pointer',
            display: 'block',
            paddingBottom: 5,
            paddingTop: 5,
        },
        '.ql-bubble .ql-picker.ql-expanded .ql-picker-label': {
            color: '#777',
            zIndex: 2,
        },
        '.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-fill': {
            fill: '#777',
        },
        '.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-stroke': {
            stroke: '#777',
        },
        '.ql-bubble .ql-picker.ql-expanded .ql-picker-options': {
            display: 'block',
            marginTop: -1,
            top: '100%',
            zIndex: 1,
        },
        '.ql-bubble .ql-color-picker, .ql-bubble .ql-icon-picker': {
            width: 28,
        },
        '.ql-bubble .ql-color-picker .ql-picker-label, .ql-bubble .ql-icon-picker .ql-picker-label': {
            padding: '2px 4px',
        },
        '.ql-bubble .ql-color-picker .ql-picker-label svg, .ql-bubble .ql-icon-picker .ql-picker-label svg': {
            right: 4,
        },
        '.ql-bubble .ql-icon-picker .ql-picker-options': {
            padding: '4px 0px',
        },
        '.ql-bubble .ql-icon-picker .ql-picker-item': {
            height: 24,
            width: 24,
            padding: '2px 4px',
        },
        '.ql-bubble .ql-color-picker .ql-picker-options': {
            padding: '3px 5px',
            width: 152,
        },
        '.ql-bubble .ql-color-picker .ql-picker-item': {
            border: '1px solid transparent',
            float: 'left',
            height: 16,
            margin: 2,
            padding: 0,
            width: 16,
        },
        '.ql-bubble .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg': {
            position: 'absolute',
            marginTop: -9,
            right: '0',
            top: '50%',
            width: 18,
        },
        ".ql-bubble .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before, .ql-bubble .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before, .ql-bubble .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before, .ql-bubble .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before, .ql-bubble .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before": {
            content: 'attr(data-label)',
        },
        '.ql-bubble .ql-picker.ql-header': {
            width: 98,
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label::before, .ql-bubble .ql-picker.ql-header .ql-picker-item::before': {
            content: "'Normal'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="1"]::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before': {
            content: "'Heading 1'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="2"]::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before': {
            content: "'Heading 2'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="3"]::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before': {
            content: "'Heading 3'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="4"]::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before': {
            content: "'Heading 4'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="5"]::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before': {
            content: "'Heading 5'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="6"]::before, .ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before': {
            content: "'Heading 6'",
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before': {
            fontSize: '2em',
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before': {
            fontSize: '1.5em',
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before': {
            fontSize: '1.17em',
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before': {
            fontSize: '1em',
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before': {
            fontSize: '0.83em',
        },
        '.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before': {
            fontSize: '0.67em',
        },
        '.ql-bubble .ql-picker.ql-font': {
            width: 108,
        },
        '.ql-bubble .ql-picker.ql-font .ql-picker-label::before, .ql-bubble .ql-picker.ql-font .ql-picker-item::before': {
            content: "'Sans Serif'",
        },
        '.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value=serif]::before, .ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=serif]::before': {
            content: "'Serif'",
        },
        '.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before, .ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before': {
            content: "'Monospace'",
        },
        '.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=serif]::before': {
            fontFamily: 'Georgia, Times New Roman, serif',
        },
        '.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before': {
            fontFamily: 'Monaco, Courier New, monospace',
        },
        '.ql-bubble .ql-picker.ql-size': {
            width: 98,
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-label::before, .ql-bubble .ql-picker.ql-size .ql-picker-item::before': {
            content: "'Normal'",
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=small]::before, .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=small]::before': {
            content: "'Small'",
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=large]::before, .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=large]::before': {
            content: "'Large'",
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=huge]::before, .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=huge]::before': {
            content: "'Huge'",
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=small]::before': {
            fontSize: 10,
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=large]::before': {
            fontSize: 18,
        },
        '.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=huge]::before': {
            fontSize: 32,
        },
        '.ql-bubble .ql-color-picker.ql-background .ql-picker-item': {
            backgroundColor: '#fff',
        },
        '.ql-bubble .ql-color-picker.ql-color .ql-picker-item': {
            backgroundColor: '#000',
        },
        '.ql-bubble .ql-toolbar .ql-formats': {
            margin: '8px 12px 8px 0px',
        },
        '.ql-bubble .ql-toolbar .ql-formats:first-child': {
            marginLeft: 12,
        },
        '.ql-bubble .ql-color-picker svg': {
            margin: 1,
        },
        '.ql-bubble .ql-color-picker .ql-picker-item.ql-selected, .ql-bubble .ql-color-picker .ql-picker-item:hover': {
            borderColor: '#fff',
        },
        '.ql-bubble .ql-tooltip-arrow': {
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            content: '" "',
            display: 'block',
            left: '50%',
            marginLeft: -6,
            position: 'absolute',
        },
        '.ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow': {
            borderBottom: '6px solid #444',
            top: -6,
        },
        '.ql-bubble .ql-tooltip.ql-flip .ql-tooltip-arrow': {
            borderTop: '6px solid #444',
            bottom: -6,
        },
        '.ql-bubble .ql-tooltip.ql-editing .ql-tooltip-editor': {
            display: 'block',
        },
        '.ql-bubble .ql-tooltip.ql-editing .ql-formats': {
            visibility: 'hidden',
        },
        '.ql-bubble .ql-tooltip-editor': {
            display: 'none',
        },
        '.ql-bubble .ql-tooltip-editor input[type=text]': {
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 13,
            height: '100%',
            outline: 'none',
            padding: '10px 20px',
            position: 'absolute',
            width: '100%',
        },
        '.ql-bubble .ql-tooltip-editor a': {
            top: 10,
            position: 'absolute',
            right: 20,
        },
        '.ql-bubble .ql-tooltip-editor a:before': {
            color: '#ccc',
            content: '"D7"',
            fontSize: 16,
            fontWeight: 'bold',
        },
        '.ql-container.ql-bubble:not(.ql-disabled) a': {
            position: 'relative',
            whiteSpace: 'nowrap',
        },
        '.ql-container.ql-bubble:not(.ql-disabled) a::before': {
            backgroundColor: '#444',
            borderRadius: 15,
            top: -5,
            fontSize: 12,
            color: '#fff',
            content: 'attr(href)',
            fontWeight: 'normal',
            overflow: 'hidden',
            padding: '5px 15px',
            textDecoration: 'none',
            zIndex: 1,
        },
        '.ql-container.ql-bubble:not(.ql-disabled) a::after': {
            borderTop: '6px solid #444',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            top: '0',
            content: '" "',
            height: '0',
            width: '0',
        },
        '.ql-container.ql-bubble:not(.ql-disabled) a::before, .ql-container.ql-bubble:not(.ql-disabled) a::after': {
            left: '0',
            marginLeft: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -100%)',
            transition: 'visibility 0s ease 200ms',
            visibility: 'hidden',
        },
        '.ql-container.ql-bubble:not(.ql-disabled) a:hover::before, .ql-container.ql-bubble:not(.ql-disabled) a:hover::after': {
            visibility: 'visible',
        },
    },
} as StyleRules;
