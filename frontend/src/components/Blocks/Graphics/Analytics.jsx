'use client';

import { Grid, Container } from '@mui/material';
import { LineChart, BarChart } from './components/charts'; // Componentes de gráficos

export default function AnalyticsPage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <LineChart title="Vendas Mensais" />
        </Grid>
        <Grid item xs={12} md={4}>
          <BarChart title="Usuários por Região" />
        </Grid>
      </Grid>
    </Container>
  );
}