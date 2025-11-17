'use client';

import { Container, Paper, TextField, Button, Box } from '@mui/material';

export default function SettingsPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome da Empresa" variant="outlined" fullWidth />
          <TextField label="Email de Contato" type="email" variant="outlined" fullWidth />
          <TextField label="Tema" select variant="outlined" fullWidth>
            {/* Opções de tema como no Mantis */}
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </TextField>
          <Button variant="contained" type="submit">Salvar Configurações</Button>
        </Box>
      </Paper>
    </Container>
  );
}