import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, AttachMoney, People, ShoppingCart, Inventory } from '@mui/icons-material';

const iconMap = {
  AttachMoney: <AttachMoney />,
  People: <People />,
  ShoppingCart: <ShoppingCart />,
  Inventory: <Inventory />,
};

export default function MetricsCard({ title, value, diff, color, icon }) {
  const IconComponent = iconMap[icon];
  const isPositive = diff.startsWith('+');

  return (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}.main 0%, ${color}.dark 100%)`, color: 'white' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2, p: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
            {IconComponent}
          </Box>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{value}</Typography>
          </Box>
        </Box>
        <Chip label={diff} color={isPositive ? 'success' : 'error'} size="small" />
      </CardContent>
    </Card>
  );
}