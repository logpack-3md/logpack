// app/dashboard/components/AppWidgetSummary.jsx
import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

export default function AppWidgetSummary({ title, total, icon, color = 'primary', sx }) {
  return (
    <Card sx={{ ...sx }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>{total}</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{title}</Typography>
          </Box>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: `${color}.lighter`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
  sx: PropTypes.object
};