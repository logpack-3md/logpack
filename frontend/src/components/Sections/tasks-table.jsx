'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns = [
  { field: 'task', headerName: 'Task', width: 150 },
  { field: 'progress', headerName: 'Progress', width: 100, type: 'number' },
  { field: 'priority', headerName: 'Priority', width: 120 },
];

const rows = [
  { id: 1, task: 'Website Redesign', progress: 75, priority: 'High' },
  { id: 2, task: 'Mobile App', progress: 45, priority: 'Medium' },
  { id: 3, task: 'Email Campaign', progress: 90, priority: 'Low' },
];

export default function TasksTable() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Tasks</Typography>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} hideFooter />
        </div>
      </CardContent>
    </Card>
  );
}