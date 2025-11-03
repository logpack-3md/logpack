'use client';

import { Card, CardContent } from '@mui/material';

export default function MainCard({ children, content = true, ...others }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 0 2rem 0 rgba(136, 152, 170, 0.15)',
        overflow: 'hidden',
        ...others.sx,
      }}
      {...others}
    >
      {content ? <CardContent sx={{ p: 3 }}>{children}</CardContent> : children}
    </Card>
  );
}