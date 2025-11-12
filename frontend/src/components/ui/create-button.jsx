// src/components/ui/create-button.jsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function CreateButton({ children, title, onSubmit, initialData = {}, isLoading = false }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  // ESCUTA O EVENTO DO BOTÃO +
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    document.addEventListener('open-create-modal', handleOpen);
    return () => document.removeEventListener('open-create-modal', handleOpen);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const closeModal = () => setOpen(false);

  const modalContent = open && (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#00000073] backdrop-blur-sm transition-opacity duration-300 ease-out"
        style={{ opacity: open ? 1 : 0 }}
        onClick={closeModal}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 transform transition-all duration-300 ease-out"
        style={{
          transform: open ? 'scale(1)' : 'scale(0.95)',
          opacity: open ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {typeof children === 'function' ? children({ formData, handleChange }) : children}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-500 transition">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return modalContent && createPortal(modalContent, document.body);
}