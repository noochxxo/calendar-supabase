'use client'

import { useEffect } from "react";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export const UndoToast = ({ message, onUndo, onDismiss }: UndoToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-5 right-5 bg-gray-800 text-white py-3 px-5 rounded-lg shadow-lg flex items-center justify-between z-50 animate-fade-in-up">
      <span>{message}</span>
      <button
        onClick={onUndo}
        className="ml-4 font-bold uppercase text-indigo-400 hover:text-indigo-300 text-sm"
      >
        Undo
      </button>
    </div>
  );
};
