// src/components/ui/create-button.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, Edit2 } from 'lucide-react';

export default function CreateButton({ 
  title, 
  onSubmit, 
  children,
  open: controlledOpen,     // ← NOVO: aceita controle externo
  onOpenChange              // ← NOVO: callback para fechar
}) {
  // Controle interno vs externo
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const result = await onSubmit(formData, file);

    if (result === false || (result && result.success === false)) {
      setAlertMessage(result.error || result?.message || 'Erro ao processar');
      setAlertOpen(true);
      return;
    }

    setOpen(false);
    setFormData({});
    setFile(null);
  };

  // Só escuta o evento global se NÃO for controlado externamente
  useEffect(() => {
    if (isControlled) return;

    const handler = () => setInternalOpen(true);
    document.addEventListener('open-create-modal', handler);
    return () => document.removeEventListener('open-create-modal', handler);
  }, [isControlled]);

  const isEdit = title.toLowerCase().includes('editar');

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-2xl">
          <div className={`p-8 text-white ${isEdit ? 'bg-gradient-to-r from-purple-600 to-indigo-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 text-3xl font-bold">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  {isEdit ? <Edit2 className="w-10 h-10" /> : <Package className="w-10 h-10" />}
                </div>
                {title}
              </DialogTitle>
              <p className="text-white/90 text-lg mt-2">
                {isEdit ? 'Altere os dados do setor conforme necessário' : 'Preencha os dados para criar o pedido'}
              </p>
            </DialogHeader>
          </div>

          <div className="p-8 max-h-[65vh] overflow-y-auto">
            {children({ formData, handleChange, setFile })}
          </div>

          <DialogFooter className="bg-gray-50 border-t border-gray-200 px-8 py-6 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className={`px-8 py-3 font-medium shadow-lg text-white ${
                isEdit 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
              }`}
            >
              {isEdit ? 'Salvar Alterações' : 'Criar Pedido'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de erro */}
      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="p-0 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-lg">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 text-3xl font-bold">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                Atenção!
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-10 text-center">
            <p className="text-xl font-medium text-gray-800 leading-relaxed">
              {alertMessage || "Ocorreu um erro ao processar sua solicitação."}
            </p>
          </div>
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
            <Button onClick={() => setAlertOpen(false)} className="w-full bg-red-600 hover:bg-red-700">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}