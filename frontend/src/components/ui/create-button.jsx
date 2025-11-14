// src/components/ui/create-button.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CreateButton({ title, onSubmit, children }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const success = await onSubmit(formData, file);
    if (success) {
      setOpen(false);
      setFormData({});
      setFile(null);
    }
  };

  // ESCUTA EVENTO GLOBAL PARA ABRIR MODAL
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('open-create-modal', handler);
    return () => document.removeEventListener('open-create-modal', handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6"
        style={{ maxHeight: '90vh' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-5">
          {children({ formData, handleChange, setFile })}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Criar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}