// app/dashboard/theme.jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#6366F1', lighter: '#EEF2FF' },
    info: { main: '#3B82F6', lighter: '#DBEAFE' },
    warning: { main: '#F59E0B', lighter: '#FEF3C7' },
    secondary: { main: '#8B5CF6', lighter: '#F3E8FF' },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    background: { default: '#f9fafb' },
    text: { primary: '#111827', secondary: '#6B7280' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  customShadows: {
    card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    z16: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  },
});

export default theme;