import { Box } from '@mui/material';

export const RoundButton = ({ color, handleClick, selected }: any) => (
    <Box
        component="button"
        type="button"
        sx={{
            bgcolor: color,
            width: 30,
            height: 30,
            borderRadius: 15,
            border: selected ? '2px solid grey' : 'none',
            display: 'inline-block',
            margin: 1,
        }}
        onClick={handleClick}
    />
);
