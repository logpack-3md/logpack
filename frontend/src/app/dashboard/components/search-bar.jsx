import { InputBase, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function SearchBar() {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 240 }}
    >
      <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Buscar..." inputProps={{ 'aria-label': 'search' }} />
    </Paper>
  );
}