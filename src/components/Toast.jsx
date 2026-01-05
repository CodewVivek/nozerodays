"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ id, message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        loading: <Loader2 className="text-primary animate-spin" size={20} />
    };

    const bgColors = {
        success: 'bg-green-500/5 border-green-500/20',
        error: 'bg-red-500/5 border-red-500/20',
        info: 'bg-blue-500/5 border-blue-500/20',
        loading: 'bg-primary/5 border-primary/20'
    };

    return (
        <div className={`
            pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl
            animate-in slide-in-from-right-8 fade-in duration-300
            ${bgColors[type] || 'bg-card border-border'}
        `}>
            {icons[type]}
            <p className="text-sm font-bold text-foreground pr-2">{message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-foreground/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
