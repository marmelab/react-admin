import QuillSnowStylesheet from './QuillSnowStylesheet';

const darkColor = '#444';
const lightColor = 'white';
const selectedColor = '#304ffe';

export default theme => ({
    label: {
        position: 'relative',
    },
    '@global': Object.assign({}, QuillSnowStylesheet, {
        '.ra-rich-text-input': {
            '& .ql-editor': {
                fontSize: '1rem',
                fontFamily: 'Roboto, sans-serif',
                padding: '6px 12px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                '&:hover::before': {
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    height: 2,
                },

                '&::before': {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 1,
                    content: '""',
                    position: 'absolute',
                    transition:
                        'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    backgroundColor: 'rgba(0, 0, 0, 0.42)',
                },

                '&::after': {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    content: '""',
                    position: 'absolute',
                    transform: 'scaleX(0)',
                    transition:
                        'transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
                    backgroundColor: theme.palette.primary.main,
                },

                '& p:not(:last-child)': {
                    marginBottom: '1rem',
                },

                '& strong': {
                    fontWeight: 700,
                },
                '& h1': {
                    margin: '1rem 0 0.5rem 0',
                    fontWeight: 500,
                },
                '& h2': {
                    margin: '1rem 0 0.5rem 0',
                    fontWeight: 500,
                },
                '& h3': {
                    margin: '1rem 0 0.5rem 0',
                    fontWeight: 500,
                },
                '& a': {
                    color: selectedColor,
                },
                '& ul': {
                    marginBottom: '1rem',
                },

                '& li:not(.ql-direction-rtl)::before': {
                    fontSize: '0.5rem',
                    position: 'relative',
                    top: '-0.2rem',
                    marginRight: '0.5rem',
                },

                '&:focus::after': {
                    transform: 'scaleX(1)',
                },
            },
            '& .standard .ql-editor': {
                backgroundColor: lightColor,
            },
            '& .outlined .ql-editor': {
                backgroundColor: lightColor,
            },
            '& .ql-toolbar.ql-snow': {
                margin: '0.5rem 0',
                border: 0,
                padding: 0,

                '& .ql-picker-item': {
                    color:
                        theme.palette.type === 'light' ? darkColor : lightColor,
                },
                '& .ql-stroke': {
                    stroke:
                        theme.palette.type === 'light' ? darkColor : lightColor,
                },
                '& .ql-fill': {
                    fill:
                        theme.palette.type === 'light' ? darkColor : lightColor,
                },
                '& .ql-picker-item.ql-active': {
                    color: selectedColor,
                },
                '& .ql-picker-item:hover': {
                    color: selectedColor,
                },
                '& .ql-picker-item.ql-selected': {
                    color: selectedColor,
                },
                '& .ql-picker-label.ql-active': {
                    color: selectedColor,
                },
                '& .ql-picker-label.ql-selected': {
                    color: selectedColor,
                },
                '& .ql-picker-label:hover': {
                    color: selectedColor,
                },

                '& button:hover .ql-fill': {
                    fill: selectedColor,
                },
                '& button.ql-active .ql-fill': {
                    fill: selectedColor,
                },

                '& button:hover .ql-stroke': {
                    stroke: selectedColor,
                },
                '& button.ql-active .ql-stroke': {
                    stroke: selectedColor,
                },
                '& .ql-picker-label:hover .ql-stroke': {
                    stroke: selectedColor,
                },

                '& .ql-snow .ql-picker.ql-expanded .ql-picker-options': {
                    background:
                        theme.palette.type === 'light' ? lightColor : darkColor,
                    zIndex: 10,
                },

                '& .ql-picker-label': {
                    paddingLeft: 0,
                    color:
                        theme.palette.type === 'light' ? darkColor : lightColor,
                },

                '& + .ql-container.ql-snow': {
                    border: 0,
                },
            },
        },
    }),
});
