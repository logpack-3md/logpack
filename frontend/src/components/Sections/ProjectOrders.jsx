'use client';

import { Container, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Instale @mui/x-data-grid se não tiver

export default function ProjectsPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome do Projeto', width: 200 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'owner', headerName: 'Dono', width: 130 },
    { field: 'date', headerName: 'Data de Criação', width: 160 },
  ];

  const rows = [
    { id: 1, name: 'Projeto Alpha', status: 'Ativo', owner: 'João Silva', date: '2025-10-01' },
    { id: 2, name: 'Projeto Beta', status: 'Pausado', owner: 'Maria Santos', date: '2025-09-15' },
    // Adicione mais dados reais aqui
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <DataGrid rows={rows} columns={columns} initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} pageSizeOptions={[5]} />
      </Paper>
    </Container>
  );
}