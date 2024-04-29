import { Button } from '@mui/material';

function ActionButton({ content, bg, color, onclick }) {
  return (
    <Button
      sx={{ textTransform: 'none' }}
      onClick={onclick}
      variant="contained"
      style={{ backgroundColor: bg, color: color }}
      className="text-[10px] text-gray-600 max-h-8"
    >
      {content}
    </Button>
  );
}

export default ActionButton;
