import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const showSuccess = (message) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const showError = (message) => {
        toast.error(message, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const showInfo = (message) => {
        toast.info(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const showWarning = (message) => {
        toast.warning(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const showLoading = (message = "Memuat...") => {
        return toast.loading(message, {
            position: "bottom-right",
        });
    };

    const updateToast = (toastId, message, type) => {
        toast.update(toastId, {
            render: message,
            type: type,
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <ToastContext.Provider
            value={{
                showSuccess,
                showError,
                showInfo,
                showWarning,
                showLoading,
                updateToast,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};